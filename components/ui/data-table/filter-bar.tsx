// components/ui/data-table/filter-bar.tsx
"use client";

import { ReactNode } from "react";
import clsx from "clsx";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import DateFilter, {
  DateRange,
  DateFilterOption,
} from "@/components/ui/data-table/date-filter";
import TableActions from "./table-actions";

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showDateFilter?: boolean;
  dateFilter?: {
    range: DateRange | null;
    option: DateFilterOption;
  };
  onDateFilterChange?: (
    range: DateRange | null,
    option: DateFilterOption
  ) => void;
  additionalFilters?: ReactNode;
  onExport?: () => void;
}

export default function FilterBar({
  searchQuery,
  onSearchChange,
  showDateFilter = false,
  dateFilter,
  onDateFilterChange,
  additionalFilters,
  onExport,
}: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full">
        {/* Search Input */}
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 w-full"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1.5 h-6 w-6"
              onClick={() => onSearchChange("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Date Filter */}
        {showDateFilter && dateFilter && onDateFilterChange && (
          <DateFilter onFilterChange={onDateFilterChange} />
        )}

        {/* Additional Custom Filters */}
        {additionalFilters}
      </div>

      {/* Export Button */}
      {onExport && (
        <div className="w-full sm:w-auto">
          <TableActions.ExportButton onClick={onExport} />
        </div>
      )}
    </div>
  );
}
