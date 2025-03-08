"use server";

import { db } from "@/prisma/db";
import { CategoryProps, SavingProps } from "@/types/types";
import { revalidatePath } from "next/cache";

export async function createSavings(data: SavingProps) {
  try {
    const newSaving = await db.saving.create({
      data,
    });
    // console.log(newCategory);
    revalidatePath("/dashboard/savings");
    return newSaving;
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function getAllSavings() {
  try {
    const savings = await db.saving.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return savings;
  } catch (error) {
    console.log(error);
    return null;
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
export async function deleteSaving(id: string) {
  try {
    const deleted = await db.saving.delete({
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
