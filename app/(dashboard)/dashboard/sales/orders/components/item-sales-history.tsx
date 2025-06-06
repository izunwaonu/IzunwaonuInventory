'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { formatDistanceToNow } from 'date-fns';
import { TrendingUp, TrendingDown, Package, AlertCircle } from 'lucide-react';
import { getInventoryMovements, getItemDetails } from '@/actions/sales-orders/get-item-details';

interface ItemSalesHistoryProps {
  itemId: string;
}

export function ItemSalesHistory({ itemId }: ItemSalesHistoryProps) {
  const [itemDetails, setItemDetails] = useState<any>(null);
  const [movements, setMovements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [detailsResult, movementsResult] = await Promise.all([
          getItemDetails(itemId),
          getInventoryMovements(itemId),
        ]);

        if (detailsResult.success && detailsResult.data) {
          setItemDetails(detailsResult.data);
        }

        if (movementsResult.success && movementsResult.data) {
          setMovements(movementsResult.data);
        } else {
          setMovements([]); // Set empty array if no data
        }
      } catch (error) {
        console.error('Error fetching item data:', error);
        setMovements([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [itemId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!itemDetails) {
    return <div>Item not found</div>;
  }

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'SALE':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case 'PURCHASE':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'ADJUSTMENT':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getMovementColor = (type: string) => {
    switch (type) {
      case 'SALE':
        return 'text-red-600';
      case 'PURCHASE':
        return 'text-green-600';
      case 'ADJUSTMENT':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Sales Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{itemDetails.salesCount}</div>
              <div className="text-sm text-muted-foreground">Units Sold</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">${itemDetails.salesTotal.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Total Revenue</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{itemDetails.totalInventory}</div>
              <div className="text-sm text-muted-foreground">Current Stock</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Sales */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sales</CardTitle>
        </CardHeader>
        <CardContent>
          {itemDetails.salesHistory.length > 0 ? (
            <div className="space-y-3">
              {itemDetails.salesHistory.slice(0, 10).map((sale: any) => (
                <div
                  key={sale.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <div className="font-medium">{sale.orderNumber}</div>
                    <div className="text-sm text-muted-foreground">{sale.customerName}</div>
                    <div className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(sale.date), { addSuffix: true })}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">Qty: {sale.quantity}</div>
                    <div className="text-sm text-muted-foreground">${sale.total.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">No sales recorded yet</div>
          )}
        </CardContent>
      </Card>

      {/* Inventory Movements */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Movements</CardTitle>
        </CardHeader>
        <CardContent>
          {movements.length > 0 ? (
            <div className="space-y-3">
              {movements.slice(0, 20).map((movement: any) => (
                <div
                  key={movement.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getMovementIcon(movement.type)}
                    <div>
                      <div className="font-medium">{movement.reference}</div>
                      <div className="text-sm text-muted-foreground">{movement.location}</div>
                      {movement.reason && (
                        <div className="text-xs text-muted-foreground">{movement.reason}</div>
                      )}
                      <div className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(movement.date), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">
                      <span className={getMovementColor(movement.type)}>
                        {movement.quantity > 0 ? '+' : ''}
                        {movement.quantity}
                      </span>
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">
                      {movement.type.toLowerCase()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              No inventory movements recorded
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
