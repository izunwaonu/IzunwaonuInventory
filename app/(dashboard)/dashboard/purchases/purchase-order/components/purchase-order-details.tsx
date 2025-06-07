// 'use client';

// import { useState, useEffect, useMemo } from 'react';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Separator } from '@/components/ui/separator';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import {
//   Mail,
//   Download,
//   Package,
//   Edit,
//   MapPin,
//   User,
//   FileText,
//   DollarSign,
//   Truck,
//   Printer,
//   Phone,
//   Check,
//   Calendar,
// } from 'lucide-react';
// import { format } from 'date-fns';
// import { receiveOrderItems, updatePurchaseOrderStatus } from '@/actions/purchase-orders';
// import { sendPurchaseOrderEmail } from '@/actions/email';
// import type { PurchaseOrderStatus } from '@prisma/client';
// import { toast } from 'sonner';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from '@/components/ui/dialog';
// import { PurchaseOrderPDFViewer } from './purchase-order-pdf';

// interface PurchaseOrder {
//   id: string;
//   poNumber: string;
//   date: string;
//   supplierId: string;
//   supplierName: string | null;
//   status: string;
//   subtotal: number;
//   taxAmount: number;
//   shippingCost: number | null;
//   discount: number | null;
//   total: number;
//   notes: string | null;
//   paymentTerms: string | null;
//   expectedDeliveryDate: string | null;
//   createdBy: {
//     id: string;
//     firstName: string;
//     lastName: string;
//     email: string;
//   } | null;
//   supplier: {
//     id: string;
//     name: string;
//     email: string | null;
//     contactPerson: string | null;
//     phone: string | null;
//   };
//   deliveryLocation: {
//     id: string;
//     name: string;
//     address: string | null;
//   };
//   lines: Array<{
//     id: string;
//     quantity: number;
//     unitPrice: number;
//     total: number;
//     receivedQuantity: number;
//     item: {
//       id: string;
//       name: string;
//       sku: string | null;
//     };
//   }>;
// }

// const statusColors = {
//   DRAFT: 'bg-gray-100 text-gray-800',
//   SUBMITTED: 'bg-blue-100 text-blue-800',
//   APPROVED: 'bg-green-100 text-green-800',
//   PARTIALLY_RECEIVED: 'bg-yellow-100 text-yellow-800',
//   RECEIVED: 'bg-emerald-100 text-emerald-800',
//   CANCELLED: 'bg-red-100 text-red-800',
//   CLOSED: 'bg-slate-100 text-slate-800',
// };

// const statusOptions = [
//   { value: 'DRAFT', label: 'Draft' },
//   { value: 'SUBMITTED', label: 'Submitted' },
//   { value: 'APPROVED', label: 'Approved' },
//   { value: 'PARTIALLY_RECEIVED', label: 'Partially Received' },
//   { value: 'RECEIVED', label: 'Received' },
//   { value: 'CANCELLED', label: 'Cancelled' },
//   { value: 'CLOSED', label: 'Closed' },
// ];

// interface PurchaseOrderDetailsProps {
//   purchaseOrder: PurchaseOrder;
//   onUpdate?: (updatedPO: PurchaseOrder) => void;
// }

// export default function PurchaseOrderDetails({
//   purchaseOrder,
//   onUpdate,
// }: PurchaseOrderDetailsProps) {
//   const [isReceiving, setIsReceiving] = useState(false);
//   const [isUpdating, setIsUpdating] = useState(false);
//   const [isSendingEmail, setIsSendingEmail] = useState(false);
//   const [isPdfOpen, setIsPdfOpen] = useState(false);
//   const [isReceiveDialogOpen, setIsReceiveDialogOpen] = useState(false);
//   const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
//   const [supplierEmail, setSupplierEmail] = useState<string | null>(null);
//   const [selectedStatus, setSelectedStatus] = useState(purchaseOrder.status);
//   const [receivingQuantities, setReceivingQuantities] = useState<Record<string, number>>({});

//   // Calculate if any items remain to be received
//   const hasItemsToReceive = useMemo(() => {
//     return purchaseOrder.lines.some((line) => line.receivedQuantity < line.quantity);
//   }, [purchaseOrder.lines]);

//   // Extract supplier email when component mounts or purchaseOrder changes
//   useEffect(() => {
//     if (purchaseOrder?.supplier?.email) {
//       setSupplierEmail(purchaseOrder.supplier.email);
//     }
//   }, [purchaseOrder]);

