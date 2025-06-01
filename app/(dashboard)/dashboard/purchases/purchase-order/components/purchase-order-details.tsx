'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Mail,
  Download,
  Package,
  Edit,
  MoreHorizontal,
  MapPin,
  User,
  FileText,
  DollarSign,
  Truck,
  Printer,
  Phone,
} from 'lucide-react';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { updatePurchaseOrderStatus } from '@/actions/purchase-orders';
import { sendPurchaseOrderEmail } from '@/actions/email';
import { PurchaseOrderStatus } from '@prisma/client';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PurchaseOrderPDFViewer } from './purchase-order-pdf';

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  date: string;
  supplierId: string;
  supplierName: string | null;
  status: string;
  subtotal: number;
  taxAmount: number;
  shippingCost: number | null;
  discount: number | null;
  total: number;
  notes: string | null;
  paymentTerms: string | null;
  expectedDeliveryDate: string | null;
  supplier: {
    id: string;
    name: string;
    email: string | null;
    contactPerson: string | null;
    phone: string | null;
  };
  deliveryLocation: {
    id: string;
    name: string;
    address: string | null;
  };
  lines: Array<{
    id: string;
    quantity: number;
    unitPrice: number;
    total: number;
    receivedQuantity: number;
    item: {
      id: string;
      name: string;
      sku: string | null;
    };
  }>;
}

const statusColors = {
  DRAFT: 'bg-gray-100 text-gray-800',
  SUBMITTED: 'bg-blue-100 text-blue-800',
  APPROVED: 'bg-green-100 text-green-800',
  PARTIALLY_RECEIVED: 'bg-yellow-100 text-yellow-800',
  RECEIVED: 'bg-emerald-100 text-emerald-800',
  CANCELLED: 'bg-red-100 text-red-800',
  CLOSED: 'bg-slate-100 text-slate-800',
};

interface PurchaseOrderDetailsProps {
  purchaseOrder: PurchaseOrder;
  onUpdate?: (updatedPO: PurchaseOrder) => void;
}

