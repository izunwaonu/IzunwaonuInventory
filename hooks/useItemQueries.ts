// hooks/useProductQueries.ts
import { itemAPI } from "@/services/items";
import { ItemCreateDTO } from "@/types/item";
import {
    useQuery,
    useSuspenseQuery,
    useMutation,
    useQueryClient,
  } from "@tanstack/react-query";
 
  import { toast } from "sonner";
  
  // Query keys for caching
  export const itemKeys = {
    all: ["items"] as const,
    lists: () => [...itemKeys.all, "list"] as const,
    org_list: (orgId:string) => [...itemKeys.lists(), orgId] as const,
    list: (filters: any) => [...itemKeys.lists(), { filters }] as const,
    filteredList: (dateFilter: any, searchQuery: string) =>
      [...itemKeys.lists(), { dateFilter, searchQuery }] as const,
    details: () => [...itemKeys.all, "detail"] as const,
    detail: (id: string) => [...itemKeys.details(), id] as const,
  };
  
  /**
   * Hook for fetching products with standard loading states
   */
//   export function useItems() {
//     // Get all products with standard loading states
//     const {
//       data: items = [],
//       isLoading,
//       isError,
//       error,
//       refetch,
//     } = useQuery({
//       queryKey: itemKeys.lists(),
//       queryFn: itemAPI.getAllBrief,
//     });
  
//     return {
//       products,
//       isLoading,
//       isError,
//       error,
//       refetch,
//     };
//   }
  
  /**
   * Hook for fetching products with React Suspense
   * Use this when the component is wrapped in a Suspense boundary
   */
//   export function useSuspenseProducts() {
//     // Get all products with Suspense (data is guaranteed to be defined)
//     const { data: products, refetch } = useSuspenseQuery({
//       queryKey: productKeys.lists(),
//       queryFn: productAPI.getAll,
//     });
  
//     return {
//       products,
//       refetch,
//     };
//   }
  
  export function useOrgItem(orgId: string) {
    // Get item in a particular organization
    const { data: items, refetch } = useSuspenseQuery({
      queryKey: itemKeys.org_list(orgId),
      queryFn: () => itemAPI.getAllBrief(orgId),
     
    });
    return {
              items,
              refetch,
            };
  }
  
  export function useCreateItem() {
    const queryClient = useQueryClient();
  
    // Create a new item
    return useMutation({
      mutationFn: (data: ItemCreateDTO) => itemAPI.create(data),
      onSuccess: () => {
        toast.success("Item added successfully");
        // Invalidate products list to trigger a refetch
        queryClient.invalidateQueries({ queryKey: itemKeys.lists() });
      },
      onError: (error: Error) => {
        toast.error("Failed to add item", {
          description: error.message || "Unknown error occurred",
        });
      },
    });
  }
  
  // export function useUpdateProduct() {
  //   const queryClient = useQueryClient();
  
  //   // Update an existing product
  //   return useMutation({
  //     mutationFn: ({ id, data }: { id: string; data: UpdateProductPayload }) =>
  //       productAPI.update(id, data),
  //     onSuccess: (data, variables) => {
  //       toast.success("Product updated successfully");
  //       // Invalidate specific product detail and list queries
  //       queryClient.invalidateQueries({
  //         queryKey: productKeys.detail(variables.id),
  //       });
  //       queryClient.invalidateQueries({ queryKey: productKeys.lists() });
  //     },
  //     onError: (error: Error) => {
  //       toast.error("Failed to update product", {
  //         description: error.message || "Unknown error occurred",
  //       });
  //     },
  //   });
  // }
  
  export function useDeleteItem() {
    const queryClient = useQueryClient();
  
    // Delete a product
    return useMutation({
      mutationFn: (id: string) => itemAPI.delete(id),
      onSuccess: () => {
        toast.success("Item deleted successfully");
        // Invalidate products list to trigger a refetch
        queryClient.invalidateQueries({ queryKey: itemKeys.lists() });
      },
      onError: (error: Error) => {
        toast.error("Failed to delete Item", {
          description: error.message || "Unknown error occurred",
        });
      },
    });
  }
  