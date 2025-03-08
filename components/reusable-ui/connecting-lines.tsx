// ConnectingLines.tsx
import React from "react";

interface ConnectingLinesProps {
  theme?: "light" | "dark";
}

const ConnectingLines: React.FC<ConnectingLinesProps> = ({
  theme = "light",
}) => {
  const strokeColor =
    theme === "light" ? "rgba(226, 232, 240, 0.8)" : "rgba(51, 65, 85, 0.8)";

  return (
    <svg
      className="absolute inset-0 w-full h-full"
      style={{ minHeight: "600px" }}
    >
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop
            offset="0%"
            style={{ stopColor: strokeColor, stopOpacity: 0 }}
          />
          <stop
            offset="50%"
            style={{ stopColor: strokeColor, stopOpacity: 1 }}
          />
          <stop
            offset="100%"
            style={{ stopColor: strokeColor, stopOpacity: 0 }}
          />
        </linearGradient>
      </defs>
      <g>
        {/* Left side connections */}
        <path
          d="M 300,100 Q 400,200 500,300"
          stroke="url(#lineGradient)"
          fill="none"
          strokeWidth="1"
        />
        <path
          d="M 300,200 Q 400,250 500,300"
          stroke="url(#lineGradient)"
          fill="none"
          strokeWidth="1"
        />
        <path
          d="M 300,300 L 500,300"
          stroke="url(#lineGradient)"
          fill="none"
          strokeWidth="1"
        />
        <path
          d="M 300,400 Q 400,350 500,300"
          stroke="url(#lineGradient)"
          fill="none"
          strokeWidth="1"
        />
        <path
          d="M 300,500 Q 400,400 500,300"
          stroke="url(#lineGradient)"
          fill="none"
          strokeWidth="1"
        />

        {/* Right side connections */}
        <path
          d="M 500,300 Q 600,200 700,100"
          stroke="url(#lineGradient)"
          fill="none"
          strokeWidth="1"
        />
        <path
          d="M 500,300 Q 600,250 700,200"
          stroke="url(#lineGradient)"
          fill="none"
          strokeWidth="1"
        />
        <path
          d="M 500,300 L 700,300"
          stroke="url(#lineGradient)"
          fill="none"
          strokeWidth="1"
        />
        <path
          d="M 500,300 Q 600,350 700,400"
          stroke="url(#lineGradient)"
          fill="none"
          strokeWidth="1"
        />
        <path
          d="M 500,300 Q 600,400 700,500"
          stroke="url(#lineGradient)"
          fill="none"
          strokeWidth="1"
        />
      </g>
    </svg>
  );
};

export default ConnectingLines;
