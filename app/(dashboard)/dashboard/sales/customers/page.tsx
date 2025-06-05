// app/products/page.tsx
import { Suspense } from 'react';

import { TableLoading } from '@/components/ui/data-table';

import { getAuthenticatedUser } from '@/config/useAuth';
import CustomerListing from './components/customerListing';

export default async function ProductsPage() {
  return (
    <div className="container py-8">
      <Suspense fallback={<TableLoading title="Customers" />}>
        <CustomerListing title="Customers" />
      </Suspense>
    </div>
  );
}
