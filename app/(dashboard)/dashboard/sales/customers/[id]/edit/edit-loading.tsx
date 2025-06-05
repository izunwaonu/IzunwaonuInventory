import React from 'react';

const EditPageSkeleton = () => {
  const SkeletonBox = ({ width = 'w-full', height = 'h-4' }) => (
    <div className={`${width} ${height} bg-gray-200 rounded animate-pulse`}></div>
  );

  const SkeletonInput = ({ width = 'w-full' }) => (
    <div className={`${width} h-10 bg-gray-200 rounded border animate-pulse`}></div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Back button */}
      <div className="mb-6">
        <div className="flex items-center space-x-2">
          <SkeletonBox width="w-4" height="h-4" />
          <SkeletonBox width="w-24" height="h-4" />
        </div>
      </div>

      {/* Header section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="space-y-4">
          <SkeletonBox width="w-48" height="h-8" />
          <div className="flex space-x-8">
            <div className="flex items-center space-x-2">
              <SkeletonBox width="w-4" height="h-4" />
              <SkeletonBox width="w-20" height="h-4" />
              <SkeletonBox width="w-32" height="h-4" />
            </div>
            <div className="flex items-center space-x-2">
              <SkeletonBox width="w-4" height="h-4" />
              <SkeletonBox width="w-24" height="h-4" />
              <SkeletonBox width="w-40" height="h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <SkeletonBox width="w-32" height="h-8" />
          <SkeletonBox width="w-36" height="h-8" />
          <SkeletonBox width="w-32" height="h-8" />
        </div>
      </div>

      {/* Main content area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column - Product Identification */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <SkeletonBox width="w-48" height="h-6" />

          <div className="mt-6 space-y-6">
            {/* Name field */}
            <div>
              <SkeletonBox width="w-16" height="h-4" />
              <div className="mt-2">
                <SkeletonInput />
              </div>
            </div>

            {/* Slug field */}
            <div>
              <SkeletonBox width="w-12" height="h-4" />
              <div className="mt-2">
                <SkeletonInput />
              </div>
            </div>
          </div>
        </div>

        {/* Right column - Product Codes */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <SkeletonBox width="w-36" height="h-6" />

          <div className="mt-6 space-y-6">
            {/* SKU field */}
            <div>
              <SkeletonBox width="w-8" height="h-4" />
              <div className="mt-2">
                <SkeletonInput />
              </div>
            </div>

            {/* Barcode field */}
            <div>
              <SkeletonBox width="w-16" height="h-4" />
              <div className="mt-2">
                <SkeletonInput />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Windows activation notice (if present) */}
      <div className="fixed bottom-4 right-4">
        <div className="bg-white rounded-lg shadow-lg p-4 w-64">
          <div className="flex items-center space-x-2">
            <SkeletonBox width="w-6" height="h-6" />
            <SkeletonBox width="w-32" height="h-5" />
          </div>
          <div className="mt-2">
            <SkeletonBox width="w-full" height="h-3" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPageSkeleton;
