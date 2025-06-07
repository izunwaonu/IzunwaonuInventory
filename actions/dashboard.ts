'use server';

import { getAuthenticatedUser } from '@/config/useAuth';
import { db } from '@/prisma/db';
import {
  startOfDay,
  endOfDay,
  subDays,
  startOfMonth,
  endOfMonth,
  subMonths,
  format,
} from 'date-fns';

export async function getDashboardStats() {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;

    const today = new Date();
    const startOfToday = startOfDay(today);
    const endOfToday = endOfDay(today);
    const yesterday = subDays(today, 1);
    const startOfYesterday = startOfDay(yesterday);
    const endOfYesterday = endOfDay(yesterday);
    const last7Days = subDays(today, 7);
    const last30Days = subDays(today, 30);
    const thisMonth = startOfMonth(today);
    const lastMonth = subMonths(today, 1);
    const startOfLastMonth = startOfMonth(lastMonth);
    const endOfLastMonth = endOfMonth(lastMonth);

    // Parallel queries for better performance
    const [
      todaySales,
      yesterdaySales,
      thisMonthSales,
      lastMonthSales,
      totalRevenue,
      totalOrders,
      totalCustomers,
      totalItems,
      allItemsForStock,
      allOutOfStockItems,
      topSellingItems,
      recentOrders,
      salesTrend,
      inventoryValue,
      pendingPurchaseOrders,
      pendingTransfers,
    ] = await Promise.all([
      // Today's sales
      db.salesOrder.aggregate({
        where: {
          orgId,
          status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED'] },
          date: { gte: startOfToday, lte: endOfToday },
        },
        _sum: { total: true },
        _count: true,
      }),

      // Yesterday's sales
      db.salesOrder.aggregate({
        where: {
          orgId,
          status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED'] },
          date: { gte: startOfYesterday, lte: endOfYesterday },
        },
        _sum: { total: true },
        _count: true,
      }),

      // This month's sales
      db.salesOrder.aggregate({
        where: {
          orgId,
          status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED'] },
          date: { gte: thisMonth },
        },
        _sum: { total: true },
        _count: true,
      }),

      // Last month's sales
      db.salesOrder.aggregate({
        where: {
          orgId,
          status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED'] },
          date: { gte: startOfLastMonth, lte: endOfLastMonth },
        },
        _sum: { total: true },
        _count: true,
      }),

      // Total revenue (all time)
      db.salesOrder.aggregate({
        where: {
          orgId,
          status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED'] },
        },
        _sum: { total: true },
      }),

      // Total orders
      db.salesOrder.count({
        where: { orgId },
      }),

      // Total customers
      db.customer.count({
        where: { orgId, isActive: true },
      }),

      // Total items
      db.item.count({
        where: { orgId, isActive: true },
      }),

      // Low stock items - fix the query
      db.item.findMany({
        where: {
          orgId,
          isActive: true,
        },
        include: {
          inventories: {
            include: { location: true },
          },
        },
        take: 50, // Get more items to filter client-side
      }),

      // Out of stock items - fix the query
      db.item.findMany({
        where: {
          orgId,
          isActive: true,
        },
        include: {
          inventories: true,
        },
        take: 50, // Get more items to filter client-side
      }),

      // Top selling items
      db.item.findMany({
        where: {
          orgId,
          isActive: true,
          salesCount: { gt: 0 },
        },
        orderBy: { salesCount: 'desc' },
        take: 10,
        include: {
          category: true,
          inventories: {
            include: { location: true },
          },
        },
      }),

      // Recent orders
      db.salesOrder.findMany({
        where: { orgId },
        include: {
          customer: true,
          lines: {
            include: { item: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),

      // Sales trend (last 7 days)
      db.salesOrder.groupBy({
        by: ['date'],
        where: {
          orgId,
          status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED'] },
          date: { gte: last7Days },
        },
        _sum: { total: true },
        _count: true,
        orderBy: { date: 'asc' },
      }),

      // Inventory value
      db.inventory.aggregate({
        where: {
          orgId,
          quantity: { gt: 0 },
        },
        _sum: { quantity: true },
      }),

      // Pending purchase orders
      db.purchaseOrder.count({
        where: {
          orgId,
          status: { in: ['DRAFT', 'SUBMITTED', 'APPROVED'] },
        },
      }),

      // Pending transfers
      db.transfer.count({
        where: {
          orgId,
          status: { in: ['DRAFT', 'APPROVED', 'IN_TRANSIT'] },
        },
      }),
    ]);

    // Calculate percentage changes
    const todayRevenue = Number(todaySales._sum.total || 0);
    const yesterdayRevenue = Number(yesterdaySales._sum.total || 0);
    const revenueChange =
      yesterdayRevenue > 0 ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100 : 0;

    const thisMonthRevenue = Number(thisMonthSales._sum.total || 0);
    const lastMonthRevenue = Number(lastMonthSales._sum.total || 0);
    const monthlyRevenueChange =
      lastMonthRevenue > 0 ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : 0;

    const ordersChange =
      yesterdaySales._count > 0
        ? ((todaySales._count - yesterdaySales._count) / yesterdaySales._count) * 100
        : 0;

    // Filter low stock items client-side
    const lowStockItems = allItemsForStock
      .filter((item: any) => {
        const totalStock = item.inventories.reduce(
          (sum: number, inv: any) => sum + inv.quantity,
          0,
        );
        return totalStock <= item.minStockLevel && totalStock > 0;
      })
      .slice(0, 10);

    // Filter out of stock items client-side
    const outOfStockCount = allOutOfStockItems.filter((item: any) => {
      const totalStock = item.inventories.reduce((sum: number, inv: any) => sum + inv.quantity, 0);
      return totalStock === 0;
    }).length;

    return {
      revenue: {
        today: todayRevenue,
        yesterday: yesterdayRevenue,
        thisMonth: thisMonthRevenue,
        lastMonth: lastMonthRevenue,
        total: Number(totalRevenue._sum.total || 0),
        change: revenueChange,
        monthlyChange: monthlyRevenueChange,
      },
      orders: {
        today: todaySales._count,
        yesterday: yesterdaySales._count,
        thisMonth: thisMonthSales._count,
        lastMonth: lastMonthSales._count,
        total: totalOrders,
        change: ordersChange,
      },
      customers: {
        total: totalCustomers,
      },
      inventory: {
        totalItems,
        lowStockCount: lowStockItems.length,
        outOfStockCount: outOfStockCount,
        totalValue: Number(inventoryValue._sum.quantity || 0),
        lowStockItems: lowStockItems.map((item: any) => ({
          id: item.id,
          name: item.name,
          sku: item.sku,
          minStockLevel: item.minStockLevel,
          currentStock: item.inventories.reduce((sum: number, inv: any) => sum + inv.quantity, 0),
          locations: item.inventories.map((inv: any) => ({
            name: inv.location.name,
            quantity: inv.quantity,
          })),
        })),
      },
      topProducts: topSellingItems.map((item) => ({
        id: item.id,
        name: item.name,
        sku: item.sku,
        salesCount: item.salesCount,
        salesTotal: Number(item.salesTotal),
        category: item.category?.title,
        currentStock: item.inventories.reduce((sum, inv) => sum + inv.quantity, 0),
      })),
      recentOrders: recentOrders.map((order) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        customerName: order.customer?.name || 'Walk-in Customer',
        total: Number(order.total),
        status: order.status,
        paymentStatus: order.paymentStatus,
        source: order.source,
        itemCount: order.lines.reduce((sum, line) => sum + line.quantity, 0),
        date: order.date.toISOString(),
        createdAt: order.createdAt.toISOString(),
      })),
      salesTrend: salesTrend.map((day) => ({
        date: format(day.date, 'MMM dd'),
        revenue: Number(day._sum.total || 0),
        orders: day._count,
      })),
      pendingActions: {
        purchaseOrders: pendingPurchaseOrders,
        transfers: pendingTransfers,
      },
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw new Error('Failed to fetch dashboard statistics');
  }
}

export async function getRecentActivity() {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;

    const [recentSales, recentPurchases, recentTransfers, recentAdjustments] = await Promise.all([
      // Recent sales
      db.salesOrder.findMany({
        where: { orgId },
        include: {
          customer: true,
          createdBy: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),

      // Recent purchases
      db.purchaseOrder.findMany({
        where: { orgId },
        include: {
          supplier: true,
          CreatedBy: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),

      // Recent transfers
      db.transfer.findMany({
        where: { orgId },
        include: {
          fromLocation: true,
          toLocation: true,
          createdBy: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),

      // Recent adjustments
      db.adjustment.findMany({
        where: { orgId },
        include: {
          location: true,
          createdBy: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    const activities = [
      ...recentSales.map((sale) => ({
        id: sale.id,
        type: 'SALE' as const,
        title: `Sale ${sale.orderNumber}`,
        description: `${sale.customer?.name || 'Walk-in Customer'} - ₦${Number(
          sale.total,
        ).toLocaleString()}`,
        user: sale.createdBy ? `${sale.createdBy.firstName} ${sale.createdBy.lastName}` : 'System',
        date: sale.createdAt.toISOString(),
        status: sale.status,
      })),
      ...recentPurchases.map((purchase) => ({
        id: purchase.id,
        type: 'PURCHASE' as const,
        title: `Purchase ${purchase.poNumber}`,
        description: `${purchase.supplier.name} - ₦${Number(purchase.total).toLocaleString()}`,
        user: purchase.CreatedBy
          ? `${purchase.CreatedBy.firstName} ${purchase.CreatedBy.lastName}`
          : 'System',
        date: purchase.createdAt.toISOString(),
        status: purchase.status,
      })),
      ...recentTransfers.map((transfer) => ({
        id: transfer.id,
        type: 'TRANSFER' as const,
        title: `Transfer ${transfer.transferNumber}`,
        description: `${transfer.fromLocation.name} → ${transfer.toLocation.name}`,
        user: transfer.createdBy
          ? `${transfer.createdBy.firstName} ${transfer.createdBy.lastName}`
          : 'System',
        date: transfer.createdAt.toISOString(),
        status: transfer.status,
      })),
      ...recentAdjustments.map((adjustment) => ({
        id: adjustment.id,
        type: 'ADJUSTMENT' as const,
        title: `Adjustment ${adjustment.adjustmentNumber}`,
        description: `${adjustment.location.name} - ${adjustment.reason}`,
        user: adjustment.createdBy
          ? `${adjustment.createdBy.firstName} ${adjustment.createdBy.lastName}`
          : 'System',
        date: adjustment.createdAt.toISOString(),
        status: adjustment.status,
      })),
    ];

    // Sort by date and take the most recent 15
    return activities
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 15);
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    return [];
  }
}

export async function getInventoryAlerts() {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;

    const [lowStockItems, outOfStockItems, expiringItems] = await Promise.all([
      // Low stock items
      db.item.findMany({
        where: {
          orgId,
          isActive: true,
        },
        include: {
          inventories: {
            include: { location: true },
          },
        },
      }),

      // Out of stock items
      db.item.findMany({
        where: {
          orgId,
          isActive: true,
          inventories: {
            every: { quantity: 0 },
          },
        },
        include: {
          inventories: {
            include: { location: true },
          },
        },
        take: 20,
      }),

      // Items with pending purchase orders (as proxy for items that might expire soon)
      db.purchaseOrder.findMany({
        where: {
          orgId,
          status: { in: ['SUBMITTED', 'APPROVED'] },
          expectedDeliveryDate: {
            lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next 7 days
          },
        },
        include: {
          lines: {
            include: { item: true },
          },
        },
        take: 10,
      }),
    ]);

    // Filter low stock items
    const lowStock = lowStockItems
      .filter((item) => {
        const totalStock = item.inventories.reduce((sum, inv) => sum + inv.quantity, 0);
        return totalStock <= item.minStockLevel && totalStock > 0;
      })
      .slice(0, 20);

    return {
      lowStock: lowStock.map((item) => ({
        id: item.id,
        name: item.name,
        sku: item.sku,
        currentStock: item.inventories.reduce((sum, inv) => sum + inv.quantity, 0),
        minStockLevel: item.minStockLevel,
        locations: item.inventories
          .filter((inv) => inv.quantity > 0)
          .map((inv) => ({
            name: inv.location.name,
            quantity: inv.quantity,
          })),
      })),
      outOfStock: outOfStockItems.map((item) => ({
        id: item.id,
        name: item.name,
        sku: item.sku,
        minStockLevel: item.minStockLevel,
      })),
      pendingDeliveries: expiringItems.map((po) => ({
        id: po.id,
        poNumber: po.poNumber,
        expectedDate: po.expectedDeliveryDate?.toISOString(),
        itemCount: po.lines.length,
        supplier: po.supplierName,
      })),
    };
  } catch (error) {
    console.error('Error fetching inventory alerts:', error);
    return {
      lowStock: [],
      outOfStock: [],
      pendingDeliveries: [],
    };
  }
}

export async function getLocationStats() {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;

    const locations = await db.location.findMany({
      where: { orgId, isActive: true },
      include: {
        inventories: {
          include: { item: true },
        },
        salesOrders: {
          where: {
            status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED'] },
            date: { gte: subDays(new Date(), 30) }, // Last 30 days
          },
        },
      },
    });

    return locations.map((location) => {
      const totalItems = location.inventories.length;
      const totalStock = location.inventories.reduce((sum, inv) => sum + inv.quantity, 0);
      const totalValue = location.inventories.reduce(
        (sum, inv) => sum + inv.quantity * Number(inv.item.costPrice),
        0,
      );
      const monthlySales = location.salesOrders.reduce(
        (sum, order) => sum + Number(order.total),
        0,
      );

      return {
        id: location.id,
        name: location.name,
        type: location.type,
        address: location.address,
        totalItems,
        totalStock,
        totalValue,
        monthlySales,
        salesCount: location.salesOrders.length,
      };
    });
  } catch (error) {
    console.error('Error fetching location stats:', error);
    return [];
  }
}
