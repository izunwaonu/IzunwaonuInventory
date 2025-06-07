'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  BarChart3,
} from 'lucide-react';
import {
  getDashboardStats,
  getRecentActivity,
  getInventoryAlerts,
  getLocationStats,
} from '@/actions/dashboard';
import { StatsCard } from './stats-card';
import { SalesChart } from './sales-chart';
import { RecentActivity } from './recent-activity';
import { InventoryAlerts } from './inventory-alerts';
import { QuickActions } from './quick-actions';
import { TopProducts } from './top-products';
import { LocationOverview } from './location-overview';

export function DashboardOverview() {
  const [stats, setStats] = useState<any>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any>(null);
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [statsData, activityData, alertsData, locationsData] = await Promise.all([
          getDashboardStats(),
          getRecentActivity(),
          getInventoryAlerts(),
          getLocationStats(),
        ]);

        setStats(statsData);
        setActivity(activityData);
        setAlerts(alertsData);
        setLocations(locationsData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-8 bg-gray-200 rounded mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Failed to load dashboard data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p className="text-gray-600 mt-1">
              Welcome back! Here's what's happening with your business today.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
              Live Data
            </Badge>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              View Reports
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatsCard
            title="Today's Revenue"
            value={`₦${stats.revenue.today.toLocaleString()}`}
            change={stats.revenue.change}
            icon={DollarSign}
            trend={stats.revenue.change >= 0 ? 'up' : 'down'}
            gradient="from-emerald-500 to-teal-600"
            description="vs yesterday"
          />
          <StatsCard
            title="Orders Today"
            value={stats.orders.today.toString()}
            change={stats.orders.change}
            icon={ShoppingCart}
            trend={stats.orders.change >= 0 ? 'up' : 'down'}
            gradient="from-blue-500 to-cyan-600"
            description="vs yesterday"
          />
          <StatsCard
            title="Total Customers"
            value={stats.customers.total.toLocaleString()}
            icon={Users}
            gradient="from-purple-500 to-pink-600"
            description="active customers"
          />
          <StatsCard
            title="Inventory Items"
            value={stats.inventory.totalItems.toLocaleString()}
            icon={Package}
            gradient="from-orange-500 to-red-600"
            description="total products"
            alert={
              stats.inventory.lowStockCount > 0
                ? `${stats.inventory.lowStockCount} low stock`
                : undefined
            }
          />
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left Column - Charts and Analytics */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sales Chart */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                      Sales Trend
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">Last 7 days performance</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full" />
                      <span className="text-gray-600">Revenue</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full" />
                      <span className="text-gray-600">Orders</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <SalesChart data={stats.salesTrend} />
              </CardContent>
            </Card>

            {/* Top Products */}
            <TopProducts products={stats.topProducts} />

            {/* Location Overview */}
            <LocationOverview locations={locations} />
          </div>

          {/* Right Column - Activity and Alerts */}
          <div className="space-y-6">
            {/* Inventory Alerts */}
            <InventoryAlerts alerts={alerts} />

            {/* Recent Activity */}
            <RecentActivity activities={activity} />

            {/* Monthly Summary */}
            <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 text-white">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  This Month
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                    <p className="text-white/80 text-sm">Revenue</p>
                    <p className="text-xl font-bold">₦{stats.revenue.thisMonth.toLocaleString()}</p>
                    <div className="flex items-center gap-1 mt-1">
                      {stats.revenue.monthlyChange >= 0 ? (
                        <ArrowUpRight className="h-3 w-3 text-green-300" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 text-red-300" />
                      )}
                      <span className="text-xs text-white/80">
                        {Math.abs(stats.revenue.monthlyChange).toFixed(1)}% vs last month
                      </span>
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                    <p className="text-white/80 text-sm">Orders</p>
                    <p className="text-xl font-bold">{stats.orders.thisMonth.toLocaleString()}</p>
                    <p className="text-xs text-white/80 mt-1">
                      Avg: ₦
                      {stats.orders.thisMonth > 0
                        ? (stats.revenue.thisMonth / stats.orders.thisMonth).toFixed(0)
                        : 0}
                    </p>
                  </div>
                </div>

                <Separator className="bg-white/20" />

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white/80 text-sm">Pending Actions</span>
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                      {stats.pendingActions.purchaseOrders + stats.pendingActions.transfers}
                    </Badge>
                  </div>
                  <div className="text-xs text-white/70">
                    {stats.pendingActions.purchaseOrders} purchase orders,{' '}
                    {stats.pendingActions.transfers} transfers
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
