"use server";

import { CategoryFormProps } from "@/components/Forms/inventory/CategoryFormModal";
import { api, getAuthenticatedApi } from "@/config/axios";
import { db } from "@/prisma/db";
import { BriefItemsResponse, ItemCreateDTO, ProductData, ProductResponse } from "@/types/item";
import { CategoryProps } from "@/types/types";
import axios from "axios";
import { revalidatePath } from "next/cache";
import { getOrgKey } from "./apiKey";
import { resolve } from "path";

export async function createItem(data: ItemCreateDTO) {
  
  try {
    const api = await getAuthenticatedApi();
    const res = await api.post("/items", data)
    const item = res.data.data
console.log(item)
    // console.log(newCategory);
    
    return {
      success: true,
      data: item,
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      success: true,
      error: "Failed to create an item",
      data: null,
    };
  }
}
export async function getOrgItems(orgId:string, params={}) {
  try {
    // const user = await getAuthenticatedUser()
    const api = await getAuthenticatedApi();
    const res = await api.get(`/organisations/${orgId}/items`, {
      params,
      
    })

    const items = res.data.data

    return items;
  } catch (error) {
    console.log(error);
    return [];
  }
}
export async function getOrgBriefItems(orgId:string, params={}): Promise<BriefItemsResponse> {
  try {
    const api = await getAuthenticatedApi();
    
    const res = await api.get(`/organisations/${orgId}/brief-items`, {
      params,
      // headers:{
      //   "x-api-key": apiKey?? "",
      // }
    })

    

    return res.data;
  } catch (error) {
    console.log(error);
    if(axios.isAxiosError(error)){
      throw new Error(error.response?.data?.error || "Failed to fetch items");
    }
    throw new Error("An unexpected error occurred")
  }
}
export async function getItemById(id:string,): Promise<ProductResponse> {
  try {
    const api = await getAuthenticatedApi();
    
    const res = await api.get(`/items/${id}`)

    

    return res.data;
  } catch (error) {
    console.log(error);
    if(axios.isAxiosError(error)){
      throw new Error(error.response?.data?.error || "Failed to fetch items");
    }
    throw new Error("An unexpected error occurred")
  }
}

export async function updateItemById(id: string, data: Partial<ProductData>){

  try {
    await db.item.update({
    where:{
      id,
    },
    data,
  })

  
  console.log("Updating Item", id, data);
  revalidatePath(`/dashboard/inventory/items/${id}`)
  return {success:true}
  } catch (error) {
    console.log(error)
    return{
      success: false
    }
  }
}


export async function updateCategoryById(id: string, data: CategoryProps) {
  try {
    const updatedCategory = await db.category.update({
      where: {
        id,
      },
      data,
    });
    revalidatePath("/dashboard/categories");
    return updatedCategory;
  } catch (error) {
    console.log(error);
  }
}
export async function getCategoryById(id: string) {
  try {
    const category = await db.category.findUnique({
      where: {
        id,
      },
    });
    return category;
  } catch (error) {
    console.log(error);
  }
}
export async function deleteItem(id: string) {
  try {
    const item = await db.item.findUnique({
      where:{
        id
      }
    })
    if(!item){
      return {
        success: false,
        data: null,
        error:"No Item found"
      };
    }
    if (item.salesCount>0){
      return {
        success: false,
        data: null,
        error:"Items with sales cannot be deleted"
      };
    }
    const deleted = await db.item.delete({
      where: {
        id,
      },
    });

    return {
      success: true,
      data: deleted,
      error:null
    };
  } catch (error) {
    
    console.log(error);
    return {
      success: false,
      data: null,
      error: "Failed to delete the item"
    };

    
  }
}
// export async function createBulkCategories(categories: CategoryProps[]) {
//   try {
//     for (const category of categories) {
//       await createCategory(category);
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }
