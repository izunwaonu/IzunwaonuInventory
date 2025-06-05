'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { getCustomerOrderHistory } from '@/actions/customers-orders';

const statusColors = {
  DRAFT: 'bg-gray-100 text-gray-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-yellow-100 text-yellow-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  COMPLETED: 'bg-emerald-100 text-emerald-800',
  CANCELED: 'bg-red-100 text-red-800',
  RETURNED: 'bg-orange-100 text-orange-800',
};

const paymentStatusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PARTIAL: 'bg-orange-100 text-orange-800',
  PAID: 'bg-green-100 text-green-800',
  REFUNDED: 'bg-red-100 text-red-800',
};

interface CustomerOrderHistoryProps {
  customerId: string;
}

export function CustomerOrderHistory({ customerId }: CustomerOrderHistoryProps) {
  const [orders, setOrders] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>({
    currentPage: 1,
    totalPages: 0,
    totalCount: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [loading, setLoading] = useState(true);

  const loadOrders = async (page = 1) => {
    setLoading(true);
    try {
      const result = await getCustomerOrderHistory(customerId, page, 10);
      setOrders(result.orders);
      setPagination(result.pagination);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [customerId]);

  const handlePageChange = (page: number) => {
    loadOrders(page);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Order History</span>
          <span className="text-sm font-normal text-gray-500">
            {pagination.totalCount} total orders
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600 mb-4">This customer hasn't placed any orders yet</p>
            <Link href={`/dashboard/sales/orders/create?customerId=${customerId}`}>
              <Button>
                <Package className="h-4 w-4 mr-2" />
                Create First Order
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
                    <th className="text-left py-3 px-2 font-medium">Order #</th>
                    <th className="text-left py-3 px-2 font-medium">Date</th>
                    <th className="text-center py-3 px-2 font-medium">Items</th>
                    <th className="text-right py-3 px-2 font-medium">Total</th>
                    <th className="text-center py-3 px-2 font-medium">Status</th>
                    <th className="text-center py-3 px-2 font-medium">Payment</th>
                    <th className="text-center py-3 px-2 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-2">
                        <Link
                          href={`/dashboard/sales/orders/${order.id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className="py-3 px-2 text-gray-600">
                        {format(new Date(order.date), 'MMM dd, yyyy')}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span className="font-medium">
                          {order.lines.length} item{order.lines.length !== 1 ? 's' : ''}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right font-medium">
                        ${order.total.toLocaleString()}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                          {order.status.replace('_', ' ')}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <Badge
                          className={
                            paymentStatusColors[
                              order.paymentStatus as keyof typeof paymentStatusColors
                            ]
                          }
                        >
                          {order.paymentStatus}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <Link href={`/dashboard/sales/orders/${order.id}`}>
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
              {orders.map((order) => (
                <Card key={order.id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <Link
                        href={`/dashboard/sales/orders/${order.id}`}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {order.orderNumber}
                      </Link>
                      <div className="flex flex-col gap-1">
                        <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                          {order.status.replace('_', ' ')}
                        </Badge>
                        <Badge
                          className={
                            paymentStatusColors[
                              order.paymentStatus as keyof typeof paymentStatusColors
                            ]
                          }
                        >
                          {order.paymentStatus}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-500">Date:</span>
                        <p className="font-medium">
                          {format(new Date(order.date), 'MMM dd, yyyy')}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">Items:</span>
                        <p className="font-medium">
                          {order.lines.length} item{order.lines.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-gray-500 text-sm">Total:</span>
                        <p className="text-lg font-bold">${order.total.toLocaleString()}</p>
                      </div>
                      <Link href={`/dashboard/sales/orders/${order.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>
                    </div>

                    {/* Order Items Preview */}
                    <div className="pt-2 border-t">
                      <p className="text-sm text-gray-600 mb-2">Items:</p>
                      <div className="space-y-1">
                        {order.lines.slice(0, 3).map((line: any) => (
                          <div key={line.id} className="flex items-center gap-2 text-sm">
                            <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center">
                              {line.item.thumbnail ? (
                                <img
                                  src={line.item.thumbnail || '/placeholder.svg'}
                                  alt={line.item.name}
                                  className="w-4 h-4 object-cover rounded"
                                />
                              ) : (
                                <Package className="h-3 w-3 text-gray-400" />
                              )}
                            </div>
                            <span className="flex-1 truncate">{line.item.name}</span>
                            <span className="text-gray-500">×{line.quantity}</span>
                          </div>
                        ))}
                        {order.lines.length > 3 && (
                          <p className="text-xs text-gray-500">
                            +{order.lines.length - 3} more items
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                <div className="text-sm text-gray-600">
                  Showing {(pagination.currentPage - 1) * 10 + 1}-
                  {Math.min(pagination.currentPage * 10, pagination.totalCount)} of{' '}
                  {pagination.totalCount} orders
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={!pagination.hasPreviousPage}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
