import { Skeleton } from "@midday/ui/skeleton";
import { Table, TableBody, TableCell, TableRow } from "@midday/ui/table";
import { TableHeader } from "./table-header";

export function CustomersSkeleton() {
  return (
    <div className="w-full">
      <div className="overflow-x-auto border-l border-r border-border">
        <Table className="min-w-[1000px]">
          <TableHeader />
          <TableBody className="border-l-0 border-r-0">
            {Array.from({ length: 25 }).map((_, index) => (
              <TableRow key={index.toString()} className="h-[45px]">
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell className="w-[280px] max-w-[280px]">
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell className="w-[100px] sticky right-0 bg-background z-10">
                  <Skeleton className="h-4 w-8" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
