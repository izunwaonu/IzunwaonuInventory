import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Plus,
  Package,
  Eye,
  Search,
  RefreshCw,
  Download,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { format } from 'date-fns';
import { getAdjustments } from '@/actions/adjustments';

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

async function AdjustmentsList() {
  const adjustments = await getAdjustments();

  const draftCount = adjustments.filter((adj) => adj.status === 'DRAFT').length;
  const approvedCount = adjustments.filter((adj) => adj.status === 'APPROVED').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Stock Adjustments</h1>
          <p className="text-gray-600 mt-1">
            {adjustments.length} adjustments | {draftCount} draft | {approvedCount} approved
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button variant="outline" className="w-full sm:w-auto">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Link href="/dashboard/inventory/adjustments/create" className="w-full sm:w-auto">
            <Button className="w-full bg-red-600 hover:bg-red-700">
              <Plus className="h-4 w-4 mr-2" />
              Add New
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input placeholder="Search..." className="pl-10" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="All Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Adjustments Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Adjustments</CardTitle>
        </CardHeader>
        <CardContent>
          {adjustments.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No adjustments found</h3>
              <p className="text-gray-600 mb-4">
                Get started by creating your first stock adjustment
              </p>
              <Link href="/dashboard/inventory/adjustments/create">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Adjustment
                </Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2 font-medium">Adjustment #</th>
                      <th className="text-left py-3 px-2 font-medium">Date</th>
                      <th className="text-left py-3 px-2 font-medium">Type</th>
                      <th className="text-left py-3 px-2 font-medium">Reason</th>
                      <th className="text-center py-3 px-2 font-medium">Items</th>
                      <th className="text-center py-3 px-2 font-medium">Status</th>
                      <th className="text-center py-3 px-2 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adjustments.map((adjustment) => (
                      <tr key={adjustment.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-2">
                          <Link
                            href={`/dashboard/adjustments/${adjustment.id}`}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            {adjustment.adjustmentNumber}
                          </Link>
                        </td>
                        <td className="py-3 px-2 text-gray-600">
                          {format(new Date(adjustment.date), 'MMM dd, yyyy')}
                        </td>
                        <td className="py-3 px-2">
                          <Badge
                            className={
                              typeColors[adjustment.adjustmentType as keyof typeof typeColors]
                            }
                          >
                            {typeLabels[adjustment.adjustmentType as keyof typeof typeLabels]}
                          </Badge>
                        </td>
                        <td className="py-3 px-2 text-gray-600 max-w-xs truncate">
                          {adjustment.reason}
                        </td>
                        <td className="py-3 px-2 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <span className="font-medium">{adjustment.itemsCount} items</span>
                            {adjustment.totalQuantityChange > 0 ? (
                              <div className="flex items-center text-green-600">
                                <TrendingUp className="h-4 w-4" />
                                <span className="text-sm">+{adjustment.totalQuantityChange}</span>
                              </div>
                            ) : adjustment.totalQuantityChange < 0 ? (
                              <div className="flex items-center text-red-600">
                                <TrendingDown className="h-4 w-4" />
                                <span className="text-sm">{adjustment.totalQuantityChange}</span>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500">0</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <Badge
                            className={statusColors[adjustment.status as keyof typeof statusColors]}
                          >
                            {statusLabels[adjustment.status as keyof typeof statusLabels]}
                          </Badge>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <Link href={`/dashboard/adjustments/${adjustment.id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {adjustments.map((adjustment) => (
                  <Card key={adjustment.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <Link
                          href={`/dashboard/adjustments/${adjustment.id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {adjustment.adjustmentNumber}
                        </Link>
                        <Badge
                          className={statusColors[adjustment.status as keyof typeof statusColors]}
                        >
                          {statusLabels[adjustment.status as keyof typeof statusLabels]}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Date:</span>
                          <p className="font-medium">
                            {format(new Date(adjustment.date), 'MMM dd, yyyy')}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Type:</span>
                          <Badge
                            className={`${
                              typeColors[adjustment.adjustmentType as keyof typeof typeColors]
                            } mt-1`}
                          >
                            {typeLabels[adjustment.adjustmentType as keyof typeof typeLabels]}
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <span className="text-gray-500 text-sm">Reason:</span>
                        <p className="text-sm truncate">{adjustment.reason}</p>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{adjustment.itemsCount} items</span>
                          {adjustment.totalQuantityChange > 0 ? (
                            <div className="flex items-center text-green-600">
                              <TrendingUp className="h-4 w-4" />
                              <span className="text-sm">+{adjustment.totalQuantityChange}</span>
                            </div>
                          ) : adjustment.totalQuantityChange < 0 ? (
                            <div className="flex items-center text-red-600">
                              <TrendingDown className="h-4 w-4" />
                              <span className="text-sm">{adjustment.totalQuantityChange}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">0</span>
                          )}
                        </div>
                        <Link href={`/dashboard/adjustments/${adjustment.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                <div className="text-sm text-gray-600">
                  Rows per page:
                  <Select defaultValue="5">
                    <SelectTrigger className="w-16 ml-2 inline-flex">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="text-sm text-gray-600">
                  Showing 1-{Math.min(adjustments.length, 5)} of {adjustments.length}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function AdjustmentsListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="h-96 bg-gray-200 rounded animate-pulse"></div>
    </div>
  );
}

export default function AdjustmentsPage() {
  return (
    <Suspense fallback={<AdjustmentsListSkeleton />}>
      <AdjustmentsList />
    </Suspense>
  );
}
