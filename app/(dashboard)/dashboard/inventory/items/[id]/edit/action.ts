// "use server"

// import { revalidatePath } from "next/cache"
// // import { getAuthenticatedApi } from "@/lib/api"
// import type { ProductData } from "@/types/item"
// import { getAuthenticatedApi } from "@/config/axios"

// export async function updateItem(id: string, data: Partial<ProductData>) {
//   try {
//     const api = await getAuthenticatedApi()

//     const response = await api.patch(`/items/${id}`, data)

//     if (!response.data.success) {
//       throw new Error(response.data.error || "Failed to update item")
//     }

//     revalidatePath(`/items/${id}`)
//     return { success: true }
//   } catch (error) {
//     console.error("Failed to update item:", error)
//     throw new Error(
//       typeof error === "object" && error !== null && "message" in error
//         ? String(error.message)
//         : "Failed to update item",
//     )
//   }
// }

"use server"

import { revalidatePath } from "next/cache"
import { updateItemById } from "@/actions/items"
import type { ProductData } from "@/types/item"

export async function updateItem(id: string, data: Partial<ProductData>) {
  try {
    const result = await updateItemById(id, data)

    if (!result.success) {
      throw new Error("Failed to update item")
    }

    revalidatePath(`/dashboard/inventory/items/${id}`)
    revalidatePath(`/dashboard/inventory/items/${id}/edit`)

    return { success: true, message: "Item updated successfully" }
  } catch (error) {
    console.error("Failed to update item:", error)
    return {
      success: false,
      message:
        typeof error === "object" && error !== null && "message" in error
          ? String(error.message)
          : "Failed to update item",
    }
  }
}
