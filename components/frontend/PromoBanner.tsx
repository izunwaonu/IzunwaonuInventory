import Link from "next/link";
import React from "react";
import { Sparkles, Gift, ArrowRight } from "lucide-react";

const PromoBanner: React.FC = () => {
  return (
    <Link
      href="https://coding-school-typescript.vercel.app/give-away"
      target="_blank"
      className="relative group"
    >
      {/* Background with gradient */}
      <div
        className="
        sticky top-0 z-[999]
        bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600
        hover:from-blue-500 hover:via-indigo-400 hover:to-blue-500
        transition-all duration-300
      "
      >
        {/* Subtle animated gradient overlay */}
        <div
          className="
          absolute inset-0 opacity-20
          bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)]
          bg-[length:250%_250%]
          animate-shimmer
        "
        />

        {/* Content container */}
        <div
          className="
          h-12 px-4 py-2
          flex justify-center items-center
          text-sm text-white
          relative
        "
        >
          <div
            className="
            flex items-center gap-3
            max-w-7xl mx-auto px-4
            animate-fadeIn
          "
          >
            {/* Left sparkle */}
            <div className="hidden sm:flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <Gift className="w-4 h-4 text-yellow-300" />
            </div>

            {/* Main text content */}
            <p className="font-medium">
              Get a{" "}
              <span className="font-semibold border-b border-yellow-300/50 hover:border-yellow-300">
                Free Next.js Starter Kit
              </span>{" "}
              and enjoy{" "}
              <span
                className="
                bg-yellow-300/20 px-1.5 py-0.5 rounded-md
                text-yellow-200 font-semibold
              "
              >
                50% Discount
              </span>{" "}
              on the Premium{" "}
              <span className="font-semibold border-b border-yellow-300/50 hover:border-yellow-300">
                Next.js Fullstack Course
              </span>
              !
            </p>

            {/* Learn More button */}
            <div
              className="
              hidden lg:flex items-center gap-1
              text-yellow-200 font-medium
              group-hover:translate-x-0.5 transition-transform
            "
            >
              Learn More
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

// Add the shimmer animation
const styles = `
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-shimmer {
  animation: shimmer 8s linear infinite;
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-out;
}
`;

// Add the styles to the document
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default PromoBanner;
