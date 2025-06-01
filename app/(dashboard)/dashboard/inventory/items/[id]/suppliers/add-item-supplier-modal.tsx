// 'use client';

// import { useState, useTransition } from 'react';
// import { Search, Plus, Check, X } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from '@/components/ui/dialog';
// import { Input } from '@/components/ui/input';
// import { Checkbox } from '@/components/ui/checkbox';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { Badge } from '@/components/ui/badge';
// import { addItemSuppliers, removeItemSuppliers } from '@/actions/item-suppliers';

// type Supplier = {
//   id: string;
//   name: string;
// };

// interface AddItemSupplierModalProps {
//   itemId: string;
//   suppliers: Supplier[];
//   existingSupplierIds?: string[];
// }

// export default function AddItemSupplierModal({
//   itemId,
//   suppliers,
//   existingSupplierIds = [],
// }: AddItemSupplierModalProps) {
//   const [open, setOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
//   const [suppliersToRemove, setSuppliersToRemove] = useState<string[]>([]);
//   const [isPending, startTransition] = useTransition();

//   // Filter suppliers based on search term (show all suppliers now)
//   const filteredSuppliers = suppliers.filter((supplier) =>
//     supplier.name.toLowerCase().includes(searchTerm.toLowerCase()),
//   );

//   const toggleSupplier = (supplierId: string) => {
//     const isExisting = existingSupplierIds.includes(supplierId);

//     if (isExisting) {
//       // Handle existing suppliers (for removal)
//       setSuppliersToRemove((prev) =>
//         prev.includes(supplierId) ? prev.filter((id) => id !== supplierId) : [...prev, supplierId],
//       );
//     } else {
//       // Handle new suppliers (for addition)
//       setSelectedSuppliers((prev) =>
//         prev.includes(supplierId) ? prev.filter((id) => id !== supplierId) : [...prev, supplierId],
//       );
//     }
//   };

//   const isSupplierSelected = (supplierId: string) => {
//     const isExisting = existingSupplierIds.includes(supplierId);
//     if (isExisting) {
//       return !suppliersToRemove.includes(supplierId); // Selected if not marked for removal
//     }
//     return selectedSuppliers.includes(supplierId);
//   };

//   const handleSubmit = () => {
//     const hasChanges = selectedSuppliers.length > 0 || suppliersToRemove.length > 0;
//     if (!hasChanges) return;

//     startTransition(async () => {
//       try {
//         // Remove suppliers first
//         if (suppliersToRemove.length > 0) {
//           await removeItemSuppliers(itemId, suppliersToRemove);
//         }

//         // Then add new suppliers
//         if (selectedSuppliers.length > 0) {
//           await addItemSuppliers(itemId, selectedSuppliers);
//         }

//         setOpen(false);
//         setSelectedSuppliers([]);
//         setSuppliersToRemove([]);
//         setSearchTerm('');
//       } catch (error) {
//         console.error('Failed to update suppliers:', error);
//       }
//     });
//   };

//   const handleOpenChange = (newOpen: boolean) => {
//     setOpen(newOpen);
//     if (!newOpen) {
//       setSelectedSuppliers([]);
//       setSuppliersToRemove([]);
//       setSearchTerm('');
//     }
//   };

//   const getActionText = () => {
//     const toAdd = selectedSuppliers.length;
//     const toRemove = suppliersToRemove.length;

//     if (isPending) return 'Updating...';

//     if (toAdd > 0 && toRemove > 0) {
//       return `Add ${toAdd} & Remove ${toRemove}`;
//     } else if (toAdd > 0) {
//       return `Add ${toAdd} Supplier${toAdd !== 1 ? 's' : ''}`;
//     } else if (toRemove > 0) {
//       return `Remove ${toRemove} Supplier${toRemove !== 1 ? 's' : ''}`;
//     }

//     return 'No Changes';
//   };

//   const hasChanges = selectedSuppliers.length > 0 || suppliersToRemove.length > 0;

