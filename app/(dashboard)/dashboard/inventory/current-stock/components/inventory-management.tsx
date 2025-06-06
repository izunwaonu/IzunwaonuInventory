// 'use client';

// import { useState, useEffect } from 'react';
// import { Search, Package, MapPin, TrendingUp, AlertTriangle, Eye, BarChart3 } from 'lucide-react';
// import { Input } from '@/components/ui/input';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { getInventoryItems, getItemDetails } from '@/actions/inventory';
// import { cn } from '@/lib/utils';
// import { ItemCardSkeleton } from '../inventory-skeleton';

// // Simple types that match our return data
// type InventoryItem = {
//   id: string;
//   name: string;
//   sku: string;
//   barcode: string | null;
//   thumbnail: string | null;
//   totalStock: number;
//   totalReserved: number;
//   available: number;
//   minStockLevel: number;
//   maxStockLevel: number | null;
//   sellingPrice: number;
//   costPrice: number;
//   salesCount: number;
//   salesTotal: number;
//   category: any;
//   brand: any;
//   unit: any;
//   inventories: Array<{
//     id: string;
//     quantity: number;
//     reservedQuantity: number;
//     location: {
//       id: string;
//       name: string;
//       type: string;
//     };
//   }>;
// };

// type ItemDetails = {
//   id: string;
//   name: string;
//   sku: string;
//   barcode: string | null;
//   description: string | null;
//   thumbnail: string | null;
//   totalStock: number;
//   totalReserved: number;
//   available: number;
//   minStockLevel: number;
//   maxStockLevel: number | null;
//   sellingPrice: number;
//   costPrice: number;
//   salesCount: number;
//   salesTotal: number;
//   isSerialTracked: boolean;
//   category: any;
//   brand: any;
//   unit: any;
//   inventories: Array<{
//     id: string;
//     quantity: number;
//     reservedQuantity: number;
//     location: {
//       id: string;
//       name: string;
//       type: string;
//       address: string | null;
//     };
//   }>;
// };

// export function InventoryManagement() {
//   const [items, setItems] = useState<InventoryItem[]>([]);
//   const [selectedItem, setSelectedItem] = useState<ItemDetails | null>(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [detailsLoading, setDetailsLoading] = useState(false);

//   // Load initial items
//   useEffect(() => {
//     loadItems();
//   }, []);

//   // Load items with search
//   useEffect(() => {
//     const timeoutId = setTimeout(() => {
//       loadItems(searchQuery);
//     }, 300);

//     return () => clearTimeout(timeoutId);
//   }, [searchQuery]);

//   const loadItems = async (search?: string) => {
//     setLoading(true);
//     try {
//       const data = await getInventoryItems(search);
//       setItems(data);

//       // If no item is selected or the selected item is not in the new results, select the first item
//       if (!selectedItem || !data.find((item) => item.id === selectedItem.id)) {
//         if (data.length > 0) {
//           await loadItemDetails(data[0].id);
//         } else {
//           setSelectedItem(null);
//         }
//       }
//     } catch (error) {
//       console.error('Error loading items:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadItemDetails = async (itemId: string) => {
//     setDetailsLoading(true);
//     try {
//       const details = await getItemDetails(itemId);
//       setSelectedItem(details);
//     } catch (error) {
//       console.error('Error loading item details:', error);
//     } finally {
//       setDetailsLoading(false);
//     }
//   };

//   const getStockStatus = (item: InventoryItem) => {
//     if (item.totalStock <= 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' };
//     if (item.totalStock <= item.minStockLevel)
//       return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
//     return { label: 'In Stock', color: 'bg-green-100 text-green-800' };
//   };

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
//       {/* Left Column - Items List */}
//       <div className="lg:col-span-1 space-y-4">
//         {/* Search */}
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//           <Input
//             placeholder="Search items by name or SKU"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="pl-10"
//           />
//         </div>

