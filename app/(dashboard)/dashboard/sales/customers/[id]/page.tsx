import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Calendar,
  Package,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { getCustomerById } from '@/actions/customers-orders';
import { CustomerEditDialog } from '../components/customer-edit-dialog';
import { CustomerOrderHistory } from '../components/customer-order-history';
import { CustomerStatistics } from '../components/customer-statistics';

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

async function CustomerDetails({ customerId }: { customerId: string }) {
  const customer = await getCustomerById(customerId);

  if (!customer) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/sales/customers">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Customers
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{customer.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                className={
                  customer.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }
              >
                {customer.isActive ? 'Active' : 'Inactive'}
              </Badge>
              <span className="text-sm text-gray-500">
                Customer since {format(new Date(customer.createdAt), 'MMM yyyy')}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <CustomerEditDialog customer={customer} />
          <Link href={`/dashboard/sales/orders/create?customerId=${customer.id}`}>
            <Button className="w-full sm:w-auto">
              <Package className="h-4 w-4 mr-2" />
              Create Order
            </Button>
          </Link>
        </div>
      </div>

      {/* Customer Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold">{customer.statistics.totalOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold">
                  ${customer.statistics.totalSpent.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Order</p>
                <p className="text-2xl font-bold">
                  ${customer.statistics.averageOrderValue.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Order</p>
                <p className="text-sm font-medium">
                  {customer.salesOrders.length > 0
                    ? format(new Date(customer.salesOrders[0].date), 'MMM dd, yyyy')
                    : 'No orders'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Customer Information */}
        <div className="space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Contact Information</span>
                <CustomerEditDialog customer={customer} />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{customer.name}</p>
                </div>
              </div>

              {customer.email && (
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{customer.email}</p>
                  </div>
                </div>
              )}

              {customer.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{customer.phone}</p>
                  </div>
                </div>
              )}

              {customer.address && (
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-medium">{customer.address}</p>
                  </div>
                </div>
              )}

              {customer.taxId && (
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Tax ID</p>
                    <p className="font-medium">{customer.taxId}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Customer Since</p>
                  <p className="font-medium">
                    {format(new Date(customer.createdAt), 'MMM dd, yyyy')}
                  </p>
                </div>
              </div>

              {customer.notes && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600">Notes</p>
                  <p className="text-sm mt-1">{customer.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Customer Statistics */}
          <CustomerStatistics customer={customer} />
        </div>

        {/* Right Column - Orders and History */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="orders" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="orders">Order History</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="space-y-4">
              <CustomerOrderHistory customerId={customer.id} />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              {/* Order Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Order Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(customer.statistics.ordersByStatus).map(([status, count]) => (
                      <div key={status} className="text-center">
                        <Badge className={statusColors[status as keyof typeof statusColors]}>
                          {status.replace('_', ' ')}
                        </Badge>
                        <p className="text-2xl font-bold mt-2">{count}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Status Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(customer.statistics.ordersByPaymentStatus).map(
                      ([status, count]) => (
                        <div key={status} className="text-center">
                          <Badge
                            className={
                              paymentStatusColors[status as keyof typeof paymentStatusColors]
                            }
                          >
                            {status}
                          </Badge>
                          <p className="text-2xl font-bold mt-2">{count}</p>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Top Purchased Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Purchased Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {customer.statistics.topItems.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div>
                          <p className="font-medium">{item.itemName}</p>
                          <p className="text-sm text-gray-500">
                            {item.totalQuantity} units • {item.orderCount} orders
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${item.totalSpent.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                    {customer.statistics.topItems.length === 0 && (
                      <p className="text-center text-gray-500 py-4">
                        No purchase history available
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function CustomerDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-48 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="lg:col-span-2 h-96 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );
}

export default async function CustomerDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <Suspense fallback={<CustomerDetailsSkeleton />}>
      <CustomerDetails customerId={id} />
    </Suspense>
  );
}
