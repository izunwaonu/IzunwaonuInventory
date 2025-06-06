'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Package, TrendingUp } from 'lucide-react';
import type { SalesOrderStatus, PaymentStatus } from '@prisma/client';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  action: {
    type: 'status' | 'payment';
    currentValue: SalesOrderStatus | PaymentStatus;
    newValue: SalesOrderStatus | PaymentStatus;
    label: string;
  };
  order: {
    id: string;
    orderNumber: string;
    total: number;
    lines: Array<{
      item: { name: string; sku: string };
      quantity: number;
    }>;
  };
  isLoading: boolean;
}

export function SalesOrderConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  action,
  order,
  isLoading,
}: ConfirmationModalProps) {
  const isConfirmationAction = action.newValue === 'CONFIRMED';
  const isCancellationAction = action.newValue === 'CANCELED';
  const isCompletionAction = action.newValue === 'COMPLETED';

  const getActionIcon = () => {
    if (isCancellationAction) return <AlertTriangle className="h-6 w-6 text-red-500" />;
    if (isConfirmationAction) return <CheckCircle className="h-6 w-6 text-green-500" />;
    return <Package className="h-4 w-4" />;
  };

  const getActionDescription = () => {
    if (isConfirmationAction) {
      return (
        <div className="space-y-3">
          <p>Confirming this order will:</p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Package className="h-4 w-4 text-blue-500" />
              Reduce inventory levels for all items
            </li>
            <li className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Update sales statistics for each item
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-purple-500" />
              Lock the order for processing
            </li>
          </ul>
        </div>
      );
    }

    if (isCancellationAction) {
      return (
        <div className="space-y-3">
          <p className="text-red-600">
            {'Warning: Canceling this order will restore inventory if it was previously confirmed.'}
          </p>
          <p className="text-sm text-muted-foreground">
            This action cannot be undone and will reverse any inventory changes.
          </p>
        </div>
      );
    }

    return (
      <p>
        Are you sure you want to change the {action.type} status from{' '}
        <Badge variant="outline">{action.currentValue.toLowerCase()}</Badge> to{' '}
        <Badge variant="outline">{action.newValue.toLowerCase()}</Badge>?
      </p>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getActionIcon()}
            Confirm {action.label}
          </DialogTitle>
          <DialogDescription>
            Order #{order.orderNumber} - Total: ${order.total.toFixed(2)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {getActionDescription()}

          {isConfirmationAction && (
            <div className="rounded-lg border p-3 space-y-2">
              <h4 className="font-medium text-sm">Items that will be deducted from inventory:</h4>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {order.lines.map((line, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>
                      {line.item.name} ({line.item.sku})
                    </span>
                    <span className="text-muted-foreground">-{line.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isCompletionAction && (
            <div className="rounded-lg border p-3 space-y-2">
              <h4 className="font-medium text-sm">Items in this order:</h4>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {order.lines.map((line, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>
                      {line.item.name} ({line.item.sku})
                    </span>
                    <span className="text-muted-foreground">Qty: {line.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            variant={isCancellationAction ? 'destructive' : 'default'}
          >
            {isLoading ? 'Processing...' : `Confirm ${action.label}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
