// app/products/page.tsx
import { Suspense } from "react";

import { TableLoading } from "@/components/ui/data-table";
import ItemListing from "@/components/dashboard/items/item-listing";
import { getAuthenticatedUser } from "@/config/useAuth";

export default async function ProductsPage() {

  const user = await getAuthenticatedUser()
  const orgId = user.orgId
  return (
    <div className="container py-8">
      <Suspense fallback={<TableLoading title="Item Inventory" />}>
        <ItemListing title="Inventory" orgId={orgId} />
      </Suspense>
    </div>
  );
}
