import { getSalesOrderById } from '@/actions/sales-orders/sales-orders';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SalesOrderActions } from '../components/sales-order-actions';
import { SalesOrderDetails } from '../components/sales-order-details';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SalesOrderDetailsPage({ params }: PageProps) {
  const { id } = await params;

  const order = await getSalesOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/sales/orders">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Order {order.orderNumber}</h1>
            <p className="text-muted-foreground">View and manage sales order details</p>
          </div>
        </div>
        <SalesOrderActions order={order} />
      </div>

      <SalesOrderDetails order={order} />
    </div>
  );
}
