import { createItem, deleteItem, getOrgBriefItems, getOrgItems } from "@/actions/items";
import { ItemCreateDTO } from "@/types/item";

  
  // Centralized API object for all product-related server actions
  export const itemAPI = {
    // Fetch all Items
    getAllBrief: async (orgId: string) => {
      const res = await getOrgBriefItems(orgId);
      if (!res.success) {
        throw new Error(res.error || "Failed to fetch items");
      }
      return res.data.data;
    },
  
  
    // Create a new item
    create: async (data: ItemCreateDTO) => {
      const response = await createItem(data);
      if (!response.success) {
        throw new Error(response.error || "Failed to create item");
      }
      return response.data;
    },
  
    // Update an existing product
    // update: async (id: string, data: UpdateProductPayload) => {
    //   const response = await editProduct(id, data);
    //   if (!response.success) {
    //     throw new Error(response.error || "Failed to update product");
    //   }
    //   return response.data;
    // },
  
    // Delete a item
    delete: async (id: string) => {
      const response = await deleteItem(id);
      if (!response.success) {
        throw new Error(response.error || "Failed to delete product");
      }
      return true;
    },
  };
  