'use server';

import { getAuthenticatedUser } from '@/config/useAuth';
import { db } from '@/prisma/db';

export async function getItems() {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;

    const items = await db.item.findMany({
      where: {
        orgId,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        sku: true,
        sellingPrice: true,
        costPrice: true,
        unitOfMeasure: true,
        thumbnail: true,
        description: true,
        minStockLevel: true,
        maxStockLevel: true,
      },
      orderBy: { name: 'asc' },
    });

    return items.map((item) => ({
      ...item,
      sellingPrice: Number(item.sellingPrice),
      costPrice: Number(item.costPrice),
    }));
  } catch (error) {
    console.error('Error fetching items:', error);
    return [];
  }
}

export async function getLocations() {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;

    const locations = await db.location.findMany({
      where: {
        orgId,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        type: true,
        address: true,
      },
      orderBy: { name: 'asc' },
    });

    return locations;
  } catch (error) {
    console.error('Error fetching locations:', error);
    return [];
  }
}
