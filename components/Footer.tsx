import React from "react";
import { Heart } from "lucide-react";
import Link from "next/link";

const FooterBanner = () => {
  return (
    <footer className="w-full bg-gray-900 text-white py-4 mt-auto relative">
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(to right, gray 1px, transparent 1px),
              linear-gradient(to bottom, gray 1px, transparent 1px)
            `,
            backgroundSize: "20px 20px",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="flex items-center justify-center space-x-2">
          <span className="text-sm md:text-base">Developed with</span>
          <Heart
            className="text-red-500 animate-pulse"
            size={16}
            fill="currentColor"
          />
          <span className="text-sm md:text-base">by</span>
          <Link
            href="https://wa.me/message/5USU26346OWRF1"
            className="text-sm md:text-base text-blue-400 hover:text-blue-300 transition-colors duration-200 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            JB
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default FooterBanner;
