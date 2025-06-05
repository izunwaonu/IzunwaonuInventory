// components/ui/groups/product-listing-suspense.tsx
'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { DollarSign, Barcode, Mail, PhoneCall } from 'lucide-react';
import { useSession } from 'next-auth/react';
import {
  DataTable,
  Column,
  TableActions,
  EntityForm,
  ConfirmationDialog,
} from '@/components/ui/data-table';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import ImageUploadButton from '@/components/FormInputs/ImageUploadButton';
import { useRouter } from 'next/navigation';
import { useCreateSupplier, useDeleteSupplier, useOrgSuppliers } from '@/hooks/useSupplierQueries';
import {
  BriefCustomerDTO,
  BriefSupplierDTO,
  CustomerCreateDTO,
  SupplierCreateDTO,
} from '@/types/types';
import { useCreateCustomer, useDeleteCustomer, useOrgCustomers } from '@/hooks/useCustomerQueries';
// import { useRouter } from "next/router";

interface ItemListingProps {
  title: string;
}

// Form schema for editing/adding products
const customerFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  //   address: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
});

export default function CustomerListing({ title }: ItemListingProps) {
  // React Query hooks with Suspense - note that data is always defined
  const { customers, refetch } = useOrgCustomers();
  const createCustomerMutation = useCreateCustomer();
  //   const updateProductMutation = useUpdateProduct();
  const deleteCustomerMutation = useDeleteCustomer();

  // Local state

  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<BriefCustomerDTO | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<BriefCustomerDTO | null>(null);

  // Form for editing/adding products
  const form = useForm<CustomerCreateDTO>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: '',
      //   address: '',
      email: '',
      phone: '',
    },
  });

  // Update form when current product changes
  useEffect(() => {
    if (!currentCustomer) {
      // Adding new - reset form
      form.reset({
        name: '',
        // address: '',
        email: '',
        phone: '',
      });
    } else {
      // Editing existing - populate form
      form.reset({
        name: currentCustomer.name,
        phone: currentCustomer?.phone ?? '',
        // address: currentCustomer?.address ?? '',
        email: currentCustomer?.email ?? '',
      });
    }
  }, [currentCustomer, form]);

  // Format date function
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'MMM dd, yyyy');
  };

  // Export to Excel
  const handleExport = async (filteredCustomers: BriefCustomerDTO[]) => {
    setIsExporting(true);
    try {
      // Prepare data for export
      const exportData = filteredCustomers.map((customer) => ({
        Name: customer.name,
        address: customer?.address,
        Email: customer.email,
        Phone: customer.phone,
        'Date Added': formatDate(customer.createdAt),
      }));

      // Create workbook and worksheet
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

      // Generate filename with current date
      const fileName = `Products_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;

      // Export to file
      XLSX.writeFile(workbook, fileName);

      toast.success('Export successful', {
        description: `Products exported to ${fileName}`,
      });
    } catch (error) {
      toast.error('Export failed', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Handle add new click
  const handleAddClick = () => {
    setCurrentCustomer(null);
    setFormDialogOpen(true);
  };
  const router = useRouter();
  // Handle edit click
  const handleEditClick = (customer: BriefCustomerDTO) => {
    // setCurrentProduct(product);
    // setFormDialogOpen(true);
    router.push(`/dashboard/sales/customers/${customer.id}/edit`);
  };

  // Handle delete click
  const handleDeleteClick = (customer: BriefCustomerDTO) => {
    setCustomerToDelete(customer);
    setDeleteDialogOpen(true);
  };

  // Handle form submission (edit or add)
  const onSubmit = async (data: CustomerCreateDTO) => {
    if (!currentCustomer) {
      // Add new product
      console.log(data);

      createCustomerMutation.mutate(data);
      setFormDialogOpen(true);
      form.reset();
    } else {
      // Edit existing product
      // updateProductMutation.mutate({
      //   id: currentProduct.id,
      //   data,
      // });
    }
  };

  // Handle confirming delete
  const handleConfirmDelete = () => {
    if (customerToDelete) {
      deleteCustomerMutation.mutate(customerToDelete.id);
      setDeleteDialogOpen(false);
    }
  };

  // Define columns for the data table
  const columns: Column<BriefCustomerDTO>[] = [
    {
      header: 'Name',
      accessorKey: 'name',
      cell: (row) => (
        <span className="font-medium line-clamp-1">
          {row.name.length > 20 ? `${row.name.substring(0, 20)}...` : row.name}
        </span>
      ),
    },
    {
      header: 'Email',
      accessorKey: 'email',
      cell: (row) => {
        const email = row?.email ?? '';
        return (
          <span className="font-medium line-clamp-1">
            {email.length > 20 ? `${email.substring(0, 20)}...` : row.email}
          </span>
        );
      },
    },
    {
      header: 'Phone',
      accessorKey: 'phone',
      cell: (row) => {
        const phone = row?.phone ?? '';
        return (
          <span className="font-medium line-clamp-1">
            {phone.length > 20 ? `${phone.substring(0, 20)}...` : row.phone}
          </span>
        );
      },
    },
    // {
    //   header: 'Address',
    //   accessorKey: 'address',
    //   cell: (row) => {
    //     const address = row?.address ?? '';
    //     return (
    //       <span className="font-medium line-clamp-1">
    //         {address.length > 20 ? `${address.substring(0, 20)}...` : row.address}
    //       </span>
    //     );
    //   },
    // },
    {
      header: 'Date Added',
      accessorKey: (row) => formatDate(row.createdAt),
    },
  ];

  return (
    <>
      <DataTable<BriefCustomerDTO>
        title={title}
        subtitle="Customers"
        data={customers}
        columns={columns}
        keyField="id"
        isLoading={false} // With Suspense, we're guaranteed to have data
        onRefresh={refetch}
        actions={{
          onAdd: handleAddClick,
          onExport: handleExport,
        }}
        filters={{
          searchFields: ['name', 'email', 'phone'],
          enableDateFilter: true,
          getItemDate: (item) => item.createdAt,
        }}
        renderRowActions={(item) => (
          <TableActions.RowActions
            onEdit={() => handleEditClick(item)}
            onDelete={() => handleDeleteClick(item)}
            // isDeleting={
            //   deleteProductMutation.isPending && productToDelete?.id === item.id
            // }
          />
        )}
      />

      {/* Product Form Dialog */}
      <EntityForm
        size="md"
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        title={currentCustomer ? 'Edit Customer' : 'Add New Customer'}
        form={form}
        onSubmit={onSubmit}
        isSubmitting={createCustomerMutation.isPending}
        // isSubmitting={
        //   createItemMutation.isPending || updateProductMutation.isPending
        // }
        submitLabel={currentCustomer ? 'Save Changes' : 'Add Customer'}
      >
        <div className="grid">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Customer name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer address</FormLabel>
                <FormControl>
                  <Input placeholder="Enter supplier contact person" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
        </div>
        <div className="grid gap-3 grid-cols-2">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <div className="relative">
                    <PhoneCall className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="+234 8138 3906 81" className="pl-8" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Eg: izunwaonu2@gmail.com" className="pl-8" {...field} />
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </EntityForm>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Customer"
        description={
          customerToDelete ? (
            <>
              Are you sure you want to delete <strong>{customerToDelete.name}?</strong> This action
              cannot be undone.
            </>
          ) : (
            'Are you sure you want to delete this Item?'
          )
        }
        onConfirm={handleConfirmDelete}
        isConfirming={deleteCustomerMutation.isPending}
        confirmLabel="Delete"
        variant="destructive"
      />
    </>
  );
}
