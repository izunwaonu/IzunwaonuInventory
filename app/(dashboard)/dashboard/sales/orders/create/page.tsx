import { getCustomers } from '@/actions/sales-orders/customers';
import { getItems, getLocations } from '@/actions/sales-orders/items';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateSalesOrderForm } from '../components/create-sales-order-form';

export default async function CreateSalesOrderPage() {
  const [customers, items, locations] = await Promise.all([
    getCustomers(),
    getItems(),
    getLocations(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Sales Order</h1>
        <p className="text-muted-foreground">Create a new sales order for your customer</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateSalesOrderForm customers={customers} items={items} locations={locations} />
        </CardContent>
      </Card>
    </div>
  );
}
