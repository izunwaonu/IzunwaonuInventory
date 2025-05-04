// components/ui/rows-per-page.tsx
"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RowsPerPageProps {
  value: number;
  onChange: (value: number) => void;
  options?: number[];
  className?: string;
}

export default function RowsPerPage({
  value,
  onChange,
  options = [5, 10, 25, 50, 100],
  className = "",
}: RowsPerPageProps) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="text-sm text-muted-foreground whitespace-nowrap">
        Rows per page:
      </span>
      <Select
        value={value.toString()}
        onValueChange={(val) => onChange(parseInt(val, 10))}
      >
        <SelectTrigger className="h-8 w-[70px]">
          <SelectValue placeholder={value.toString()} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option} value={option.toString()}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