//   // Initialize receiving quantities
//   useEffect(() => {
//     const initialQuantities: Record<string, number> = {};
//     purchaseOrder.lines.forEach((line) => {
//       const remainingQty = line.quantity - line.receivedQuantity;
//       initialQuantities[line.id] = remainingQty > 0 ? remainingQty : 0;
//     });
//     setReceivingQuantities(initialQuantities);
//   }, [purchaseOrder.lines]);

//   const handleSendEmail = async () => {
//     if (!supplierEmail) {
//       toast.error('Supplier email not found. Please update supplier details first.');
//       return;
//     }

//     setIsSendingEmail(true);
//     try {
//       const result = await sendPurchaseOrderEmail(purchaseOrder.id);
//       if (result.success) {
//         toast.success(`Email sent successfully to ${result.data?.sentTo || supplierEmail}`);

//         // Update the purchase order status locally if it was DRAFT
//         if (purchaseOrder.status === 'DRAFT' && onUpdate) {
//           onUpdate({
//             ...purchaseOrder,
//             status: 'SUBMITTED',
//           });
//         }
//       } else {
//         toast.error(result.error || 'Failed to send email');
//       }
//     } catch (error) {
//       toast.error('Failed to send email');
//     } finally {
//       setIsSendingEmail(false);
//     }
//   };

//   const handleViewPDF = () => {
//     setIsPdfOpen(true);
//   };

//   const handleReceiveItems = async () => {
//     setIsReceiving(true);
//     try {
//       const receiveData = Object.entries(receivingQuantities)
//         .filter(([_, quantity]) => quantity > 0)
//         .map(([lineId, quantity]) => ({
//           lineId,
//           receivedQuantity: quantity,
//         }));

//       if (receiveData.length === 0) {
//         toast.error('Please enter quantities to receive');
//         setIsReceiving(false);
//         return;
//       }

//       const result = await receiveOrderItems(purchaseOrder.id, receiveData);
//       if (result.success && result.data) {
//         toast.success('Items received successfully');
//         if (onUpdate) {
//           onUpdate(result.data);
//         }
//         setIsReceiveDialogOpen(false);
//       } else {
//         toast.error(result.error || 'Failed to receive items');
//       }
//     } catch (error) {
//       toast.error('Failed to receive items');
//     } finally {
//       setIsReceiving(false);
//     }
//   };

//   const handleStatusUpdate = async () => {
//     if (selectedStatus === purchaseOrder.status) {
//       setIsStatusDialogOpen(false);
//       return;
//     }

//     setIsUpdating(true);
//     try {
//       const result = await updatePurchaseOrderStatus(
//         purchaseOrder.id,
//         selectedStatus as PurchaseOrderStatus,
//       );
//       if (result.success) {
//         toast.success('Purchase order status updated');
//         if (onUpdate) {
//           onUpdate({ ...purchaseOrder, status: selectedStatus });
//         }
//         setIsStatusDialogOpen(false);
//       } else {
//         toast.error('Failed to update purchase order status');
//       }
//     } catch (error) {
//       toast.error('Failed to update purchase order status');
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   // Determine which buttons to show based on status and remaining items
//   const canSendEmail = ['DRAFT', 'SUBMITTED'].includes(purchaseOrder.status);

//   // Show receive button if there are items to receive, regardless of status
//   // (except for DRAFT, CANCELLED, or CLOSED)
//   const canReceive =
//     hasItemsToReceive && !['DRAFT', 'CANCELLED', 'CLOSED'].includes(purchaseOrder.status);

//   const totalReceived = purchaseOrder.lines.reduce((sum, line) => sum + line.receivedQuantity, 0);
//   const totalOrdered = purchaseOrder.lines.reduce((sum, line) => sum + line.quantity, 0);

//   const updateReceivingQuantity = (lineId: string, quantity: number) => {
//     const line = purchaseOrder.lines.find((l) => l.id === lineId);
//     if (line) {
//       const maxQuantity = line.quantity - line.receivedQuantity;
//       const validQuantity = Math.max(0, Math.min(quantity, maxQuantity));
//       setReceivingQuantities((prev) => ({
//         ...prev,
//         [lineId]: validQuantity,
//       }));
//     }
//   };

