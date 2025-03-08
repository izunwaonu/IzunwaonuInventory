import React from "react";

export default function LoginLoader() {
  return (
    <div className="min-h-screen flex">
      {/* Left Section - Login Form */}
      <div className="w-1/2 p-8 flex flex-col justify-center">
        {/* Logo */}
        <div className="mb-12">
          <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>
        </div>

        {/* Login Form */}
        <div className="max-w-md space-y-8">
          {/* Heading */}
          <div className="h-8 w-64 bg-gray-200 animate-pulse rounded"></div>

          {/* Email Field */}
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-12 w-full bg-gray-100 animate-pulse rounded"></div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <div className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div>
            <div className="h-12 w-full bg-gray-100 animate-pulse rounded"></div>
            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>

          {/* Sign In Button */}
          <div className="h-12 w-full bg-indigo-200 animate-pulse rounded"></div>
        </div>
      </div>

      {/* Right Section - Image Carousel */}
      <div className="w-1/2 relative">
        <div className="absolute inset-0 bg-purple-200 animate-pulse">
          {/* Carousel Navigation */}
          <div className="absolute inset-y-0 left-4 flex items-center">
            <div className="h-8 w-8 bg-white/20 animate-pulse rounded-full"></div>
          </div>
          <div className="absolute inset-y-0 right-4 flex items-center">
            <div className="h-8 w-8 bg-white/20 animate-pulse rounded-full"></div>
          </div>

          {/* Carousel Content */}
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 space-y-4">
            <div className="h-8 w-64 bg-white/20 animate-pulse rounded"></div>
            <div className="h-6 w-48 bg-white/20 animate-pulse rounded"></div>

            {/* Carousel Dots */}
            <div className="flex justify-center space-x-2 mt-6">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-2 w-2 bg-white/20 animate-pulse rounded-full"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
