'use server';
import { getAuthenticatedUser } from '@/config/useAuth';
import { revalidatePath } from 'next/cache';
import type { SalesOrderStatus, PaymentStatus } from '@prisma/client';
import { db } from '@/prisma/db';

export async function getSalesOrders(page = 1, limit = 10, search = '', status = '') {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;

    const skip = (page - 1) * limit;

    const where = {
      orgId,
      ...(search && {
        OR: [
          { orderNumber: { contains: search, mode: 'insensitive' as const } },
          { customer: { name: { contains: search, mode: 'insensitive' as const } } },
          { notes: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
      ...(status && { status: status as SalesOrderStatus }),
    };

    const [orders, total] = await Promise.all([
      db.salesOrder.findMany({
        where,
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
          lines: {
            include: {
              item: {
                select: {
                  id: true,
                  name: true,
                  sku: true,
                  thumbnail: true,
                  sellingPrice: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      db.salesOrder.count({ where }),
    ]);

    return {
      orders: orders.map((order) => ({
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
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error fetching sales orders:', error);
    return {
      orders: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
      },
    };
  }
}

export async function getSalesOrderById(id: string) {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;

    const order = await db.salesOrder.findFirst({
      where: {
        id,
        orgId,
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
      throw new Error('Sales order not found');
    }

    return {
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
    };
  } catch (error) {
    console.error('Error fetching sales order:', error);
    return null;
  }
}

export async function createSalesOrder(data: {
  customerId?: string;
  locationId: string;
  date: string;
  paymentMethod?: string;
  notes?: string;
  lines: Array<{
    itemId: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
    taxRate?: number;
  }>;
}) {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;

    // Generate organization-specific order number
    const lastOrder = await db.salesOrder.findFirst({
      where: { orgId },
      orderBy: { createdAt: 'desc' },
      select: { orderNumber: true },
    });

    let orderNumber = `SO-${orgId.slice(-4).toUpperCase()}-001`;
    if (lastOrder?.orderNumber) {
      const lastNumber = Number.parseInt(lastOrder.orderNumber.split('-').pop() || '0');
      orderNumber = `SO-${orgId.slice(-4).toUpperCase()}-${String(lastNumber + 1).padStart(
        3,
        '0',
      )}`;
    }

    // Calculate totals
    let subtotal = 0;
    let taxAmount = 0;
    let discountAmount = 0;

    const processedLines = data.lines.map((line) => {
      const lineSubtotal = line.quantity * line.unitPrice;
      const lineDiscount = ((line.discount || 0) * lineSubtotal) / 100;
      const lineAfterDiscount = lineSubtotal - lineDiscount;
      const lineTax = ((line.taxRate || 0) * lineAfterDiscount) / 100;
      const lineTotal = lineAfterDiscount + lineTax;

      subtotal += lineSubtotal;
      discountAmount += lineDiscount;
      taxAmount += lineTax;

      return {
        itemId: line.itemId,
        quantity: line.quantity,
        unitPrice: line.unitPrice,
        discount: line.discount || 0,
        taxRate: line.taxRate || 0,
        taxAmount: lineTax,
        total: lineTotal,
        serialNumbers: [],
      };
    });

    const total = subtotal - discountAmount + taxAmount;

    const order = await db.salesOrder.create({
      data: {
        orderNumber,
        orgId,
        customerId: data.customerId,
        locationId: data.locationId,
        createdById: user.id,
        date: new Date(data.date),
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

    revalidatePath('/dashboard/sales/orders');
    return { success: true, data: order };
  } catch (error) {
    console.error('Error creating sales order:', error);
    return { success: false, error: 'Failed to create sales order' };
  }
}

export async function updateSalesOrderStatus(id: string, status: SalesOrderStatus) {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;

    const order = await db.salesOrder.update({
      where: {
        id,
        orgId,
      },
      data: { status },
      include: {
        customer: true,
        lines: {
          include: {
            item: true,
          },
        },
      },
    });

    // Update inventory when order is confirmed
    if (status === 'CONFIRMED') {
      for (const line of order.lines) {
        await db.inventory.upsert({
          where: {
            itemId_locationId: {
              itemId: line.itemId,
              locationId: order.locationId,
            },
          },
          update: {
            quantity: {
              decrement: line.quantity,
            },
          },
          create: {
            itemId: line.itemId,
            locationId: order.locationId,
            orgId,
            quantity: -line.quantity,
          },
        });
      }
    }

    revalidatePath('/dashboard/sales/orders');
    revalidatePath(`/dashboard/sales/orders/${id}`);
    return { success: true, data: order };
  } catch (error) {
    console.error('Error updating sales order status:', error);
    return { success: false, error: 'Failed to update sales order status' };
  }
}

export async function updatePaymentStatus(id: string, paymentStatus: PaymentStatus) {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;

    const order = await db.salesOrder.update({
      where: {
        id,
        orgId,
      },
      data: { paymentStatus },
    });

    revalidatePath('/dashboard/sales/orders');
    revalidatePath(`/dashboard/sales/orders/${id}`);
    return { success: true, data: order };
  } catch (error) {
    console.error('Error updating payment status:', error);
    return { success: false, error: 'Failed to update payment status' };
  }
}

export async function deleteSalesOrder(id: string) {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;

    await db.salesOrder.delete({
      where: {
        id,
        orgId,
      },
    });

    revalidatePath('/dashboard/sales/orders');
    return { success: true };
  } catch (error) {
    console.error('Error deleting sales order:', error);
    return { success: false, error: 'Failed to delete sales order' };
  }
}

export async function getSalesOrderStats() {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;

    const [totalOrders, pendingOrders, confirmedOrders, totalRevenue] = await Promise.all([
      db.salesOrder.count({
        where: { orgId },
      }),
      db.salesOrder.count({
        where: {
          orgId,
          status: 'DRAFT',
        },
      }),
      db.salesOrder.count({
        where: {
          orgId,
          status: 'CONFIRMED',
        },
      }),
      db.salesOrder.aggregate({
        where: {
          orgId,
          status: { in: ['CONFIRMED', 'SHIPPED', 'DELIVERED', 'COMPLETED'] },
        },
        _sum: { total: true },
      }),
    ]);

    return {
      totalOrders,
      pendingOrders,
      confirmedOrders,
      totalRevenue: Number(totalRevenue._sum.total || 0),
    };
  } catch (error) {
    console.error('Error fetching sales order stats:', error);
    return {
      totalOrders: 0,
      pendingOrders: 0,
      confirmedOrders: 0,
      totalRevenue: 0,
    };
  }
}