//   return (
//     <div className="h-full flex flex-col">
//       {/* Header */}
//       <div className="p-6 border-b bg-gray-50">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">{purchaseOrder.poNumber}</h1>
//             <div className="flex items-center gap-2 mt-1">
//               <Badge className={statusColors[purchaseOrder.status as keyof typeof statusColors]}>
//                 {purchaseOrder.status.replace('_', ' ')}
//               </Badge>
//               <span className="text-sm text-gray-500">
//                 {format(new Date(purchaseOrder.date), 'MMM dd, yyyy')}
//               </span>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex flex-wrap gap-2">
//             {canSendEmail && (
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={handleSendEmail}
//                 disabled={isSendingEmail || !supplierEmail}
//                 title={!supplierEmail ? 'Supplier email not available' : 'Send email to supplier'}
//               >
//                 <Mail className="h-4 w-4 mr-2" />
//                 {isSendingEmail ? 'Sending...' : 'Send Email'}
//               </Button>
//             )}
//             <Button variant="outline" size="sm" onClick={handleViewPDF}>
//               <Printer className="h-4 w-4 mr-2" />
//               View/Print
//             </Button>
//             {canReceive && (
//               <Button
//                 size="sm"
//                 onClick={() => setIsReceiveDialogOpen(true)}
//                 className="bg-green-600 hover:bg-green-700"
//               >
//                 <Package className="h-4 w-4 mr-2" />
//                 Receive Items
//               </Button>
//             )}
//             <Button variant="outline" size="sm" onClick={() => setIsStatusDialogOpen(true)}>
//               <Edit className="h-4 w-4 mr-2" />
//               Change Status
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="flex-1 overflow-y-auto p-6 space-y-6">
//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <Card>
//             <CardContent className="p-4">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-blue-100 rounded-lg">
//                   <DollarSign className="h-5 w-5 text-blue-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Total Amount</p>
//                   <p className="text-xl font-bold">₦{purchaseOrder.total.toLocaleString()}</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-4">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-green-100 rounded-lg">
//                   <Package className="h-5 w-5 text-green-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Items Received</p>
//                   <p className="text-xl font-bold">
//                     {totalReceived}/{totalOrdered}
//                   </p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="p-4">
//               <div className="flex items-center gap-3">
//                 <div className="p-2 bg-orange-100 rounded-lg">
//                   <Truck className="h-5 w-5 text-orange-600" />
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-600">Expected Delivery</p>
//                   <p className="text-sm font-medium">
//                     {purchaseOrder.expectedDeliveryDate
//                       ? format(new Date(purchaseOrder.expectedDeliveryDate), 'MMM dd, yyyy')
//                       : 'Not set'}
//                   </p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Order Information */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-lg">Supplier Information</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-3">
//               <div className="flex items-center gap-2">
//                 <User className="h-4 w-4 text-gray-500" />
//                 <span className="font-medium">{purchaseOrder.supplier.name}</span>
//               </div>

//               {purchaseOrder.supplier.contactPerson && (
//                 <div className="flex items-center gap-2">
//                   <User className="h-4 w-4 text-gray-500" />
//                   <span className="text-sm text-gray-600">
//                     Contact: {purchaseOrder.supplier.contactPerson}
//                   </span>
//                 </div>
//               )}

//               {supplierEmail && (
//                 <div className="flex items-center gap-2">
//                   <Mail className="h-4 w-4 text-gray-500" />
//                   <span className="text-sm text-gray-600">{supplierEmail}</span>
//                 </div>
//               )}

//               {purchaseOrder.supplier.phone && (
//                 <div className="flex items-center gap-2">
//                   <Phone className="h-4 w-4 text-gray-500" />
//                   <span className="text-sm text-gray-600">{purchaseOrder.supplier.phone}</span>
//                 </div>
//               )}

//               <div className="flex items-center gap-2">
//                 <MapPin className="h-4 w-4 text-gray-500" />
//                 <span className="text-sm text-gray-600">
//                   Delivery to: {purchaseOrder.deliveryLocation.name}
//                 </span>
//               </div>

//               {purchaseOrder.paymentTerms && (
//                 <div className="flex items-center gap-2">
//                   <FileText className="h-4 w-4 text-gray-500" />
//                   <span className="text-sm text-gray-600">
//                     Payment Terms: {purchaseOrder.paymentTerms}
//                   </span>
//                 </div>
//               )}
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle className="text-lg">Order Information</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-3">
//               <div className="flex items-center gap-2">
//                 <User className="h-4 w-4 text-gray-500" />
//                 <span className="text-sm text-gray-600">Created by:</span>
//                 <span className="font-medium">
//                   {purchaseOrder.createdBy
//                     ? `${purchaseOrder.createdBy.firstName} ${purchaseOrder.createdBy.lastName}`
//                     : 'System'}
//                 </span>
//               </div>

//               {purchaseOrder.createdBy?.email && (
//                 <div className="flex items-center gap-2">
//                   <Mail className="h-4 w-4 text-gray-500" />
//                   <span className="text-sm text-gray-600">{purchaseOrder.createdBy.email}</span>
//                 </div>
//               )}

