import { Suspense } from 'react';
import type { Metadata } from 'next';

import { Skeleton } from '@/components/ui/skeleton';
import SalesReportDashboard from './components/sales-report-dashboard';

export const metadata: Metadata = {
  title: 'Sales Reports | Dashboard',
  description: 'Comprehensive sales performance analysis and reporting',
};

function SalesReportSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-80" />
        <Skeleton className="h-80" />
      </div>
    </div>
  );
}

export default function SalesReportsPage() {
  return (
    <div className="container mx-auto p-4 lg:p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Sales Reports</h1>
        <p className="text-muted-foreground">
          Comprehensive analysis of your sales performance across all channels
        </p>
      </div>

      <Suspense fallback={<SalesReportSkeleton />}>
        <SalesReportDashboard />
      </Suspense>
    </div>
  );
}