export default function PurchaseOrderDetails({
  purchaseOrder,
  onUpdate,
}: PurchaseOrderDetailsProps) {
  const [isReceiving, setIsReceiving] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [supplierEmail, setSupplierEmail] = useState<string | null>(null);

  // Extract supplier email when component mounts or purchaseOrder changes
  useEffect(() => {
    console.log('Supplier data:', purchaseOrder.supplier);
    if (purchaseOrder?.supplier?.email) {
      setSupplierEmail(purchaseOrder.supplier.email);
    }
  }, [purchaseOrder]);

  const handleSendEmail = async () => {
    if (!supplierEmail) {
      toast.error('Supplier email not found. Please update supplier details first.');
      return;
    }

    setIsSendingEmail(true);
    try {
      const result = await sendPurchaseOrderEmail(purchaseOrder.id);
      if (result.success) {
        toast.success(`Email sent successfully to ${result.data?.sentTo || supplierEmail}`);
      } else {
        toast.error(result.error || 'Failed to send email');
      }
    } catch (error) {
      toast.error('Failed to send email');
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleViewPDF = () => {
    setIsPdfOpen(true);
  };

  const handleReceive = async () => {
    setIsReceiving(true);
    try {
      const result = await updatePurchaseOrderStatus(
        purchaseOrder.id,
        PurchaseOrderStatus.RECEIVED,
      );
      if (result.success) {
        toast.success('Purchase order marked as received');
        if (onUpdate) {
          onUpdate({ ...purchaseOrder, status: 'RECEIVED' });
        }
      } else {
        toast.error('Failed to update purchase order status');
      }
    } catch (error) {
      toast.error('Failed to update purchase order status');
    } finally {
      setIsReceiving(false);
    }
  };

  const handleStatusUpdate = async (status: PurchaseOrderStatus) => {
    setIsUpdating(true);
    try {
      const result = await updatePurchaseOrderStatus(purchaseOrder.id, status);
      if (result.success) {
        toast.success('Purchase order status updated');
        if (onUpdate) {
          onUpdate({ ...purchaseOrder, status });
        }
      } else {
        toast.error('Failed to update purchase order status');
      }
    } catch (error) {
      toast.error('Failed to update purchase order status');
    } finally {
      setIsUpdating(false);
    }
  };

  const canReceive = ['APPROVED', 'PARTIALLY_RECEIVED'].includes(purchaseOrder.status);
  const totalReceived = purchaseOrder.lines.reduce((sum, line) => sum + line.receivedQuantity, 0);
  const totalOrdered = purchaseOrder.lines.reduce((sum, line) => sum + line.quantity, 0);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b bg-gray-50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{purchaseOrder.poNumber}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={statusColors[purchaseOrder.status as keyof typeof statusColors]}>
                {purchaseOrder.status.replace('_', ' ')}
              </Badge>
              <span className="text-sm text-gray-500">
                {format(new Date(purchaseOrder.date), 'MMM dd, yyyy')}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSendEmail}
              disabled={isSendingEmail || !supplierEmail}
              title={!supplierEmail ? 'Supplier email not available' : 'Send email to supplier'}
            >
              <Mail className="h-4 w-4 mr-2" />
              {isSendingEmail ? 'Sending...' : 'Send Email'}
            </Button>
            <Button variant="outline" size="sm" onClick={handleViewPDF}>
              <Printer className="h-4 w-4 mr-2" />
              View/Print
            </Button>
            {canReceive && (
              <Button size="sm" onClick={handleReceive} disabled={isReceiving}>
                <Package className="h-4 w-4 mr-2" />
                {isReceiving ? 'Processing...' : 'Receive'}
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" disabled={isUpdating}>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusUpdate(PurchaseOrderStatus.APPROVED)}>
                  <FileText className="h-4 w-4 mr-2" />
                  Approve
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleStatusUpdate(PurchaseOrderStatus.CANCELLED)}
                  className="text-red-600"
                >
                  Cancel Order
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-xl font-bold">${purchaseOrder.total.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Package className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Items Received</p>
                  <p className="text-xl font-bold">
                    {totalReceived}/{totalOrdered}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Truck className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Expected Delivery</p>
                  <p className="text-sm font-medium">
                    {purchaseOrder.expectedDeliveryDate
                      ? format(new Date(purchaseOrder.expectedDeliveryDate), 'MMM dd, yyyy')
                      : 'Not set'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Supplier Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="font-medium">{purchaseOrder.supplier.name}</span>
              </div>

              {purchaseOrder.supplier.contactPerson && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Contact: {purchaseOrder.supplier.contactPerson}
                  </span>
                </div>
              )}

              {supplierEmail && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{supplierEmail}</span>
                </div>
              )}

              {purchaseOrder.supplier.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{purchaseOrder.supplier.phone}</span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Delivery to: {purchaseOrder.deliveryLocation.name}
                </span>
              </div>

              {purchaseOrder.paymentTerms && (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Payment Terms: {purchaseOrder.paymentTerms}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span>${purchaseOrder.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax:</span>
                <span>${purchaseOrder.taxAmount.toLocaleString()}</span>
              </div>
              {purchaseOrder.shippingCost && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span>${purchaseOrder.shippingCost.toLocaleString()}</span>
                </div>
              )}
              {purchaseOrder.discount && (
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span>-${purchaseOrder.discount.toLocaleString()}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>${purchaseOrder.total.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Lines */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Item</th>
                    <th className="text-right py-3 px-2">Qty Ordered</th>
                    <th className="text-right py-3 px-2">Qty Received</th>
                    <th className="text-right py-3 px-2">Unit Price</th>
                    <th className="text-right py-3 px-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseOrder.lines.map((line) => (
                    <tr key={line.id} className="border-b">
                      <td className="py-3 px-2">
                        <div>
                          <p className="font-medium">{line.item.name}</p>
                          {line.item.sku && (
                            <p className="text-sm text-gray-500">SKU: {line.item.sku}</p>
                          )}
                        </div>
                      </td>
                      <td className="text-right py-3 px-2">{line.quantity}</td>
                      <td className="text-right py-3 px-2">
                        <span
                          className={
                            line.receivedQuantity === line.quantity
                              ? 'text-green-600'
                              : 'text-orange-600'
                          }
                        >
                          {line.receivedQuantity}
                        </span>
                      </td>
                      <td className="text-right py-3 px-2">${line.unitPrice.toLocaleString()}</td>
                      <td className="text-right py-3 px-2 font-medium">
                        ${line.total.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        {purchaseOrder.notes && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{purchaseOrder.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* PDF Dialog */}
      <Dialog open={isPdfOpen} onOpenChange={setIsPdfOpen}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>Purchase Order: {purchaseOrder.poNumber}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col h-full">
            <div className="flex justify-end mb-4">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <PurchaseOrderPDFViewer purchaseOrder={purchaseOrder} mode="download" />
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              <PurchaseOrderPDFViewer purchaseOrder={purchaseOrder} mode="view" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
