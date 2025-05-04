// components/ui/data-table/table-loading.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

interface TableLoadingProps {
  title?: string;
  columnCount?: number;
  rowCount?: number;
}

export default function TableLoading({
  title = "Loading data",
  columnCount = 6,
  rowCount = 5,
}: TableLoadingProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-2xl font-bold">
            <Skeleton className="h-8 w-64" />
          </CardTitle>
          <Skeleton className="h-5 w-80 mt-2" />
        </div>
        <Skeleton className="h-10 w-32" />
      </CardHeader>

      <CardContent className="px-0">
        <div className="flex items-center justify-between px-6 mb-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-40" />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              {Array(columnCount)
                .fill(0)
                .map((_, i) => (
                  <TableHead key={i}>
                    <Skeleton className="h-4 w-full max-w-24" />
                  </TableHead>
                ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array(rowCount)
              .fill(0)
              .map((_, i) => (
                <TableRow key={i}>
                  {Array(columnCount)
                    .fill(0)
                    .map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                    ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
