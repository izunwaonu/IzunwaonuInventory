import { Suspense } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getLocations, getItemsWithInventory } from '@/actions/adjustments';
import { CreateAdjustmentForm } from '../components/create-adjustment-form';

async function CreateAdjustmentContent() {
  const [locations, items] = await Promise.all([getLocations(), getItemsWithInventory()]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/inventory/adjustments">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Stock Adjustment</h1>
          <p className="text-gray-600 mt-1">
            Adjust inventory quantities for accurate stock levels
          </p>
        </div>
      </div>

      {/* Form */}
      <CreateAdjustmentForm locations={locations} items={items} />
    </div>
  );
}

function CreateAdjustmentSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="h-96 bg-gray-200 rounded animate-pulse"></div>
    </div>
  );
}

export default function CreateAdjustmentPage() {
  return (
    <Suspense fallback={<CreateAdjustmentSkeleton />}>
      <CreateAdjustmentContent />
    </Suspense>
  );
}