//               <div className="flex items-center gap-2">
//                 <Calendar className="h-4 w-4 text-gray-500" />
//                 <span className="text-sm text-gray-600">Order Date:</span>
//                 <span className="font-medium">
//                   {format(new Date(purchaseOrder.date), 'MMM dd, yyyy')}
//                 </span>
//               </div>

//               {purchaseOrder.expectedDeliveryDate && (
//                 <div className="flex items-center gap-2">
//                   <Truck className="h-4 w-4 text-gray-500" />
//                   <span className="text-sm text-gray-600">Expected Delivery:</span>
//                   <span className="font-medium">
//                     {format(new Date(purchaseOrder.expectedDeliveryDate), 'MMM dd, yyyy')}
//                   </span>
//                 </div>
//               )}

//               {purchaseOrder.paymentTerms && (
//                 <div className="flex items-center gap-2">
//                   <FileText className="h-4 w-4 text-gray-500" />
//                   <span className="text-sm text-gray-600">Payment Terms:</span>
//                   <span className="font-medium">{purchaseOrder.paymentTerms}</span>
//                 </div>
//               )}
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle className="text-lg">Order Summary</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-3">
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Subtotal:</span>
//                 <span>₦{purchaseOrder.subtotal.toLocaleString()}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Tax:</span>
//                 <span>₦{purchaseOrder.taxAmount.toLocaleString()}</span>
//               </div>
//               {purchaseOrder.shippingCost && (
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Shipping:</span>
//                   <span>₦{purchaseOrder.shippingCost.toLocaleString()}</span>
//                 </div>
//               )}
//               {purchaseOrder.discount && (
//                 <div className="flex justify-between text-green-600">
//                   <span>Discount:</span>
//                   <span>-₦{purchaseOrder.discount.toLocaleString()}</span>
//                 </div>
//               )}
//               <Separator />
//               <div className="flex justify-between font-bold text-lg">
//                 <span>Total:</span>
//                 <span>₦{purchaseOrder.total.toLocaleString()}</span>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Order Lines */}
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between">
//             <CardTitle className="text-lg">Order Items</CardTitle>
//             {canReceive && (
//               <Button
//                 size="sm"
//                 onClick={() => setIsReceiveDialogOpen(true)}
//                 className="bg-green-600 hover:bg-green-700"
//               >
//                 <Package className="h-4 w-4 mr-2" />
//                 Receive Items
//               </Button>
//             )}
//           </CardHeader>
//           <CardContent>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="border-b">
//                     <th className="text-left py-3 px-2">Item</th>
//                     <th className="text-right py-3 px-2">Qty Ordered</th>
//                     <th className="text-right py-3 px-2">Qty Received</th>
//                     <th className="text-right py-3 px-2">Unit Price</th>
//                     <th className="text-right py-3 px-2">Total</th>
//                     <th className="text-center py-3 px-2">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {purchaseOrder.lines.map((line) => {
//                     const isFullyReceived = line.receivedQuantity >= line.quantity;
//                     const isPartiallyReceived =
//                       line.receivedQuantity > 0 && line.receivedQuantity < line.quantity;
//                     return (
//                       <tr key={line.id} className="border-b">
//                         <td className="py-3 px-2">
//                           <div>
//                             <p className="font-medium">{line.item.name}</p>
//                             {line.item.sku && (
//                               <p className="text-sm text-gray-500">SKU: {line.item.sku}</p>
//                             )}
//                           </div>
//                         </td>
//                         <td className="text-right py-3 px-2">{line.quantity}</td>
//                         <td className="text-right py-3 px-2">
//                           <span
//                             className={
//                               isFullyReceived
//                                 ? 'text-green-600 font-medium'
//                                 : isPartiallyReceived
//                                 ? 'text-orange-600 font-medium'
//                                 : 'text-gray-600'
//                             }
//                           >
//                             {line.receivedQuantity}
//                           </span>
//                         </td>
//                         <td className="text-right py-3 px-2">${line.unitPrice.toLocaleString()}</td>
//                         <td className="text-right py-3 px-2 font-medium">
//                           ₦{line.total.toLocaleString()}
//                         </td>
//                         <td className="text-center py-3 px-2">
//                           {isFullyReceived ? (
//                             <Badge className="bg-green-100 text-green-800">
//                               <Check className="h-3 w-3 mr-1" />
//                               Complete
//                             </Badge>
//                           ) : isPartiallyReceived ? (
//                             <Badge className="bg-orange-100 text-orange-800">Partial</Badge>
//                           ) : (
//                             <Badge className="bg-gray-100 text-gray-800">Pending</Badge>
//                           )}
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Notes */}
//         {purchaseOrder.notes && (
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-lg">Notes</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <p className="text-gray-700">{purchaseOrder.notes}</p>
//             </CardContent>
//           </Card>
//         )}
//       </div>