//         {/* Items List */}
//         {/* <Card className="flex-1">
//           <CardHeader className="pb-3">
//             <CardTitle className="text-lg">Items ({loading ? '...' : items.length})</CardTitle>
//           </CardHeader>
//           <CardContent className="p-0">
//             <ScrollArea className="h-[calc(100vh-320px)]">
//               <div className="space-y-1 p-4 pt-0">
//                 {loading ? (
//                   Array.from({ length: 6 }).map((_, i) => <ItemCardSkeleton key={i} />)
//                 ) : items.length === 0 ? (
//                   <div className="text-center py-8 text-gray-500">
//                     <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
//                     <p>No items found</p>
//                   </div>
//                 ) : (
//                   items.map((item) => {
//                     const status = getStockStatus(item);
//                     const isSelected = selectedItem?.id === item.id;

//                     return (
//                       <div
//                         key={item.id}
//                         onClick={() => loadItemDetails(item.id)}
//                         className={cn(
//                           'p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm',
//                           isSelected
//                             ? 'border-blue-500 bg-blue-50'
//                             : 'border-gray-200 hover:border-gray-300',
//                         )}
//                       >
//                         <div className="flex items-center gap-3">
//                           <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
//                             {item.thumbnail ? (
//                               <img
//                                 src={item.thumbnail || '/placeholder.svg?height=40&width=40'}
//                                 alt={item.name}
//                                 className="w-8 h-8 object-cover rounded"
//                               />
//                             ) : (
//                               <Package className="h-5 w-5 text-gray-400" />
//                             )}
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <div className="flex items-center justify-between">
//                               <h3 className="font-medium text-sm truncate">{item.name}</h3>
//                               <span className="text-lg font-bold text-gray-900 ml-2">
//                                 {item.totalStock}
//                               </span>
//                             </div>
//                             <div className="flex items-center justify-between mt-1">
//                               <p className="text-xs text-gray-500">{item.sku}</p>
//                               <Badge className={cn('text-xs', status.color)}>{status.label}</Badge>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })
//                 )}
//               </div>
//             </ScrollArea>
//           </CardContent>
//         </Card> */}
//         <Card className="flex-1 w-full">
//           <CardHeader className="pb-3">
//             <CardTitle className="text-lg">Items ({loading ? '...' : items.length})</CardTitle>
//           </CardHeader>

//           <CardContent className="p-0">
//             <ScrollArea className="max-h-[70vh] md:max-h-[calc(100vh-320px)] overflow-y-auto">
//               <div className="space-y-1 p-4 pt-0">
//                 {loading ? (
//                   Array.from({ length: 6 }).map((_, i) => <ItemCardSkeleton key={i} />)
//                 ) : items.length === 0 ? (
//                   <div className="text-center py-8 text-gray-500">
//                     <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
//                     <p>No items found</p>
//                   </div>
//                 ) : (
//                   items.map((item) => {
//                     const status = getStockStatus(item);
//                     const isSelected = selectedItem?.id === item.id;

//                     return (
//                       <div
//                         key={item.id}
//                         onClick={() => loadItemDetails(item.id)}
//                         className={cn(
//                           'p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm',
//                           isSelected
//                             ? 'border-blue-500 bg-blue-50'
//                             : 'border-gray-200 hover:border-gray-300',
//                         )}
//                       >
//                         <div className="flex items-center gap-3">
//                           <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
//                             {item.thumbnail ? (
//                               <img
//                                 src={item.thumbnail || '/placeholder.svg?height=40&width=40'}
//                                 alt={item.name}
//                                 className="w-8 h-8 object-cover rounded"
//                               />
//                             ) : (
//                               <Package className="h-5 w-5 text-gray-400" />
//                             )}
//                           </div>
//                           <div className="flex-1 min-w-0">
//                             <div className="flex items-center justify-between">
//                               <h3 className="font-medium text-sm truncate">{item.name}</h3>
//                               <span className="text-lg font-bold text-gray-900 ml-2">
//                                 {item.totalStock}
//                               </span>
//                             </div>
//                             <div className="flex items-center justify-between mt-1">
//                               <p className="text-xs text-gray-500 truncate">{item.sku}</p>
//                               <Badge className={cn('text-xs', status.color)}>{status.label}</Badge>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     );
//                   })
//                 )}
//               </div>
//             </ScrollArea>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Right Column - Item Details */}
//       <div className="lg:col-span-2 space-y-6">
//         {detailsLoading ? (
//           // Skeleton for item details while loading
//           <>
//             <Card>
//               <CardContent className="p-6">
//                 <div className="flex items-start justify-between">
//                   <div className="flex items-center gap-4">
//                     <div className="w-16 h-16 bg-gray-100 rounded-lg animate-pulse" />
//                     <div className="space-y-2">
//                       <div className="h-8 w-48 bg-gray-100 rounded animate-pulse" />
//                       <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               {Array.from({ length: 4 }).map((_, i) => (
//                 <Card key={i}>
//                   <CardContent className="p-4">
//                     <div className="space-y-2">
//                       <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
//                       <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
//                       <div className="h-8 w-16 bg-gray-100 rounded animate-pulse" />
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </>
//         ) : selectedItem ? (
//           <>
//             {/* Item Header */}
//             {/* <Card>
//               <CardContent className="p-6">
//                 <div className="flex items-start justify-between">
//                   <div className="flex items-center gap-4">
//                     <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
//                       {selectedItem.thumbnail ? (
//                         <img
//                           src={selectedItem.thumbnail || '/placeholder.svg?height=64&width=64'}
//                           alt={selectedItem.name}
//                           className="w-14 h-14 object-cover rounded-lg"
//                         />
//                       ) : (
//                         <Package className="h-8 w-8 text-gray-400" />
//                       )}
//                     </div>

