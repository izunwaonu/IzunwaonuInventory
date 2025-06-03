// 'use client';

// import type React from 'react';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { Plus, Trash2, Package } from 'lucide-react';
// import { toast } from 'sonner';
// import { createTransfer } from '@/actions/transfers';

// interface Location {
//   id: string;
//   name: string;
//   address: string | null;
// }

// interface Item {
//   id: string;
//   name: string;
//   sku: string;
//   thumbnail: string | null;
//   inventories: Array<{
//     id: string;
//     quantity: number;
//     reservedQuantity: number;
//     locationId: string;
//     location: {
//       id: string;
//       name: string;
//     };
//   }>;
// }

// interface TransferLine {
//   id: string;
//   itemId: string;
//   quantity: number;
//   notes: string;
// }

// interface CreateTransferFormProps {
//   locations: Location[];
//   items: Item[];
// }

// export function CreateTransferForm({ locations, items }: CreateTransferFormProps) {
//   const router = useRouter();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [fromLocationId, setFromLocationId] = useState('');
//   const [toLocationId, setToLocationId] = useState('');
//   const [notes, setNotes] = useState('');
//   const [lines, setLines] = useState<TransferLine[]>([
//     { id: '1', itemId: '', quantity: 1, notes: '' },
//   ]);

//   const addLine = () => {
//     const newLine: TransferLine = {
//       id: Date.now().toString(),
//       itemId: '',
//       quantity: 1,
//       notes: '',
//     };
//     setLines([...lines, newLine]);
//   };

//   const removeLine = (id: string) => {
//     if (lines.length > 1) {
//       setLines(lines.filter((line) => line.id !== id));
//     }
//   };

//   const updateLine = (id: string, field: keyof TransferLine, value: string | number) => {
//     setLines(lines.map((line) => (line.id === id ? { ...line, [field]: value } : line)));
//   };

//   const getAvailableQuantity = (itemId: string, locationId: string) => {
//     const item = items.find((i) => i.id === itemId);
//     if (!item) return 0;

//     const inventory = item.inventories.find((inv) => inv.locationId === locationId);
//     if (!inventory) return 0;

//     return inventory.quantity - inventory.reservedQuantity;
//   };

//   const getItemsForLocation = (locationId: string) => {
//     if (!locationId) return [];
//     return items.filter((item) =>
//       item.inventories.some((inv) => inv.locationId === locationId && inv.quantity > 0),
//     );
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       // Validate form
//       if (!fromLocationId || !toLocationId) {
//         toast.error('Please select both from and to locations');
//         return;
//       }

//       if (fromLocationId === toLocationId) {
//         toast.error('From and To locations cannot be the same');
//         return;
//       }

//       const validLines = lines.filter((line) => line.itemId && line.quantity > 0);
//       if (validLines.length === 0) {
//         toast.error('Please add at least one item to transfer');
//         return;
//       }

//       // Validate quantities
//       for (const line of validLines) {
//         const availableQty = getAvailableQuantity(line.itemId, fromLocationId);
//         if (line.quantity > availableQty) {
//           const item = items.find((i) => i.id === line.itemId);
//           toast.error(
//             `Insufficient quantity for ${item?.name}. Available: ${availableQty}, Requested: ${line.quantity}`,
//           );
//           return;
//         }
//       }

//       const result = await createTransfer({
//         fromLocationId,
//         toLocationId,
//         notes: notes || undefined,
//         lines: validLines.map((line) => ({
//           itemId: line.itemId,
//           quantity: line.quantity,
//           notes: line.notes || undefined,
//         })),
//       });

