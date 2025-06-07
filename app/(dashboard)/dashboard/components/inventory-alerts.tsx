'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, Package, Clock, Eye } from 'lucide-react';

interface InventoryAlertsProps {
  alerts: {
    lowStock: Array<{
      id: string;
      name: string;
      sku: string;
      currentStock: number;
      minStockLevel: number;
      locations: Array<{ name: string; quantity: number }>;
    }>;
    outOfStock: Array<{
      id: string;
      name: string;
      sku: string;
      minStockLevel: number;
    }>;
    pendingDeliveries: Array<{
      id: string;
      poNumber: string;
      expectedDate?: string;
      itemCount: number;
      supplier?: string;
    }>;
  };
}

export function InventoryAlerts({ alerts }: InventoryAlertsProps) {
  const totalAlerts = alerts.lowStock.length + alerts.outOfStock.length;

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-gray-800">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            Inventory Alerts
          </CardTitle>
          {totalAlerts > 0 && (
            <Badge variant="destructive" className="animate-pulse">
              {totalAlerts}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-80">
          <div className="space-y-3 p-6 pt-0">
            {/* Out of Stock Items */}
            {alerts.outOfStock.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg"
              >
                <Package className="h-4 w-4 text-red-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-red-900 truncate">{item.name}</p>
                  <p className="text-xs text-red-700">SKU: {item.sku}</p>
                  <Badge variant="destructive" className="mt-1 text-xs">
                    Out of Stock
                  </Badge>
                </div>
              </div>
            ))}

            {/* Low Stock Items */}
            {alerts.lowStock.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
              >
                <AlertTriangle className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-yellow-900 truncate">{item.name}</p>
                  <p className="text-xs text-yellow-700">SKU: {item.sku}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant="outline"
                      className="bg-yellow-100 text-yellow-800 border-yellow-300 text-xs"
                    >
                      {item.currentStock} left
                    </Badge>
                    <span className="text-xs text-yellow-700">Min: {item.minStockLevel}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Pending Deliveries */}
            {alerts.pendingDeliveries.map((delivery) => (
              <div
                key={delivery.id}
                className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg"
              >
                <Clock className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-blue-900 truncate">
                    PO {delivery.poNumber}
                  </p>
                  <p className="text-xs text-blue-700">
                    {delivery.itemCount} items from {delivery.supplier}
                  </p>
                  {delivery.expectedDate && (
                    <p className="text-xs text-blue-600 mt-1">
                      Expected: {new Date(delivery.expectedDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {totalAlerts === 0 && alerts.pendingDeliveries.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <AlertTriangle className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No alerts at this time</p>
                <p className="text-xs mt-1">Your inventory is looking good!</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {totalAlerts > 0 && (
          <div className="p-4 border-t bg-gray-50">
            <Button variant="outline" size="sm" className="w-full">
              <Eye className="h-4 w-4 mr-2" />
              View All Alerts
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
