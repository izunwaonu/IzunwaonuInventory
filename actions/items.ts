"use server";

import { CategoryFormProps } from "@/components/Forms/inventory/CategoryFormModal";
import { ItemFormProps } from "@/components/Forms/inventory/ItemFormModal";
import { db } from "@/prisma/db";
import { CategoryProps } from "@/types/types";
import { revalidatePath } from "next/cache";

export async function createItem(data: ItemFormProps) {
  const slug = data.slug;
  try {
    const existingItem = await db.item.findUnique({
      where: {
        slug,
      },
    });
    if (existingItem) {
      return {
        status: 409,
        data: null,
        error: "Item already exists",
      };
    }
    const newItem = await db.item.create({
      data,
    });
    // console.log(newCategory);
    revalidatePath("/dashboard/inventory/items");
    return {
      status: 200,
      data: newItem,
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      error: "Something went wrong",
      data: null,
    };
  }
}
export async function getOrgItems(orgId:string) {
  try {
    const items = await db.item.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where:{
        orgId
      }
    });

    return items;
  } catch (error) {
    console.log(error);
    return [];
  }
}
export async function getOrgBriefItems(orgId:string) {
  try {
    const items = await db.item.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where:{
        orgId
      },
      select:{
        id:true,
        name:true,
        slug:true,
        thumbnail:true,
        createdAt:true,
      }
    });

    return items;
  } catch (error) {
    console.log(error);
    return [];
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
    const deleted = await db.item.delete({
      where: {
        id,
      },
    });

    return {
      ok: true,
      data: deleted,
    };
  } catch (error) {
    console.log(error);
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