//       if (result.success) {
//         toast.success('Transfer created successfully');
//         router.push(`/dashboard/transfers/${result.data?.id}`);
//       } else {
//         toast.error(result.error || 'Failed to create transfer');
//       }
//     } catch (error) {
//       toast.error('Failed to create transfer');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const availableItems = getItemsForLocation(fromLocationId);

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       {/* Location Selection */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Transfer Locations</CardTitle>
//         </CardHeader>
//         <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="space-y-2">
//             <Label htmlFor="fromLocation">From Location</Label>
//             <Select value={fromLocationId} onValueChange={setFromLocationId}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Select source location" />
//               </SelectTrigger>
//               <SelectContent>
//                 {locations.map((location) => (
//                   <SelectItem key={location.id} value={location.id}>
//                     {location.name}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="toLocation">To Location</Label>
//             <Select value={toLocationId} onValueChange={setToLocationId}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Select destination location" />
//               </SelectTrigger>
//               <SelectContent>
//                 {locations
//                   .filter((location) => location.id !== fromLocationId)
//                   .map((location) => (
//                     <SelectItem key={location.id} value={location.id}>
//                       {location.name}
//                     </SelectItem>
//                   ))}
//               </SelectContent>
//             </Select>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Transfer Items */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center justify-between">
//             Transfer Items
//             <Button type="button" onClick={addLine} variant="outline" size="sm">
//               <Plus className="h-4 w-4 mr-2" />
//               Add Item
//             </Button>
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {/* Header */}
//             <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-600">
//               <div className="col-span-4">Item</div>
//               <div className="col-span-2">Available</div>
//               <div className="col-span-2">Quantity</div>
//               <div className="col-span-3">Notes</div>
//               <div className="col-span-1">Actions</div>
//             </div>

//             {/* Lines */}
//             {lines.map((line) => {
//               const selectedItem = items.find((item) => item.id === line.itemId);
//               const availableQty = line.itemId
//                 ? getAvailableQuantity(line.itemId, fromLocationId)
//                 : 0;

//               return (
//                 <div key={line.id} className="grid grid-cols-12 gap-4 items-center">
//                   <div className="col-span-4">
//                     <Select
//                       value={line.itemId}
//                       onValueChange={(value) => updateLine(line.id, 'itemId', value)}
//                     >
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select item" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {availableItems.map((item) => (
//                           <SelectItem key={item.id} value={item.id}>
//                             <div className="flex items-center gap-2">
//                               {item.thumbnail ? (
//                                 <img
//                                   src={item.thumbnail || '/placeholder.svg'}
//                                   alt={item.name}
//                                   className="w-6 h-6 object-cover rounded"
//                                 />
//                               ) : (
//                                 <Package className="h-4 w-4 text-gray-400" />
//                               )}
//                               <div>
//                                 <div className="font-medium">{item.name}</div>
//                                 {item.sku && (
//                                   <div className="text-xs text-gray-500">SKU: {item.sku}</div>
//                                 )}
//                               </div>
//                             </div>
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="col-span-2">
//                     <div className="text-sm text-gray-600">{line.itemId ? availableQty : '-'}</div>
//                   </div>

//                   <div className="col-span-2">
//                     <Input
//                       type="number"
//                       min="1"
//                       max={availableQty}
//                       value={line.quantity}
//                       onChange={(e) =>
//                         updateLine(line.id, 'quantity', Number.parseInt(e.target.value) || 1)
//                       }
//                       disabled={!line.itemId}
//                     />
//                   </div>

//                   <div className="col-span-3">
//                     <Input
//                       placeholder="Optional notes"
//                       value={line.notes}
//                       onChange={(e) => updateLine(line.id, 'notes', e.target.value)}
//                     />
//                   </div>

//                   <div className="col-span-1">
//                     <Button
//                       type="button"
//                       variant="outline"
//                       size="sm"
//                       onClick={() => removeLine(line.id)}
//                       disabled={lines.length === 1}
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Notes */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Notes (Optional)</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Textarea
//             placeholder="Add any notes about this batch transfer"
//             value={notes}
//             onChange={(e) => setNotes(e.target.value)}
//             rows={3}
//           />
//         </CardContent>
//       </Card>

//       {/* Actions */}
//       <div className="flex justify-end gap-4">
//         <Button type="button" variant="outline" onClick={() => router.push('/dashboard/transfers')}>
//           Cancel
//         </Button>
//         <Button type="submit" disabled={isSubmitting}>
//           {isSubmitting ? 'Creating...' : 'Create Transfer'}
//         </Button>
//       </div>
//     </form>
//   );
// }

'use client';

import type React from 'react';

import { useState } from 'react';
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
import { createTransfer } from '@/actions/transfers';
import { toast } from 'sonner';

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

interface TransferLine {
  itemId: string;
  quantity: number;
  notes?: string;
}

interface CreateTransferFormProps {
  locations: Location[];
  items: Item[];
}

export function CreateTransferForm({ locations, items }: CreateTransferFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fromLocationId, setFromLocationId] = useState('');
  const [toLocationId, setToLocationId] = useState('');
  const [notes, setNotes] = useState('');
  const [lines, setLines] = useState<TransferLine[]>([{ itemId: '', quantity: 1, notes: '' }]);

  const getAvailableItems = () => {
    if (!fromLocationId) return [];
    return items.filter((item) =>
      item.inventories.some(
        (inv) => inv.locationId === fromLocationId && inv.quantity - inv.reservedQuantity > 0,
      ),
    );
  };

  const getItemInventory = (itemId: string) => {
    if (!fromLocationId || !itemId) return null;
    const item = items.find((i) => i.id === itemId);
    if (!item) return null;
    return item.inventories.find((inv) => inv.locationId === fromLocationId);
  };

  const addLine = () => {
    setLines([...lines, { itemId: '', quantity: 1, notes: '' }]);
  };

  const removeLine = (index: number) => {
    if (lines.length > 1) {
      setLines(lines.filter((_, i) => i !== index));
    }
  };

  const updateLine = (index: number, field: keyof TransferLine, value: any) => {
    const updatedLines = [...lines];
    updatedLines[index] = { ...updatedLines[index], [field]: value };
    setLines(updatedLines);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fromLocationId || !toLocationId) {
      toast.error('Please select both from and to locations');
      return;
    }

    if (fromLocationId === toLocationId) {
      toast.error('From and To locations cannot be the same');
      return;
    }

    const validLines = lines.filter((line) => line.itemId && line.quantity > 0);
    if (validLines.length === 0) {
      toast.error('Please add at least one item to transfer');
      return;
    }

    // Validate inventory availability
    for (const line of validLines) {
      const inventory = getItemInventory(line.itemId);
      if (!inventory || inventory.quantity - inventory.reservedQuantity < line.quantity) {
        const item = items.find((i) => i.id === line.itemId);
        toast.error(`Insufficient inventory for ${item?.name || 'item'}`);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const result = await createTransfer({
        fromLocationId,
        toLocationId,
        notes: notes.trim() || undefined,
        lines: validLines,
      });

      if (result.success) {
        toast.success('Transfer created successfully');
        router.push(`/dashboard/inventory/transfers/${result.data?.id}`);
      } else {
        toast.error(result.error || 'Failed to create transfer');
      }
    } catch (error) {
      toast.error('Failed to create transfer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableItems = getAvailableItems();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Location Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>From Location</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={fromLocationId} onValueChange={setFromLocationId}>
              <SelectTrigger>
                <SelectValue placeholder="Select source location" />
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
            <CardTitle>To Location</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={toLocationId} onValueChange={setToLocationId}>
              <SelectTrigger>
                <SelectValue placeholder="Select destination location" />
              </SelectTrigger>
              <SelectContent>
                {locations
                  .filter((loc) => loc.id !== fromLocationId)
                  .map((location) => (
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
      </div>

      {/* Transfer Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Transfer Items
            <Button type="button" onClick={addLine} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {lines.map((line, index) => {
              const inventory = getItemInventory(line.itemId);
              const maxQuantity = inventory ? inventory.quantity - inventory.reservedQuantity : 0;

              return (
                <div key={index} className="grid grid-cols-12 gap-4 items-end">
                  {/* Item Selection */}
                  <div className="col-span-4">
                    <Label>Item</Label>
                    <Select
                      value={line.itemId}
                      onValueChange={(value) => updateLine(index, 'itemId', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select item" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableItems.map((item) => {
                          const itemInventory = item.inventories.find(
                            (inv) => inv.locationId === fromLocationId,
                          );
                          const available = itemInventory
                            ? itemInventory.quantity - itemInventory.reservedQuantity
                            : 0;

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
                                    {item.sku} • Available: {available}
                                  </p>
                                </div>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Quantity */}
                  <div className="col-span-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      min="1"
                      max={maxQuantity}
                      value={line.quantity}
                      onChange={(e) =>
                        updateLine(index, 'quantity', Number.parseInt(e.target.value) || 1)
                      }
                      disabled={!line.itemId}
                    />
                    {line.itemId && (
                      <p className="text-xs text-gray-500 mt-1">Max: {maxQuantity}</p>
                    )}
                  </div>

                  {/* Notes */}
                  <div className="col-span-5">
                    <Label>Notes (Optional)</Label>
                    <Input
                      value={line.notes || ''}
                      onChange={(e) => updateLine(index, 'notes', e.target.value)}
                      placeholder="Add notes for this item"
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
            placeholder="Add any notes about this batch transfer"
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Submit Buttons */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Transfer'}
        </Button>
      </div>
    </form>
  );
}
