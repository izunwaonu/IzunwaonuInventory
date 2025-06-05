// hooks/useProductQueries.ts
import { createCustomer, deleteCustomer, getOrgCustomers } from '@/actions/customers';

import { CustomerCreateDTO } from '@/types/types';
import { useQuery, useSuspenseQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from 'sonner';

// Query keys for caching
export const customerKeys = {
  all: ['customers'] as const,
  lists: () => [...customerKeys.all, 'list'] as const,
  list: (filters: any) => [...customerKeys.lists(), { filters }] as const,
  filteredList: (dateFilter: any, searchQuery: string) =>
    [...customerKeys.lists(), { dateFilter, searchQuery }] as const,
  details: () => [...customerKeys.all, 'detail'] as const,
  detail: (id: string) => [...customerKeys.details(), id] as const,
};

export function useOrgCustomers() {
  // Get item in a particular organization
  const { data: customers, refetch } = useSuspenseQuery({
    queryKey: customerKeys.lists(),
    queryFn: () => getOrgCustomers(),
  });
  return {
    customers,
    refetch,
  };
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();

  // Create a new location
  return useMutation({
    mutationFn: (data: CustomerCreateDTO) => createCustomer(data),
    onSuccess: () => {
      toast.success('Customer Added successfully successfully');
      // Invalidate products list to trigger a refetch
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
    },
    onError: (error: Error) => {
      toast.error('Failed to add Customer', {
        description: error.message || 'Unknown error occurred',
      });
    },
  });
}

// export function useUpdateLocation() {
//   const queryClient = useQueryClient();

//   // Update an existing product
//   return useMutation({
//     mutationFn: ({ id, data }: { id: string; data: Partial<LocationDTO> }) =>
//       updateLocationById(id, data),
//     onSuccess: (data, variables) => {
//       toast.success('Location updated successfully');
//       // Invalidate specific product detail and list queries
//       queryClient.invalidateQueries({
//         queryKey: supplierKeys.detail(variables.id),
//       });
//       queryClient.invalidateQueries({ queryKey: supplierKeys.lists() });
//     },
//     onError: (error: Error) => {
//       toast.error('Failed to update Location', {
//         description: error.message || 'Unknown error occurred',
//       });
//     },
//   });
// }

export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  // Delete a product
  return useMutation({
    mutationFn: (id: string) => deleteCustomer(id),
    onSuccess: () => {
      toast.success('Customer deleted successfully');
      // Invalidate products list to trigger a refetch
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
    },
    onError: (error: Error) => {
      toast.error('Failed to delete Customer', {
        description: error.message || 'Unknown error occurred',
      });
    },
  });
}
