import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Package, DollarSign } from 'lucide-react';

interface CustomerStatisticsProps {
  customer: any;
}

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

export function CustomerStatistics({ customer }: CustomerStatisticsProps) {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <Package className="h-6 w-6 text-blue-600 mx-auto mb-1" />
              <p className="text-2xl font-bold text-blue-600">{customer.statistics.totalOrders}</p>
              <p className="text-sm text-blue-600">Total Orders</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-1" />
              <p className="text-2xl font-bold text-green-600">
                ${customer.statistics.totalSpent.toLocaleString()}
              </p>
              <p className="text-sm text-green-600">Total Spent</p>
            </div>
          </div>

          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <TrendingUp className="h-6 w-6 text-purple-600 mx-auto mb-1" />
            <p className="text-2xl font-bold text-purple-600">
              ${customer.statistics.averageOrderValue.toLocaleString()}
            </p>
            <p className="text-sm text-purple-600">Average Order Value</p>
          </div>
        </CardContent>
      </Card>

      {/* Order Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Order Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(customer.statistics.ordersByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <Badge className={statusColors[status as keyof typeof statusColors]}>
                  {status.replace('_', ' ')}
                </Badge>
                <span className="font-medium">{count as number}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(customer.statistics.ordersByPaymentStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <Badge className={paymentStatusColors[status as keyof typeof paymentStatusColors]}>
                  {status}
                </Badge>
                <span className="font-medium">{count as number}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {customer.salesOrders.slice(0, 3).map((order: any) => (
              <div key={order.id} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <p className="font-medium text-sm">{order.orderNumber}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-sm">${order.total.toLocaleString()}</p>
                  <Badge
                    className={`text-xs ${statusColors[order.status as keyof typeof statusColors]}`}
                  >
                    {order.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            ))}
            {customer.salesOrders.length === 0 && (
              <p className="text-center text-gray-500 py-4 text-sm">No recent orders</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
