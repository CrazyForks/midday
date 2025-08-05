import type { TransactionForEnrichment } from "@midday/db/queries";
import type { TransactionData, UpdateData } from "./enrichment-schema";

/**
 * Generates the enrichment prompt for the LLM
 */
export function generateEnrichmentPrompt(
  transactionData: TransactionData[],
  batch: TransactionForEnrichment[],
): string {
  const transactionList = transactionData
    .map((tx, index) => {
      const transaction = batch[index];
      const hasExistingMerchant = transaction?.merchantName;

      return `${index + 1}. Description: "${tx.description}", Amount: ${tx.amount}, Currency: ${tx.currency}${hasExistingMerchant ? ` (Merchant: ${transaction.merchantName})` : ""}`;
    })
    .join("\n");

  const needsMerchantNames = batch.some((tx) => !tx.merchantName);
  const needsCategories = batch.some((tx) => !tx.categorySlug);

  let returnInstructions = "Return:\n";

  if (needsMerchantNames) {
    returnInstructions +=
      "1. For transactions WITHOUT existing merchant names: The formal legal business name including proper entity suffixes (Inc, LLC, Corp, Ltd, Co, etc.) when identifiable. Use proper capitalization. If you cannot identify the formal legal name, return a cleaned and properly capitalized version of the merchant name.\n";
  }

  if (needsCategories) {
    returnInstructions += `${needsMerchantNames ? "2" : "1"}. The best-fit category from the allowed categories based on the transaction's content and context.\n`;
  }

  if (!needsMerchantNames) {
    returnInstructions +=
      "Note: For transactions that already have merchant names, only provide the category - DO NOT change the existing merchant name.\n";
  }

  return `You are a financial transaction enrichment function.

Process each transaction with its description, amount, and currency. The description may contain multiple data fields:
- "Counterparty": Bank-parsed merchant name (usually cleaner)
- "Raw": Original transaction description (may contain codes, locations, store numbers)
- "Description": Additional transaction details
- "Merchant": Already identified merchant name (when available - DO NOT override)

For merchant names, prefer formal business names with proper legal entity suffixes:
- Apple Inc. (not "apple" or "Apple")
- Google LLC (not "google" or "Google")
- Microsoft Corporation (not "microsoft" or "Microsoft")
- Amazon.com Inc. (not "amazon" or "Amazon")

Use ALL available information to make the best identification.

${returnInstructions}

Transactions to process:
${transactionList}

IMPORTANT: You must respond with results for each transaction in the exact same order as listed above. Return exactly ${batch.length} results, one for each transaction.`;
}

/**
 * Prepares transaction data for LLM processing
 */
export function prepareTransactionData(
  batch: TransactionForEnrichment[],
): TransactionData[] {
  return batch.map((tx) => {
    // Build a comprehensive description with all available information
    const parts: string[] = [];

    if (tx.counterpartyName) {
      parts.push(`Counterparty: ${tx.counterpartyName}`);
    }

    if (tx.name && tx.name !== tx.counterpartyName) {
      parts.push(`Raw: ${tx.name}`);
    }

    if (
      tx.description &&
      tx.description !== tx.counterpartyName &&
      tx.description !== tx.name
    ) {
      parts.push(`Description: ${tx.description}`);
    }

    // Fallback to just name if no counterparty
    const description = parts.length > 0 ? parts.join(" | ") : tx.name;

    return {
      description,
      amount: tx.amount.toString(),
      currency: tx.currency,
    };
  });
}

/**
 * Prepares update data, respecting existing merchant names and category classifications
 */
export function prepareUpdateData(
  transaction: { categorySlug: string | null; merchantName: string | null },
  result: { merchant: string | null; category: string },
): UpdateData {
  const updateData: UpdateData = {};

  // Only update merchantName if it's currently null (no provider merchant name)
  // and if the result has a valid merchant name
  if (!transaction.merchantName && result.merchant) {
    updateData.merchantName = result.merchant;
  }

  // Only update categorySlug if it's currently null
  if (!transaction.categorySlug) {
    updateData.categorySlug = result.category;
  }

  return updateData;
}
