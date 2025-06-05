import { notFound } from 'next/navigation';
import { SupplierUpdateForm } from './supplier-update-form';

import { ArrowLeft, Calendar, Hash, Phone } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import EditPageSkeleton from './edit-loading';
import { getSupplierById } from '@/actions/suppliers';

// Add this interface at the top of the file or update the existing one
interface Supplier {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  contactPerson?: string | null;
  notes?: string | null;
  paymentTerms?: string | null;
  taxId?: string | null;
  orgId: string;
  updatedAt?: string | Date;
}

export default async function SupplierEditPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;

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
    const supplier = await getSupplierById(id);

    if (!supplier) {
      notFound();
    }

    return (
      <Suspense fallback={<EditPageSkeleton />}>
        <div className="container py-10">
          <div className="mb-8">
            {/* Back Button */}
            <Link
              href="/dashboard/purchases/suppliers"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-6 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="text-sm font-medium">Back to Suppliers</span>
            </Link>

            {/* Main Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6 shadow-sm">
              <div className="flex flex-col space-y-4">
                {/* Title */}
                <h1 className="text-xl font-bold text-gray-900 leading-tight">
                  Update Supplier: <span className="text-gray-600">{supplier.name}</span>
                </h1>

                {/* Supplier Info */}
                <div className="flex flex-wrap items-center gap-6 text-sm">
                  {/* Phone */}
                  {supplier.phone && (
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600 font-medium">Phone:</span>
                      <span className="font-semibold text-gray-900">{supplier.phone}</span>
                    </div>
                  )}

                  {/* Tax ID */}
                  {/* {supplier.taxId && (
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
                      <Hash className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600 font-medium">Tax ID:</span>
                      <span className="font-semibold text-gray-900">{supplier.taxId}</span>
                    </div>
                  )} */}

                  {/* Payment Terms */}
                  {/* {supplier.paymentTerms && (
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600 font-medium">Terms:</span>
                      <span className="font-semibold text-gray-900">{supplier.paymentTerms}</span>
                    </div>
                  )} */}

                  {/* Supplier ID */}
                  {/* <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
                    <Hash className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600 font-medium">ID:</span>
                    <span className="font-semibold text-gray-900">{supplier.id}</span>
                  </div> */}

                  {/* Last Updated */}
                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600 font-medium">Last Updated:</span>
                    <span className="font-semibold text-gray-900">
                      {formatDate(supplier.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Supplier Update Form */}
          <SupplierUpdateForm supplier={supplier} />
        </div>
      </Suspense>
    );
  } catch (error) {
    console.error('Error loading supplier:', error);
    notFound();
  }
}