//   return (
//     <Dialog open={open} onOpenChange={handleOpenChange}>
//       <DialogTrigger asChild>
//         <Button variant="outline" className="gap-2">
//           <Plus className="h-4 w-4" />
//           <span className="hidden sm:inline">Add Item Supplier</span>
//           <span className="sm:hidden">Add Supplier</span>
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="w-[95vw] max-w-2xl h-[90vh] max-h-[600px] flex flex-col">
//         <DialogHeader className="flex-shrink-0 px-4 sm:px-6 py-4 border-b">
//           <DialogTitle className="text-lg sm:text-xl">Add Suppliers</DialogTitle>
//           <DialogDescription className="text-sm">
//             Select suppliers to associate with this item. You can search and select multiple
//             suppliers.
//           </DialogDescription>
//         </DialogHeader>

//         <div className="flex-1 flex flex-col px-4 sm:px-6 py-4 space-y-4 overflow-hidden">
//           {/* Search Input */}
//           <div className="flex-shrink-0 relative">
//             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
//             <Input
//               placeholder="Search suppliers..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="pl-10"
//             />
//           </div>

//           {/* Status Badges */}
//           <div className="flex-shrink-0 flex flex-wrap gap-2">
//             {selectedSuppliers.length > 0 && (
//               <Badge variant="default" className="text-xs">
//                 +{selectedSuppliers.length} to add
//               </Badge>
//             )}
//             {suppliersToRemove.length > 0 && (
//               <Badge variant="destructive" className="text-xs">
//                 -{suppliersToRemove.length} to remove
//               </Badge>
//             )}
//           </div>

//           {/* Suppliers List - This will be scrollable */}
//           <div className="flex-1 border rounded-md overflow-hidden">
//             <ScrollArea className="h-full">
//               <div className="p-3 space-y-2">
//                 {filteredSuppliers.length === 0 ? (
//                   <div className="text-center text-muted-foreground py-8 text-sm">
//                     {searchTerm
//                       ? 'No suppliers found matching your search.'
//                       : 'No suppliers available.'}
//                   </div>
//                 ) : (
//                   filteredSuppliers.map((supplier) => {
//                     const isExisting = existingSupplierIds.includes(supplier.id);
//                     const isSelected = isSupplierSelected(supplier.id);
//                     const isMarkedForRemoval = suppliersToRemove.includes(supplier.id);
//                     const isMarkedForAddition = selectedSuppliers.includes(supplier.id);

//                     return (
//                       <div
//                         key={supplier.id}
//                         className={`flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors ${
//                           isMarkedForRemoval
//                             ? 'bg-red-50 border-red-200'
//                             : isMarkedForAddition
//                             ? 'bg-green-50 border-green-200'
//                             : ''
//                         }`}
//                       >
//                         <Checkbox
//                           id={supplier.id}
//                           checked={isSelected}
//                           onCheckedChange={() => toggleSupplier(supplier.id)}
//                           className="shrink-0"
//                         />
//                         <div className="flex-1 min-w-0">
//                           <label
//                             htmlFor={supplier.id}
//                             className="text-sm font-medium leading-none cursor-pointer block truncate"
//                           >
//                             {supplier.name}
//                           </label>
//                           <div className="flex flex-wrap gap-1 mt-1">
//                             {isExisting && (
//                               <Badge
//                                 variant={isMarkedForRemoval ? 'destructive' : 'secondary'}
//                                 className="text-xs"
//                               >
//                                 {isMarkedForRemoval ? 'Will be removed' : 'Already added'}
//                               </Badge>
//                             )}
//                             {isMarkedForAddition && (
//                               <Badge variant="default" className="text-xs">
//                                 Will be added
//                               </Badge>
//                             )}
//                           </div>
//                         </div>
//                         <div className="shrink-0">
//                           {isSelected && !isMarkedForRemoval && (
//                             <Check className="h-4 w-4 text-green-600" />
//                           )}
//                           {isMarkedForRemoval && <X className="h-4 w-4 text-red-600" />}
//                         </div>
//                       </div>
//                     );
//                   })
//                 )}
//               </div>
//             </ScrollArea>
//           </div>
//         </div>

