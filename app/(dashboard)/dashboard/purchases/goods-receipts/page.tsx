import { Suspense } from 'react';

import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import Link from 'next/link';
import GoodsReceiptsLayout from './components/goods-receipts-layout';

export default function GoodsReceiptsPage() {
  return (
    <div className="container py-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Goods Receipts</h1>
          <p className="text-gray-600">Track and manage received goods from purchase orders</p>
        </div>
        <Link href="/dashboard/purchases/purchase-order">
          <Button variant="outline" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            View Purchase Orders
          </Button>
        </Link>
      </div>

      <Suspense fallback={<div>Loading goods receipts...</div>}>
        <GoodsReceiptsLayout />
      </Suspense>
    </div>
  );
}
