'use client';

import { useState, useEffect } from 'react';
import ItemSupplierForm from './item-supplier-form';
import { Search, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { deleteItemSupplier, getItemSuppliers, updateItemSupplier } from '@/actions/item-suppliers';
import { toast } from 'sonner';

interface Supplier {
  id: string;
  name: string;
}

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

export default function ItemSupplierLayout({ itemId }: { itemId: string }) {
  const [itemSuppliers, setItemSuppliers] = useState<ItemSupplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<ItemSupplier | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSuppliers = async () => {
      try {
        setIsLoading(true);
        const suppliers = await getItemSuppliers(itemId);

        // Process the suppliers to ensure proper serialization
        const processedSuppliers = suppliers.map((supplier: { unitCost: null }) => ({
          ...supplier,
          unitCost: supplier.unitCost !== null ? Number(supplier.unitCost) : null,
        }));

        setItemSuppliers(processedSuppliers);

        // Select the first supplier by default if available
        if (processedSuppliers.length > 0 && !selectedSupplier) {
          setSelectedSupplier(processedSuppliers[0]);
        }
      } catch (error) {
        console.error('Failed to load suppliers:', error);
        toast.error('Error', {
          description: 'Failed to load suppliers. Please try again.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSuppliers();
  }, [itemId]);

  const handleSupplierSelect = (supplier: ItemSupplier) => {
    setSelectedSupplier(supplier);
  };

  const handleSupplierDelete = async (supplierId: string) => {
    if (confirm('Are you sure you want to remove this supplier?')) {
      try {
        await deleteItemSupplier(supplierId);

        // Update the local state
        const updatedSuppliers = itemSuppliers.filter((s) => s.id !== supplierId);
        setItemSuppliers(updatedSuppliers);

        // If the deleted supplier was selected, select the first available supplier or clear selection
        if (selectedSupplier && selectedSupplier.id === supplierId) {
          setSelectedSupplier(updatedSuppliers.length > 0 ? updatedSuppliers[0] : null);
        }

        toast.success('Success', {
          description: 'Supplier removed successfully',
        });
      } catch (error) {
        toast.error('Error', {
          description: 'Failed to remove supplier',
        });
      }
    }
  };

  const handleSupplierUpdate = (updatedSupplier: ItemSupplier) => {
    const updatedSuppliers = itemSuppliers.map((s) =>
      s.id === updatedSupplier.id ? updatedSupplier : s,
    );
    setItemSuppliers(updatedSuppliers);
    setSelectedSupplier(updatedSupplier);
  };

  const handlePreferredChange = async (supplierId: string, isPreferred: boolean) => {
    if (isPreferred) {
      // If setting this supplier as preferred, unset all other preferred suppliers
      const updatedSuppliers = itemSuppliers.map((supplier) => ({
        ...supplier,
        isPreferred: supplier.id === supplierId,
      }));

      setItemSuppliers(updatedSuppliers);

      // Update the selected supplier if it's the one being changed
      if (selectedSupplier && selectedSupplier.id === supplierId) {
        setSelectedSupplier({ ...selectedSupplier, isPreferred: true });
      }

      // Update all other preferred suppliers in the database
      try {
        const otherPreferredSuppliers = itemSuppliers.filter(
          (s) => s.isPreferred && s.id !== supplierId,
        );

        // Unset other preferred suppliers
        for (const supplier of otherPreferredSuppliers) {
          await updateItemSupplier(supplier.id, { isPreferred: false });
        }
      } catch (error) {
        console.error('Error updating other preferred suppliers:', error);
        toast.error('Warning', {
          description: 'Some preferred suppliers may not have been updated properly',
        });
      }
    }
  };

  const filteredSuppliers = itemSuppliers.filter((s) =>
    s.supplier.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left column - Supplier List */}
      <div className="md:col-span-1 border rounded-lg overflow-hidden bg-white shadow-sm">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search suppliers..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="divide-y max-h-[500px] overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Loading suppliers...</div>
          ) : filteredSuppliers.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {searchTerm ? 'No suppliers match your search' : 'No suppliers linked to this item'}
            </div>
          ) : (
            filteredSuppliers.map((supplier) => (
              <div
                key={supplier.id}
                className={`p-4 cursor-pointer hover:bg-gray-50 flex justify-between items-center group ${
                  selectedSupplier?.id === supplier.id
                    ? 'bg-blue-50 border-r-2 border-blue-500'
                    : ''
                }`}
                onClick={() => handleSupplierSelect(supplier)}
              >
                <div className="flex items-center gap-2">
                  {supplier.isPreferred && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                      Preferred
                    </span>
                  )}
                  <span className="font-medium">{supplier.supplier.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSupplierDelete(supplier.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right column - Supplier Form */}
      <div className="md:col-span-2 border rounded-lg bg-white shadow-sm">
        {selectedSupplier ? (
          <ItemSupplierForm
            itemSupplier={selectedSupplier}
            onUpdate={handleSupplierUpdate}
            onPreferredChange={handlePreferredChange}
          />
        ) : (
          <div className="p-8 text-center text-gray-500">
            <p>Select a supplier from the list to view and edit details</p>
          </div>
        )}
      </div>
    </div>
  );
}
