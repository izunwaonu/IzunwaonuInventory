// components/ui/date-filter.tsx
"use client";

import { useState } from "react";
import {
  format,
  startOfDay,
  endOfDay,
  subDays,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { DateRange as CalendarDateRange } from "react-day-picker";

// Define our own DateRange type for the component API
export type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

export type DateFilterOption =
  | "lifetime"
  | "today"
  | "last7days"
  | "thisMonth"
  | "thisYear"
  | "custom";

interface DateFilterProps {
  onFilterChange: (range: DateRange | null, option: DateFilterOption) => void;
}

export default function DateFilter({ onFilterChange }: DateFilterProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [dateRange, setDateRange] = useState<CalendarDateRange | undefined>(
    undefined
  );
  const [selectedOption, setSelectedOption] =
    useState<DateFilterOption>("lifetime");

  const handleOptionSelect = (option: DateFilterOption) => {
    setSelectedOption(option);
    let newRange: DateRange | null = null;

    const today = new Date();

    switch (option) {
      case "lifetime":
        newRange = null;
        break;
      case "today":
        newRange = {
          from: startOfDay(today),
          to: endOfDay(today),
        };
        break;
      case "last7days":
        newRange = {
          from: startOfDay(subDays(today, 6)),
          to: endOfDay(today),
        };
        break;
      case "thisMonth":
        newRange = {
          from: startOfMonth(today),
          to: endOfMonth(today),
        };
        break;
      case "thisYear":
        newRange = {
          from: startOfYear(today),
          to: endOfYear(today),
        };
        break;
      case "custom":
        setIsCalendarOpen(true);
        return; // Don't update filter yet, wait for user to select dates
    }

    onFilterChange(newRange, option);
  };

  const getFilterLabel = () => {
    switch (selectedOption) {
      case "lifetime":
        return "All Time";
      case "today":
        return "Today";
      case "last7days":
        return "Last 7 Days";
      case "thisMonth":
        return "This Month";
      case "thisYear":
        return "This Year";
      case "custom":
        if (dateRange?.from && dateRange?.to) {
          return `${format(dateRange.from, "MMM dd, yyyy")} - ${format(
            dateRange.to,
            "MMM dd, yyyy"
          )}`;
        }
        return "Custom Range";
      default:
        return "All Time";
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="min-w-[180px] justify-between">
            <span>{getFilterLabel()}</span>
            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuItem onSelect={() => handleOptionSelect("lifetime")}>
            All Time
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleOptionSelect("today")}>
            Today
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleOptionSelect("last7days")}>
            Last 7 Days
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleOptionSelect("thisMonth")}>
            This Month
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => handleOptionSelect("thisYear")}>
            This Year
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => handleOptionSelect("custom")}>
            Custom Range
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedOption === "custom" && (
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                !dateRange?.from && !dateRange?.to && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from && dateRange?.to ? (
                <>
                  {format(dateRange.from, "MMM dd, yyyy")} -{" "}
                  {format(dateRange.to, "MMM dd, yyyy")}
                </>
              ) : (
                "Select date range"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={(range) => {
                setDateRange(range);
                // Only trigger the filter change when both dates are selected
                if (range?.from && range?.to) {
                  // Use setTimeout to break the render cycle
                  setTimeout(() => {
                    onFilterChange(
                      {
                        from: startOfDay(range.from as any),
                        to: endOfDay(range.to as any),
                      },
                      "custom"
                    );
                  }, 0);
                }
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
