// import { notFound } from 'next/navigation';
// import { db } from '@/prisma/db';
// import { getBriefItemById, getItemById } from '@/actions/items';
// import { ArrowLeft, Calendar, Hash } from 'lucide-react';
// import Link from 'next/link';
// import { Suspense } from 'react';
// import EditPageSkeleton from './edit-loading';
// import { Button } from '@/components/ui/moving-border';
// import AddItemSupplierModal from './add-item-supplier-modal';
// import { getBriefSuppliers } from '@/actions/suppliers';

// export default async function ItemEditPage({ params }: { params: Promise<{ id: string }> }) {
//   // Format the updated date
//   const formatDate = (dateString?: string | Date) => {
//     if (!dateString) return 'Not updated';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   };

//   try {
//     const id = (await params).id;
//     const item = await getBriefItemById(id);
//     const suppliers = await getBriefSuppliers();

//     if (!item) {
//       notFound();
//     }
//     const existingSupplierIds = item.supplierRelations.map((is) => is.supplierId);

//     return (
//       <Suspense fallback={<EditPageSkeleton />}>
//         <div className="container py-10">
//           <div className="mb-8">
//             {/* Back Button */}
//             <Link
//               href="/dashboard/inventory/items"
//               className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-6 group"
//             >
//               <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
//               <span className="text-sm font-medium">Back to Items</span>
//             </Link>

//             {/* Main Header */}
//             <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6 shadow-sm">
//               <div className="flex flex-col space-y-4">
//                 {/* Title */}
//                 <h1 className="text-xl font-bold text-gray-900 leading-tight">
//                   Update Item: <span className=" text-gray-600">{item.name}</span>
//                 </h1>

//                 {/* SKU and Updated Info */}
//                 <div className="flex flex-wrap items-center gap-6 text-sm">
//                   {/* SKU */}
//                   {item.sku && (
//                     <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
//                       <Hash className="w-4 h-4 text-gray-500" />
//                       <span className="text-gray-600 font-sm">SKU:</span>
//                       <span className="font-semibold text-gray-900">{item.sku}</span>
//                     </div>
//                   )}

//                   {/* Last Updated */}
//                   <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
//                     <Calendar className="w-4 h-4 text-gray-500" />
//                     <span className="text-gray-600 font-medium">Last Updated:</span>
//                     <span className="font-semibold text-gray-900">
//                       {formatDate(item.updatedAt)}
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <AddItemSupplierModal
//                       existingSupplierIds={existingSupplierIds}
//                       suppliers={suppliers}
//                       itemId={id}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="">Item Suppliers layout will be here</div>
//         </div>
//       </Suspense>
//     );
//   } catch (error) {
//     console.error('Error loading item:', error);
//     notFound();
//   }
// }

import { notFound } from 'next/navigation';
import { getBriefItemById } from '@/actions/items';
import { ArrowLeft, Calendar, Hash } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import EditPageSkeleton from './edit-loading';
import AddItemSupplierModal from './add-item-supplier-modal';
import { getBriefSuppliers } from '@/actions/suppliers';
import ItemSupplierLayout from './item-supplier-layout';
// import ItemSupplierLayout from "@/components/item-supplier-layout"

export default async function ItemEditPage({ params }: { params: Promise<{ id: string }> }) {
  // Format the updated date
  const formatDate = (dateString?: string | Date) => {
    if (!dateString) return 'Not updated';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  try {
    const id = (await params).id;
    const item = await getBriefItemById(id);
    const suppliers = await getBriefSuppliers();

    if (!item) {
      notFound();
    }
    const existingSupplierIds = item.supplierRelations.map((is) => is.supplierId);

    return (
      <Suspense fallback={<EditPageSkeleton />}>
        <div className="container py-10">
          <div className="mb-8">
            {/* Back Button */}
            <Link
              href="/dashboard/inventory/items"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-6 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="text-sm font-medium">Back to Items</span>
            </Link>

            {/* Main Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6 shadow-sm">
              <div className="flex flex-col space-y-4">
                {/* Title */}
                <h1 className="text-xl font-bold text-gray-900 leading-tight">
                  Update Item: <span className=" text-gray-600">{item.name}</span>
                </h1>

                {/* SKU and Updated Info */}
                <div className="flex flex-wrap items-center gap-6 text-sm">
                  {/* SKU */}
                  {item.sku && (
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
                      <Hash className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600 font-sm">SKU:</span>
                      <span className="font-semibold text-gray-900">{item.sku}</span>
                    </div>
                  )}

                  {/* Last Updated */}
                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600 font-medium">Last Updated:</span>
                    <span className="font-semibold text-gray-900">
                      {formatDate(item.updatedAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AddItemSupplierModal
                      existingSupplierIds={existingSupplierIds}
                      suppliers={suppliers}
                      itemId={id}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm">
            <ItemSupplierLayout itemId={id} />
          </div>
        </div>
      </Suspense>
    );
  } catch (error) {
    console.error('Error loading item:', error);
    notFound();
  }
}
