// 'use client';

// import { useState } from 'react';
// import { Button } from '@/components/ui/button';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import { MoreHorizontal, Download, Mail, Edit, Trash2 } from 'lucide-react';
// import { toast } from 'sonner';
// import type { SalesOrderStatus, PaymentStatus } from '@prisma/client';
// import { updatePaymentStatus, updateSalesOrderStatus } from '@/actions/sales-orders/sales-orders';

// interface SalesOrderActionsProps {
//   order: {
//     id: string;
//     orderNumber: string;
//     status: SalesOrderStatus;
//     paymentStatus: PaymentStatus;
//   };
// }

// export function SalesOrderActions({ order }: SalesOrderActionsProps) {
//   const [isUpdating, setIsUpdating] = useState(false);

//   const handleStatusUpdate = async (status: SalesOrderStatus) => {
//     setIsUpdating(true);
//     try {
//       const result = await updateSalesOrderStatus(order.id, status);
//       if (result.success) {
//         toast.success(`Order status updated to ${status.toLowerCase()}`);
//       } else {
//         toast.error(result.error || 'Failed to update order status');
//       }
//     } catch (error) {
//       toast.error('An error occurred while updating the order status');
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   const handlePaymentStatusUpdate = async (paymentStatus: PaymentStatus) => {
//     setIsUpdating(true);
//     try {
//       const result = await updatePaymentStatus(order.id, paymentStatus);
//       if (result.success) {
//         toast.success(`Payment status updated to ${paymentStatus.toLowerCase()}`);
//       } else {
//         toast.error(result.error || 'Failed to update payment status');
//       }
//     } catch (error) {
//       toast.error('An error occurred while updating the payment status');
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   const getAvailableStatusActions = () => {
//     const actions = [];

//     switch (order.status) {
//       case 'DRAFT':
//         actions.push({ label: 'Confirm Order', value: 'CONFIRMED' as SalesOrderStatus });
//         break;
//       case 'CONFIRMED':
//         actions.push({ label: 'Start Processing', value: 'PROCESSING' as SalesOrderStatus });
//         break;
//       case 'PROCESSING':
//         actions.push({ label: 'Mark as Shipped', value: 'SHIPPED' as SalesOrderStatus });
//         break;
//       case 'SHIPPED':
//         actions.push({ label: 'Mark as Delivered', value: 'DELIVERED' as SalesOrderStatus });
//         break;
//       case 'DELIVERED':
//         actions.push({ label: 'Complete Order', value: 'COMPLETED' as SalesOrderStatus });
//         break;
//     }

//     if (order.status !== 'CANCELED' && order.status !== 'COMPLETED') {
//       actions.push({ label: 'Cancel Order', value: 'CANCELED' as SalesOrderStatus });
//     }

//     return actions;
//   };

//   const getAvailablePaymentActions = () => {
//     const actions = [];

//     switch (order.paymentStatus) {
//       case 'PENDING':
//         actions.push({ label: 'Mark as Partial', value: 'PARTIAL' as PaymentStatus });
//         actions.push({ label: 'Mark as Paid', value: 'PAID' as PaymentStatus });
//         break;
//       case 'PARTIAL':
//         actions.push({ label: 'Mark as Paid', value: 'PAID' as PaymentStatus });
//         break;
//       case 'PAID':
//         actions.push({ label: 'Mark as Refunded', value: 'REFUNDED' as PaymentStatus });
//         break;
//     }

//     return actions;
//   };

//   const statusActions = getAvailableStatusActions();
//   const paymentActions = getAvailablePaymentActions();

//   return (
//     <div className="flex items-center gap-2">
//       {/* Quick Status Actions */}
//       {statusActions.length > 0 && (
//         <div className="flex gap-2">
//           {statusActions.slice(0, 2).map((action) => (
//             <Button
//               key={action.value}
//               onClick={() => handleStatusUpdate(action.value)}
//               disabled={isUpdating}
//               size="sm"
//               variant={action.value === 'CANCELED' ? 'destructive' : 'default'}
//             >
//               {action.label}
//             </Button>
//           ))}
//         </div>
//       )}

//       {/* More Actions Dropdown */}
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button variant="outline" size="sm">
//             <MoreHorizontal className="h-4 w-4" />
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent align="end" className="w-48">
//           <DropdownMenuLabel>Order Actions</DropdownMenuLabel>
//           <DropdownMenuSeparator />

//           <DropdownMenuItem>
//             <Download className="mr-2 h-4 w-4" />
//             Download PDF
//           </DropdownMenuItem>

//           <DropdownMenuItem>
//             <Mail className="mr-2 h-4 w-4" />
//             Send Email
//           </DropdownMenuItem>

//           <DropdownMenuItem>
//             <Edit className="mr-2 h-4 w-4" />
//             Edit Order
//           </DropdownMenuItem>

//           {statusActions.length > 2 && (
//             <>
//               <DropdownMenuSeparator />
//               <DropdownMenuLabel>Status Actions</DropdownMenuLabel>
//               {statusActions.slice(2).map((action) => (
//                 <DropdownMenuItem
//                   key={action.value}
//                   onClick={() => handleStatusUpdate(action.value)}
//                   disabled={isUpdating}
//                 >
//                   {action.label}
//                 </DropdownMenuItem>
//               ))}
//             </>
//           )}

//           {paymentActions.length > 0 && (
//             <>
//               <DropdownMenuSeparator />
//               <DropdownMenuLabel>Payment Actions</DropdownMenuLabel>
//               {paymentActions.map((action) => (
//                 <DropdownMenuItem
//                   key={action.value}
//                   onClick={() => handlePaymentStatusUpdate(action.value)}
//                   disabled={isUpdating}
//                 >
//                   {action.label}
//                 </DropdownMenuItem>
//               ))}
//             </>
//           )}

//           <DropdownMenuSeparator />
//           <DropdownMenuItem className="text-red-600">
//             <Trash2 className="mr-2 h-4 w-4" />
//             Delete Order
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </div>
//   );
// }

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Download, Mail, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { SalesOrderStatus, PaymentStatus } from '@prisma/client';
import { updatePaymentStatus, updateSalesOrderStatus } from '@/actions/sales-orders/sales-orders';
import { SalesOrderConfirmationModal } from './sales-order-confirmation-modal';

interface SalesOrderActionsProps {
  order: {
    id: string;
    orderNumber: string;
    status: SalesOrderStatus;
    paymentStatus: PaymentStatus;
    total: number;
    lines: Array<{
      item: { name: string; sku: string };
      quantity: number;
    }>;
  };
}

export function SalesOrderActions({ order }: SalesOrderActionsProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    action: {
      type: 'status' | 'payment';
      currentValue: SalesOrderStatus | PaymentStatus;
      newValue: SalesOrderStatus | PaymentStatus;
      label: string;
    } | null;
  }>({
    isOpen: false,
    action: null,
  });

  const handleStatusUpdate = async (status: SalesOrderStatus) => {
    const actionLabel = getStatusActionLabel(status);

    setConfirmationModal({
      isOpen: true,
      action: {
        type: 'status',
        currentValue: order.status,
        newValue: status,
        label: actionLabel,
      },
    });
  };

  const handlePaymentStatusUpdate = async (paymentStatus: PaymentStatus) => {
    const actionLabel = getPaymentActionLabel(paymentStatus);

    setConfirmationModal({
      isOpen: true,
      action: {
        type: 'payment',
        currentValue: order.paymentStatus,
        newValue: paymentStatus,
        label: actionLabel,
      },
    });
  };

  const confirmAction = async () => {
    if (!confirmationModal.action) return;

    setIsUpdating(true);
    try {
      let result;

      if (confirmationModal.action.type === 'status') {
        result = await updateSalesOrderStatus(
          order.id,
          confirmationModal.action.newValue as SalesOrderStatus,
        );
      } else {
        result = await updatePaymentStatus(
          order.id,
          confirmationModal.action.newValue as PaymentStatus,
        );
      }

      if (result.success) {
        toast.success(`${confirmationModal.action.label} completed successfully`);
        setConfirmationModal({ isOpen: false, action: null });
      } else {
        toast.error(result.error || `Failed to ${confirmationModal.action.label.toLowerCase()}`);
      }
    } catch (error) {
      toast.error('An error occurred while updating the order');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusActionLabel = (status: SalesOrderStatus): string => {
    const labels: Record<SalesOrderStatus, string> = {
      DRAFT: 'Save as Draft',
      CONFIRMED: 'Confirm Order',
      PROCESSING: 'Start Processing',
      SHIPPED: 'Mark as Shipped',
      DELIVERED: 'Mark as Delivered',
      COMPLETED: 'Complete Order',
      CANCELED: 'Cancel Order',
      RETURNED: 'Mark as Returned',
    };
    return labels[status];
  };

  const getPaymentActionLabel = (status: PaymentStatus): string => {
    const labels: Record<PaymentStatus, string> = {
      PENDING: 'Mark as Pending',
      PARTIAL: 'Mark as Partial',
      PAID: 'Mark as Paid',
      REFUNDED: 'Mark as Refunded',
    };
    return labels[status];
  };

  const getAvailableStatusActions = () => {
    const actions = [];

    switch (order.status) {
      case 'DRAFT':
        actions.push({ label: 'Confirm Order', value: 'CONFIRMED' as SalesOrderStatus });
        break;
      case 'CONFIRMED':
        actions.push({ label: 'Start Processing', value: 'PROCESSING' as SalesOrderStatus });
        break;
      case 'PROCESSING':
        actions.push({ label: 'Mark as Shipped', value: 'SHIPPED' as SalesOrderStatus });
        break;
      case 'SHIPPED':
        actions.push({ label: 'Mark as Delivered', value: 'DELIVERED' as SalesOrderStatus });
        break;
      case 'DELIVERED':
        actions.push({ label: 'Complete Order', value: 'COMPLETED' as SalesOrderStatus });
        break;
    }

    if (order.status !== 'CANCELED' && order.status !== 'COMPLETED') {
      actions.push({ label: 'Cancel Order', value: 'CANCELED' as SalesOrderStatus });
    }

    return actions;
  };

  const getAvailablePaymentActions = () => {
    const actions = [];

    switch (order.paymentStatus) {
      case 'PENDING':
        actions.push({ label: 'Mark as Partial', value: 'PARTIAL' as PaymentStatus });
        actions.push({ label: 'Mark as Paid', value: 'PAID' as PaymentStatus });
        break;
      case 'PARTIAL':
        actions.push({ label: 'Mark as Paid', value: 'PAID' as PaymentStatus });
        break;
      case 'PAID':
        actions.push({ label: 'Mark as Refunded', value: 'REFUNDED' as PaymentStatus });
        break;
    }

    return actions;
  };

  const statusActions = getAvailableStatusActions();
  const paymentActions = getAvailablePaymentActions();

  return (
    <>
      <div className="flex items-center gap-2">
        {/* Quick Status Actions */}
        {statusActions.length > 0 && (
          <div className="flex gap-2">
            {statusActions.slice(0, 2).map((action) => (
              <Button
                key={action.value}
                onClick={() => handleStatusUpdate(action.value)}
                disabled={isUpdating}
                size="sm"
                variant={action.value === 'CANCELED' ? 'destructive' : 'default'}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}

        {/* More Actions Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Order Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Mail className="mr-2 h-4 w-4" />
              Send Email
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit Order
            </DropdownMenuItem>

            {statusActions.length > 2 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Status Actions</DropdownMenuLabel>
                {statusActions.slice(2).map((action) => (
                  <DropdownMenuItem
                    key={action.value}
                    onClick={() => handleStatusUpdate(action.value)}
                    disabled={isUpdating}
                  >
                    {action.label}
                  </DropdownMenuItem>
                ))}
              </>
            )}

            {paymentActions.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Payment Actions</DropdownMenuLabel>
                {paymentActions.map((action) => (
                  <DropdownMenuItem
                    key={action.value}
                    onClick={() => handlePaymentStatusUpdate(action.value)}
                    disabled={isUpdating}
                  >
                    {action.label}
                  </DropdownMenuItem>
                ))}
              </>
            )}

            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Order
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Confirmation Modal */}
      {confirmationModal.action && (
        <SalesOrderConfirmationModal
          isOpen={confirmationModal.isOpen}
          onClose={() => setConfirmationModal({ isOpen: false, action: null })}
          onConfirm={confirmAction}
          action={confirmationModal.action}
          order={order}
          isLoading={isUpdating}
        />
      )}
    </>
  );
}
