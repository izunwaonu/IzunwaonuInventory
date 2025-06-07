'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Package,
  Edit,
  MapPin,
  User,
  FileText,
  DollarSign,
  Calendar,
  Truck,
  Hash,
  Phone,
  Mail,
} from 'lucide-react';
import { format } from 'date-fns';
import { updateGoodsReceiptStatus } from '@/actions/goods-receipts';
import type { GoodsReceiptStatus } from '@prisma/client';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface GoodsReceiptLine {
  id: string;
  goodsReceiptId: string;
  purchaseOrderLineId: string;
  itemId: string;
  receivedQuantity: number;
  notes: string | null;
  serialNumbers: string[];
  createdAt: string;
  updatedAt: string;
  item: {
    id: string;
    name: string;
    sku: string | null;
  };
  purchaseOrderLine: {
    id: string;
    quantity: number;
    unitPrice: number;
    total: number;
  };
}

interface GoodsReceipt {
  id: string;
  receiptNumber: string;
  date: string;
  purchaseOrderId: string;
  locationId: string;
  status: GoodsReceiptStatus;
  notes: string | null;
  orgId: string;
  receivedById: string;
  createdAt: string;
  updatedAt: string;
  totalValue: number;
  receivedBy: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  purchaseOrder: {
    id: string;
    poNumber: string;
    supplier: {
      id: string;
      name: string;
      email: string | null;
      contactPerson: string | null;
      phone: string | null;
    };
  };
  location: {
    id: string;
    name: string;
    address: string | null;
  };
  lines: GoodsReceiptLine[];
}

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  COMPLETED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const statusOptions = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

interface GoodsReceiptDetailsProps {
  goodsReceipt: GoodsReceipt;
  onUpdate?: (updatedGR: GoodsReceipt) => void;
}

export default function GoodsReceiptDetails({ goodsReceipt, onUpdate }: GoodsReceiptDetailsProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<GoodsReceiptStatus>(goodsReceipt.status);

  const handleStatusUpdate = async () => {
    if (selectedStatus === goodsReceipt.status) {
      setIsStatusDialogOpen(false);
      return;
    }

    setIsUpdating(true);
    try {
      const result = await updateGoodsReceiptStatus(goodsReceipt.id, selectedStatus);
      if (result.success) {
        toast.success('Goods receipt status updated');
        if (onUpdate) {
          onUpdate({ ...goodsReceipt, status: selectedStatus });
        }
        setIsStatusDialogOpen(false);
      } else {
        toast.error('Failed to update goods receipt status');
      }
    } catch (error) {
      toast.error('Failed to update goods receipt status');
    } finally {
      setIsUpdating(false);
    }
  };

  const totalItems = goodsReceipt.lines.reduce((sum, line) => sum + line.receivedQuantity, 0);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b bg-gray-50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{goodsReceipt.receiptNumber}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={statusColors[goodsReceipt.status]}>{goodsReceipt.status}</Badge>
              <span className="text-sm text-gray-500">
                {format(new Date(goodsReceipt.date), 'MMM dd, yyyy')}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsStatusDialogOpen(true)}>
              <Edit className="h-4 w-4 mr-2" />
              Change Status
            </Button>
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
                  <p className="text-sm text-gray-600">Total Value</p>
                  <p className="text-xl font-bold">₦{goodsReceipt.totalValue.toLocaleString()}</p>
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
                  <p className="text-xl font-bold">{totalItems}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FileText className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Line Items</p>
                  <p className="text-xl font-bold">{goodsReceipt.lines.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Receipt Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Receipt Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Receipt Number:</span>
                <span className="font-medium">{goodsReceipt.receiptNumber}</span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Receipt Date:</span>
                <span className="font-medium">
                  {format(new Date(goodsReceipt.date), 'MMM dd, yyyy')}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Purchase Order:</span>
                <span className="font-medium">{goodsReceipt.purchaseOrder.poNumber}</span>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Location:</span>
                <span className="font-medium">{goodsReceipt.location.name}</span>
              </div>

              {goodsReceipt.location.address && (
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Address:</span>
                  <span className="font-medium">{goodsReceipt.location.address}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Supplier & Receiver Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Supplier:</span>
                <span className="font-medium">{goodsReceipt.purchaseOrder.supplier.name}</span>
              </div>

              {goodsReceipt.purchaseOrder.supplier.contactPerson && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Contact:</span>
                  <span className="font-medium">
                    {goodsReceipt.purchaseOrder.supplier.contactPerson}
                  </span>
                </div>
              )}

              {goodsReceipt.purchaseOrder.supplier.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {goodsReceipt.purchaseOrder.supplier.email}
                  </span>
                </div>
              )}

              {goodsReceipt.purchaseOrder.supplier.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {goodsReceipt.purchaseOrder.supplier.phone}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Received by:</span>
                <span className="font-medium">
                  {goodsReceipt.receivedBy
                    ? `${goodsReceipt.receivedBy.firstName} ${goodsReceipt.receivedBy.lastName}`
                    : 'System'}
                </span>
              </div>

              {goodsReceipt.receivedBy?.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{goodsReceipt.receivedBy.email}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Received Items */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Received Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Item</th>
                    <th className="text-right py-3 px-2">Received Qty</th>
                    <th className="text-right py-3 px-2">Unit Price</th>
                    <th className="text-right py-3 px-2">Total Value</th>
                    <th className="text-left py-3 px-2">Serial Numbers</th>
                  </tr>
                </thead>
                <tbody>
                  {goodsReceipt.lines.map((line) => (
                    <tr key={line.id} className="border-b">
                      <td className="py-3 px-2">
                        <div>
                          <p className="font-medium">{line.item.name}</p>
                          {line.item.sku && (
                            <p className="text-sm text-gray-500">SKU: {line.item.sku}</p>
                          )}
                        </div>
                      </td>
                      <td className="text-right py-3 px-2 font-medium">{line.receivedQuantity}</td>
                      <td className="text-right py-3 px-2">
                        ₦{line.purchaseOrderLine.unitPrice.toLocaleString()}
                      </td>
                      <td className="text-right py-3 px-2 font-medium">
                        ₦
                        {(
                          line.receivedQuantity * line.purchaseOrderLine.unitPrice
                        ).toLocaleString()}
                      </td>
                      <td className="py-3 px-2">
                        {line.serialNumbers.length > 0 ? (
                          <div className="text-sm">
                            {line.serialNumbers.slice(0, 2).map((sn, index) => (
                              <div key={index} className="text-gray-600">
                                {sn}
                              </div>
                            ))}
                            {line.serialNumbers.length > 2 && (
                              <div className="text-gray-500">
                                +{line.serialNumbers.length - 2} more
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">No serial numbers</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        {goodsReceipt.notes && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{goodsReceipt.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Status Change Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Status - {goodsReceipt.receiptNumber}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="status">Select New Status</Label>
              <Select
                value={selectedStatus}
                onValueChange={(value) => setSelectedStatus(value as GoodsReceiptStatus)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <Badge className={statusColors[option.value as keyof typeof statusColors]}>
                          {option.label}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-gray-600">
              Current status: <span className="font-medium">{goodsReceipt.status}</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleStatusUpdate} disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Update Status'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
