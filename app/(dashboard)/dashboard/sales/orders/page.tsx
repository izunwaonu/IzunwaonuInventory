import { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getSalesOrders, getSalesOrderStats } from '@/actions/sales-orders/sales-orders';
import { SalesOrdersList } from './components/sales-orders-list';
import { SalesOrdersStats } from './components/sales-orders-stats';

interface PageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
  }>;
}

export default async function SalesOrdersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number.parseInt(params.page || '1');
  const search = params.search || '';
  const status = params.status || '';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Orders</h1>
          <p className="text-muted-foreground">
            Manage your sales orders and track customer purchases
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/sales/orders/create">
            <Plus className="mr-2 h-4 w-4" />
            Create Order
          </Link>
        </Button>
      </div>

      <Suspense fallback={<StatsLoading />}>
        <SalesOrdersStatsWrapper />
      </Suspense>

      <Suspense fallback={<OrdersLoading />}>
        <SalesOrdersListWrapper page={page} search={search} status={status} />
      </Suspense>
    </div>
  );
}

async function SalesOrdersStatsWrapper() {
  const stats = await getSalesOrderStats();
  return <SalesOrdersStats stats={stats} />;
}

async function SalesOrdersListWrapper({
  page,
  search,
  status,
}: {
  page: number;
  search: string;
  status: string;
}) {
  const data = await getSalesOrders(page, 10, search, status);
  return <SalesOrdersList data={data} />;
}

function StatsLoading() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-3 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function OrdersLoading() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-8 w-20" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
