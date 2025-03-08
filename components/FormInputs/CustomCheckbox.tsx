"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface CustomCheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const CustomCheckbox = forwardRef<HTMLInputElement, CustomCheckboxProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="flex items-center ps-3">
        <input
          type="checkbox"
          ref={ref}
          {...props}
          className={cn(
            "w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded",
            "focus:ring-blue-500 focus:ring-2",
            "checked:bg-blue-600 checked:border-blue-600",
            className
          )}
        />
        {label && (
          <label
            htmlFor={props.id}
            className="w-full py-1 ms-2 text-sm font-medium text-gray-900"
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

CustomCheckbox.displayName = "CustomCheckbox";

export { CustomCheckbox };
