'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  type SalesReportFilters,
  getSalesReportByCustomers,
} from '@/actions/reports/sales-reports';
import {
  Users,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Mail,
  Phone,
  User,
  TrendingUp,
  DollarSign,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface SalesCustomersViewProps {
  filters: SalesReportFilters;
}

export function SalesCustomersView({ filters }: SalesCustomersViewProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadCustomersData();
  }, [filters, page, limit]);

  useEffect(() => {
    // Reset to page 1 when search changes
    if (page !== 1) {
      setPage(1);
    } else {
      loadCustomersData();
    }
  }, [search]);

  const loadCustomersData = async () => {
    setLoading(true);
    try {
      const customersData = await getSalesReportByCustomers({ ...filters, search }, page, limit);
      setData(customersData);
    } catch (error) {
      console.error('Error loading customers data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => `₦${value.toLocaleString()}`;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit: string) => {
    setLimit(Number.parseInt(newLimit));
    setPage(1);
  };

  if (loading) {
    return <SalesCustomersViewSkeleton />;
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load customers data</p>
      </div>
    );
  }

  const { customers, pagination } = data;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900">{pagination.total}</p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Sales</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900">
                  {formatCurrency(
                    customers.reduce((sum: number, customer: any) => sum + customer.totalSales, 0),
                  )}
                </p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900">
                  {customers.reduce((sum: number, customer: any) => sum + customer.orderCount, 0)}
                </p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Avg. Order Value</p>
                <p className="text-lg sm:text-xl font-bold text-gray-900">
                  {formatCurrency(
                    customers.length > 0
                      ? customers.reduce(
                          (sum: number, customer: any) => sum + customer.totalSales,
                          0,
                        ) /
                          customers.reduce(
                            (sum: number, customer: any) => sum + customer.orderCount,
                            0,
                          )
                      : 0,
                  )}
                </p>
              </div>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center">
                <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customers Table */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-3 p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <CardTitle className="text-sm sm:text-base">Customer Sales Report</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
                <Input
                  placeholder="Search customers..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 h-8 text-xs w-full sm:w-48"
                />
              </div>
              <Select value={limit.toString()} onValueChange={handleLimitChange}>
                <SelectTrigger className="w-20 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Mobile View */}
          <div className="block sm:hidden">
            <div className="space-y-3 p-3">
              {customers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No customers found</p>
                </div>
              ) : (
                customers.map((customer: any) => (
                  <Card key={customer.customerId} className="p-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-sm">{customer.customerName}</h3>
                            {customer.customerEmail && (
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {customer.customerEmail}
                              </p>
                            )}
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {customer.orderCount} orders
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-gray-500">Total Sales</p>
                          <p className="font-bold text-green-600">
                            {formatCurrency(customer.totalSales)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500">Avg. Order</p>
                          <p className="font-medium">
                            {formatCurrency(customer.totalSales / customer.orderCount)}
                          </p>
                        </div>
                      </div>

                      {customer.customerPhone && (
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {customer.customerPhone}
                        </p>
                      )}
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Desktop View */}
          <div className="hidden sm:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Customer</TableHead>
                  <TableHead className="text-xs">Contact</TableHead>
                  <TableHead className="text-xs text-right">Total Sales</TableHead>
                  <TableHead className="text-xs text-right">Orders</TableHead>
                  <TableHead className="text-xs text-right">Avg. Order Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No customers found</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  customers.map((customer: any) => (
                    <TableRow key={customer.customerId}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{customer.customerName}</p>
                            <p className="text-xs text-gray-500">
                              ID: {customer.customerId?.substring(0, 8) || 'Walk-in'}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {customer.customerEmail && (
                            <p className="text-xs flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {customer.customerEmail}
                            </p>
                          )}
                          {customer.customerPhone && (
                            <p className="text-xs flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {customer.customerPhone}
                            </p>
                          )}
                          {!customer.customerEmail && !customer.customerPhone && (
                            <p className="text-xs text-gray-400">No contact info</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <p className="font-bold text-green-600 text-sm">
                          {formatCurrency(customer.totalSales)}
                        </p>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className="text-xs">
                          {customer.orderCount}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <p className="font-medium text-sm">
                          {formatCurrency(customer.totalSales / customer.orderCount)}
                        </p>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-between p-3 sm:p-4 border-t">
              <div className="text-xs text-gray-500">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                {pagination.total} customers
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(1)}
                  disabled={pagination.page === 1}
                  className="h-7 w-7 p-0"
                >
                  <ChevronsLeft className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="h-7 w-7 p-0"
                >
                  <ChevronLeft className="h-3 w-3" />
                </Button>
                <span className="text-xs px-2">
                  {pagination.page} of {pagination.pages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="h-7 w-7 p-0"
                >
                  <ChevronRight className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.pages)}
                  disabled={pagination.page === pagination.pages}
                  className="h-7 w-7 p-0"
                >
                  <ChevronsRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Skeleton component for loading state
function SalesCustomersViewSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-3 w-20 mb-2" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table Skeleton */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-3 p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <Skeleton className="h-5 w-32" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-2 p-3 sm:p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
