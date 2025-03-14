import React from "react";

const IzuInventoryLogo = ({
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
    textSecondary: isDark ? "#3b82f6" : "#3b82f6",
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

        {/* Inventory Box Symbol Group */}
        <g transform="translate(30, 25)">
          {/* Box base */}
          <path
            d="M50 10 L80 25 L50 40 L20 25 Z"
            fill={`url(#gradient-${theme})`}
            stroke="#ffffff"
            strokeWidth="1.5"
          />
          {/* Box front */}
          <path
            d="M20 25 L20 60 L50 75 L50 40 Z"
            fill={`url(#gradient-${theme})`}
            stroke="#ffffff"
            strokeWidth="1.5"
            fillOpacity="0.9"
          />
          {/* Box side */}
          <path
            d="M50 40 L50 75 L80 60 L80 25 Z"
            fill={`url(#gradient-${theme})`}
            stroke="#ffffff"
            strokeWidth="1.5"
            fillOpacity="0.7"
          />
          {/* Box lines */}
          <path
            d="M30 30 L30 55 M40 35 L40 60 M60 35 L60 60 M70 30 L70 55"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1"
            strokeDasharray="3,2"
          />
        </g>

        {/* Text */}
        <text
          x="120"
          y="70"
          fontFamily="Arial, sans-serif"
          fontWeight="bold"
          fontSize="44"
          fill={colors.textPrimary}
        >
          Izu
          <tspan fill={colors.textSecondary}>Inventory</tspan>
        </text>

        {/* Tagline */}
        <text
          x="123"
          y="90"
          fontFamily="Arial, sans-serif"
          fontSize="14"
          fill={colors.tagline}
        >
          Simplify Stock. Amplify Business.
        </text>
      </svg>
    </div>
  );
};

export default IzuInventoryLogo;