import React from 'react';

interface SkeletonBoxProps {
  width?: string;
  height?: string;
  className?: string;
}

interface SkeletonCardProps {
  children: React.ReactNode;
  className?: string;
}

const DashboardLayoutSkeleton = () => {
  const SkeletonBox: React.FC<SkeletonBoxProps> = ({ width = "w-full", height = "h-4", className = "" }) => (
    <div className={`${width} ${height} bg-gray-200 rounded animate-pulse ${className}`}></div>
  );

  const SkeletonCard: React.FC<SkeletonCardProps> = ({ children, className = "" }) => (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      {children}
    </div>
  );

  const SidebarItem = () => (
    <div className="flex items-center space-x-3 px-4 py-3">
      <SkeletonBox width="w-5" height="h-5" />
      <SkeletonBox width="w-20" height="h-4" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200 flex flex-col">
        {/* Logo section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <SkeletonBox width="w-10" height="h-10" className="rounded-full" />
            <div className="flex-1">
              <SkeletonBox width="w-24" height="h-5" />
              <SkeletonBox width="w-32" height="h-3" className="mt-1" />
            </div>
            <SkeletonBox width="w-6" height="h-6" className="rounded-full" />
          </div>
        </div>

        {/* Navigation items */}
        <div className="flex-1 py-4">
          <SidebarItem />
          <SidebarItem />
          <SidebarItem />
          <SidebarItem />
          <SidebarItem />
          <SidebarItem />
          <SidebarItem />
          <SidebarItem />
          <SidebarItem />
        </div>

        {/* User section at bottom */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <SkeletonBox width="w-10" height="h-10" className="rounded-full" />
            <div className="flex-1">
              <SkeletonBox width="w-28" height="h-4" />
              <SkeletonBox width="w-32" height="h-3" className="mt-1" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <SkeletonBox width="w-20" height="h-5" />
              <SkeletonBox width="w-24" height="h-4" />
            </div>
            <div className="flex items-center space-x-4">
              <SkeletonBox width="w-10" height="h-10" className="rounded-full" />
              <div>
                <SkeletonBox width="w-32" height="h-4" />
                <SkeletonBox width="w-36" height="h-3" className="mt-1" />
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-8">
          {/* Page header with title and controls */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <SkeletonBox width="w-32" height="h-8" />
              <SkeletonBox width="w-48" height="h-4" className="mt-2" />
            </div>
            <div className="flex items-center space-x-4">
              <SkeletonBox width="w-24" height="h-10" className="rounded" />
              <SkeletonBox width="w-32" height="h-10" className="rounded" />
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <SkeletonCard key={i}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <SkeletonBox width="w-20" height="h-4" />
                    <SkeletonBox width="w-24" height="h-8" className="mt-3" />
                    <SkeletonBox width="w-16" height="h-3" className="mt-2" />
                  </div>
                  <SkeletonBox width="w-10" height="h-10" className="rounded" />
                </div>
              </SkeletonCard>
            ))}
          </div>

          {/* Main content sections */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <SkeletonCard className="lg:col-span-2">
              <div className="space-y-6">
                <SkeletonBox width="w-32" height="h-6" />
                <SkeletonBox width="w-48" height="h-4" />
                
                {/* Table header */}
                <div className="grid grid-cols-4 gap-4 py-3 border-b border-gray-100">
                  <SkeletonBox width="w-16" height="h-4" />
                  <SkeletonBox width="w-12" height="h-4" />
                  <SkeletonBox width="w-14" height="h-4" />
                  <SkeletonBox width="w-10" height="h-4" />
                </div>

                {/* Table rows */}
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="grid grid-cols-4 gap-4 py-4 border-b border-gray-50">
                    <div className="flex items-center space-x-3">
                      <SkeletonBox width="w-8" height="h-8" className="rounded-full" />
                      <div>
                        <SkeletonBox width="w-20" height="h-4" />
                        <SkeletonBox width="w-32" height="h-3" className="mt-1" />
                      </div>
                    </div>
                    <SkeletonBox width="w-16" height="h-6" className="rounded-full" />
                    <SkeletonBox width="w-12" height="h-4" />
                    <SkeletonBox width="w-16" height="h-4" />
                  </div>
                ))}
              </div>
            </SkeletonCard>

            {/* Top Products */}
            <SkeletonCard>
              <div className="space-y-6">
                <SkeletonBox width="w-32" height="h-6" />
                <SkeletonBox width="w-40" height="h-4" />

                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between py-3">
                    <div className="flex items-center space-x-3">
                      <SkeletonBox width="w-8" height="h-8" className="rounded" />
                      <div>
                        <SkeletonBox width="w-24" height="h-4" />
                        <SkeletonBox width="w-16" height="h-3" className="mt-1" />
                      </div>
                    </div>
                    <SkeletonBox width="w-16" height="h-5" />
                  </div>
                ))}
              </div>
            </SkeletonCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayoutSkeleton;