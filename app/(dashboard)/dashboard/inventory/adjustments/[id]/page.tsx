import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { ArrowLeft, Package, Printer, Download } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { getAdjustmentById } from '@/actions/adjustments';
import { AdjustmentActions } from '../components/adjustment-actions';

const statusColors = {
  DRAFT: 'bg-gray-100 text-gray-800',
  APPROVED: 'bg-blue-100 text-blue-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELED: 'bg-red-100 text-red-800',
};

const statusLabels = {
  DRAFT: 'Draft',
  APPROVED: 'Approved',
  COMPLETED: 'Completed',
  CANCELED: 'Cancelled',
};

const typeColors = {
  STOCK_COUNT: 'bg-blue-100 text-blue-800',
  DAMAGE: 'bg-red-100 text-red-800',
  THEFT: 'bg-orange-100 text-orange-800',
  EXPIRED: 'bg-yellow-100 text-yellow-800',
  OTHER: 'bg-gray-100 text-gray-800',
};

const typeLabels = {
  STOCK_COUNT: 'Stock Count',
  DAMAGE: 'Damage',
  THEFT: 'Theft',
  EXPIRED: 'Expired',
  OTHER: 'Other',
};

async function AdjustmentDetails({ adjustmentId }: { adjustmentId: string }) {
  const adjustment = await getAdjustmentById(adjustmentId);

  if (!adjustment) {
    notFound();
  }

  const canApprove = adjustment.status === 'DRAFT';
  const canComplete = adjustment.status === 'APPROVED';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/inventory/adjustments">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Adjustment {adjustment.adjustmentNumber}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={statusColors[adjustment.status as keyof typeof statusColors]}>
                {statusLabels[adjustment.status as keyof typeof statusLabels]}
              </Badge>
              <span className="text-sm text-gray-500">
                {format(new Date(adjustment.date), 'MMM dd, yyyy')}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <AdjustmentActions
            adjustmentId={adjustmentId}
            currentStatus={adjustment.status}
            canApprove={canApprove}
            canComplete={canComplete}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Adjustment Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Adjustment Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Adjustment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Adjustment Number</span>
                  <p className="font-medium">{adjustment.adjustmentNumber}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Date</span>
                  <p className="font-medium">{format(new Date(adjustment.date), 'MMM dd, yyyy')}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Location</span>
                  <p className="font-medium">{adjustment.location.name}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Type</span>
                  <Badge
                    className={typeColors[adjustment.adjustmentType as keyof typeof typeColors]}
                  >
                    {typeLabels[adjustment.adjustmentType as keyof typeof typeLabels]}
                  </Badge>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Status</span>
                  <Badge className={statusColors[adjustment.status as keyof typeof statusColors]}>
                    {statusLabels[adjustment.status as keyof typeof statusLabels]}
                  </Badge>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Created By</span>
                  <p className="font-medium">
                    {adjustment.createdBy
                      ? `${adjustment.createdBy.firstName} ${adjustment.createdBy.lastName}`
                      : 'System'}
                  </p>
                </div>
              </div>

              {adjustment.approvedBy && (
                <div>
                  <span className="text-sm text-gray-600">Approved By</span>
                  <p className="font-medium">
                    {`${adjustment.approvedBy.firstName} ${adjustment.approvedBy.lastName}`}
                  </p>
                </div>
              )}

              <div>
                <span className="text-sm text-gray-600">Reason</span>
                <p className="font-medium">{adjustment.reason}</p>
              </div>

              {adjustment.notes && (
                <div>
                  <span className="text-sm text-gray-600">Notes</span>
                  <p className="text-sm">{adjustment.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Adjustment Items */}
          <Card>
            <CardHeader>
              <CardTitle>Adjustment Items</CardTitle>
              <p className="text-sm text-gray-600">List of items included in this adjustment</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Item</th>
                        <th className="text-center py-2">SKU</th>
                        <th className="text-center py-2">Before Quantity</th>
                        <th className="text-center py-2">After Quantity</th>
                        <th className="text-center py-2">Change</th>
                        <th className="text-left py-2">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adjustment.lines.map((line) => (
                        <tr key={line.id} className="border-b">
                          <td className="py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                {line.item.thumbnail ? (
                                  <img
                                    src={line.item.thumbnail || '/placeholder.svg'}
                                    alt={line.item.name}
                                    className="w-8 h-8 object-cover rounded"
                                  />
                                ) : (
                                  <Package className="h-5 w-5 text-gray-400" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium">{line.item.name}</p>
                              </div>
                            </div>
                          </td>
                          <td className="text-center py-3">{line.item.sku || '-'}</td>
                          <td className="text-center py-3">{line.beforeQuantity}</td>
                          <td className="text-center py-3">{line.afterQuantity}</td>
                          <td className="text-center py-3">
                            <span
                              className={`font-medium ${
                                line.adjustedQuantity > 0
                                  ? 'text-green-600'
                                  : line.adjustedQuantity < 0
                                  ? 'text-red-600'
                                  : 'text-gray-600'
                              }`}
                            >
                              {line.adjustedQuantity > 0 ? '+' : ''}
                              {line.adjustedQuantity}
                            </span>
                          </td>
                          <td className="py-3">{line.notes || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                  {adjustment.lines.map((line) => (
                    <Card key={line.id} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            {line.item.thumbnail ? (
                              <img
                                src={line.item.thumbnail || '/placeholder.svg'}
                                alt={line.item.name}
                                className="w-8 h-8 object-cover rounded"
                              />
                            ) : (
                              <Package className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{line.item.name}</p>
                            {line.item.sku && (
                              <p className="text-sm text-gray-500">SKU: {line.item.sku}</p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div className="text-center">
                            <span className="text-gray-500">Before</span>
                            <p className="font-medium">{line.beforeQuantity}</p>
                          </div>
                          <div className="text-center">
                            <span className="text-gray-500">After</span>
                            <p className="font-medium">{line.afterQuantity}</p>
                          </div>
                          <div className="text-center">
                            <span className="text-gray-500">Change</span>
                            <p
                              className={`font-medium ${
                                line.adjustedQuantity > 0
                                  ? 'text-green-600'
                                  : line.adjustedQuantity < 0
                                  ? 'text-red-600'
                                  : 'text-gray-600'
                              }`}
                            >
                              {line.adjustedQuantity > 0 ? '+' : ''}
                              {line.adjustedQuantity}
                            </p>
                          </div>
                        </div>

                        {line.notes && (
                          <div>
                            <span className="text-gray-500 text-sm">Notes:</span>
                            <p className="text-sm">{line.notes}</p>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Adjustment Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Adjustment Summary</CardTitle>
              <p className="text-sm text-gray-600">Overview of quantity changes</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm text-gray-600">Items Count</span>
                <p className="text-3xl font-bold">{adjustment.itemsCount}</p>
              </div>

              <div>
                <span className="text-sm text-gray-600">Total Quantity Change</span>
                <p
                  className={`text-3xl font-bold ${
                    adjustment.totalQuantityChange > 0
                      ? 'text-green-600'
                      : adjustment.totalQuantityChange < 0
                      ? 'text-red-600'
                      : 'text-gray-600'
                  }`}
                >
                  {adjustment.totalQuantityChange > 0 ? '+' : ''}
                  {adjustment.totalQuantityChange}
                </p>
              </div>

              <div className="space-y-2">
                <span className="text-sm text-gray-600">Quantity Changes</span>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-green-50 p-3 rounded-lg text-center">
                    <p className="text-sm text-green-600">Increased</p>
                    <p className="text-xl font-bold text-green-600">{adjustment.increasedItems}</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg text-center">
                    <p className="text-sm text-red-600">Decreased</p>
                    <p className="text-xl font-bold text-red-600">{adjustment.decreasedItems}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg text-center">
                    <p className="text-sm text-gray-600">Unchanged</p>
                    <p className="text-xl font-bold text-gray-600">{adjustment.unchangedItems}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function AdjustmentDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="h-96 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );
}

export default async function AdjustmentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <Suspense fallback={<AdjustmentDetailsSkeleton />}>
      <AdjustmentDetails adjustmentId={id} />
    </Suspense>
  );
}
