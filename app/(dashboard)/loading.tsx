import React from "react";

export default function DashboardLoader() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 animate-pulse bg-gray-200 rounded"></div>
          <div className="h-4 w-32 animate-pulse bg-gray-200 rounded"></div>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-8 w-64 animate-pulse bg-gray-200 rounded"></div>
          <div className="h-8 w-8 animate-pulse bg-gray-200 rounded-full"></div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 p-4">
        <div className="space-y-6">
          <div className="h-6 w-32 animate-pulse bg-gray-200 rounded"></div>
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-5 w-5 animate-pulse bg-gray-200 rounded"></div>
              <div className="h-4 w-24 animate-pulse bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-6">
        {/* Welcome Section */}
        <div className="bg-gray-300 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 animate-pulse bg-gray-200 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-6 w-48 animate-pulse bg-gray-200 rounded"></div>
              <div className="h-4 w-32 animate-pulse bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-lg border border-gray-200"
            >
              <div className="space-y-4">
                <div className="h-4 w-20 animate-pulse bg-gray-200 rounded"></div>
                <div className="h-8 w-8 animate-pulse bg-gray-200 rounded"></div>
                <div className="h-4 w-24 animate-pulse bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