//         <DialogFooter className="flex-shrink-0 px-4 sm:px-6 py-4 border-t bg-background">
//           <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
//             <Button
//               variant="outline"
//               onClick={() => handleOpenChange(false)}
//               className="w-full sm:w-auto"
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={handleSubmit}
//               disabled={!hasChanges || isPending}
//               className="w-full sm:w-auto"
//             >
//               {getActionText()}
//             </Button>
//           </div>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

'use client';

import { useState, useTransition } from 'react';
import { Search, Plus, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { addItemSuppliers, removeItemSuppliers } from '@/actions/item-suppliers';
import { toast } from 'sonner';

type Supplier = {
  id: string;
  name: string;
};

interface AddItemSupplierModalProps {
  itemId: string;
  suppliers: Supplier[];
  existingSupplierIds?: string[];
}

export default function AddItemSupplierModal({
  itemId,
  suppliers,
  existingSupplierIds = [],
}: AddItemSupplierModalProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSuppliers, setSelectedSuppliers] = useState<string[]>([]);
  const [suppliersToRemove, setSuppliersToRemove] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  // Filter suppliers based on search term (show all suppliers now)
  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const toggleSupplier = (supplierId: string) => {
    const isExisting = existingSupplierIds.includes(supplierId);

    if (isExisting) {
      // Handle existing suppliers (for removal)
      setSuppliersToRemove((prev) =>
        prev.includes(supplierId) ? prev.filter((id) => id !== supplierId) : [...prev, supplierId],
      );
    } else {
      // Handle new suppliers (for addition)
      setSelectedSuppliers((prev) =>
        prev.includes(supplierId) ? prev.filter((id) => id !== supplierId) : [...prev, supplierId],
      );
    }
  };

  const isSupplierSelected = (supplierId: string) => {
    const isExisting = existingSupplierIds.includes(supplierId);
    if (isExisting) {
      return !suppliersToRemove.includes(supplierId); // Selected if not marked for removal
    }
    return selectedSuppliers.includes(supplierId);
  };

  const handleSubmit = () => {
    const hasChanges = selectedSuppliers.length > 0 || suppliersToRemove.length > 0;
    if (!hasChanges) return;

    startTransition(async () => {
      try {
        let addedCount = 0;
        let removedCount = 0;

        // Remove suppliers first
        if (suppliersToRemove.length > 0) {
          const removeResult = await removeItemSuppliers(itemId, suppliersToRemove);
          removedCount = suppliersToRemove.length;
        }

        // Then add new suppliers
        if (selectedSuppliers.length > 0) {
          const addResult = await addItemSuppliers(itemId, selectedSuppliers);
          addedCount = selectedSuppliers.length;
        }

        // Show success toast with specific message
        let successMessage = '';
        if (addedCount > 0 && removedCount > 0) {
          successMessage = `Successfully added ${addedCount} and removed ${removedCount} supplier${
            addedCount + removedCount !== 1 ? 's' : ''
          }`;
        } else if (addedCount > 0) {
          successMessage = `Successfully added ${addedCount} supplier${
            addedCount !== 1 ? 's' : ''
          }`;
        } else if (removedCount > 0) {
          successMessage = `Successfully removed ${removedCount} supplier${
            removedCount !== 1 ? 's' : ''
          }`;
        }

        toast.success(successMessage);

        // Wait a bit for the toast to be visible, then close modal
        setTimeout(() => {
          setOpen(false);
          setSelectedSuppliers([]);
          setSuppliersToRemove([]);
          setSearchTerm('');
        }, 500);
        window.location.reload();
        // 500ms delay to show the toast
      } catch (error) {
        console.error('Failed to update suppliers:', error);
        toast.error('Failed to update suppliers. Please try again.');
      }
    });
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setSelectedSuppliers([]);
      setSuppliersToRemove([]);
      setSearchTerm('');
    }
  };

  const getActionText = () => {
    const toAdd = selectedSuppliers.length;
    const toRemove = suppliersToRemove.length;

    if (isPending) return 'Updating...';

    if (toAdd > 0 && toRemove > 0) {
      return `Add ${toAdd} & Remove ${toRemove}`;
    } else if (toAdd > 0) {
      return `Add ${toAdd} Supplier${toAdd !== 1 ? 's' : ''}`;
    } else if (toRemove > 0) {
      return `Remove ${toRemove} Supplier${toRemove !== 1 ? 's' : ''}`;
    }

    return 'No Changes';
  };

  const hasChanges = selectedSuppliers.length > 0 || suppliersToRemove.length > 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Add Item Supplier</span>
          <span className="sm:hidden">Add Supplier</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-2xl h-[90vh] max-h-[600px] flex flex-col">
        <DialogHeader className="flex-shrink-0 px-4 sm:px-6 py-4 border-b">
          <DialogTitle className="text-lg sm:text-xl">Add Suppliers</DialogTitle>
          <DialogDescription className="text-sm">
            Select suppliers to associate with this item. You can search and select multiple
            suppliers.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col px-4 sm:px-6 py-4 space-y-4 overflow-hidden">
          {/* Search Input */}
          <div className="flex-shrink-0 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Badges */}
          <div className="flex-shrink-0 flex flex-wrap gap-2">
            {selectedSuppliers.length > 0 && (
              <Badge variant="default" className="text-xs">
                +{selectedSuppliers.length} to add
              </Badge>
            )}
            {suppliersToRemove.length > 0 && (
              <Badge variant="destructive" className="text-xs">
                -{suppliersToRemove.length} to remove
              </Badge>
            )}
          </div>

          {/* Suppliers List - This will be scrollable */}
          <div className="flex-1 border rounded-md overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-3 space-y-2">
                {filteredSuppliers.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8 text-sm">
                    {searchTerm
                      ? 'No suppliers found matching your search.'
                      : 'No suppliers available.'}
                  </div>
                ) : (
                  filteredSuppliers.map((supplier) => {
                    const isExisting = existingSupplierIds.includes(supplier.id);
                    const isSelected = isSupplierSelected(supplier.id);
                    const isMarkedForRemoval = suppliersToRemove.includes(supplier.id);
                    const isMarkedForAddition = selectedSuppliers.includes(supplier.id);

                    return (
                      <div
                        key={supplier.id}
                        className={`flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors ${
                          isMarkedForRemoval
                            ? 'bg-red-50 border-red-200'
                            : isMarkedForAddition
                            ? 'bg-green-50 border-green-200'
                            : ''
                        }`}
                      >
                        <Checkbox
                          id={supplier.id}
                          checked={isSelected}
                          onCheckedChange={() => toggleSupplier(supplier.id)}
                          className="shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <label
                            htmlFor={supplier.id}
                            className="text-sm font-medium leading-none cursor-pointer block truncate"
                          >
                            {supplier.name}
                          </label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {isExisting && (
                              <Badge
                                variant={isMarkedForRemoval ? 'destructive' : 'secondary'}
                                className="text-xs"
                              >
                                {isMarkedForRemoval ? 'Will be removed' : 'Already added'}
                              </Badge>
                            )}
                            {isMarkedForAddition && (
                              <Badge variant="default" className="text-xs">
                                Will be added
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="shrink-0">
                          {isSelected && !isMarkedForRemoval && (
                            <Check className="h-4 w-4 text-green-600" />
                          )}
                          {isMarkedForRemoval && <X className="h-4 w-4 text-red-600" />}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0 px-4 sm:px-6 py-4 border-t bg-background">
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!hasChanges || isPending}
              className="w-full sm:w-auto"
            >
              {getActionText()}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
