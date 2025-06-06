'use server';
import { getAuthenticatedUser } from '@/config/useAuth';
import { revalidatePath } from 'next/cache';
import { db } from '@/prisma/db';

export async function getItemsForPOS(search?: string, categoryId?: string) {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;

    const where = {
      orgId,
      isActive: true,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { sku: { contains: search, mode: 'insensitive' as const } },
          { barcode: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
      ...(categoryId && { categoryId }),
    };

    const items = await db.item.findMany({
      where,
      include: {
        category: true,
        brand: true,
        unit: true,
        inventories: {
          include: {
            location: true,
          },
        },
      },
      orderBy: { name: 'asc' },
      take: 50,
    });

    return items.map((item) => ({
      id: item.id,
      name: item.name,
      sku: item.sku,
      barcode: item.barcode,
      thumbnail: item.thumbnail,
      sellingPrice: Number(item.sellingPrice),
      costPrice: Number(item.costPrice),
      category: item.category,
      brand: item.brand,
      unit: item.unit,
      totalStock: item.inventories.reduce((sum, inv) => sum + inv.quantity, 0),
      available: item.inventories.reduce(
        (sum, inv) => sum + (inv.quantity - inv.reservedQuantity),
        0,
      ),
    }));
  } catch (error) {
    console.error('Error fetching items for POS:', error);
    return [];
  }
}

export async function getCategoriesForPOS() {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;

    const categories = await db.category.findMany({
      where: { orgId },
      orderBy: { title: 'asc' },
    });

    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function getCustomersForPOS(search?: string) {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;

    const where = {
      orgId,
      isActive: true,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
          { phone: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const customers = await db.customer.findMany({
      where,
      orderBy: { name: 'asc' },
      take: 20,
    });

    return customers;
  } catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
}

export async function createCustomer(data: {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}) {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;

    const customer = await db.customer.create({
      data: {
        ...data,
        orgId,
      },
    });

    return { success: true, data: customer };
  } catch (error) {
    console.error('Error creating customer:', error);
    return { success: false, error: 'Failed to create customer' };
  }
}

export async function processPOSSale(data: {
  customerId?: string;
  locationId: string;
  items: Array<{
    itemId: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
    taxRate?: number;
  }>;
  paymentMethod: string;
  amountPaid: number;
  discount?: number;
  taxRate?: number;
  notes?: string;
}) {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;

    // Get default location if not provided
    let locationId = data.locationId;
    if (locationId === 'default') {
      // Try to find a location marked as default in the name or description
      const defaultLocation = await db.location.findFirst({
        where: {
          orgId,
          OR: [
            { name: { contains: 'default', mode: 'insensitive' as const } },
            { description: { contains: 'default', mode: 'insensitive' as const } },
          ],
        },
        select: { id: true },
      });

      if (!defaultLocation) {
        const anyLocation = await db.location.findFirst({
          where: { orgId },
          select: { id: true },
        });

        if (!anyLocation) {
          return { success: false, error: 'No location found for this organization' };
        }

        locationId = anyLocation.id;
      } else {
        locationId = defaultLocation.id;
      }
    }

    // Generate POS order number
    const lastOrder = await db.salesOrder.findFirst({
      where: { orgId, source: 'POS' },
      orderBy: { createdAt: 'desc' },
      select: { orderNumber: true },
    });

    let orderNumber = `POS-${orgId.slice(-4).toUpperCase()}-001`;
    if (lastOrder?.orderNumber) {
      const lastNumber = Number.parseInt(lastOrder.orderNumber.split('-').pop() || '0');
      orderNumber = `POS-${orgId.slice(-4).toUpperCase()}-${String(lastNumber + 1).padStart(
        3,
        '0',
      )}`;
    }

    // Calculate totals
    let subtotal = 0;
    let taxAmount = 0;
    let discountAmount = 0;

    const processedLines = data.items.map((line) => {
      const lineSubtotal = line.quantity * line.unitPrice;
      const lineDiscount = ((line.discount || 0) * lineSubtotal) / 100;
      const lineAfterDiscount = lineSubtotal - lineDiscount;
      const lineTax = ((line.taxRate || data.taxRate || 0) * lineAfterDiscount) / 100;
      const lineTotal = lineAfterDiscount + lineTax;

      subtotal += lineSubtotal;
      discountAmount += lineDiscount;
      taxAmount += lineTax;

      return {
        itemId: line.itemId,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
        discount: line.discount || 0,
        taxRate: line.taxRate || data.taxRate || 0,
        taxAmount: lineTax,
        total: lineTotal,
        serialNumbers: [],
      };
    });

    // Apply overall discount
    if (data.discount) {
      const overallDiscount = (data.discount * subtotal) / 100;
      discountAmount += overallDiscount;
    }

    const total = subtotal - discountAmount + taxAmount;
    const change = data.amountPaid - total;

    if (change < 0) {
      return { success: false, error: 'Insufficient payment amount' };
    }

    // Use transaction to ensure data consistency
    const result = await db.$transaction(async (tx) => {
      // Create the sales order
      const order = await tx.salesOrder.create({
        data: {
          orderNumber,
          orgId,
          source: 'POS',
          customerId: data.customerId,
          locationId,
          createdById: user.id,
          date: new Date(),
          status: 'CONFIRMED', // POS sales are immediately confirmed
          paymentStatus: 'PAID', // POS sales are immediately paid
          paymentMethod: data.paymentMethod,
          notes: data.notes,
          subtotal,
          taxAmount,
          discount: discountAmount,
          total,
          lines: {
            create: processedLines,
          },
        },
        include: {
          customer: true,
          location: true,
          lines: {
            include: {
              item: true,
            },
          },
        },
      });

      // Update inventory for each item
      for (const line of processedLines) {
        await tx.inventory.upsert({
          where: {
            itemId_locationId: {
              itemId: line.itemId,
              locationId,
            },
          },
          update: {
            quantity: {
              decrement: line.quantity,
            },
            updatedAt: new Date(),
          },
          create: {
            itemId: line.itemId,
            locationId,
            orgId,
            quantity: Math.max(0, -line.quantity),
            reservedQuantity: 0,
          },
        });

        // Update item sales statistics
        await tx.item.update({
          where: { id: line.itemId },
          data: {
            salesCount: {
              increment: line.quantity,
            },
            salesTotal: {
              increment: line.total,
            },
            updatedAt: new Date(),
          },
        });
      }

      return { order, change };
    });

    revalidatePath('/dashboard/sales/pos');
    revalidatePath('/dashboard/sales/orders');
    revalidatePath('/dashboard/inventory');

    return {
      success: true,
      data: {
        order: result.order,
        change: change,
        amountPaid: data.amountPaid,
      },
    };
  } catch (error) {
    console.error('Error processing POS sale:', error);
    return { success: false, error: 'Failed to process sale' };
  }
}

