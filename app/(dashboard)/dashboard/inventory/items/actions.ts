"use server"


import { db } from "@/prisma/db"
import { revalidatePath } from "next/cache"

export async function updateItem(id: string, data: Partial<any>) {
  try {
    await db.item.update({
      where: { id },
      data,
    })

    revalidatePath(`/items/${id}`)
    return { success: true }
  } catch (error) {
    console.error("Failed to update item:", error)
    throw new Error("Failed to update item")
  }
}
