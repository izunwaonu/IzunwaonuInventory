import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  change: {
    value: string;
    trend: "up" | "down";
    today: string;
  };
  color: string;
}

export function MetricCard({ title, value, change, color }: MetricCardProps) {
  return (
    <Card className="bg-white">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={cn("w-4 h-4 rounded", color)} />
            <span className="text-sm font-medium text-muted-foreground">
              {title}
            </span>
          </div>
          <button className="text-muted-foreground hover:text-foreground">
            <svg
              width="4"
              height="16"
              viewBox="0 0 4 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 4C3.1 4 4 3.1 4 2C4 0.9 3.1 0 2 0C0.9 0 0 0.9 0 2C0 3.1 0.9 4 2 4ZM2 6C0.9 6 0 6.9 0 8C0 9.1 0.9 10 2 10C3.1 10 4 9.1 4 8C4 6.9 3.1 6 2 6ZM2 12C0.9 12 0 12.9 0 14C0 15.1 0.9 16 2 16C3.1 16 4 15.1 4 14C4 12.9 3.1 12 2 12Z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        <div className="space-y-2">
          <div className="text-2xl font-bold">{value}</div>
          {/* <div className="flex items-center space-x-2 text-sm">
            <span
              className={cn(
                "flex items-center",
                change.trend === "up" ? "text-green-600" : "text-red-600"
              )}
            >
              {change.trend === "up" ? (
                <ArrowUp className="mr-1 h-4 w-4" />
              ) : (
                <ArrowDown className="mr-1 h-4 w-4" />
              )}
              {change.value}
            </span>
            <span className="text-muted-foreground">{change.today}</span>
          </div> */}
        </div>

        <div className="pt-4 border-t">
          <a
            href="#"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            View Report
            <ArrowRight className="ml-1 h-4 w-4" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
