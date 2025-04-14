"use server";

import { CategoryFormProps } from "@/components/Forms/inventory/CategoryFormModal";
import { db } from "@/prisma/db";
import { CategoryProps } from "@/types/types";
import { revalidatePath } from "next/cache";

export async function createCategory(data: CategoryFormProps) {
  const slug = data.slug;
  try {
    const existingCategory = await db.category.findUnique({
      where: {
        slug,
      },
    });
    if (existingCategory) {
      return {
        status: 409,
        data: null,
        error: "Category already exists",
      };
    }
    const newCategory = await db.category.create({
      data,
    });
    // console.log(newCategory);
    revalidatePath("/dashboard/inventory/categories");
    return {
      status: 200,
      data: newCategory,
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
export async function getOrgCategories(orgId:string) {
  try {
    const categories = await db.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where:{
        orgId
      }
    });

    return categories;
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
export async function deleteCategory(id: string) {
  try {
    const deletedCategory = await db.category.delete({
      where: {
        id,
      },
    });

    return {
      ok: true,
      data: deletedCategory,
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
