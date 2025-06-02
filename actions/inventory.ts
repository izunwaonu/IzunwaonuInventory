'use server';

import { db } from '@/prisma/db';
import { getAuthenticatedUser } from '@/config/useAuth';

export async function getInventoryItems(search?: string) {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;

    // Get all items with their inventory records
    const items = await db.item.findMany({
      where: {
        orgId,
        isActive: true,
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { sku: { contains: search, mode: 'insensitive' } },
            { barcode: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
      include: {
        inventories: {
          include: {
            location: true,
          },
        },
        category: true,
        brand: true,
        unit: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Transform the data to include calculated fields
    const transformedItems = items.map((item) => {
      const totalStock = item.inventories.reduce((sum, inv) => sum + inv.quantity, 0);
      const totalReserved = item.inventories.reduce((sum, inv) => sum + inv.reservedQuantity, 0);
      const available = totalStock - totalReserved;

      return {
        id: item.id,
        name: item.name,
        sku: item.sku,
        barcode: item.barcode,
        description: item.description,
        thumbnail: item.thumbnail,
        costPrice: Number(item.costPrice),
        sellingPrice: Number(item.sellingPrice),
        minStockLevel: item.minStockLevel,
        maxStockLevel: item.maxStockLevel,
        salesCount: item.salesCount,
        salesTotal: Number(item.salesTotal),
        isActive: item.isActive,
        isSerialTracked: item.isSerialTracked,
        categoryId: item.categoryId,
        brandId: item.brandId,
        unitId: item.unitId,
        totalStock,
        totalReserved,
        available,
        category: item.category,
        brand: item.brand,
        unit: item.unit,
        inventories: item.inventories.map((inv) => ({
          id: inv.id,
          quantity: inv.quantity,
          reservedQuantity: inv.reservedQuantity,
          location: {
            id: inv.location.id,
            name: inv.location.name,
            type: inv.location.type,
          },
        })),
      };
    });

    return transformedItems;
  } catch (error) {
    console.error('Error fetching inventory items:', error);
    return [];
  }
}

export async function getItemDetails(itemId: string) {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;

    const item = await db.item.findFirst({
      where: {
        id: itemId,
        orgId,
      },
      include: {
        inventories: {
          include: {
            location: true,
          },
        },
        category: true,
        brand: true,
        unit: true,
        purchaseOrderLines: {
          include: {
            purchaseOrder: {
              select: {
                poNumber: true,
                status: true,
                date: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
        },
        salesOrderLines: {
          include: {
            salesOrder: {
              select: {
                orderNumber: true,
                status: true,
                date: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 5,
        },
      },
    });

    if (!item) {
      return null;
    }

    const totalStock = item.inventories.reduce((sum, inv) => sum + inv.quantity, 0);
    const totalReserved = item.inventories.reduce((sum, inv) => sum + inv.reservedQuantity, 0);
    const available = totalStock - totalReserved;

    return {
      id: item.id,
      name: item.name,
      sku: item.sku,
      barcode: item.barcode,
      description: item.description,
      dimensions: item.dimensions,
      weight: item.weight ? Number(item.weight) : null,
      upc: item.upc,
      ean: item.ean,
      mpn: item.mpn,
      isbn: item.isbn,
      thumbnail: item.thumbnail,
      imageUrls: item.imageUrls,
      costPrice: Number(item.costPrice),
      sellingPrice: Number(item.sellingPrice),
      minStockLevel: item.minStockLevel,
      maxStockLevel: item.maxStockLevel,
      salesCount: item.salesCount,
      salesTotal: Number(item.salesTotal),
      isActive: item.isActive,
      isSerialTracked: item.isSerialTracked,
      categoryId: item.categoryId,
      brandId: item.brandId,
      unitId: item.unitId,
      totalStock,
      totalReserved,
      available,
      category: item.category,
      brand: item.brand,
      unit: item.unit,
      inventories: item.inventories.map((inv) => ({
        id: inv.id,
        quantity: inv.quantity,
        reservedQuantity: inv.reservedQuantity,
        location: {
          id: inv.location.id,
          name: inv.location.name,
          type: inv.location.type,
          address: inv.location.address,
        },
      })),
      purchaseOrderLines: item.purchaseOrderLines.map((line) => ({
        id: line.id,
        quantity: line.quantity,
        receivedQuantity: line.receivedQuantity,
        purchaseOrder: {
          poNumber: line.purchaseOrder.poNumber,
          status: line.purchaseOrder.status,
          date: line.purchaseOrder.date.toISOString(),
        },
      })),
      salesOrderLines: item.salesOrderLines.map((line) => ({
        id: line.id,
        quantity: line.quantity,
        salesOrder: {
          orderNumber: line.salesOrder.orderNumber,
          status: line.salesOrder.status,
          date: line.salesOrder.date.toISOString(),
        },
      })),
    };
  } catch (error) {
    console.error('Error fetching item details:', error);
    return null;
  }
}
