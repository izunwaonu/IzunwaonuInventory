import React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SavingsSummary({ data }: { data: any[] }) {
  const totalSavings = data.reduce((acc, item) => {
    return acc + item.amount;
  }, 0) as number;

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Savings Summary</CardTitle>
          <CardDescription>Showing savings Summary</CardDescription>
        </div>
        <div className="flex">
          <button className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
            <span className="text-xs text-muted-foreground">Total Savings</span>
            <span className="text-lg font-bold leading-none sm:text-3xl">
              {data.length.toString().padStart(2, "0")}
            </span>
          </button>
          <button className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
            <span className="text-xs text-muted-foreground">Total Revenue</span>
            <span className="text-lg font-bold leading-none sm:text-3xl">
              {totalSavings.toLocaleString()}
            </span>
          </button>
        </div>
      </CardHeader>
    </Card>
  );
}
