'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { format } from 'date-fns';
import { CalendarIcon, Plus, Trash2, Save, Check, ChevronsUpDown } from 'lucide-react';
import {
  createPurchaseOrder,
  getSuppliers,
  getLocations,
  getItems,
} from '@/actions/purchase-orders';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface Supplier {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
}

interface Location {
  id: string;
  name: string;
  address: string | null;
}

interface Item {
  id: string;
  name: string;
  sku: string | null;
  description: string | null;
}

interface OrderLine {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  discount: number;
  total: number;
  notes: string;
}

export default function CreatePurchaseOrderForm() {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    supplierId: '',
    deliveryLocationId: '',
    expectedDeliveryDate: undefined as Date | undefined,
    notes: '',
    paymentTerms: '',
  });
  const [orderLines, setOrderLines] = useState<OrderLine[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Combobox states
  const [supplierOpen, setSupplierOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [itemOpenStates, setItemOpenStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [suppliersData, locationsData, itemsData] = await Promise.all([
          getSuppliers(),
          getLocations(),
          getItems(),
        ]);
        setSuppliers(suppliersData);
        setLocations(locationsData);
        setItems(itemsData);
      } catch (error) {
        toast.error('Failed to load form data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const addOrderLine = () => {
    const newLine: OrderLine = {
      id: Math.random().toString(36).substr(2, 9),
      itemId: '',
      itemName: '',
      quantity: 1,
      unitPrice: 0,
      taxRate: 8, // Default 8% tax rate
      discount: 0,
      total: 0,
      notes: '',
    };
    setOrderLines([...orderLines, newLine]);
  };

  const removeOrderLine = (id: string) => {
    setOrderLines(orderLines.filter((line) => line.id !== id));
    // Remove the item open state
    const newItemOpenStates = { ...itemOpenStates };
    delete newItemOpenStates[id];
    setItemOpenStates(newItemOpenStates);
  };

  const updateOrderLine = (id: string, field: keyof OrderLine, value: any) => {
    setOrderLines(
      orderLines.map((line) => {
        if (line.id === id) {
          const updatedLine = { ...line, [field]: value };

          // Update item name when item is selected
          if (field === 'itemId') {
            const selectedItem = items.find((item) => item.id === value);
            updatedLine.itemName = selectedItem?.name || '';
          }

          // Recalculate total when quantity, unitPrice, taxRate, or discount changes
          if (['quantity', 'unitPrice', 'taxRate', 'discount'].includes(field)) {
            const subtotal = updatedLine.quantity * updatedLine.unitPrice;
            const discountAmount = updatedLine.discount || 0;
            const discountedAmount = subtotal - discountAmount;
            const taxAmount = discountedAmount * (updatedLine.taxRate / 100);
            updatedLine.total = discountedAmount + taxAmount;
          }

          return updatedLine;
        }
        return line;
      }),
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.supplierId || !formData.deliveryLocationId || orderLines.length === 0) {
      toast.error('Please fill in all required fields and add at least one item');
      return;
    }

    // Validate order lines
    const invalidLines = orderLines.filter(
      (line) => !line.itemId || line.quantity <= 0 || line.unitPrice < 0,
    );
    if (invalidLines.length > 0) {
      toast.error('Please complete all order line details');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createPurchaseOrder({
        ...formData,
        lines: orderLines.map((line) => ({
          itemId: line.itemId,
          quantity: line.quantity,
          unitPrice: line.unitPrice,
          taxRate: line.taxRate,
          discount: line.discount > 0 ? line.discount : undefined,
          notes: line.notes || undefined,
        })),
      });

      if (result.success) {
        toast.success('Purchase order created successfully');
        router.push('/dashboard/purchases/purchase-order');
      } else {
        toast.error(result.error || 'Failed to create purchase order');
      }
    } catch (error) {
      toast.error('Failed to create purchase order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const subtotal = orderLines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0);
  const totalDiscount = orderLines.reduce((sum, line) => sum + (line.discount || 0), 0);
  const taxAmount = orderLines.reduce((sum, line) => {
    const lineSubtotal = line.quantity * line.unitPrice;
    const discountedAmount = lineSubtotal - (line.discount || 0);
    return sum + discountedAmount * (line.taxRate / 100);
  }, 0);
  const total = subtotal - totalDiscount + taxAmount;

  if (isLoading) {
    return <div className="p-6 text-center">Loading form data...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Supplier Information */}
        <Card>
          <CardHeader>
            <CardTitle>Supplier Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Supplier *</Label>
              <Popover open={supplierOpen} onOpenChange={setSupplierOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={supplierOpen}
                    className="w-full justify-between"
                  >
                    {formData.supplierId
                      ? suppliers.find((supplier) => supplier.id === formData.supplierId)?.name
                      : 'Search and select a supplier'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search suppliers..." />
                    <CommandList>
                      <CommandEmpty>No suppliers found.</CommandEmpty>
                      <CommandGroup>
                        {suppliers.map((supplier) => (
                          <CommandItem
                            key={supplier.id}
                            value={supplier.name}
                            onSelect={() => {
                              setFormData({ ...formData, supplierId: supplier.id });
                              setSupplierOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                formData.supplierId === supplier.id ? 'opacity-100' : 'opacity-0',
                              )}
                            />
                            <div>
                              <div className="font-medium">{supplier.name}</div>
                              {supplier.email && (
                                <div className="text-sm text-gray-500">{supplier.email}</div>
                              )}
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Delivery Location *</Label>
              <Popover open={locationOpen} onOpenChange={setLocationOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={locationOpen}
                    className="w-full justify-between"
                  >
                    {formData.deliveryLocationId
                      ? locations.find((location) => location.id === formData.deliveryLocationId)
                          ?.name
                      : 'Search and select a location'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search locations..." />
                    <CommandList>
                      <CommandEmpty>No locations found.</CommandEmpty>
                      <CommandGroup>
                        {locations.map((location) => (
                          <CommandItem
                            key={location.id}
                            value={location.name}
                            onSelect={() => {
                              setFormData({ ...formData, deliveryLocationId: location.id });
                              setLocationOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                formData.deliveryLocationId === location.id
                                  ? 'opacity-100'
                                  : 'opacity-0',
                              )}
                            />
                            <div>
                              <div className="font-medium">{location.name}</div>
                              {location.address && (
                                <div className="text-sm text-gray-500">{location.address}</div>
                              )}
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Expected Delivery Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.expectedDeliveryDate ? (
                      format(formData.expectedDeliveryDate, 'PPP')
                    ) : (
                      <span className="text-muted-foreground">Select a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.expectedDeliveryDate}
                    onSelect={(date) => setFormData({ ...formData, expectedDeliveryDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="paymentTerms">Payment Terms</Label>
              <Input
                id="paymentTerms"
                placeholder="e.g., Net 30"
                value={formData.paymentTerms}
                onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes for this purchase order"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Lines */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Order Items</CardTitle>
            <Button type="button" onClick={addOrderLine} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {orderLines.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No items added yet. Click "Add Item" to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-2">Item</th>
                      <th className="text-center py-2 px-2">Quantity</th>
                      <th className="text-center py-2 px-2">Unit Price</th>
                      <th className="text-center py-2 px-2">Tax Rate (%)</th>
                      <th className="text-center py-2 px-2">Discount</th>
                      <th className="text-center py-2 px-2">Subtotal</th>
                      <th className="text-center py-2 px-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderLines.map((line) => (
                      <tr key={line.id} className="border-b">
                        <td className="py-2 px-2 min-w-[200px]">
                          <Popover
                            open={itemOpenStates[line.id] || false}
                            onOpenChange={(open) =>
                              setItemOpenStates({ ...itemOpenStates, [line.id]: open })
                            }
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                className="w-full justify-between"
                              >
                                {line.itemId
                                  ? items.find((item) => item.id === line.itemId)?.name
                                  : 'Search and select an item'}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0">
                              <Command>
                                <CommandInput placeholder="Search items..." />
                                <CommandList>
                                  <CommandEmpty>No items found.</CommandEmpty>
                                  <CommandGroup>
                                    {items.map((item) => (
                                      <CommandItem
                                        key={item.id}
                                        value={item.name}
                                        onSelect={() => {
                                          updateOrderLine(line.id, 'itemId', item.id);
                                          setItemOpenStates({
                                            ...itemOpenStates,
                                            [line.id]: false,
                                          });
                                        }}
                                      >
                                        <Check
                                          className={cn(
                                            'mr-2 h-4 w-4',
                                            line.itemId === item.id ? 'opacity-100' : 'opacity-0',
                                          )}
                                        />
                                        <div>
                                          <div className="font-medium">{item.name}</div>
                                          {item.sku && (
                                            <div className="text-sm text-gray-500">
                                              SKU: {item.sku}
                                            </div>
                                          )}
                                        </div>
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </td>
                        <td className="py-2 px-2">
                          <Input
                            type="number"
                            min="1"
                            value={line.quantity}
                            onChange={(e) =>
                              updateOrderLine(
                                line.id,
                                'quantity',
                                Number.parseInt(e.target.value) || 1,
                              )
                            }
                            className="w-20"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={line.unitPrice}
                            onChange={(e) =>
                              updateOrderLine(
                                line.id,
                                'unitPrice',
                                Number.parseFloat(e.target.value) || 0,
                              )
                            }
                            className="w-24"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            max="100"
                            value={line.taxRate}
                            onChange={(e) =>
                              updateOrderLine(
                                line.id,
                                'taxRate',
                                Number.parseFloat(e.target.value) || 0,
                              )
                            }
                            className="w-20"
                          />
                        </td>
                        <td className="py-2 px-2">
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={line.discount}
                            onChange={(e) =>
                              updateOrderLine(
                                line.id,
                                'discount',
                                Number.parseFloat(e.target.value) || 0,
                              )
                            }
                            className="w-24"
                          />
                        </td>
                        <td className="py-2 px-2 text-center font-medium">
                          ${line.total.toFixed(2)}
                        </td>
                        <td className="py-2 px-2 text-center">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeOrderLine(line.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Summary */}
      {orderLines.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-w-sm ml-auto">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {totalDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span>-${totalDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || orderLines.length === 0}>
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
              Creating...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Create Purchase Order
            </span>
          )}
        </Button>
      </div>
    </form>
  );
}
