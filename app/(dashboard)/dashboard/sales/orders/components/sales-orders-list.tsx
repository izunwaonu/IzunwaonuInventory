'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Eye, Download, Mail } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import type { SalesOrderStatus, PaymentStatus } from '@prisma/client';
import { format } from 'date-fns';

interface SalesOrdersListProps {
  data: {
    orders: Array<{
      id: string;
      orderNumber: string;
      status: SalesOrderStatus;
      paymentStatus: PaymentStatus;
      date: string;
      total: number;
      customer: {
        id: string;
        name: string;
        email: string | null;
      } | null;
      createdBy: {
        firstName: string;
        lastName: string;
      };
      lines: Array<{
        quantity: number;
        item: {
          name: string;
        };
      }>;
    }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
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

export function SalesOrdersList({ data }: SalesOrdersListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams);
    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }
    params.delete('page');
    router.push(`/dashboard/sales/orders?${params.toString()}`);
  };

  const handleStatusFilter = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== 'all') {
      params.set('status', value);
    } else {
      params.delete('status');
    }
    params.delete('page');
    setStatus(value);
    router.push(`/dashboard/sales/orders?${params.toString()}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getTotalItems = (lines: Array<{ quantity: number }>) => {
    return lines.reduce((total, line) => total + line.quantity, 0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Orders</CardTitle>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-1 gap-2">
            <Input
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <Select value={status} onValueChange={handleStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="PROCESSING">Processing</SelectItem>
              <SelectItem value="SHIPPED">Shipped</SelectItem>
              <SelectItem value="DELIVERED">Delivered</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELED">Canceled</SelectItem>
              <SelectItem value="RETURNED">Returned</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.orderNumber}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {order.customer?.name || 'Walk-in Customer'}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {order.customer?.email || '-'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{format(new Date(order.date), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>{getTotalItems(order.lines)} items</TableCell>
                  <TableCell className="font-medium">{formatCurrency(order.total)}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[order.status]}>
                      {order.status.toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={paymentStatusColors[order.paymentStatus]}>
                      {order.paymentStatus.toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/sales/orders/${order.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Mail className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {data.pagination.pages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Showing {(data.pagination.page - 1) * data.pagination.limit + 1} to{' '}
              {Math.min(data.pagination.page * data.pagination.limit, data.pagination.total)} of{' '}
              {data.pagination.total} orders
            </div>
            <div className="flex items-center gap-2">
              {Array.from({ length: data.pagination.pages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === data.pagination.page ? 'default' : 'outline'}
                  size="sm"
                  asChild
                >
                  <Link
                    href={`/dashboard/sales/orders?${new URLSearchParams({
                      ...Object.fromEntries(searchParams.entries()),
                      page: page.toString(),
                    }).toString()}`}
                  >
                    {page}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
