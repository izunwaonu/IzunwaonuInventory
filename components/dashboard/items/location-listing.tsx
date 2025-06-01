// components/ui/groups/product-listing-suspense.tsx
'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { DollarSign, Barcode, PhoneCall, Mail } from 'lucide-react';
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
import { useCreateItem, useDeleteItem, useOrgItem } from '@/hooks/useItemQueries';
import { BriefItemDTO, ItemCreateDTO } from '@/types/item';
import NairaIcon from '@/components/NairaIcon';
import ImageUploadButton from '@/components/FormInputs/ImageUploadButton';
import { useRouter } from 'next/navigation';
import {
  useCreateLocation,
  useDeleteLocation,
  useOrgLocations,
  useUpdateLocation,
} from '@/hooks/useLocationQueries';
import { LocationCreateDTO, LocationDTO } from '@/types/location';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LocationType } from '@prisma/client';
// import { useRouter } from "next/router";

interface LocationListingProps {
  title: string;
}

// Form schema for editing/adding products
const locationFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.string().min(1, 'Type is required'),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
});

type locationFormValues = z.infer<typeof locationFormSchema>;

export default function LocationListing({ title }: LocationListingProps) {
  // React Query hooks with Suspense - note that data is always defined
  const { locations, refetch } = useOrgLocations();
  const createLocationMutation = useCreateLocation();
  const updateLocationMutation = useUpdateLocation();
  const deleteLocationMutation = useDeleteLocation();

  // Local state

  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationDTO | null>(null);
  const [locationToDelete, setLocationToDelete] = useState<LocationDTO | null>(null);

  // Form for editing/adding products
  const form = useForm<LocationCreateDTO>({
    resolver: zodResolver(locationFormSchema),
    defaultValues: {
      name: '',
      type: 'WAREHOUSE',
      address: '',
      phone: '',
      email: '',
    },
  });

  // Update form when current product changes
  useEffect(() => {
    if (!currentLocation) {
      // Adding new - reset form
      form.reset({
        name: '',
        type: 'WAREHOUSE',
        address: '',
        phone: '',
        email: '',
      });
    } else {
      // Editing existing - populate form
      form.reset({
        name: currentLocation.name,
        type: currentLocation.type,
        address: currentLocation?.address ?? '',
        phone: currentLocation?.phone ?? '',
        email: currentLocation?.email ?? '',
      });
    }
  }, [currentLocation, form]);

  // Format date function
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'MMM dd, yyyy');
  };

  // Export to Excel
  const handleExport = async (filteredLocations: LocationDTO[]) => {
    setIsExporting(true);
    try {
      // Prepare data for export
      const exportData = filteredLocations.map((location) => ({
        Name: location.name,
        Type: location.type,
        Phone: location.phone,
        Address: location.address,
        Email: location.email,
        'Date Added': formatDate(location.createdAt),
      }));

      // Create workbook and worksheet
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Locations');

      // Generate filename with current date
      const fileName = `Location_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;

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
    setCurrentLocation(null);
    setFormDialogOpen(true);
  };
  const router = useRouter();
  // Handle edit click
  const handleEditClick = (location: LocationDTO) => {
    setCurrentLocation(location);
    setFormDialogOpen(true);
  };

  // Handle delete click
  const handleDeleteClick = (location: LocationDTO) => {
    setLocationToDelete(location);
    setDeleteDialogOpen(true);
  };

  // Handle form submission (edit or add)
  const onSubmit = async (data: LocationCreateDTO) => {
    if (!currentLocation) {
      // Add new product
      console.log(data);

      createLocationMutation.mutate(data);
      setFormDialogOpen(true);
      form.reset();
    } else {
      // Edit existing product
      const obj = {
        ...data,
        type: data.type as LocationType,
      };
      updateLocationMutation.mutate({
        id: currentLocation.id,
        data: obj,
      });
    }
  };

  // Handle confirming delete
  const handleConfirmDelete = () => {
    if (locationToDelete) {
      deleteLocationMutation.mutate(locationToDelete.id);
      setDeleteDialogOpen(false);
    }
  };

  // Define columns for the data table
  const columns: Column<LocationDTO>[] = [
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
      header: 'Type',
      accessorKey: 'type',
      cell: (row) => (
        <span className="font-medium line-clamp-1">
          {row.name.length > 20 ? `${row.name.substring(0, 20)}...` : row.type}
        </span>
      ),
    },
    {
      header: 'Phone',
      accessorKey: 'phone',
      cell: (row) => (
        <span className="font-medium line-clamp-1">
          {row.name.length > 20 ? `${row.name.substring(0, 20)}...` : row.phone}
        </span>
      ),
    },
    {
      header: 'Email',
      accessorKey: 'email',
      cell: (row) => (
        <span className="font-medium line-clamp-1">
          {row.name.length > 20 ? `${row.name.substring(0, 20)}...` : row.email}
        </span>
      ),
    },
    // {
    //   header: 'Address',
    //   accessorKey: 'address',
    //   cell: (row) => (
    //     <span className="font-medium line-clamp-1">
    //       {row.name.length > 20 ? `${row.name.substring(0, 20)}...` : row.address}
    //     </span>
    //   ),
    // },

    {
      header: 'Date Added',
      accessorKey: (row) => formatDate(row.createdAt),
    },
  ];

  // Generate subtitle with total value

  return (
    <>
      <DataTable<LocationDTO>
        title={title}
        subtitle="Location"
        data={locations}
        columns={columns}
        keyField="id"
        isLoading={false} // With Suspense, we're guaranteed to have data
        onRefresh={refetch}
        actions={{
          onAdd: handleAddClick,
          onExport: handleExport,
        }}
        filters={{
          searchFields: ['name', 'type', 'phone'],
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
        title={currentLocation ? 'Edit Location' : 'Add New Location'}
        form={form}
        onSubmit={onSubmit}
        // isSubmitting={createLocationMutation.isPending}
        isSubmitting={createLocationMutation.isPending || updateLocationMutation.isPending}
        submitLabel={currentLocation ? 'Save Changes' : 'Add Location'}
      >
        <div className="grid gap-3 grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter location name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <div className="col-span-7">
            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item SKU</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Barcode className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="SKU-001" className="pl-8" {...field} />
                    </div>
                  </FormControl>
                  <FormDescription>Enter the Item SKU</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div> */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select the Location type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="WAREHOUSE">WAREHOUSE</SelectItem>
                    <SelectItem value="SHOP">SHOP</SelectItem>
                    <SelectItem value="VIRTUAL">VIRTUAL</SelectItem>
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />

          {/* <div className="col-span-5">
            <ImageUploadButton
              title="Upload Image"
              imageUrl={imageUrl}
              setImageUrl={setImageUrl}
              endpoint="itemImage"
              display={'horizontal'}
              size={'sm'}
            />
          </div> */}
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
                    <Input placeholder="izunwaonu2@gmail.com" className="pl-8" {...field} />
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter location Address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </EntityForm>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Delete Item"
        description={
          locationToDelete ? (
            <>
              Are you sure you want to delete <strong>{locationToDelete.name}?</strong> This action
              cannot be undone.
            </>
          ) : (
            'Are you sure you want to delete thisLocation?'
          )
        }
        onConfirm={handleConfirmDelete}
        isConfirming={deleteLocationMutation.isPending}
        confirmLabel="Delete"
        variant="destructive"
      />
    </>
  );
}
