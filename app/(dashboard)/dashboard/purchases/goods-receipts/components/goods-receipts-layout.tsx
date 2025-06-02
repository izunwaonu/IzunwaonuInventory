'use client';

import { useState, useEffect } from 'react';
import { getGoodsReceipts } from '@/actions/goods-receipts';

import { Search, Calendar, DollarSign, Package } from 'lucide-react';
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
import type { GoodsReceiptStatus } from '@prisma/client';
import GoodsReceiptDetails from './goods-receipt-details';

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

export default function GoodsReceiptsLayout() {
  const [goodsReceipts, setGoodsReceipts] = useState<GoodsReceipt[]>([]);
  const [selectedGR, setSelectedGR] = useState<GoodsReceipt | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadGoodsReceipts = async () => {
      try {
        setIsLoading(true);
        const receipts = await getGoodsReceipts();
        setGoodsReceipts(receipts);

        // Select the first receipt by default if available
        if (receipts.length > 0 && !selectedGR) {
          setSelectedGR(receipts[0]);
        }
      } catch (error) {
        console.error('Failed to load goods receipts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadGoodsReceipts();
  }, []);

  const handleGRSelect = (gr: GoodsReceipt) => {
    setSelectedGR(gr);
  };

  const handleGRUpdate = (updatedGR: GoodsReceipt) => {
    setGoodsReceipts(goodsReceipts.map((gr) => (gr.id === updatedGR.id ? updatedGR : gr)));
    setSelectedGR(updatedGR);
  };

  const filteredGRs = goodsReceipts.filter((gr) => {
    const matchesSearch =
      gr.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gr.purchaseOrder.supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gr.purchaseOrder.poNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || gr.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-[calc(100vh-200px)]">
      {/* Left column - Goods Receipts List */}
      <div className="lg:col-span-2 border rounded-lg overflow-hidden bg-white shadow-sm">
        {/* Header with filters */}
        <div className="p-4 border-b bg-gray-50">
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search receipt number or supplier..."
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
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Goods Receipts List */}
        <div className="divide-y max-h-[calc(100vh-350px)] overflow-y-auto">
          {isLoading ? (
            <div className="p-6 text-center text-gray-500">Loading goods receipts...</div>
          ) : filteredGRs.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              {searchTerm || statusFilter !== 'all'
                ? 'No goods receipts match your filters'
                : 'No goods receipts found'}
            </div>
          ) : (
            filteredGRs.map((gr) => (
              <div
                key={gr.id}
                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedGR?.id === gr.id ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                }`}
                onClick={() => handleGRSelect(gr)}
              >
                <div className="space-y-2">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{gr.receiptNumber}</h3>
                      <p className="text-sm text-gray-600">{gr.purchaseOrder.supplier.name}</p>
                    </div>
                    <Badge className={statusColors[gr.status]}>{gr.status}</Badge>
                  </div>

                  {/* Details */}
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-1 text-gray-500">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(gr.date), 'MMM dd, yyyy')}
                    </div>
                    <div className="flex items-center gap-1 font-semibold text-gray-900">
                      <DollarSign className="h-3 w-3" />
                      {gr.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                  </div>

                  {/* Purchase Order Reference */}
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Package className="h-3 w-3" />
                    PO: {gr.purchaseOrder.poNumber}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right column - Goods Receipt Details */}
      <div className="lg:col-span-3 border rounded-lg bg-white shadow-sm overflow-hidden">
        {selectedGR ? (
          <GoodsReceiptDetails goodsReceipt={selectedGR} onUpdate={handleGRUpdate} />
        ) : (
          <div className="p-8 text-center text-gray-500 h-full flex items-center justify-center">
            <div>
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Package className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-lg font-medium">Select a goods receipt to view details</p>
              <p className="text-sm">Choose a goods receipt from the list to view details</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
