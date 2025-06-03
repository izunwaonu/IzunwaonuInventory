import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { ArrowLeft, Package, MapPin, User, Calendar, FileText } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { getTransferById } from '@/actions/transfers';
import { TransferStatusTimeline } from '../components/transfer-status-timeline';
import { TransferActions } from '../components/transfer-actions';

const statusColors = {
  DRAFT: 'bg-gray-100 text-gray-800',
  APPROVED: 'bg-blue-100 text-blue-800',
  IN_TRANSIT: 'bg-yellow-100 text-yellow-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELED: 'bg-red-100 text-red-800',
};

const statusLabels = {
  DRAFT: 'Draft',
  APPROVED: 'Approved',
  IN_TRANSIT: 'In Transit',
  COMPLETED: 'Completed',
  CANCELED: 'Cancelled',
};

async function TransferDetails({ transferId }: { transferId: string }) {
  const transfer = await getTransferById(transferId);

  if (!transfer) {
    notFound();
  }

  const canApprove = transfer.status === 'DRAFT';
  const canComplete = transfer.status === 'APPROVED' || transfer.status === 'IN_TRANSIT';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/inventory/transfers">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{transfer.transferNumber}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={statusColors[transfer.status as keyof typeof statusColors]}>
                {statusLabels[transfer.status as keyof typeof statusLabels]}
              </Badge>
              <span className="text-sm text-gray-500">
                {format(new Date(transfer.date), 'MMM dd, yyyy')}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <TransferActions
          transferId={transferId}
          currentStatus={transfer.status}
          canApprove={canApprove}
          canComplete={canComplete}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Location Cards and Status */}
        <div className="lg:col-span-2 space-y-6">
          {/* Location Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* From Location */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  From Location
                </CardTitle>
                <p className="text-sm text-gray-600">Source of items</p>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold text-lg">{transfer.fromLocation.name}</h3>
                {transfer.fromLocation.address && (
                  <p className="text-sm text-gray-600 mt-1">{transfer.fromLocation.address}</p>
                )}
              </CardContent>
            </Card>

            {/* To Location */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  To Location
                </CardTitle>
                <p className="text-sm text-gray-600">Destination for items</p>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold text-lg">{transfer.toLocation.name}</h3>
                {transfer.toLocation.address && (
                  <p className="text-sm text-gray-600 mt-1">{transfer.toLocation.address}</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Transfer Status Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Transfer Status</CardTitle>
            </CardHeader>
            <CardContent>
              <TransferStatusTimeline currentStatus={transfer.status} />
            </CardContent>
          </Card>

          {/* Transfer Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Transfer Items</span>
                <TransferActions
                  transferId={transferId}
                  currentStatus={transfer.status}
                  canApprove={canApprove}
                  canComplete={canComplete}
                  size="sm"
                />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transfer.lines.map((line) => (
                  <div key={line.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      {line.item.thumbnail ? (
                        <img
                          src={line.item.thumbnail || '/placeholder.svg'}
                          alt={line.item.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                      ) : (
                        <Package className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{line.item.name}</h4>
                      {line.item.sku && (
                        <p className="text-sm text-gray-500">SKU: {line.item.sku}</p>
                      )}
                      {line.notes && <p className="text-sm text-gray-600 mt-1">{line.notes}</p>}
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">Qty: {line.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Transfer Details */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Transfer Details</CardTitle>
              <p className="text-sm text-gray-600">Information about this transfer</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Date:</span>
                <span className="font-medium">
                  {format(new Date(transfer.date), 'MMM dd, yyyy')}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Total Items:</span>
                <span className="font-medium">{transfer.lines.length}</span>
              </div>

              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Created By:</span>
                <span className="font-medium">
                  {transfer.createdBy
                    ? `${transfer.createdBy.firstName} ${transfer.createdBy.lastName}`
                    : 'System'}
                </span>
              </div>

              {transfer.approvedBy && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Approved By:</span>
                  <span className="font-medium">
                    {`${transfer.approvedBy.firstName} ${transfer.approvedBy.lastName}`}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Created:</span>
                <span className="font-medium">
                  {format(new Date(transfer.createdAt), 'MMM dd, yyyy')}
                </span>
              </div>

              {transfer.notes && (
                <div className="pt-4 border-t">
                  <div className="flex items-start gap-2">
                    <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div>
                      <span className="text-sm text-gray-600 block">Notes:</span>
                      <p className="text-sm mt-1">{transfer.notes}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function TransferDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-48 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="h-96 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );
}

export default async function TransferDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <Suspense fallback={<TransferDetailsSkeleton />}>
      <TransferDetails transferId={id} />
    </Suspense>
  );
}
