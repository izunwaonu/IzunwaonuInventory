import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface GridBackgroundProps {
  children: ReactNode;
  className?: string;
}

const GridBackground: React.FC<GridBackgroundProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={cn("relative min-h-screen w-full bg-slate-50", className)}>
      {/* Grid Pattern SVG */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid-pattern"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              {/* Vertical lines */}
              <path
                d="M 40 0 L 40 40"
                fill="none"
                stroke="rgb(226 232 240)"
                strokeWidth="0.4"
              />
              {/* Horizontal lines */}
              <path
                d="M 0 40 L 40 40"
                fill="none"
                stroke="rgb(226 232 240)"
                strokeWidth="0.4"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>

      {/* Content Container */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export { GridBackground };
