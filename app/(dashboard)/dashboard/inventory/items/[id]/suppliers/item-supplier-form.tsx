'use client';

import type React from 'react';

import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, Save } from 'lucide-react';
import { updateItemSupplier } from '@/actions/item-suppliers';
import { toast } from 'sonner';

interface ItemSupplier {
  id: string;
  itemId: string;
  supplierId: string;
  isPreferred: boolean;
  supplierSku: string | null;
  leadTime: number | null;
  minOrderQty: number | null;
  unitCost: number | null;
  lastPurchaseDate: Date | null;
  notes: string | null;
  supplier: {
    id: string;
    name: string;
  };
}

interface ItemSupplierFormProps {
  itemSupplier: ItemSupplier;
  onUpdate: (updatedSupplier: ItemSupplier) => void;
  onPreferredChange?: (supplierId: string, isPreferred: boolean) => void;
}

export default function ItemSupplierForm({
  itemSupplier,
  onUpdate,
  onPreferredChange,
}: ItemSupplierFormProps) {
  const [formData, setFormData] = useState({
    isPreferred: itemSupplier.isPreferred,
    supplierSku: itemSupplier.supplierSku || '',
    leadTime: itemSupplier.leadTime || '',
    minOrderQty: itemSupplier.minOrderQty || '',
    unitCost: itemSupplier.unitCost || '',
    lastPurchaseDate: itemSupplier.lastPurchaseDate
      ? new Date(itemSupplier.lastPurchaseDate)
      : null,
    notes: itemSupplier.notes || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form data when itemSupplier changes
  useEffect(() => {
    setFormData({
      isPreferred: itemSupplier.isPreferred,
      supplierSku: itemSupplier.supplierSku || '',
      leadTime: itemSupplier.leadTime !== null ? String(itemSupplier.leadTime) : '',
      minOrderQty: itemSupplier.minOrderQty !== null ? String(itemSupplier.minOrderQty) : '',
      unitCost: itemSupplier.unitCost !== null ? String(itemSupplier.unitCost) : '',
      lastPurchaseDate: itemSupplier.lastPurchaseDate
        ? new Date(itemSupplier.lastPurchaseDate)
        : null,
      notes: itemSupplier.notes || '',
    });
  }, [itemSupplier]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Allow empty string or valid number
    if (value === '' || !isNaN(Number(value))) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, isPreferred: checked }));

    // Notify parent component about preferred change
    if (onPreferredChange) {
      onPreferredChange(itemSupplier.id, checked);
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, lastPurchaseDate: date || null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await updateItemSupplier(itemSupplier.id, {
        isPreferred: formData.isPreferred,
        supplierSku: formData.supplierSku || null,
        leadTime: formData.leadTime ? Number.parseInt(formData.leadTime.toString()) : null,
        minOrderQty: formData.minOrderQty ? Number.parseInt(formData.minOrderQty.toString()) : null,
        unitCost: formData.unitCost ? Number.parseFloat(formData.unitCost.toString()) : null,
        lastPurchaseDate: formData.lastPurchaseDate,
        notes: formData.notes || null,
      });

      if (result.success) {
        toast.success('Success', {
          description: 'Supplier details updated successfully',
        });

        // Update the parent component with the updated supplier
        onUpdate({
          ...itemSupplier,
          isPreferred: formData.isPreferred,
          supplierSku: formData.supplierSku || null,
          leadTime: formData.leadTime ? Number.parseInt(formData.leadTime.toString()) : null,
          minOrderQty: formData.minOrderQty
            ? Number.parseInt(formData.minOrderQty.toString())
            : null,
          unitCost: formData.unitCost ? Number.parseFloat(formData.unitCost.toString()) : null,
          lastPurchaseDate: formData.lastPurchaseDate,
          notes: formData.notes || null,
        });
      }
    } catch (error) {
      toast.error('Error', {
        description: 'Failed to update supplier details',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800">{itemSupplier.supplier.name}</h2>
        <p className="text-sm text-gray-500">Update supplier details</p>
      </div>

      <div className="mb-6">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isPreferred"
            checked={formData.isPreferred}
            onCheckedChange={handleCheckboxChange}
          />
          <Label htmlFor="isPreferred" className="font-medium">
            Preferred Supplier
          </Label>
        </div>
        <p className="text-sm text-gray-500 mt-1 ml-6">
          Mark this supplier as preferred for this item
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-2">
          <Label htmlFor="supplierSku">Supplier SKU</Label>
          <Input
            id="supplierSku"
            name="supplierSku"
            placeholder="Supplier's SKU for this item"
            value={formData.supplierSku}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="unitCost">Unit Cost</Label>
          <Input
            id="unitCost"
            name="unitCost"
            placeholder="0.00"
            value={formData.unitCost}
            onChange={handleNumberChange}
            type="text"
            inputMode="decimal"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="leadTime">Lead Time (days)</Label>
          <Input
            id="leadTime"
            name="leadTime"
            placeholder="0"
            value={formData.leadTime}
            onChange={handleNumberChange}
            type="text"
            inputMode="numeric"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="minOrderQty">Minimum Order Quantity</Label>
          <Input
            id="minOrderQty"
            name="minOrderQty"
            placeholder="0"
            value={formData.minOrderQty}
            onChange={handleNumberChange}
            type="text"
            inputMode="numeric"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastPurchaseDate">Last Purchase Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.lastPurchaseDate ? (
                  format(formData.lastPurchaseDate, 'PPP')
                ) : (
                  <span className="text-muted-foreground">Select a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.lastPurchaseDate || undefined}
                onSelect={handleDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="space-y-2 mb-6">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder="Additional notes about this supplier"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
            Saving...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </span>
        )}
      </Button>
    </form>
  );
}
