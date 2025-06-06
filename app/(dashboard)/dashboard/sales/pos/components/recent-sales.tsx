'use client';

import { useState } from 'react';
import { Clock, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface RecentSalesProps {
  sales: Array<{
    id: string;
    orderNumber: string;
    customerName: string;
    total: number;
    itemCount: number;
    date: string;
    paymentMethod: string;
  }>;
}

export function RecentSales({ sales }: RecentSalesProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Clock className="h-4 w-4 mr-2" />
          Recent Sales
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Recent Sales
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-96">
          <div className="space-y-3">
            {sales.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Receipt className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>No recent sales</p>
              </div>
            ) : (
              sales.map((sale) => (
                <Card key={sale.id} className="p-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{sale.orderNumber}</span>
                      <Badge variant="outline" className="text-xs">
                        {sale.paymentMethod}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{sale.customerName}</span>
                      <span className="font-bold text-green-600">${sale.total.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{sale.itemCount} items</span>
                      <span>{formatDistanceToNow(new Date(sale.date), { addSuffix: true })}</span>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
