'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Plus, Trash2, Package } from 'lucide-react';
import { createAdjustment, getItemsWithInventory } from '@/actions/adjustments';
import { toast } from 'sonner';
import type { AdjustmentType } from '@prisma/client';

interface Location {
  id: string;
  name: string;
  address: string | null;
}

interface Item {
  id: string;
  name: string;
  sku: string;
  thumbnail: string | null;
  inventories: Array<{
    id: string;
    quantity: number;
    reservedQuantity: number;
    locationId: string;
    location: {
      id: string;
      name: string;
    };
  }>;
}

interface AdjustmentLine {
  itemId: string;
  beforeQuantity: number;
  afterQuantity: number;
  notes?: string;
}

interface CreateAdjustmentFormProps {
  locations: Location[];
  items: Item[];
}

const adjustmentTypes = [
  { value: 'STOCK_COUNT', label: 'Stock Count' },
  { value: 'DAMAGE', label: 'Damage' },
  { value: 'THEFT', label: 'Theft' },
  { value: 'EXPIRED', label: 'Expired' },
  { value: 'OTHER', label: 'Other' },
];

export function CreateAdjustmentForm({
  locations,
  items: initialItems,
}: CreateAdjustmentFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationId, setLocationId] = useState('');
  const [adjustmentType, setAdjustmentType] = useState<AdjustmentType | ''>('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [lines, setLines] = useState<AdjustmentLine[]>([
    { itemId: '', beforeQuantity: 0, afterQuantity: 0, notes: '' },
  ]);
  const [availableItems, setAvailableItems] = useState<Item[]>([]);

  // Load items when location changes
  useEffect(() => {
    if (locationId) {
      loadItemsForLocation(locationId);
    } else {
      setAvailableItems([]);
    }
  }, [locationId]);

  const loadItemsForLocation = async (selectedLocationId: string) => {
    try {
      const locationItems = await getItemsWithInventory(selectedLocationId);
      setAvailableItems(locationItems);
    } catch (error) {
      console.error('Error loading items:', error);
      toast.error('Failed to load items for location');
    }
  };

  const getItemInventory = (itemId: string) => {
    if (!locationId || !itemId) return null;
    const item = availableItems.find((i) => i.id === itemId);
    if (!item) return null;
    return item.inventories.find((inv) => inv.locationId === locationId);
  };

  const addLine = () => {
    setLines([...lines, { itemId: '', beforeQuantity: 0, afterQuantity: 0, notes: '' }]);
  };

  const removeLine = (index: number) => {
    if (lines.length > 1) {
      setLines(lines.filter((_, i) => i !== index));
    }
  };

  const updateLine = (index: number, field: keyof AdjustmentLine, value: any) => {
    const updatedLines = [...lines];
    updatedLines[index] = { ...updatedLines[index], [field]: value };

    // Auto-populate current quantity when item is selected
    if (field === 'itemId' && value) {
      const inventory = getItemInventory(value);
      if (inventory) {
        updatedLines[index].beforeQuantity = inventory.quantity;
        updatedLines[index].afterQuantity = inventory.quantity;
      }
    }

    setLines(updatedLines);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!locationId || !adjustmentType || !reason.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const validLines = lines.filter(
      (line) => line.itemId && line.beforeQuantity >= 0 && line.afterQuantity >= 0,
    );
    if (validLines.length === 0) {
      toast.error('Please add at least one item to adjust');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createAdjustment({
        locationId,
        adjustmentType: adjustmentType as AdjustmentType,
        reason: reason.trim(),
        notes: notes.trim() || undefined,
        lines: validLines,
      });

      if (result.success && result.data) {
        toast.success('Adjustment created successfully');
        router.push(`/dashboard/adjustments/${result.data.id}`);
      } else {
        toast.error(result.error || 'Failed to create adjustment');
      }
    } catch (error) {
      toast.error('Failed to create adjustment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={locationId} onValueChange={setLocationId}>
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    <div>
                      <p className="font-medium">{location.name}</p>
                      {location.address && (
                        <p className="text-sm text-gray-500">{location.address}</p>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Adjustment Type</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={adjustmentType}
              onValueChange={(value) => setAdjustmentType(value as AdjustmentType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select adjustment type" />
              </SelectTrigger>
              <SelectContent>
                {adjustmentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Reason */}
      <Card>
        <CardHeader>
          <CardTitle>Reason</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason for adjustment"
            required
          />
        </CardContent>
      </Card>

      {/* Adjustment Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Adjustment Items
            <Button type="button" onClick={addLine} size="sm" disabled={!locationId}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {lines.map((line, index) => {
              const inventory = getItemInventory(line.itemId);
              const difference = line.afterQuantity - line.beforeQuantity;

              return (
                <div key={index} className="space-y-4 p-4 border rounded-lg">
                  {/* Desktop Layout */}
                  <div className="hidden md:grid md:grid-cols-12 gap-4 items-end">
                    {/* Item Selection */}
                    <div className="col-span-3">
                      <Label>Item</Label>
                      <Select
                        value={line.itemId}
                        onValueChange={(value) => updateLine(index, 'itemId', value)}
                        disabled={!locationId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select item" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableItems.map((item) => {
                            const itemInventory = item.inventories.find(
                              (inv) => inv.locationId === locationId,
                            );
                            const currentQty = itemInventory ? itemInventory.quantity : 0;

                            return (
                              <SelectItem key={item.id} value={item.id}>
                                <div className="flex items-center gap-2">
                                  {item.thumbnail ? (
                                    <img
                                      src={item.thumbnail || '/placeholder.svg'}
                                      alt={item.name}
                                      className="w-6 h-6 object-cover rounded"
                                    />
                                  ) : (
                                    <Package className="h-4 w-4 text-gray-400" />
                                  )}
                                  <div>
                                    <p className="font-medium">{item.name}</p>
                                    <p className="text-sm text-gray-500">
                                      {item.sku} • Current: {currentQty}
                                    </p>
                                  </div>
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Current Quantity */}
                    <div className="col-span-2">
                      <Label>Current Quantity</Label>
                      <Input
                        type="number"
                        min="0"
                        value={line.beforeQuantity}
                        onChange={(e) =>
                          updateLine(index, 'beforeQuantity', Number.parseInt(e.target.value) || 0)
                        }
                        disabled={!line.itemId}
                      />
                    </div>

                    {/* New Quantity */}
                    <div className="col-span-2">
                      <Label>New Quantity</Label>
                      <Input
                        type="number"
                        min="0"
                        value={line.afterQuantity}
                        onChange={(e) =>
                          updateLine(index, 'afterQuantity', Number.parseInt(e.target.value) || 0)
                        }
                        disabled={!line.itemId}
                      />
                    </div>

                    {/* Difference */}
                    <div className="col-span-1">
                      <Label>Difference</Label>
                      <div className="h-10 flex items-center">
                        <span
                          className={`font-medium ${
                            difference > 0
                              ? 'text-green-600'
                              : difference < 0
                              ? 'text-red-600'
                              : 'text-gray-600'
                          }`}
                        >
                          {difference > 0 ? '+' : ''}
                          {difference}
                        </span>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="col-span-3">
                      <Label>Notes (Optional)</Label>
                      <Input
                        value={line.notes || ''}
                        onChange={(e) => updateLine(index, 'notes', e.target.value)}
                        placeholder="Optional notes"
                      />
                    </div>

                    {/* Remove Button */}
                    <div className="col-span-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeLine(index)}
                        disabled={lines.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Mobile Layout */}
                  <div className="md:hidden space-y-4">
                    <div className="flex justify-between items-center">
                      <Label>Item {index + 1}</Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeLine(index)}
                        disabled={lines.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div>
                      <Label>Item</Label>
                      <Select
                        value={line.itemId}
                        onValueChange={(value) => updateLine(index, 'itemId', value)}
                        disabled={!locationId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select item" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableItems.map((item) => {
                            const itemInventory = item.inventories.find(
                              (inv) => inv.locationId === locationId,
                            );
                            const currentQty = itemInventory ? itemInventory.quantity : 0;

                            return (
                              <SelectItem key={item.id} value={item.id}>
                                <div>
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-sm text-gray-500">
                                    {item.sku} • Current: {currentQty}
                                  </p>
                                </div>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <Label>Current</Label>
                        <Input
                          type="number"
                          min="0"
                          value={line.beforeQuantity}
                          onChange={(e) =>
                            updateLine(
                              index,
                              'beforeQuantity',
                              Number.parseInt(e.target.value) || 0,
                            )
                          }
                          disabled={!line.itemId}
                        />
                      </div>
                      <div>
                        <Label>New</Label>
                        <Input
                          type="number"
                          min="0"
                          value={line.afterQuantity}
                          onChange={(e) =>
                            updateLine(index, 'afterQuantity', Number.parseInt(e.target.value) || 0)
                          }
                          disabled={!line.itemId}
                        />
                      </div>
                      <div>
                        <Label>Difference</Label>
                        <div className="h-10 flex items-center">
                          <span
                            className={`font-medium ${
                              difference > 0
                                ? 'text-green-600'
                                : difference < 0
                                ? 'text-red-600'
                                : 'text-gray-600'
                            }`}
                          >
                            {difference > 0 ? '+' : ''}
                            {difference}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>Notes (Optional)</Label>
                      <Input
                        value={line.notes || ''}
                        onChange={(e) => updateLine(index, 'notes', e.target.value)}
                        placeholder="Optional notes"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Notes (Optional)</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes about this stock adjustment"
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Submit Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
        >
          {isSubmitting ? 'Creating...' : 'Create Adjustment'}
        </Button>
      </div>
    </form>
  );
}
