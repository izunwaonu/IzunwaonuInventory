import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import type { SalesOrderStatus, PaymentStatus } from '@prisma/client';

interface SalesOrderDetailsProps {
  order: {
    id: string;
    orderNumber: string;
    status: SalesOrderStatus;
    paymentStatus: PaymentStatus;
    date: string;
    subtotal: number;
    taxAmount: number;
    total: number;
    shippingCost: number | null;
    discount: number | null;
    paymentMethod: string | null;
    notes: string | null;
    customer: {
      id: string;
      name: string;
      email: string | null;
      phone: string | null;
      address: string | null;
    } | null;
    createdBy: {
      firstName: string;
      lastName: string;
    };
    location: {
      name: string;
      address: string | null;
    };
    organization: {
      name: string;
      address: string | null;
      country: string | null;
      state: string | null;
    };
    lines: Array<{
      id: string;
      quantity: number;
      unitPrice: number;
      discount: number | null;
      taxRate: number;
      taxAmount: number;
      total: number;
      item: {
        id: string;
        name: string;
        description: string | null;
        sku: string;
        unitOfMeasure: string | null;
      };
    }>;
  };
}

const statusColors = {
  DRAFT: 'bg-gray-100 text-gray-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-yellow-100 text-yellow-800',
  SHIPPED: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELED: 'bg-red-100 text-red-800',
  RETURNED: 'bg-orange-100 text-orange-800',
};

const paymentStatusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PARTIAL: 'bg-orange-100 text-orange-800',
  PAID: 'bg-green-100 text-green-800',
  REFUNDED: 'bg-red-100 text-red-800',
};

export function SalesOrderDetails({ order }: SalesOrderDetailsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2 space-y-6">
        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Tax</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.lines.map((line) => (
                    <TableRow key={line.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{line.item.name}</div>
                          {line.item.description && (
                            <div className="text-sm text-muted-foreground">
                              {line.item.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{line.item.sku}</TableCell>
                      <TableCell>
                        {line.quantity} {line.item.unitOfMeasure || 'pcs'}
                      </TableCell>
                      <TableCell>{formatCurrency(line.unitPrice)}</TableCell>
                      <TableCell>
                        {line.discount && line.discount > 0 ? `${line.discount}%` : '-'}
                      </TableCell>
                      <TableCell>{line.taxRate > 0 ? `${line.taxRate}%` : '-'}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(line.total)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                {order.discount && order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-{formatCurrency(order.discount)}</span>
                  </div>
                )}
                {order.taxAmount > 0 && (
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>{formatCurrency(order.taxAmount)}</span>
                  </div>
                )}
                {order.shippingCost && order.shippingCost > 0 && (
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>{formatCurrency(order.shippingCost)}</span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total:</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        {order.notes && (
          <Card>
            <CardHeader>
              <CardTitle>Order Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{order.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-6">
        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Status:</span>
              <Badge className={statusColors[order.status]}>{order.status.toLowerCase()}</Badge>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Payment:</span>
              <Badge className={paymentStatusColors[order.paymentStatus]}>
                {order.paymentStatus.toLowerCase()}
              </Badge>
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order Date:</span>
                <span>{format(new Date(order.date), 'MMM dd, yyyy')}</span>
              </div>

              {order.paymentMethod && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method:</span>
                  <span className="capitalize">{order.paymentMethod.replace('_', ' ')}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-muted-foreground">Location:</span>
                <span>{order.location.name}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Created by:</span>
                <span>
                  {order.createdBy.firstName} {order.createdBy.lastName}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Information */}
        {order.customer && (
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <div className="font-medium">{order.customer.name}</div>
                {order.customer.email && (
                  <div className="text-muted-foreground">{order.customer.email}</div>
                )}
                {order.customer.phone && (
                  <div className="text-muted-foreground">{order.customer.phone}</div>
                )}
              </div>

              {order.customer.address && (
                <div className="pt-2">
                  <div className="text-muted-foreground text-xs">Address:</div>
                  <div>{order.customer.address}</div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Location Information */}
        <Card>
          <CardHeader>
            <CardTitle>Location Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="font-medium">{order.location.name}</div>
            {order.location.address && (
              <div className="text-muted-foreground">{order.location.address}</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
