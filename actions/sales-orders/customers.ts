'use server';

import { getAuthenticatedUser } from '@/config/useAuth';
import { db } from '@/prisma/db';
import { revalidatePath } from 'next/cache';

export async function getCustomers() {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;

    const customers = await db.customer.findMany({
      where: {
        orgId,
        isActive: true,
      },
      orderBy: { name: 'asc' },
    });

    return customers;
  } catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
}

export async function getCustomerById(id: string) {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;

    const customer = await db.customer.findFirst({
      where: {
        id,
        orgId,
      },
      include: {
        salesOrders: {
          include: {
            location: {
              select: {
                id: true,
                name: true,
                address: true,
              },
            },
            createdBy: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
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
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!customer) {
      return null;
    }

    // Calculate customer statistics
    const totalOrders = customer.salesOrders.length;
    const totalSpent = customer.salesOrders.reduce((sum, order) => sum + Number(order.total), 0);
    const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

    // Order status breakdown
    const ordersByStatus = customer.salesOrders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Payment status breakdown
    const ordersByPaymentStatus = customer.salesOrders.reduce((acc, order) => {
      acc[order.paymentStatus] = (acc[order.paymentStatus] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Most purchased items
    const itemPurchases = customer.salesOrders.flatMap((order) =>
      order.lines.map((line) => ({
        itemId: line.itemId,
        itemName: line.item.name,
        quantity: line.quantity,
        total: Number(line.total),
      })),
    );

    const itemStats = itemPurchases.reduce((acc, purchase) => {
      if (!acc[purchase.itemId]) {
        acc[purchase.itemId] = {
          itemName: purchase.itemName,
          totalQuantity: 0,
          totalSpent: 0,
          orderCount: 0,
        };
      }
      acc[purchase.itemId].totalQuantity += purchase.quantity;
      acc[purchase.itemId].totalSpent += purchase.total;
      acc[purchase.itemId].orderCount += 1;
      return acc;
    }, {} as Record<string, any>);

    const topItems = Object.values(itemStats)
      .sort((a: any, b: any) => b.totalSpent - a.totalSpent)
      .slice(0, 5);

    return {
      ...customer,
      createdAt: customer.createdAt.toISOString(),
      updatedAt: customer.updatedAt.toISOString(),
      salesOrders: customer.salesOrders.map((order) => ({
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
      statistics: {
        totalOrders,
        totalSpent,
        averageOrderValue,
        ordersByStatus,
        ordersByPaymentStatus,
        topItems,
      },
    };
  } catch (error) {
    console.error('Error fetching customer:', error);
    return null;
  }
}

export async function createCustomer(data: {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  taxId?: string;
  notes?: string;
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

    revalidatePath('/dashboard/sales/customers');
    return { success: true, data: customer };
  } catch (error) {
    console.error('Error creating customer:', error);
    return { success: false, error: 'Failed to create customer' };
  }
}

export async function updateCustomer(
  id: string,
  data: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    taxId?: string;
    notes?: string;
    isActive?: boolean;
  },
) {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;

    const customer = await db.customer.update({
      where: {
        id,
        orgId,
      },
      data,
    });

    revalidatePath('/dashboard/sales/customers');
    revalidatePath(`/dashboard/sales/customers/${id}`);
    return { success: true, data: customer };
  } catch (error) {
    console.error('Error updating customer:', error);
    return { success: false, error: 'Failed to update customer' };
  }
}
