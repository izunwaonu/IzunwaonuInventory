// 'use client';

// import { useState, useEffect } from 'react';
// import { getPurchaseOrders } from '@/actions/purchase-orders';
// import PurchaseOrderDetails from './purchase-order-details';
// import { Search, Calendar, DollarSign } from 'lucide-react';
// import { Input } from '@/components/ui/input';
// import { Badge } from '@/components/ui/badge';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { format } from 'date-fns';

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
//   supplier: {
//     id: string;
//     name: string;
//     email: string | null;
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

// export default function PurchaseOrderLayout() {
//   const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
//   const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState<string>('all');
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const loadPurchaseOrders = async () => {
//       try {
//         setIsLoading(true);
//         const orders = await getPurchaseOrders();
//         setPurchaseOrders(orders);

//         // Select the first order by default if available
//         if (orders.length > 0 && !selectedPO) {
//           setSelectedPO(orders[0]);
//         }
//       } catch (error) {
//         console.error('Failed to load purchase orders:', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadPurchaseOrders();
//   }, []);

//   const handlePOSelect = (po: PurchaseOrder) => {
//     setSelectedPO(po);
//   };

//   const handlePOUpdate = (updatedPO: PurchaseOrder) => {
//     setPurchaseOrders(purchaseOrders.map((po) => (po.id === updatedPO.id ? updatedPO : po)));
//     setSelectedPO(updatedPO);
//   };

//   const filteredPOs = purchaseOrders.filter((po) => {
//     const matchesSearch =
//       po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       po.supplier.name.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesStatus = statusFilter === 'all' || po.status === statusFilter;

//     return matchesSearch && matchesStatus;
//   });

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[calc(100vh-200px)]">
//       {/* Left column - Purchase Order List */}
//       <div className="lg:col-span-2 border rounded-lg overflow-hidden bg-white shadow-sm">
//         {/* Header with filters */}
//         <div className="p-4 border-b bg-gray-50">
//           <div className="space-y-3">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//               <Input
//                 placeholder="Search by PO number or supplier..."
//                 className="pl-10"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
//             <div className="flex gap-2">
//               <Select value={statusFilter} onValueChange={setStatusFilter}>
//                 <SelectTrigger className="w-full">
//                   <SelectValue placeholder="Filter by status" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Status</SelectItem>
//                   <SelectItem value="DRAFT">Draft</SelectItem>
//                   <SelectItem value="SUBMITTED">Submitted</SelectItem>
//                   <SelectItem value="APPROVED">Approved</SelectItem>
//                   <SelectItem value="PARTIALLY_RECEIVED">Partially Received</SelectItem>
//                   <SelectItem value="RECEIVED">Received</SelectItem>
//                   <SelectItem value="CANCELLED">Cancelled</SelectItem>
//                   <SelectItem value="CLOSED">Closed</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//         </div>

//         {/* Purchase Orders List */}
//         <div className="divide-y max-h-[calc(100vh-350px)] overflow-y-auto">
//           {isLoading ? (
//             <div className="p-6 text-center text-gray-500">Loading purchase orders...</div>
//           ) : filteredPOs.length === 0 ? (
//             <div className="p-6 text-center text-gray-500">
//               {searchTerm || statusFilter !== 'all'
//                 ? 'No purchase orders match your filters'
//                 : 'No purchase orders found'}
//             </div>
//           ) : (
//             filteredPOs.map((po) => (
//               <div
//                 key={po.id}
//                 className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
//                   selectedPO?.id === po.id ? 'bg-blue-50 border-r-4 border-blue-500' : ''
//                 }`}
//                 onClick={() => handlePOSelect(po)}
//               >
//                 <div className="space-y-2">
//                   {/* Header */}
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <h3 className="font-semibold text-gray-900">{po.poNumber}</h3>
//                       <p className="text-sm text-gray-600">{po.supplier.name}</p>
//                     </div>
//                     <Badge className={statusColors[po.status as keyof typeof statusColors]}>
//                       {po.status.replace('_', ' ')}
//                     </Badge>
//                   </div>

//                   {/* Details */}
//                   <div className="flex justify-between items-center text-sm">
//                     <div className="flex items-center gap-1 text-gray-500">
//                       <Calendar className="h-3 w-3" />
//                       {format(new Date(po.date), 'MMM dd, yyyy')}
//                     </div>
//                     <div className="flex items-center gap-1 font-semibold text-gray-900">
//                       <DollarSign className="h-3 w-3" />
//                       {po.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
//                     </div>
//                   </div>

//                   {/* Expected delivery */}
//                   {po.expectedDeliveryDate && (
//                     <div className="text-xs text-gray-500">
//                       Expected: {format(new Date(po.expectedDeliveryDate), 'MMM dd, yyyy')}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))
//           )}
//         </div>
//       </div>

//       {/* Right column - Purchase Order Details */}
//       <div className="lg:col-span-3 border rounded-lg bg-white shadow-sm overflow-hidden">
//         {selectedPO ? (
//           <PurchaseOrderDetails purchaseOrder={selectedPO} onUpdate={handlePOUpdate} />
//         ) : (
//           <div className="p-8 text-center text-gray-500 h-full flex items-center justify-center">
//             <div>
//               <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
//                 <Search className="h-8 w-8 text-gray-400" />
//               </div>
//               <p className="text-lg font-medium">Select a purchase order</p>
//               <p className="text-sm">Choose a purchase order from the list to view details</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

'use client';

import { useState, useEffect } from 'react';
import { getPurchaseOrders } from '@/actions/purchase-orders';
import PurchaseOrderDetails from './purchase-order-details';
import { Search, Calendar, DollarSign } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';

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

export default function PurchaseOrderLayout() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPurchaseOrders = async () => {
      try {
        setIsLoading(true);
        const orders = await getPurchaseOrders();
        setPurchaseOrders(orders);

        // Select the first order by default if available
        if (orders.length > 0 && !selectedPO) {
          setSelectedPO(orders[0]);
        }
      } catch (error) {
        console.error('Failed to load purchase orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPurchaseOrders();
  }, []);

  const handlePOSelect = (po: PurchaseOrder) => {
    setSelectedPO(po);
  };

  const handlePOUpdate = (updatedPO: PurchaseOrder) => {
    setPurchaseOrders(purchaseOrders.map((po) => (po.id === updatedPO.id ? updatedPO : po)));
    setSelectedPO(updatedPO);
  };

  const filteredPOs = purchaseOrders.filter((po) => {
    const matchesSearch =
      po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.supplier.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || po.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[calc(100vh-200px)]">
      {/* Left column - Purchase Order List */}
      <div className="lg:col-span-2 border rounded-lg overflow-hidden bg-white shadow-sm">
        {/* Header with filters */}
        <div className="p-4 border-b bg-gray-50">
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by PO number or supplier..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="SUBMITTED">Submitted</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="PARTIALLY_RECEIVED">Partially Received</SelectItem>
                  <SelectItem value="RECEIVED">Received</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  <SelectItem value="CLOSED">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Purchase Orders List */}
        <div className="divide-y max-h-[calc(100vh-350px)] overflow-y-auto">
          {isLoading ? (
            <div className="p-6 text-center text-gray-500">Loading purchase orders...</div>
          ) : filteredPOs.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              {searchTerm || statusFilter !== 'all'
                ? 'No purchase orders match your filters'
                : 'No purchase orders found'}
            </div>
          ) : (
            filteredPOs.map((po) => (
              <div
                key={po.id}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedPO?.id === po.id ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                }`}
                onClick={() => handlePOSelect(po)}
              >
                <div className="space-y-2">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{po.poNumber}</h3>
                      <p className="text-sm text-gray-600">{po.supplier.name}</p>
                    </div>
                    <Badge className={statusColors[po.status as keyof typeof statusColors]}>
                      {po.status.replace('_', ' ')}
                    </Badge>
                  </div>

                  {/* Details */}
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-1 text-gray-500">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(po.date), 'MMM dd, yyyy')}
                    </div>
                    <div className="flex items-center gap-1 font-semibold text-gray-900">
                      <DollarSign className="h-3 w-3" />
                      {po.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                  </div>

                  {/* Expected delivery */}
                  {po.expectedDeliveryDate && (
                    <div className="text-xs text-gray-500">
                      Expected: {format(new Date(po.expectedDeliveryDate), 'MMM dd, yyyy')}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right column - Purchase Order Details */}
      <div className="lg:col-span-3 border rounded-lg bg-white shadow-sm overflow-hidden">
        {selectedPO ? (
          <PurchaseOrderDetails purchaseOrder={selectedPO} onUpdate={handlePOUpdate} />
        ) : (
          <div className="p-8 text-center text-gray-500 h-full flex items-center justify-center">
            <div>
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-lg font-medium">Select a purchase order</p>
              <p className="text-sm">Choose a purchase order from the list to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
