import { Suspense } from 'react';
import { InventoryPageSkeleton } from './inventory-skeleton';
import { InventoryManagement } from './components/inventory-management';
// import { InventoryManagement } from "@/components/inventory/inventory-management"
// import { InventoryPageSkeleton } from "@/components/inventory/inventory-skeleton"

export const metadata = {
  title: 'Inventory Management',
  description: 'View and manage your inventory across all locations',
};

export default function InventoryPage() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
        <p className="text-muted-foreground">View and manage your inventory across all locations</p>
      </div>

      <Suspense fallback={<InventoryPageSkeleton />}>
        <InventoryManagement />
      </Suspense>
    </div>
  );
}