//                     <div>
//                       <h1 className="text-2xl font-bold">{selectedItem.name}</h1>
//                       <p className="text-gray-600">SKU: {selectedItem.sku}</p>

//                       {selectedItem.category && (
//                         <Badge variant="outline" className="mt-1">
//                           {selectedItem.category.name}
//                         </Badge>
//                       )}

//                       <p className="mt-2 text-sm text-gray-800">
//                         Total in stock:{' '}
//                         <span className="font-semibold">{selectedItem.totalStock}</span>
//                       </p>

//                       <p
//                         className={`mt-1 text-sm font-medium ${
//                           selectedItem.available > 0 ? 'text-green-600' : 'text-red-600'
//                         }`}
//                       >
//                         {selectedItem.available > 0 ? 'In Stock' : 'Out of Stock'}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex gap-2">
//                     <Button variant="outline" size="sm">
//                       <Eye className="h-4 w-4 mr-2" />
//                       View Details
//                     </Button>
//                     <Button size="sm">
//                       <TrendingUp className="h-4 w-4 mr-2" />
//                       Transfer Stock
//                     </Button>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card> */}
//             <Card>
//               <CardContent className="p-4 sm:p-6">
//                 <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
//                   {/* Left side: Thumbnail + Info */}
//                   <div className="flex flex-col sm:flex-row items-start gap-4 flex-1">
//                     {/* Thumbnail */}
//                     <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
//                       {selectedItem.thumbnail ? (
//                         <img
//                           src={selectedItem.thumbnail || '/placeholder.svg?height=64&width=64'}
//                           alt={selectedItem.name}
//                           className="w-14 h-14 object-cover rounded-lg"
//                         />
//                       ) : (
//                         <Package className="h-8 w-8 text-gray-400" />
//                       )}
//                     </div>

//                     {/* Item Info */}
//                     <div>
//                       <h1 className="text-xl sm:text-2xl font-bold">{selectedItem.name}</h1>
//                       <p className="text-gray-600 text-sm sm:text-base">SKU: {selectedItem.sku}</p>

//                       {selectedItem.category && (
//                         <Badge variant="outline" className="mt-1">
//                           {selectedItem.category.name}
//                         </Badge>
//                       )}

//                       <p className="mt-2 text-sm text-gray-800">
//                         Total in stock:{' '}
//                         <span className="font-semibold">{selectedItem.totalStock}</span>
//                       </p>

//                       <p
//                         className={`mt-1 text-sm font-medium ${
//                           selectedItem.available > 0 ? 'text-green-600' : 'text-red-600'
//                         }`}
//                       >
//                         {selectedItem.available > 0 ? 'In Stock' : 'Out of Stock'}
//                       </p>
//                     </div>
//                   </div>

