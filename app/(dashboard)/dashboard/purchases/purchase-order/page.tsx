import { Suspense } from 'react';
// import PurchaseOrderLayout from '@/components/purchase-order-layout';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import PurchaseOrderLayout from './components/purchase-order-layout';

export default function PurchaseOrdersPage() {
  return (
    <div className="container py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Purchase Orders</h1>
          <p className="text-gray-600">Manage your purchase orders and track deliveries</p>
        </div>
        <Link href="/dashboard/purchases/purchase-order/create">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Purchase Order
          </Button>
        </Link>
      </div>

      <Suspense fallback={<div>Loading purchase orders...</div>}>
        <PurchaseOrderLayout />
      </Suspense>
    </div>
  );
}
