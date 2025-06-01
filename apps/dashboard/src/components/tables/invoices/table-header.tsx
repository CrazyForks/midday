"use client";

import { useSortParams } from "@/hooks/use-sort-params";
import { Button } from "@midday/ui/button";
import {
  TableHeader as BaseTableHeader,
  TableHead,
  TableRow,
} from "@midday/ui/table";
import { ArrowDown, ArrowUp } from "lucide-react";

interface TableColumn {
  id: string;
  getIsVisible: () => boolean;
}

interface TableInterface {
  getAllLeafColumns: () => TableColumn[];
  getIsAllPageRowsSelected: () => boolean;
  getIsSomePageRowsSelected: () => boolean;
  toggleAllPageRowsSelected: (value: boolean) => void;
}

interface Props {
  table?: TableInterface;
}

export function TableHeader({ table }: Props) {
  const { params, setParams } = useSortParams();

  const [column, value] = params.sort || [];

  const createSortQuery = (name: string) => {
    const [currentColumn, currentValue] = params.sort || [];

    if (name === currentColumn) {
      if (currentValue === "asc") {
        setParams({ sort: [name, "desc"] });
      } else if (currentValue === "desc") {
        setParams({ sort: null });
      } else {
        setParams({ sort: [name, "asc"] });
      }
    } else {
      setParams({ sort: [name, "asc"] });
    }
  };

  const isVisible = (id: string) =>
    table
      ?.getAllLeafColumns()
      .find((col) => col.id === id)
      ?.getIsVisible();

  return (
    <BaseTableHeader>
      <TableRow>
        {isVisible("invoiceNumber") && (
          <TableHead className="w-[200px]">
            <Button
              className="p-0 hover:bg-transparent space-x-2"
              variant="ghost"
              onClick={() => createSortQuery("invoice_number")}
            >
              <span>Invoice no.</span>
              {"invoiceNumber" === column && value === "asc" && (
                <ArrowDown size={16} />
              )}
              {"invoiceNumber" === column && value === "desc" && (
                <ArrowUp size={16} />
              )}
            </Button>
          </TableHead>
        )}
        {isVisible("status") && (
          <TableHead className="w-[150px]">
            <Button
              className="p-0 hover:bg-transparent space-x-2"
              variant="ghost"
              onClick={() => createSortQuery("status")}
            >
              <span>Status</span>
              {"status" === column && value === "asc" && (
                <ArrowDown size={16} />
              )}
              {"status" === column && value === "desc" && <ArrowUp size={16} />}
            </Button>
          </TableHead>
        )}

        {isVisible("dueDate") && (
          <TableHead className="w-[180px]">
            <Button
              className="p-0 hover:bg-transparent space-x-2"
              variant="ghost"
              onClick={() => createSortQuery("due_date")}
            >
              <span>Due Date</span>
              {"dueDate" === column && value === "asc" && (
                <ArrowDown size={16} />
              )}
              {"dueDate" === column && value === "desc" && (
                <ArrowUp size={16} />
              )}
            </Button>
          </TableHead>
        )}

        {isVisible("customer") && (
          <TableHead className="min-w-[250px]">
            <Button
              className="p-0 hover:bg-transparent space-x-2"
              variant="ghost"
              onClick={() => createSortQuery("customer")}
            >
              <span>Customer</span>
              {"customer" === column && value === "asc" && (
                <ArrowDown size={16} />
              )}
              {"customer" === column && value === "desc" && (
                <ArrowUp size={16} />
              )}
            </Button>
          </TableHead>
        )}
        {isVisible("amount") && (
          <TableHead className="w-[200px]">
            <Button
              className="p-0 hover:bg-transparent space-x-2"
              variant="ghost"
              onClick={() => createSortQuery("amount")}
            >
              <span>Amount</span>
              {"amount" === column && value === "asc" && (
                <ArrowDown size={16} />
              )}
              {"amount" === column && value === "desc" && <ArrowUp size={16} />}
            </Button>
          </TableHead>
        )}

        {isVisible("vatRate") && (
          <TableHead className="w-[100px] min-w-[100px]">
            <span>VAT Rate</span>
          </TableHead>
        )}

        {isVisible("vatAmount") && (
          <TableHead className="w-[150px] min-w-[150px]">
            <span>VAT Amount</span>
          </TableHead>
        )}

        {isVisible("taxRate") && (
          <TableHead className="w-[100px] min-w-[100px]">
            <span>Tax Rate</span>
          </TableHead>
        )}

        {isVisible("taxAmount") && (
          <TableHead className="w-[150px] min-w-[150px]">
            <span>Tax Amount</span>
          </TableHead>
        )}

        {isVisible("exclVat") && (
          <TableHead className="w-[150px] min-w-[150px]">
            <span>Excl. VAT</span>
          </TableHead>
        )}

        {isVisible("exclTax") && (
          <TableHead className="w-[150px] min-w-[150px]">
            <span>Excl. Tax</span>
          </TableHead>
        )}

        {isVisible("internalNote") && (
          <TableHead className="w-[150px] min-w-[150px]">
            <span>Internal Note</span>
          </TableHead>
        )}

        {isVisible("issueDate") && (
          <TableHead className="w-[120px] min-w-[120px]">
            <Button
              className="p-0 hover:bg-transparent space-x-2"
              variant="ghost"
              onClick={() => createSortQuery("issue_date")}
            >
              <span>Issue Date</span>
              {"issueDate" === column && value === "asc" && (
                <ArrowDown size={16} />
              )}
              {"issueDate" === column && value === "desc" && (
                <ArrowUp size={16} />
              )}
            </Button>
          </TableHead>
        )}

        {isVisible("sentAt") && (
          <TableHead className="w-[150px] min-w-[150px]">
            <span>Sent at</span>
          </TableHead>
        )}

        {isVisible("actions") && (
          <TableHead className="w-[100px]">Actions</TableHead>
        )}
      </TableRow>
    </BaseTableHeader>
  );
}