//                   {/* Right side: Action Buttons */}
//                   <div className="flex flex-col sm:flex-row gap-2 sm:items-start">
//                     <Button variant="outline" size="sm" className="w-full sm:w-auto">
//                       <Eye className="h-4 w-4 mr-2" />
//                       View Details
//                     </Button>
//                     <Button size="sm" className="w-full sm:w-auto">
//                       <TrendingUp className="h-4 w-4 mr-2" />
//                       Transfer Stock
//                     </Button>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Stock Summary Cards */}
//             {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//               <Card>
//                 <CardContent className="p-4">
//                   <div className="space-y-2">
//                     <p className="text-sm text-gray-600">Total Stock</p>
//                     <p className="text-sm text-gray-500">Across all locations</p>
//                     <p className="text-3xl font-bold">{selectedItem.totalStock}</p>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardContent className="p-4">
//                   <div className="space-y-2">
//                     <p className="text-sm text-gray-600">Available</p>
//                     <p className="text-sm text-gray-500">Not reserved</p>
//                     <p className="text-3xl font-bold text-green-600">{selectedItem.available}</p>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardContent className="p-4">
//                   <div className="space-y-2">
//                     <p className="text-sm text-gray-600">Reserved</p>
//                     <p className="text-sm text-gray-500">For orders</p>
//                     <p className="text-3xl font-bold text-orange-600">
//                       {selectedItem.totalReserved}
//                     </p>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardContent className="p-4">
//                   <div className="space-y-2">
//                     <p className="text-sm text-gray-600">Sales Count</p>
//                     <p className="text-sm text-gray-500">Total sold</p>
//                     <p className="text-3xl font-bold text-blue-600">{selectedItem.salesCount}</p>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div> */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//               <Card>
//                 <CardContent className="p-4">
//                   <div className="space-y-2">
//                     <p className="text-sm text-gray-600">Total Stock</p>
//                     <p className="text-sm text-gray-500">Across all locations</p>
//                     <p className="text-3xl font-bold">{selectedItem.totalStock}</p>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardContent className="p-4">
//                   <div className="space-y-2">
//                     <p className="text-sm text-gray-600">Available</p>
//                     <p className="text-sm text-gray-500">Not reserved</p>
//                     <p className="text-3xl font-bold text-green-600">{selectedItem.available}</p>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardContent className="p-4">
//                   <div className="space-y-2">
//                     <p className="text-sm text-gray-600">Reserved</p>
//                     <p className="text-sm text-gray-500">For orders</p>
//                     <p className="text-3xl font-bold text-orange-600">
//                       {selectedItem.totalReserved}
//                     </p>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card>
//                 <CardContent className="p-4">
//                   <div className="space-y-2">
//                     <p className="text-sm text-gray-600">Sales Count</p>
//                     <p className="text-sm text-gray-500">Total sold</p>
//                     <p className="text-3xl font-bold text-blue-600">{selectedItem.salesCount}</p>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             {/* Stock by Location */}
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2">
//                   <MapPin className="h-5 w-5" />
//                   Stock by Location
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {selectedItem.inventories.length === 0 ? (
//                     <div className="text-center py-8 text-gray-500">
//                       <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
//                       <p>No inventory found at any location</p>
//                     </div>
//                   ) : (
//                     selectedItem.inventories.map((inventory) => (
//                       <div
//                         key={inventory.id}
//                         className="flex items-center justify-between p-4 border rounded-lg"
//                       >
//                         <div>
//                           <h3 className="font-medium">{inventory.location.name}</h3>
//                           <p className="text-sm text-gray-500">
//                             {inventory.reservedQuantity} reserved
//                           </p>
//                         </div>
//                         <div className="text-right">
//                           <p className="text-2xl font-bold">{inventory.quantity}</p>
//                           <p className="text-sm text-gray-500">
//                             {inventory.quantity - inventory.reservedQuantity} available
//                           </p>
//                         </div>
//                       </div>
//                     ))
//                   )}
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Item Information */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* Product Details */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Product Details</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="grid grid-cols-2 gap-4 text-sm">
//                     <div>
//                       <p className="text-gray-600">Cost Price</p>
//                       <p className="font-medium">${selectedItem.costPrice.toFixed(2)}</p>
//                     </div>
//                     <div>
//                       <p className="text-gray-600">Selling Price</p>
//                       <p className="font-medium">${selectedItem.sellingPrice.toFixed(2)}</p>
//                     </div>
//                     <div>
//                       <p className="text-gray-600">Min Stock Level</p>
//                       <p className="font-medium">{selectedItem.minStockLevel}</p>
//                     </div>
//                     <div>
//                       <p className="text-gray-600">Max Stock Level</p>
//                       <p className="font-medium">{selectedItem.maxStockLevel || 'Not set'}</p>
//                     </div>
//                     {selectedItem.brand && (
//                       <div>
//                         <p className="text-gray-600">Brand</p>
//                         <p className="font-medium">{selectedItem.brand.name}</p>
//                       </div>
//                     )}
//                     {selectedItem.unit && (
//                       <div>
//                         <p className="text-gray-600">Unit</p>
//                         <p className="font-medium">{selectedItem.unit.name}</p>
//                       </div>
//                     )}
//                   </div>
//                   {selectedItem.description && (
//                     <div>
//                       <p className="text-gray-600 text-sm">Description</p>
//                       <p className="text-sm">{selectedItem.description}</p>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>

//               {/* Sales Performance */}
//               <Card>
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2">
//                     <BarChart3 className="h-5 w-5" />
//                     Sales Performance
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   <div className="grid grid-cols-2 gap-4 text-sm">
//                     <div>
//                       <p className="text-gray-600">Total Sales</p>
//                       <p className="font-medium">${selectedItem.salesTotal.toFixed(2)}</p>
//                     </div>
//                     <div>
//                       <p className="text-gray-600">Units Sold</p>
//                       <p className="font-medium">{selectedItem.salesCount}</p>
//                     </div>
//                     <div>
//                       <p className="text-gray-600">Avg Sale Price</p>
//                       <p className="font-medium">
//                         $
//                         {selectedItem.salesCount > 0
//                           ? (selectedItem.salesTotal / selectedItem.salesCount).toFixed(2)
//                           : '0.00'}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-gray-600">Serial Tracked</p>
//                       <p className="font-medium">{selectedItem.isSerialTracked ? 'Yes' : 'No'}</p>
//                     </div>
//                   </div>

//                   {/* Stock Level Warning */}
//                   {selectedItem.totalStock <= selectedItem.minStockLevel && (
//                     <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
//                       <AlertTriangle className="h-4 w-4 text-yellow-600" />
//                       <p className="text-sm text-yellow-800">
//                         Stock level is below minimum threshold ({selectedItem.minStockLevel})
//                       </p>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             </div>
//           </>
//         ) : (
//           <Card className="h-full flex items-center justify-center">
//             <CardContent className="text-center">
//               <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
//               <h3 className="text-lg font-medium text-gray-900 mb-2">No Item Selected</h3>
//               <p className="text-gray-500">Select an item from the list to view its details</p>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </div>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Package,
  MapPin,
  TrendingUp,
  AlertTriangle,
  Eye,
  BarChart3,
  Filter,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getInventoryItems, getItemDetails } from '@/actions/inventory';
import { cn } from '@/lib/utils';
import { ItemCardSkeleton } from '../inventory-skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

// Simple types that match our return data
type InventoryItem = {
  id: string;
  name: string;
  sku: string;
  barcode: string | null;
  thumbnail: string | null;
  totalStock: number;
  totalReserved: number;
  available: number;
  minStockLevel: number;
  maxStockLevel: number | null;
  sellingPrice: number;
  costPrice: number;
  salesCount: number;
  salesTotal: number;
  category: any;
  brand: any;
  unit: any;
  inventories: Array<{
    id: string;
    quantity: number;
    reservedQuantity: number;
    location: {
      id: string;
      name: string;
      type: string;
    };
  }>;
};

type ItemDetails = {
  id: string;
  name: string;
  sku: string;
  barcode: string | null;
  description: string | null;
  thumbnail: string | null;
  totalStock: number;
  totalReserved: number;
  available: number;
  minStockLevel: number;
  maxStockLevel: number | null;
  sellingPrice: number;
  costPrice: number;
  salesCount: number;
  salesTotal: number;
  isSerialTracked: boolean;
  category: any;
  brand: any;
  unit: any;
  inventories: Array<{
    id: string;
    quantity: number;
    reservedQuantity: number;
    location: {
      id: string;
      name: string;
      type: string;
      address: string | null;
    };
  }>;
};

export function InventoryManagement() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<ItemDetails | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Load initial items
  useEffect(() => {
    loadItems();
  }, []);

  // Load items with search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadItems(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const loadItems = async (search?: string) => {
    setLoading(true);
    try {
      const data = await getInventoryItems(search);
      setItems(data);

      // If no item is selected or the selected item is not in the new results, select the first item
      if (!selectedItem || !data.find((item) => item.id === selectedItem.id)) {
        if (data.length > 0) {
          await loadItemDetails(data[0].id);
        } else {
          setSelectedItem(null);
        }
      }
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadItemDetails = async (itemId: string) => {
    setDetailsLoading(true);
    try {
      const details = await getItemDetails(itemId);
      setSelectedItem(details);
      // Close the sheet on mobile when an item is selected
      setIsSheetOpen(false);
    } catch (error) {
      console.error('Error loading item details:', error);
    } finally {
      setDetailsLoading(false);
    }
  };

  const getStockStatus = (item: InventoryItem) => {
    if (item.totalStock <= 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (item.totalStock <= item.minStockLevel)
      return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'In Stock', color: 'bg-green-100 text-green-800' };
  };

  const filteredItems = items.filter((item) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'low' && item.totalStock <= item.minStockLevel) return true;
    if (activeTab === 'out' && item.totalStock <= 0) return true;
    return false;
  });

  // Mobile view - render items list in a sheet
  const ItemsList = () => (
    <div className="space-y-4 w-full">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search items by name or SKU"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Tabs
          defaultValue="all"
          className="w-full sm:w-auto"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="low">Low Stock</TabsTrigger>
            <TabsTrigger value="out">Out of Stock</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Items List */}
      <Card className="flex-1 w-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">
            Items ({loading ? '...' : filteredItems.length})
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <ScrollArea className="h-[60vh] md:h-[calc(100vh-320px)]">
            <div className="space-y-1 p-4 pt-0">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => <ItemCardSkeleton key={i} />)
              ) : filteredItems.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No items found</p>
                </div>
              ) : (
                filteredItems.map((item) => {
                  const status = getStockStatus(item);
                  const isSelected = selectedItem?.id === item.id;

                  return (
                    <div
                      key={item.id}
                      onClick={() => loadItemDetails(item.id)}
                      className={cn(
                        'p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm',
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300',
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          {item.thumbnail ? (
                            <img
                              src={item.thumbnail || '/placeholder.svg?height=40&width=40'}
                              alt={item.name}
                              className="w-8 h-8 object-cover rounded"
                            />
                          ) : (
                            <Package className="h-5 w-5 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-sm truncate">{item.name}</h3>
                            <span className="text-lg font-bold text-gray-900 ml-2">
                              {item.totalStock}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-xs text-gray-500 truncate">{item.sku}</p>
                            <Badge className={cn('text-xs', status.color)}>{status.label}</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );

  // Item details section
  const ItemDetails = () => (
    <>
      {detailsLoading ? (
        // Skeleton for item details while loading
        <>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-8 w-48 bg-gray-100 rounded animate-pulse" />
                    <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
                    <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
                    <div className="h-8 w-16 bg-gray-100 rounded animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : selectedItem ? (
        <>
          {/* Item Header */}
          <Card>
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                {/* Left side: Thumbnail + Info */}
                <div className="flex flex-col sm:flex-row items-start gap-4 flex-1">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    {selectedItem.thumbnail ? (
                      <img
                        src={selectedItem.thumbnail || '/placeholder.svg?height=64&width=64'}
                        alt={selectedItem.name}
                        className="w-14 h-14 object-cover rounded-lg"
                      />
                    ) : (
                      <Package className="h-8 w-8 text-gray-400" />
                    )}
                  </div>

                  {/* Item Info */}
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold">{selectedItem.name}</h1>
                    <p className="text-gray-600 text-sm sm:text-base">SKU: {selectedItem.sku}</p>

                    {selectedItem.category && (
                      <Badge variant="outline" className="mt-1">
                        {selectedItem.category.name}
                      </Badge>
                    )}

                    <p className="mt-2 text-sm text-gray-800">
                      Total in stock:{' '}
                      <span className="font-semibold">{selectedItem.totalStock}</span>
                    </p>

                    <p
                      className={`mt-1 text-sm font-medium ${
                        selectedItem.available > 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {selectedItem.available > 0 ? 'In Stock' : 'Out of Stock'}
                    </p>
                  </div>
                </div>

                {/* Right side: Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 sm:items-start">
                  <Button variant="outline" size="sm" className="w-full sm:w-auto">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button size="sm" className="w-full sm:w-auto">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Transfer Stock
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stock Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Total Stock</p>
                  <p className="text-sm text-gray-500">Across all locations</p>
                  <p className="text-3xl font-bold">{selectedItem.totalStock}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Available</p>
                  <p className="text-sm text-gray-500">Not reserved</p>
                  <p className="text-3xl font-bold text-green-600">{selectedItem.available}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Reserved</p>
                  <p className="text-sm text-gray-500">For orders</p>
                  <p className="text-3xl font-bold text-orange-600">{selectedItem.totalReserved}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Sales Count</p>
                  <p className="text-sm text-gray-500">Total sold</p>
                  <p className="text-3xl font-bold text-blue-600">{selectedItem.salesCount}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stock by Location */}
          <Card>
            <CardHeader className="sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Stock by Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedItem.inventories.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No inventory found at any location</p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {selectedItem.inventories.map((inventory) => (
                      <div
                        key={inventory.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <h3 className="font-medium">{inventory.location.name}</h3>
                          <p className="text-sm text-gray-500">
                            {inventory.reservedQuantity} reserved
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">{inventory.quantity}</p>
                          <p className="text-sm text-gray-500">
                            {inventory.quantity - inventory.reservedQuantity} available
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Item Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Details */}
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Cost Price</p>
                    <p className="font-medium">${selectedItem.costPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Selling Price</p>
                    <p className="font-medium">${selectedItem.sellingPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Min Stock Level</p>
                    <p className="font-medium">{selectedItem.minStockLevel}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Max Stock Level</p>
                    <p className="font-medium">{selectedItem.maxStockLevel || 'Not set'}</p>
                  </div>
                  {selectedItem.brand && (
                    <div>
                      <p className="text-gray-600">Brand</p>
                      <p className="font-medium">{selectedItem.brand.name}</p>
                    </div>
                  )}
                  {selectedItem.unit && (
                    <div>
                      <p className="text-gray-600">Unit</p>
                      <p className="font-medium">{selectedItem.unit.name}</p>
                    </div>
                  )}
                </div>
                {selectedItem.description && (
                  <div>
                    <p className="text-gray-600 text-sm">Description</p>
                    <p className="text-sm">{selectedItem.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Sales Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Sales Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Total Sales</p>
                    <p className="font-medium">${selectedItem.salesTotal.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Units Sold</p>
                    <p className="font-medium">{selectedItem.salesCount}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Avg Sale Price</p>
                    <p className="font-medium">
                      $
                      {selectedItem.salesCount > 0
                        ? (selectedItem.salesTotal / selectedItem.salesCount).toFixed(2)
                        : '0.00'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Serial Tracked</p>
                    <p className="font-medium">{selectedItem.isSerialTracked ? 'Yes' : 'No'}</p>
                  </div>
                </div>

                {/* Stock Level Warning */}
                {selectedItem.totalStock <= selectedItem.minStockLevel && (
                  <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <p className="text-sm text-yellow-800">
                      Stock level is below minimum threshold ({selectedItem.minStockLevel})
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      ) : (
        <Card className="h-full flex items-center justify-center">
          <CardContent className="text-center">
            <Package className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Item Selected</h3>
            <p className="text-gray-500">Select an item from the list to view its details</p>
          </CardContent>
        </Card>
      )}
    </>
  );

  return (
    <>
      {/* Mobile View */}
      <div className="block lg:hidden">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Inventory</h1>
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Items
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85%] sm:w-[400px] p-0">
              <div className="p-4 h-full overflow-auto">
                <ItemsList />
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <div className="space-y-6">
          <ItemDetails />
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden lg:grid lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Left Column - Items List */}
        <div className="lg:col-span-1 space-y-4">
          <ItemsList />
        </div>

        {/* Right Column - Item Details */}
        <div className="lg:col-span-2 space-y-6 overflow-y-auto">
          <ItemDetails />
        </div>
      </div>
    </>
  );
}
