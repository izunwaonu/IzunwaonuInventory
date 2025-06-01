// import CreatePurchaseOrderForm from "@/components/create-purchase-order-form"
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import CreatePurchaseOrderForm from '../components/create-purchase-order-form';

export default function CreatePurchaseOrderPage() {
  return (
    <div className="container py-6">
      <div className="mb-6">
        <Link
          href="/dashboard/purchase-orders"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-4 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="text-sm font-medium">Back to Purchase Orders</span>
        </Link>

        <h1 className="text-2xl font-bold text-gray-900">Create Purchase Order</h1>
        <p className="text-gray-600">Create a new purchase order for your suppliers</p>
      </div>

      <CreatePurchaseOrderForm />
    </div>
  );
}