export async function getPOSOrderById(id: string) {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;

    const order = await db.salesOrder.findFirst({
      where: {
        id,
        orgId,
        source: 'POS',
      },
      include: {
        customer: true,
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        location: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
            address: true,
            country: true,
            state: true,
            currency: true,
          },
        },
        lines: {
          include: {
            item: {
              select: {
                id: true,
                name: true,
                description: true,
                sku: true,
                thumbnail: true,
                sellingPrice: true,
                unitOfMeasure: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return { success: false, error: 'Order not found' };
    }

    return {
      success: true,
      data: {
        ...order,
        subtotal: Number(order.subtotal),
        taxAmount: Number(order.taxAmount),
        total: Number(order.total),
        shippingCost: order.shippingCost ? Number(order.shippingCost) : null,
        discount: order.discount ? Number(order.discount) : null,
        date: order.date.toISOString(),
        createdAt: order.createdAt.toISOString(),
        updatedAt: order.updatedAt.toISOString(),
        lines: order.lines.map((line) => ({
          ...line,
          unitPrice: Number(line.unitPrice),
          taxRate: Number(line.taxRate),
          taxAmount: Number(line.taxAmount),
          discount: line.discount ? Number(line.discount) : null,
          total: Number(line.total),
          createdAt: line.createdAt.toISOString(),
          updatedAt: line.updatedAt.toISOString(),
          item: {
            ...line.item,
            sellingPrice: Number(line.item.sellingPrice),
          },
        })),
      },
    };
  } catch (error) {
    console.error('Error fetching POS order:', error);
    return { success: false, error: 'Failed to fetch order' };
  }
}

export async function getRecentPOSSales(limit = 10) {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;

    const orders = await db.salesOrder.findMany({
      where: {
        orgId,
        source: 'POS',
      },
      include: {
        customer: true,
        lines: {
          include: {
            item: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return orders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customer?.name || 'Walk-in Customer',
      total: Number(order.total),
      itemCount: order.lines.reduce((sum, line) => sum + line.quantity, 0),
      date: order.date.toISOString(),
      paymentMethod: order.paymentMethod,
    }));
  } catch (error) {
    console.error('Error fetching recent POS sales:', error);
    return [];
  }
}

export async function getPOSStats() {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [todaySales, todayOrders, totalSales, totalOrders] = await Promise.all([
      db.salesOrder.aggregate({
        where: {
          orgId,
          source: 'POS',
          date: { gte: today },
        },
        _sum: { total: true },
      }),
      db.salesOrder.count({
        where: {
          orgId,
          source: 'POS',
          date: { gte: today },
        },
      }),
      db.salesOrder.aggregate({
        where: {
          orgId,
          source: 'POS',
        },
        _sum: { total: true },
      }),
      db.salesOrder.count({
        where: {
          orgId,
          source: 'POS',
        },
      }),
    ]);

    return {
      todaySales: Number(todaySales._sum.total || 0),
      todayOrders,
      totalSales: Number(totalSales._sum.total || 0),
      totalOrders,
    };
  } catch (error) {
    console.error('Error fetching POS stats:', error);
    return {
      todaySales: 0,
      todayOrders: 0,
      totalSales: 0,
      totalOrders: 0,
    };
  }
}