//       {/* Receive Items Dialog */}
//       <Dialog open={isReceiveDialogOpen} onOpenChange={setIsReceiveDialogOpen}>
//         <DialogContent className="max-w-4xl">
//           <DialogHeader>
//             <DialogTitle>Receive Items - {purchaseOrder.poNumber}</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4">
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead>
//                   <tr className="border-b">
//                     <th className="text-left py-2">Item</th>
//                     <th className="text-center py-2">Ordered</th>
//                     <th className="text-center py-2">Already Received</th>
//                     <th className="text-center py-2">Remaining</th>
//                     <th className="text-center py-2">Receive Now</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {purchaseOrder.lines.map((line) => {
//                     const remaining = line.quantity - line.receivedQuantity;
//                     return (
//                       <tr key={line.id} className="border-b">
//                         <td className="py-3">
//                           <div>
//                             <p className="font-medium">{line.item.name}</p>
//                             {line.item.sku && (
//                               <p className="text-sm text-gray-500">SKU: {line.item.sku}</p>
//                             )}
//                           </div>
//                         </td>
//                         <td className="text-center py-3">{line.quantity}</td>
//                         <td className="text-center py-3">{line.receivedQuantity}</td>
//                         <td className="text-center py-3 font-medium">{remaining}</td>
//                         <td className="text-center py-3">
//                           <Input
//                             type="number"
//                             min="0"
//                             max={remaining}
//                             value={receivingQuantities[line.id] || 0}
//                             onChange={(e) =>
//                               updateReceivingQuantity(line.id, Number.parseInt(e.target.value) || 0)
//                             }
//                             className="w-20 mx-auto"
//                             disabled={remaining <= 0}
//                           />
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsReceiveDialogOpen(false)}>
//               Cancel
//             </Button>
//             <Button
//               onClick={handleReceiveItems}
//               disabled={isReceiving}
//               className="bg-green-600 hover:bg-green-700"
//             >
//               {isReceiving ? 'Processing...' : 'Receive Items'}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Status Change Dialog */}
//       <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Change Status - {purchaseOrder.poNumber}</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4">
//             <div>
//               <Label htmlFor="status">Select New Status</Label>
//               <Select value={selectedStatus} onValueChange={setSelectedStatus}>
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {statusOptions.map((option) => (
//                     <SelectItem key={option.value} value={option.value}>
//                       <div className="flex items-center gap-2">
//                         <Badge className={statusColors[option.value as keyof typeof statusColors]}>
//                           {option.label}
//                         </Badge>
//                       </div>
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="text-sm text-gray-600">
//               Current status:{' '}
//               <span className="font-medium">{purchaseOrder.status.replace('_', ' ')}</span>
//             </div>
//           </div>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
//               Cancel
//             </Button>
//             <Button onClick={handleStatusUpdate} disabled={isUpdating}>
//               {isUpdating ? 'Updating...' : 'Update Status'}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* PDF Dialog */}
//       <Dialog open={isPdfOpen} onOpenChange={setIsPdfOpen}>
//         <DialogContent className="max-w-4xl h-[80vh]">
//           <DialogHeader>
//             <DialogTitle>Purchase Order: {purchaseOrder.poNumber}</DialogTitle>
//           </DialogHeader>
//           <div className="flex flex-col h-full">
//             <div className="flex justify-end mb-4">
//               <Button variant="outline" size="sm" className="flex items-center gap-2">
//                 <Download className="h-4 w-4" />
//                 <PurchaseOrderPDFViewer purchaseOrder={purchaseOrder} mode="download" />
//               </Button>
//             </div>
//             <div className="flex-1 overflow-hidden">
//               <PurchaseOrderPDFViewer purchaseOrder={purchaseOrder} mode="view" />
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Mail,
  Download,
  Package,
  Edit,
  MapPin,
  User,
  FileText,
  DollarSign,
  Truck,
  Printer,
  Phone,
  Check,
  MoreVertical,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { receiveOrderItems, updatePurchaseOrderStatus } from '@/actions/purchase-orders';
import { sendPurchaseOrderEmail } from '@/actions/email';
import type { PurchaseOrderStatus } from '@prisma/client';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { PurchaseOrderPDFViewer } from './purchase-order-pdf';

interface PurchaseOrder {
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
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
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

const statusOptions = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'SUBMITTED', label: 'Submitted' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'PARTIALLY_RECEIVED', label: 'Partially Received' },
  { value: 'RECEIVED', label: 'Received' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'CLOSED', label: 'Closed' },
];

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
  const [isReceiveDialogOpen, setIsReceiveDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [supplierEmail, setSupplierEmail] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState(purchaseOrder.status);
  const [receivingQuantities, setReceivingQuantities] = useState<Record<string, number>>({});

  // Calculate if any items remain to be received
  const hasItemsToReceive = useMemo(() => {
    return purchaseOrder.lines.some((line) => line.receivedQuantity < line.quantity);
  }, [purchaseOrder.lines]);

  // Extract supplier email when component mounts or purchaseOrder changes
  useEffect(() => {
    if (purchaseOrder?.supplier?.email) {
      setSupplierEmail(purchaseOrder.supplier.email);
    }
  }, [purchaseOrder]);

  // Initialize receiving quantities
  useEffect(() => {
    const initialQuantities: Record<string, number> = {};
    purchaseOrder.lines.forEach((line) => {
      const remainingQty = line.quantity - line.receivedQuantity;
      initialQuantities[line.id] = remainingQty > 0 ? remainingQty : 0;
    });
    setReceivingQuantities(initialQuantities);
  }, [purchaseOrder.lines]);

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

        // Update the purchase order status locally if it was DRAFT
        if (purchaseOrder.status === 'DRAFT' && onUpdate) {
          onUpdate({
            ...purchaseOrder,
            status: 'SUBMITTED',
          });
        }
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

  const handleReceiveItems = async () => {
    setIsReceiving(true);
    try {
      const receiveData = Object.entries(receivingQuantities)
        .filter(([_, quantity]) => quantity > 0)
        .map(([lineId, quantity]) => ({
          lineId,
          receivedQuantity: quantity,
        }));

      if (receiveData.length === 0) {
        toast.error('Please enter quantities to receive');
        setIsReceiving(false);
        return;
      }

      const result = await receiveOrderItems(purchaseOrder.id, receiveData);
      if (result.success && result.data) {
        toast.success('Items received successfully');
        if (onUpdate) {
          onUpdate(result.data);
        }
        setIsReceiveDialogOpen(false);
      } else {
        toast.error(result.error || 'Failed to receive items');
      }
    } catch (error) {
      toast.error('Failed to receive items');
    } finally {
      setIsReceiving(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (selectedStatus === purchaseOrder.status) {
      setIsStatusDialogOpen(false);
      return;
    }

    setIsUpdating(true);
    try {
      const result = await updatePurchaseOrderStatus(
        purchaseOrder.id,
        selectedStatus as PurchaseOrderStatus,
      );
      if (result.success) {
        toast.success('Purchase order status updated');
        if (onUpdate) {
          onUpdate({ ...purchaseOrder, status: selectedStatus });
        }
        setIsStatusDialogOpen(false);
      } else {
        toast.error('Failed to update purchase order status');
      }
    } catch (error) {
      toast.error('Failed to update purchase order status');
    } finally {
      setIsUpdating(false);
    }
  };

  // Determine which buttons to show based on status and remaining items
  const canSendEmail = ['DRAFT', 'SUBMITTED'].includes(purchaseOrder.status);
  const canReceive =
    hasItemsToReceive && !['DRAFT', 'CANCELLED', 'CLOSED'].includes(purchaseOrder.status);

  const totalReceived = purchaseOrder.lines.reduce((sum, line) => sum + line.receivedQuantity, 0);
  const totalOrdered = purchaseOrder.lines.reduce((sum, line) => sum + line.quantity, 0);

  const updateReceivingQuantity = (lineId: string, quantity: number) => {
    const line = purchaseOrder.lines.find((l) => l.id === lineId);
    if (line) {
      const maxQuantity = line.quantity - line.receivedQuantity;
      const validQuantity = Math.max(0, Math.min(quantity, maxQuantity));
      setReceivingQuantities((prev) => ({
        ...prev,
        [lineId]: validQuantity,
      }));
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b bg-gray-50 flex-shrink-0">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
                {purchaseOrder.poNumber}
              </h1>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge className={statusColors[purchaseOrder.status as keyof typeof statusColors]}>
                  {purchaseOrder.status.replace('_', ' ')}
                </Badge>
                <span className="text-sm text-gray-500">
                  {format(new Date(purchaseOrder.date), 'MMM dd, yyyy')}
                </span>
              </div>
            </div>

            {/* Action Buttons - Desktop */}
            <div className="hidden sm:flex flex-wrap gap-2">
              {canSendEmail && (
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
              )}
              <Button variant="outline" size="sm" onClick={handleViewPDF}>
                <Printer className="h-4 w-4 mr-2" />
                View/Print
              </Button>
              {canReceive && (
                <Button
                  size="sm"
                  onClick={() => setIsReceiveDialogOpen(true)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Package className="h-4 w-4 mr-2" />
                  Receive Items
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={() => setIsStatusDialogOpen(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Change Status
              </Button>
            </div>

            {/* Action Buttons - Mobile Dropdown */}
            <div className="sm:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {canSendEmail && (
                    <DropdownMenuItem
                      onClick={handleSendEmail}
                      disabled={isSendingEmail || !supplierEmail}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      {isSendingEmail ? 'Sending...' : 'Send Email'}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleViewPDF}>
                    <Printer className="h-4 w-4 mr-2" />
                    View/Print
                  </DropdownMenuItem>
                  {canReceive && (
                    <DropdownMenuItem onClick={() => setIsReceiveDialogOpen(true)}>
                      <Package className="h-4 w-4 mr-2" />
                      Receive Items
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => setIsStatusDialogOpen(true)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Change Status
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-lg sm:text-xl font-bold truncate">
                    ₦{purchaseOrder.total.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                  <Package className="h-5 w-5 text-green-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-600">Items Received</p>
                  <p className="text-lg sm:text-xl font-bold">
                    {totalReceived}/{totalOrdered}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="sm:col-span-2 lg:col-span-1">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0">
                  <Truck className="h-5 w-5 text-orange-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-gray-600">Expected Delivery</p>
                  <p className="text-sm font-medium truncate">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Supplier Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <span className="font-medium truncate">{purchaseOrder.supplier.name}</span>
              </div>

              {purchaseOrder.supplier.contactPerson && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600 truncate">
                    Contact: {purchaseOrder.supplier.contactPerson}
                  </span>
                </div>
              )}

              {supplierEmail && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600 truncate">{supplierEmail}</span>
                </div>
              )}

              {purchaseOrder.supplier.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600 truncate">
                    {purchaseOrder.supplier.phone}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <span className="text-sm text-gray-600 truncate">
                  Delivery to: {purchaseOrder.deliveryLocation.name}
                </span>
              </div>

              {purchaseOrder.paymentTerms && (
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <span className="text-sm text-gray-600 truncate">
                    Payment Terms: {purchaseOrder.paymentTerms}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span>₦{purchaseOrder.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax:</span>
                <span>₦{purchaseOrder.taxAmount.toLocaleString()}</span>
              </div>
              {purchaseOrder.shippingCost && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span>₦{purchaseOrder.shippingCost.toLocaleString()}</span>
                </div>
              )}
              {purchaseOrder.discount && (
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span>-₦{purchaseOrder.discount.toLocaleString()}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>₦{purchaseOrder.total.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Lines */}
        <Card>
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-base sm:text-lg">Order Items</CardTitle>
            {canReceive && (
              <Button
                size="sm"
                onClick={() => setIsReceiveDialogOpen(true)}
                className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
              >
                <Package className="h-4 w-4 mr-2" />
                Receive Items
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {/* Mobile Card View */}
            <div className="block sm:hidden space-y-4">
              {purchaseOrder.lines.map((line) => {
                const isFullyReceived = line.receivedQuantity >= line.quantity;
                const isPartiallyReceived =
                  line.receivedQuantity > 0 && line.receivedQuantity < line.quantity;
                return (
                  <Card key={line.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{line.item.name}</p>
                          {line.item.sku && (
                            <p className="text-sm text-gray-500">SKU: {line.item.sku}</p>
                          )}
                        </div>
                        {isFullyReceived ? (
                          <Badge className="bg-green-100 text-green-800 flex-shrink-0">
                            <Check className="h-3 w-3 mr-1" />
                            Complete
                          </Badge>
                        ) : isPartiallyReceived ? (
                          <Badge className="bg-orange-100 text-orange-800 flex-shrink-0">
                            Partial
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800 flex-shrink-0">Pending</Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Ordered:</span>
                          <span className="ml-2 font-medium">{line.quantity}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Received:</span>
                          <span
                            className={`ml-2 font-medium ${
                              isFullyReceived
                                ? 'text-green-600'
                                : isPartiallyReceived
                                ? 'text-orange-600'
                                : 'text-gray-600'
                            }`}
                          >
                            {line.receivedQuantity}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Unit Price:</span>
                          <span className="ml-2 font-medium">
                            ₦{line.unitPrice.toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Total:</span>
                          <span className="ml-2 font-medium">₦{line.total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-2">Item</th>
                    <th className="text-right py-3 px-2">Qty Ordered</th>
                    <th className="text-right py-3 px-2">Qty Received</th>
                    <th className="text-right py-3 px-2">Unit Price</th>
                    <th className="text-right py-3 px-2">Total</th>
                    <th className="text-center py-3 px-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseOrder.lines.map((line) => {
                    const isFullyReceived = line.receivedQuantity >= line.quantity;
                    const isPartiallyReceived =
                      line.receivedQuantity > 0 && line.receivedQuantity < line.quantity;
                    return (
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
                              isFullyReceived
                                ? 'text-green-600 font-medium'
                                : isPartiallyReceived
                                ? 'text-orange-600 font-medium'
                                : 'text-gray-600'
                            }
                          >
                            {line.receivedQuantity}
                          </span>
                        </td>
                        <td className="text-right py-3 px-2">₦{line.unitPrice.toLocaleString()}</td>
                        <td className="text-right py-3 px-2 font-medium">
                          ₦{line.total.toLocaleString()}
                        </td>
                        <td className="text-center py-3 px-2">
                          {isFullyReceived ? (
                            <Badge className="bg-green-100 text-green-800">
                              <Check className="h-3 w-3 mr-1" />
                              Complete
                            </Badge>
                          ) : isPartiallyReceived ? (
                            <Badge className="bg-orange-100 text-orange-800">Partial</Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-800">Pending</Badge>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        {purchaseOrder.notes && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 text-sm sm:text-base">{purchaseOrder.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Receive Items Dialog */}
      <Dialog open={isReceiveDialogOpen} onOpenChange={setIsReceiveDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              Receive Items - {purchaseOrder.poNumber}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Mobile Card View */}
            <div className="block sm:hidden space-y-4">
              {purchaseOrder.lines.map((line) => {
                const remaining = line.quantity - line.receivedQuantity;
                return (
                  <Card key={line.id} className="p-4">
                    <div className="space-y-3">
                      <div>
                        <p className="font-medium">{line.item.name}</p>
                        {line.item.sku && (
                          <p className="text-sm text-gray-500">SKU: {line.item.sku}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Ordered:</span>
                          <span className="ml-2 font-medium">{line.quantity}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Received:</span>
                          <span className="ml-2 font-medium">{line.receivedQuantity}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Remaining:</span>
                          <span className="ml-2 font-medium">{remaining}</span>
                        </div>
                        <div>
                          <Label htmlFor={`receive-${line.id}`} className="text-gray-600">
                            Receive Now:
                          </Label>
                          <Input
                            id={`receive-${line.id}`}
                            type="number"
                            min="0"
                            max={remaining}
                            value={receivingQuantities[line.id] || 0}
                            onChange={(e) =>
                              updateReceivingQuantity(line.id, Number.parseInt(e.target.value) || 0)
                            }
                            className="mt-1"
                            disabled={remaining <= 0}
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Desktop Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Item</th>
                    <th className="text-center py-2">Ordered</th>
                    <th className="text-center py-2">Already Received</th>
                    <th className="text-center py-2">Remaining</th>
                    <th className="text-center py-2">Receive Now</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseOrder.lines.map((line) => {
                    const remaining = line.quantity - line.receivedQuantity;
                    return (
                      <tr key={line.id} className="border-b">
                        <td className="py-3">
                          <div>
                            <p className="font-medium">{line.item.name}</p>
                            {line.item.sku && (
                              <p className="text-sm text-gray-500">SKU: {line.item.sku}</p>
                            )}
                          </div>
                        </td>
                        <td className="text-center py-3">{line.quantity}</td>
                        <td className="text-center py-3">{line.receivedQuantity}</td>
                        <td className="text-center py-3 font-medium">{remaining}</td>
                        <td className="text-center py-3">
                          <Input
                            type="number"
                            min="0"
                            max={remaining}
                            value={receivingQuantities[line.id] || 0}
                            onChange={(e) =>
                              updateReceivingQuantity(line.id, Number.parseInt(e.target.value) || 0)
                            }
                            className="w-20 mx-auto"
                            disabled={remaining <= 0}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setIsReceiveDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              onClick={handleReceiveItems}
              disabled={isReceiving}
              className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
            >
              {isReceiving ? 'Processing...' : 'Receive Items'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Change Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg">Change Status - {purchaseOrder.poNumber}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="status">Select New Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
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
              Current status:{' '}
              <span className="font-medium">{purchaseOrder.status.replace('_', ' ')}</span>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setIsStatusDialogOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button onClick={handleStatusUpdate} disabled={isUpdating} className="w-full sm:w-auto">
              {isUpdating ? 'Updating...' : 'Update Status'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
