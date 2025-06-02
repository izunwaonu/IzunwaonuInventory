'use server';

import { CategoryFormProps } from '@/components/Forms/inventory/CategoryFormModal';
import { api, getAuthenticatedApi } from '@/config/axios';
import { db } from '@/prisma/db';
import { BriefItemsResponse, ItemCreateDTO, ProductData, ProductResponse } from '@/types/item';
import { CategoryProps } from '@/types/types';
import axios from 'axios';
import { revalidatePath } from 'next/cache';
import { getOrgKey } from './apiKey';
import { resolve } from 'path';
import { getAuthenticatedUser } from '@/config/useAuth';

export async function createItem(data: ItemCreateDTO) {
  try {
    const api = await getAuthenticatedApi();
    const res = await api.post('/items', data);
    const item = res.data.data;
    console.log(item);
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
      error: 'Failed to create an item',
      data: null,
    };
  }
}
export async function getOrgItems(orgId: string, params = {}) {
  try {
    // const user = await getAuthenticatedUser()
    const api = await getAuthenticatedApi();
    const res = await api.get(`/organisations/${orgId}/items`, {
      params,
    });

    const items = res.data.data;

    return items;
  } catch (error) {
    console.log(error);
    return [];
  }
}
export async function getOrgBriefItems(orgId: string, params = {}): Promise<BriefItemsResponse> {
  try {
    const api = await getAuthenticatedApi();

    const res = await api.get(`/organisations/${orgId}/brief-items`, {
      params,
      // headers:{
      //   "x-api-key": apiKey?? "",
      // }
    });

    return res.data;
  } catch (error) {
    console.log(error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to fetch items');
    }
    throw new Error('An unexpected error occurred');
  }
}
export async function getItemById(id: string): Promise<ProductResponse> {
  try {
    const api = await getAuthenticatedApi();

    const res = await api.get(`/items/${id}`);

    return res.data;
  } catch (error) {
    console.log(error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to fetch items');
    }
    throw new Error('An unexpected error occurred');
  }
}
export async function getBriefItemById(id: string) {
  try {
    const api = await getAuthenticatedApi();

    const item = await db.item.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        sku: true,
        updatedAt: true,
        supplierRelations: {
          include: {
            supplier: true,
          },
        },
      },
    });

    return item;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function updateItemById(id: string, data: Partial<ProductData>) {
  try {
    await db.item.update({
      where: {
        id,
      },
      data,
    });

    console.log('Updating Item', id, data);
    revalidatePath(`/dashboard/inventory/items/${id}`);
    return { success: true };
  } catch (error) {
    console.log(error);
    return {
      success: false,
    };
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
    revalidatePath('/dashboard/categories');
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
      where: {
        id,
      },
    });
    if (!item) {
      return {
        success: false,
        data: null,
        error: 'No Item found',
      };
    }
    if (item.salesCount > 0) {
      return {
        success: false,
        data: null,
        error: 'Items with sales cannot be deleted',
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
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      data: null,
      error: 'Failed to delete the item',
    };
  }
}

export async function getItemSuppliers(itemId: string) {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;

    // Add timeout to prevent long-running queries
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database query timeout')), 5000);
    });

    const queryPromise = db.itemSupplier.findMany({
      where: {
        itemId,
        item: {
          orgId,
        },
      },
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

export async function updateItemSupplier(id: string, data: any) {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;

    // Verify the item supplier belongs to the user's organization
    const itemSupplier = await db.itemSupplier.findFirst({
      where: {
        id,
        item: {
          orgId,
        },
      },
    });

    if (!itemSupplier) {
      return {
        success: false,
        error: 'Item supplier not found',
      };
    }

    const updatedSupplier = await db.itemSupplier.update({
      where: { id },
      data,
    });

    revalidatePath(`/dashboard/inventory/items/${itemSupplier.itemId}`);

    return {
      success: true,
      data: updatedSupplier,
    };
  } catch (error) {
    console.error('Error updating item supplier:', error);
    return {
      success: false,
      error: 'Failed to update item supplier',
    };
  }
}

export async function deleteItemSupplier(id: string) {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;

    // Verify the item supplier belongs to the user's organization
    const itemSupplier = await db.itemSupplier.findFirst({
      where: {
        id,
        item: {
          orgId,
        },
      },
    });

    if (!itemSupplier) {
      throw new Error('Item supplier not found');
    }

    await db.itemSupplier.delete({
      where: { id },
    });

    revalidatePath(`/dashboard/inventory/items/${itemSupplier.itemId}`);
  } catch (error) {
    console.error('Error deleting item supplier:', error);
    throw error;
  }
}
