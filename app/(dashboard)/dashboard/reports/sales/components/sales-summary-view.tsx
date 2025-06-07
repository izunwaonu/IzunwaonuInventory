'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { type SalesReportFilters, getSalesReportSummary } from '@/actions/reports/sales-reports';
import { DollarSign, ShoppingCart, Package, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface SalesSummaryViewProps {
  filters: SalesReportFilters;
}

export function SalesSummaryView({ filters }: SalesSummaryViewProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSummaryData();
  }, [filters]);

  const loadSummaryData = async () => {
    setLoading(true);
    try {
      const summaryData = await getSalesReportSummary(filters);
      setData(summaryData);
    } catch (error) {
      console.error('Error loading sales summary data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Colors for charts
  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b', '#ef4444'];

  // Format currency
  const formatCurrency = (value: number) => `₦${value.toLocaleString()}`;

  if (loading) {
    return <SalesSummaryViewSkeleton />;
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load sales summary data</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <MetricCard
          title="Total Sales"
          value={formatCurrency(data.summary.totalSales)}
          icon={DollarSign}
          color="from-blue-500 to-blue-600"
        />
        <MetricCard
          title="Orders"
          value={data.summary.orderCount.toString()}
          icon={ShoppingCart}
          color="from-purple-500 to-purple-600"
        />
        <MetricCard
          title="Items Sold"
          value={data.summary.itemCount.toString()}
          icon={Package}
          color="from-green-500 to-green-600"
        />
        <MetricCard
          title="Avg. Order Value"
          value={formatCurrency(data.summary.averageOrderValue)}
          icon={TrendingUp}
          color="from-pink-500 to-pink-600"
        />
      </div>

      {/* Sales Trend Chart */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-3 p-3 sm:p-4">
          <CardTitle className="text-sm sm:text-base">Sales Trend</CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-4 pt-0">
          <div className="h-48 sm:h-64 lg:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.salesByDay} margin={{ top: 5, right: 10, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={formatCurrency}
                  width={40}
                />
                <Tooltip
                  formatter={(value: any) => formatCurrency(value)}
                  contentStyle={{
                    fontSize: '12px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    border: 'none',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line
                  type="monotone"
                  dataKey="total"
                  name="Sales"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="Orders"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Payment Method Distribution */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3 p-3 sm:p-4">
            <CardTitle className="text-sm sm:text-base">Sales by Payment Method</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="h-48 sm:h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.salesByPaymentMethod}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="total"
                    nameKey="method"
                    label={({ method, percent }) => `${method}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {data.salesByPaymentMethod.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => formatCurrency(value)}
                    contentStyle={{
                      fontSize: '12px',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      border: 'none',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Sales by Source */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3 p-3 sm:p-4">
            <CardTitle className="text-sm sm:text-base">Sales by Source</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="h-48 sm:h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.salesBySource}
                  margin={{ top: 5, right: 10, left: 5, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="source" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={formatCurrency}
                    width={40}
                  />
                  <Tooltip
                    formatter={(value: any) => formatCurrency(value)}
                    contentStyle={{
                      fontSize: '12px',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      border: 'none',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="total" name="Sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="count" name="Orders" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Sales by Status */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3 p-3 sm:p-4">
            <CardTitle className="text-sm sm:text-base">Sales by Status</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="h-48 sm:h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.salesByStatus}
                  margin={{ top: 5, right: 10, left: 5, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    type="number"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={formatCurrency}
                  />
                  <YAxis
                    dataKey="status"
                    type="category"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    width={80}
                  />
                  <Tooltip
                    formatter={(value: any) => formatCurrency(value)}
                    contentStyle={{
                      fontSize: '12px',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      border: 'none',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="total" name="Sales" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Sales by Location */}
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-3 p-3 sm:p-4">
            <CardTitle className="text-sm sm:text-base">Sales by Location</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="h-48 sm:h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.salesByLocation}
                  margin={{ top: 5, right: 10, left: 5, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    type="number"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={formatCurrency}
                  />
                  <YAxis
                    dataKey="locationName"
                    type="category"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    width={80}
                  />
                  <Tooltip
                    formatter={(value: any) => formatCurrency(value)}
                    contentStyle={{
                      fontSize: '12px',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      border: 'none',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="total" name="Sales" fill="#10b981" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="count" name="Orders" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Metric Card Component
interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
}

function MetricCard({ title, value, icon: Icon, color }: MetricCardProps) {
  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
      {/* Background Icon */}
      <div className="absolute top-2 right-2 opacity-5">
        <Icon className="h-12 w-12 sm:h-16 sm:w-16" />
      </div>

      <CardContent className="p-3 sm:p-4 relative z-10">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 truncate">{title}</p>
            <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2 break-all">
              {value}
            </p>
          </div>

          <div
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0 ml-2 ${color}`}
          >
            <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Skeleton component for loading state
function SalesSummaryViewSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Key Metrics Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Skeleton className="h-3 w-20 mb-2" />
                  <Skeleton className="h-6 w-16 mb-2" />
                </div>
                <Skeleton className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Skeleton */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-3 p-3 sm:p-4">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="p-3 sm:p-4 pt-0">
          <Skeleton className="h-48 sm:h-64 lg:h-72 w-full" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-3 p-3 sm:p-4">
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0">
              <Skeleton className="h-48 sm:h-64 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
