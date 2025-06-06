'use server';
import { getAuthenticatedUser } from '@/config/useAuth';
import { db } from '@/prisma/db';

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
        category: true,
        brand: true,
        unit: true,
        taxRate: true,
        inventories: {
          include: {
            location: {
              select: {
                id: true,
                name: true,
                type: true,
              },
            },
          },
        },
      },
    });

    if (!item) {
      return { success: false, error: 'Item not found' };
    }

    // Get sales history from sales order lines
    const salesHistory = await db.salesOrderLine.findMany({
      where: {
        itemId: itemId,
        salesOrder: {
          orgId: orgId,
          status: 'CONFIRMED', // Only confirmed orders
        },
      },
      include: {
        salesOrder: {
          select: {
            id: true,
            orderNumber: true,
            date: true,
            status: true,
            customer: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // Limit to last 50 sales
    });

    // Get current total inventory across all locations
    const totalInventory = item.inventories.reduce((sum, inv) => sum + inv.quantity, 0);

    return {
      success: true,
      data: {
        ...item,
        totalInventory,
        salesHistory: salesHistory.map((sale) => ({
          id: sale.id,
          quantity: sale.quantity,
          unitPrice: Number(sale.unitPrice),
          total: Number(sale.total),
          date: sale.salesOrder.date.toISOString(),
          orderNumber: sale.salesOrder.orderNumber,
          customerName: sale.salesOrder.customer?.name || 'Walk-in Customer',
          createdAt: sale.createdAt.toISOString(),
        })),
        salesCount: item.salesCount,
        salesTotal: Number(item.salesTotal),
        costPrice: Number(item.costPrice),
        sellingPrice: Number(item.sellingPrice),
      },
    };
  } catch (error) {
    console.error('Error fetching item details:', error);
    return { success: false, error: 'Failed to fetch item details' };
  }
}

export async function getInventoryMovements(itemId: string) {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;

    // Get all movements for this item
    const movements = [];

    // Sales orders (outgoing)
    const salesMovements = await db.salesOrderLine.findMany({
      where: {
        itemId: itemId,
        salesOrder: {
          orgId: orgId,
          status: 'CONFIRMED',
        },
      },
      include: {
        salesOrder: {
          select: {
            orderNumber: true,
            date: true,
            location: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    movements.push(
      ...salesMovements.map((movement) => ({
        id: movement.id,
        type: 'SALE' as const,
        quantity: -movement.quantity, // Negative for outgoing
        reference: movement.salesOrder.orderNumber,
        location: movement.salesOrder.location.name,
        date: movement.salesOrder.date.toISOString(),
        createdAt: movement.createdAt.toISOString(),
      })),
    );

    // Purchase orders (incoming) - from goods receipts
    const purchaseMovements = await db.goodsReceiptLine.findMany({
      where: {
        itemId: itemId,
        goodsReceipt: {
          orgId: orgId,
          status: 'COMPLETED',
        },
      },
      include: {
        goodsReceipt: {
          select: {
            receiptNumber: true,
            date: true,
            location: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    movements.push(
      ...purchaseMovements.map((movement) => ({
        id: movement.id,
        type: 'PURCHASE' as const,
        quantity: movement.receivedQuantity, // Positive for incoming
        reference: movement.goodsReceipt.receiptNumber,
        location: movement.goodsReceipt.location.name,
        date: movement.goodsReceipt.date.toISOString(),
        createdAt: movement.createdAt.toISOString(),
      })),
    );

    // Adjustments
    const adjustmentMovements = await db.adjustmentLine.findMany({
      where: {
        itemId: itemId,
        adjustment: {
          orgId: orgId,
          status: 'COMPLETED',
        },
      },
      include: {
        adjustment: {
          select: {
            adjustmentNumber: true,
            date: true,
            reason: true,
            location: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    movements.push(
      ...adjustmentMovements.map((movement) => ({
        id: movement.id,
        type: 'ADJUSTMENT' as const,
        quantity: movement.adjustedQuantity,
        reference: movement.adjustment.adjustmentNumber,
        location: movement.adjustment.location.name,
        reason: movement.adjustment.reason,
        date: movement.adjustment.date.toISOString(),
        createdAt: movement.createdAt.toISOString(),
      })),
    );

    // Sort all movements by date (most recent first)
    movements.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return {
      success: true,
      data: movements,
    };
  } catch (error) {
    console.error('Error fetching inventory movements:', error);
    return { success: false, error: 'Failed to fetch inventory movements' };
  }
}
