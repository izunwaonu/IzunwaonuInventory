'use client';

import type React from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { createSalesOrder } from '@/actions/sales-orders/sales-orders';

interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
}

interface Item {
  id: string;
  name: string;
  sku: string;
  sellingPrice: number;
  unitOfMeasure: string | null;
  description: string | null;
}

interface Location {
  id: string;
  name: string;
  type: string;
  address: string | null;
}

interface OrderLine {
  itemId: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxRate: number;
}

interface CreateSalesOrderFormProps {
  customers: Customer[];
  items: Item[];
  locations: Location[];
}

export function CreateSalesOrderForm({ customers, items, locations }: CreateSalesOrderFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    customerId: '',
    locationId: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: '',
    notes: '',
  });

  const [orderLines, setOrderLines] = useState<OrderLine[]>([
    {
      itemId: '',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      taxRate: 0,
    },
  ]);

  const handleItemChange = (index: number, itemId: string) => {
    const item = items.find((i) => i.id === itemId);
    const newLines = [...orderLines];
    newLines[index] = {
      ...newLines[index],
      itemId,
      unitPrice: item?.sellingPrice || 0,
    };
    setOrderLines(newLines);
  };

  const addOrderLine = () => {
    setOrderLines([
      ...orderLines,
      {
        itemId: '',
        quantity: 1,
        unitPrice: 0,
        discount: 0,
        taxRate: 0,
      },
    ]);
  };

  const removeOrderLine = (index: number) => {
    if (orderLines.length > 1) {
      setOrderLines(orderLines.filter((_, i) => i !== index));
    }
  };

  const updateOrderLine = (index: number, field: keyof OrderLine, value: string | number) => {
    const newLines = [...orderLines];
    newLines[index] = { ...newLines[index], [field]: value };
    setOrderLines(newLines);
  };

  const calculateLineTotal = (line: OrderLine) => {
    const subtotal = line.quantity * line.unitPrice;
    const discountAmount = (line.discount / 100) * subtotal;
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = (line.taxRate / 100) * afterDiscount;
    return afterDiscount + taxAmount;
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let totalDiscount = 0;
    let totalTax = 0;

    orderLines.forEach((line) => {
      const lineSubtotal = line.quantity * line.unitPrice;
      const discountAmount = (line.discount / 100) * lineSubtotal;
      const afterDiscount = lineSubtotal - discountAmount;
      const taxAmount = (line.taxRate / 100) * afterDiscount;

      subtotal += lineSubtotal;
      totalDiscount += discountAmount;
      totalTax += taxAmount;
    });

    return {
      subtotal,
      totalDiscount,
      totalTax,
      total: subtotal - totalDiscount + totalTax,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.locationId) {
      toast.error('Please select a location');
      return;
    }

    const validLines = orderLines.filter((line) => line.itemId && line.quantity > 0);
    if (validLines.length === 0) {
      toast.error('Please add at least one order line');
      return;
    }

    setIsLoading(true);
    try {
      const result = await createSalesOrder({
        ...formData,
        customerId: formData.customerId || undefined,
        lines: validLines,
      });

      if (result.success && result.data) {
        toast.success('Sales order created successfully');
        router.push(`/dashboard/sales/orders/${result.data.id}`);
      } else {
        toast.error(result.error || 'Failed to create sales order');
      }
    } catch (error) {
      toast.error('An error occurred while creating the sales order');
    } finally {
      setIsLoading(false);
    }
  };

  const totals = calculateTotals();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="customer">Customer (Optional)</Label>
            <Select
              value={formData.customerId}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, customerId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select customer or leave blank for walk-in" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="location">Location *</Label>
            <Select
              value={formData.locationId}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, locationId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name} ({location.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="date">Order Date *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Select
              value={formData.paymentMethod}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, paymentMethod: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="check">Check</SelectItem>
                <SelectItem value="credit">Credit</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Order notes..."
              rows={4}
            />
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Order Items</CardTitle>
            <Button type="button" onClick={addOrderLine} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead>Discount %</TableHead>
                  <TableHead>Tax %</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderLines.map((line, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Select
                        value={line.itemId}
                        onValueChange={(value) => handleItemChange(index, value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select item" />
                        </SelectTrigger>
                        <SelectContent>
                          {items.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name} - ${item.sellingPrice}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="1"
                        value={line.quantity}
                        onChange={(e) =>
                          updateOrderLine(index, 'quantity', Number.parseInt(e.target.value) || 1)
                        }
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={line.unitPrice}
                        onChange={(e) =>
                          updateOrderLine(
                            index,
                            'unitPrice',
                            Number.parseFloat(e.target.value) || 0,
                          )
                        }
                        className="w-24"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={line.discount}
                        onChange={(e) =>
                          updateOrderLine(index, 'discount', Number.parseFloat(e.target.value) || 0)
                        }
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={line.taxRate}
                        onChange={(e) =>
                          updateOrderLine(index, 'taxRate', Number.parseFloat(e.target.value) || 0)
                        }
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      ${calculateLineTotal(line).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeOrderLine(index)}
                        disabled={orderLines.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount:</span>
                <span>-${totals.totalDiscount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${totals.totalTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>${totals.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? 'Creating...' : 'Create Order'}
        </Button>
      </div>
    </form>
  );
}
