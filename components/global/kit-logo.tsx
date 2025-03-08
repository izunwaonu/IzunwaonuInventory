import React from "react";

const HubStackLogo = ({
  theme = "light",
  className = "",
  width = 400,
  height = 120,
}) => {
  const isDark = theme === "dark";

  // Colors based on theme
  const colors = {
    background: isDark ? "#111827" : "transparent",
    gradientStart: isDark ? "#60a5fa" : "#2563eb",
    gradientEnd: isDark ? "#818cf8" : "#4f46e5",
    textPrimary: isDark ? "#ffffff" : "#1e293b",
    textSecondary: isDark ? "#60a5fa" : "#3b82f6",
    tagline: isDark ? "#94a3b8" : "#64748b",
  };

  return (
    <div className={className}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 400 120"
        className={`w-full h-auto`}
        style={{ maxWidth: width, maxHeight: height }}
      >
        {/* Background for dark theme */}
        {/* {isDark && <rect width="400" height="120" fill={colors.background} />} */}

        {/* Gradient definition */}
        <defs>
          <linearGradient
            id={`gradient-${theme}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop
              offset="0%"
              style={{ stopColor: colors.gradientStart, stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: colors.gradientEnd, stopOpacity: 1 }}
            />
          </linearGradient>
        </defs>

        {/* Code Symbol Group */}
        <g transform="translate(30, 25)">
          {/* Outer hexagon */}
          <path
            d="M50 0 L85 20 L85 60 L50 80 L15 60 L15 20 Z"
            fill={`url(#gradient-${theme})`}
            stroke="#ffffff"
            strokeWidth="2"
          />

          {/* Code brackets */}
          <path
            d="M35 30 L45 40 L35 50 M65 30 L55 40 L65 50"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </g>

        {/* Text */}
        <text
          x="120"
          y="70"
          fontFamily="Arial, sans-serif"
          fontWeight="bold"
          fontSize="48"
          fill={colors.textPrimary}
        >
          Hub
          <tspan fill={colors.textSecondary}>Stack</tspan>
        </text>

        {/* Tagline */}
        <text
          x="123"
          y="90"
          fontFamily="Arial, sans-serif"
          fontSize="14"
          fill={colors.tagline}
        >
          Premium Developer Toolkit
        </text>
      </svg>
    </div>
  );
};

export default HubStackLogo;
