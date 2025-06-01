'use server';

import { db } from '@/prisma/db';
import { revalidatePath } from 'next/cache';

export async function addItemSuppliers(itemId: string, supplierIds: string[]) {
  try {
    //Create an array of Item Supplier objects to create
    const itemSuppliers = supplierIds.map((supplierId) => ({
      itemId,
      supplierId,
    }));
    await db.itemSupplier.createMany({
      data: itemSuppliers,
      skipDuplicates: true,
    });
    revalidatePath(`/dashboard/inventory/items/${itemId}/suppliers`);
    return { success: true };
  } catch (error) {
    console.error('Failed to add item Suppliers:', error);
    throw new Error('Failed to add suppliers to item');
  }
}

export async function removeItemSuppliers(itemId: string, supplierIds: string[]) {
  try {
    // Remove ItemSupplier records for the specified suppliers
    const result = await db.itemSupplier.deleteMany({
      where: {
        itemId,
        supplierId: {
          in: supplierIds,
        },
      },
    });

    // Revalidate the item detail page to show updated suppliers
    revalidatePath(`/dashboard/inventory/items/${itemId}`);

    return {
      success: true,
      message: `Successfully removed ${result.count} supplier${result.count !== 1 ? 's' : ''}`,
    };
  } catch (error) {
    console.error('Error removing item suppliers:', error);
    throw new Error('Failed to remove suppliers from item');
  }
}

// export async function getItemSuppliers(itemId: string) {
//   try {
//     // Add timeout to prevent long-running queries
//     const timeoutPromise = new Promise((_, reject) => {
//       setTimeout(() => reject(new Error('Database query timeout')), 5000);
//     });

//     const queryPromise = db.itemSupplier.findMany({
//       where: { itemId },
//       include: {
//         supplier: {
//           select: {
//             id: true,
//             name: true,
//           },
//         },
//       },
//       orderBy: [
//         { isPreferred: 'desc' }, // Preferred suppliers first
//         { supplier: { name: 'asc' } }, // Then alphabetically
//       ],
//     });

//     // Race between the query and the timeout
//     const itemSuppliers = (await Promise.race([queryPromise, timeoutPromise])) as any;

//     // Serialize Decimal values to strings to prevent serialization issues
//     return itemSuppliers.map((supplier: any) => ({
//       ...supplier,
//       unitCost: supplier.unitCost
//         ? {
//             ...supplier.unitCost,
//             toString: () => supplier.unitCost.toString(),
//             toFixed: (digits: number) => supplier.unitCost.toFixed(digits),
//           }
//         : null,
//     }));
//   } catch (error) {
//     console.error('Error fetching item suppliers:', error);
//     // Return empty array instead of throwing to prevent page crashes
//     return [];
//   }
// }

export async function getItemSuppliers(itemId: string) {
  try {
    // Add timeout to prevent long-running queries
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database query timeout')), 5000);
    });

    const queryPromise = db.itemSupplier.findMany({
      where: { itemId },
      include: {
        supplier: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: [
        { isPreferred: 'desc' }, // Preferred suppliers first
        { supplier: { name: 'asc' } }, // Then alphabetically
      ],
    });

    // Race between the query and the timeout
    const itemSuppliers = (await Promise.race([queryPromise, timeoutPromise])) as any;

    // Properly serialize Decimal values to numbers
    return itemSuppliers.map((supplier: any) => ({
      ...supplier,
      unitCost: supplier.unitCost !== null ? Number(supplier.unitCost) : null,
    }));
  } catch (error) {
    console.error('Error fetching item suppliers:', error);
    // Return empty array instead of throwing to prevent page crashes
    return [];
  }
}

export async function updateItemSupplier(
  itemSupplierId: string,
  data: {
    isPreferred?: boolean;
    supplierSku?: string | null;
    leadTime?: number | null;
    minOrderQty?: number | null;
    unitCost?: number | null;
    lastPurchaseDate?: Date | null;
    notes?: string | null;
  },
) {
  try {
    const result = await db.itemSupplier.update({
      where: { id: itemSupplierId },
      data: {
        isPreferred: data.isPreferred,
        supplierSku: data.supplierSku,
        leadTime: data.leadTime,
        minOrderQty: data.minOrderQty,
        unitCost: data.unitCost,
        lastPurchaseDate: data.lastPurchaseDate,
        notes: data.notes,
      },
    });

    revalidatePath(`/dashboard/inventory/items/${itemSupplierId}/supplier`);
    return {
      success: true,
      data: result,
      message: 'Supplier details updated successfully',
    };
  } catch (error) {
    console.error('Error updating item supplier:', error);
    throw new Error('Failed to update supplier details');
  }
}

export async function deleteItemSupplier(itemSupplierId: string) {
  try {
    await db.itemSupplier.delete({
      where: { id: itemSupplierId },
    });

    revalidatePath(`/dashboard/inventory/items`);

    return {
      success: true,
      message: 'Supplier removed successfully',
    };
  } catch (error) {
    console.error('Error deleting item supplier:', error);
    throw new Error('Failed to remove supplier');
  }
}
