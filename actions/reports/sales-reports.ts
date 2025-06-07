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
import { z } from 'zod';

// Define filter schema for type safety
const filterSchema = z.object({
  dateRange: z
    .enum(['today', 'yesterday', 'last7days', 'last30days', 'thisMonth', 'lastMonth', 'custom'])
    .optional()
    .default('last30days'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  locationIds: z.array(z.string()).optional(),
  paymentMethods: z.array(z.string()).optional(),
  paymentStatus: z.array(z.string()).optional(),
  orderStatus: z.array(z.string()).optional(),
  minAmount: z.number().optional(),
  maxAmount: z.number().optional(),
  search: z.string().optional(),
  sortBy: z.string().optional().default('date'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type SalesReportFilters = z.infer<typeof filterSchema>;

// Helper function to get date range based on filter
function getDateRange(filter: SalesReportFilters) {
  const now = new Date();
  let startDate: Date;
  let endDate = endOfDay(now);

  switch (filter.dateRange) {
    case 'today':
      startDate = startOfDay(now);
      break;
    case 'yesterday':
      startDate = startOfDay(subDays(now, 1));
      endDate = endOfDay(subDays(now, 1));
      break;
    case 'last7days':
      startDate = startOfDay(subDays(now, 6));
      break;
    case 'last30days':
      startDate = startOfDay(subDays(now, 29));
      break;
    case 'thisMonth':
      startDate = startOfMonth(now);
      break;
    case 'lastMonth':
      startDate = startOfMonth(subMonths(now, 1));
      endDate = endOfMonth(subMonths(now, 1));
      break;
    case 'custom':
      startDate = filter.startDate
        ? startOfDay(new Date(filter.startDate))
        : startOfDay(subDays(now, 29));
      endDate = filter.endDate ? endOfDay(new Date(filter.endDate)) : endOfDay(now);
      break;
    default:
      startDate = startOfDay(subDays(now, 29));
  }

  return { startDate, endDate };
}

export async function getSalesReportSummary(filters: SalesReportFilters) {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;
    const { startDate, endDate } = getDateRange(filters);

    // Build where clause based on filters
    const where: any = {
      orgId,
      date: { gte: startDate, lte: endDate },
    };

    // Add optional filters
    if (filters.locationIds?.length) {
      where.locationId = { in: filters.locationIds };
    }
    if (filters.paymentMethods?.length) {
      where.paymentMethod = { in: filters.paymentMethods };
    }
    if (filters.paymentStatus?.length) {
      where.paymentStatus = { in: filters.paymentStatus };
    }
    if (filters.orderStatus?.length) {
      where.status = { in: filters.orderStatus };
    }
    if (filters.minAmount !== undefined) {
      where.total = { ...where.total, gte: filters.minAmount };
    }
    if (filters.maxAmount !== undefined) {
      where.total = { ...where.total, lte: filters.maxAmount };
    }
    if (filters.search) {
      where.OR = [
        { orderNumber: { contains: filters.search, mode: 'insensitive' } },
        { customer: { name: { contains: filters.search, mode: 'insensitive' } } },
      ];
    }

    // Get summary data
    const [
      totalSales,
      salesByDay,
      salesByPaymentMethod,
      salesByStatus,
      salesByLocation,
      averageOrderValue,
      orderCount,
      itemCount,
    ] = await Promise.all([
      // Total sales
      db.salesOrder.aggregate({
        where,
        _sum: { total: true, subtotal: true, taxAmount: true, discount: true },
      }),

      // Sales by day
      db.salesOrder.groupBy({
        by: ['date'],
        where,
        _sum: { total: true },
        _count: true,
        orderBy: { date: 'asc' },
      }),

      // Sales by payment method
      db.salesOrder.groupBy({
        by: ['paymentMethod'],
        where,
        _sum: { total: true },
        _count: true,
      }),

      // Sales by status
      db.salesOrder.groupBy({
        by: ['status'],
        where,
        _sum: { total: true },
        _count: true,
      }),

      // Sales by location
      db.salesOrder.groupBy({
        by: ['locationId'],
        where,
        _sum: { total: true },
        _count: true,
      }),

      // Average order value
      db.salesOrder.aggregate({
        where,
        _avg: { total: true },
      }),

      // Order count
      db.salesOrder.count({ where }),

      // Item count
      db.salesOrderLine.aggregate({
        where: {
          salesOrder: where,
        },
        _sum: { quantity: true },
      }),
    ]);

    // Get location names for the location IDs
    const locationIds = salesByLocation.map((item) => item.locationId).filter(Boolean);
    const locations =
      locationIds.length > 0
        ? await db.location.findMany({
            where: { id: { in: locationIds } },
            select: { id: true, name: true },
          })
        : [];

    // Format the data with proper null checks
    const formattedSalesByDay = salesByDay.map((day) => ({
      date: format(day.date, 'MMM dd'),
      total: Number(day._sum?.total || 0),
      count: day._count,
    }));

    const formattedSalesByPaymentMethod = salesByPaymentMethod.map((item) => ({
      method: item.paymentMethod || 'Unknown',
      total: Number(item._sum?.total || 0),
      count: item._count,
    }));

    const formattedSalesByStatus = salesByStatus.map((item) => ({
      status: item.status || 'Unknown',
      total: Number(item._sum?.total || 0),
      count: item._count,
    }));

    const formattedSalesByLocation = salesByLocation.map((item) => {
      const location = locations.find((loc) => loc.id === item.locationId);
      return {
        locationId: item.locationId,
        locationName: location?.name || 'Unknown',
        total: Number(item._sum?.total || 0),
        count: item._count,
      };
    });

    return {
      summary: {
        totalSales: Number(totalSales._sum?.total || 0),
        subtotal: Number(totalSales._sum?.subtotal || 0),
        taxAmount: Number(totalSales._sum?.taxAmount || 0),
        discount: Number(totalSales._sum?.discount || 0),
        averageOrderValue: Number(averageOrderValue._avg?.total || 0),
        orderCount,
        itemCount: Number(itemCount._sum?.quantity || 0),
      },
      salesByDay: formattedSalesByDay,
      salesByPaymentMethod: formattedSalesByPaymentMethod,
      salesByStatus: formattedSalesByStatus,
      salesByLocation: formattedSalesByLocation,
    };
  } catch (error) {
    console.error('Error fetching sales report summary:', error);
    throw new Error('Failed to fetch sales report summary');
  }
}

export async function getSalesReportByCustomers(filters: SalesReportFilters, page = 1, limit = 10) {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;
    const { startDate, endDate } = getDateRange(filters);
    const skip = (page - 1) * limit;

    // Build where clause based on filters
    const where: any = {
      orgId,
      date: { gte: startDate, lte: endDate },
    };

    // Add optional filters
    if (filters.locationIds?.length) {
      where.locationId = { in: filters.locationIds };
    }
    if (filters.paymentMethods?.length) {
      where.paymentMethod = { in: filters.paymentMethods };
    }
    if (filters.paymentStatus?.length) {
      where.paymentStatus = { in: filters.paymentStatus };
    }
    if (filters.orderStatus?.length) {
      where.status = { in: filters.orderStatus };
    }
    if (filters.minAmount !== undefined) {
      where.total = { ...where.total, gte: filters.minAmount };
    }
    if (filters.maxAmount !== undefined) {
      where.total = { ...where.total, lte: filters.maxAmount };
    }
    if (filters.search) {
      where.OR = [
        { orderNumber: { contains: filters.search, mode: 'insensitive' } },
        { customer: { name: { contains: filters.search, mode: 'insensitive' } } },
      ];
    }

    // Get sales grouped by customer
    const salesByCustomer = await db.salesOrder.groupBy({
      by: ['customerId'],
      where,
      _sum: { total: true },
      _count: true,
      orderBy: {
        _sum: {
          total: filters.sortOrder === 'asc' ? 'asc' : 'desc',
        },
      },
      skip,
      take: limit,
    });

    // Get total count for pagination
    const totalCount = await db.salesOrder.groupBy({
      by: ['customerId'],
      where,
      _count: true,
    });

    // Get customer details
    const customerIds = salesByCustomer
      .map((item) => item.customerId)
      .filter((id): id is string => id !== null);

    const customers =
      customerIds.length > 0
        ? await db.customer.findMany({
            where: { id: { in: customerIds } },
            select: { id: true, name: true, email: true, phone: true },
          })
        : [];

    // Format the data
    const formattedSalesByCustomer = salesByCustomer.map((item) => {
      const customer = customers.find((c) => c.id === item.customerId);
      return {
        customerId: item.customerId,
        customerName: customer?.name || 'Walk-in Customer',
        customerEmail: customer?.email || null,
        customerPhone: customer?.phone || null,
        totalSales: Number(item._sum?.total || 0),
        orderCount: item._count,
      };
    });

    return {
      customers: formattedSalesByCustomer,
      pagination: {
        page,
        limit,
        total: totalCount.length,
        pages: Math.ceil(totalCount.length / limit),
      },
    };
  } catch (error) {
    console.error('Error fetching sales report by customers:', error);
    throw new Error('Failed to fetch sales report by customers');
  }
}

export async function getSalesReportByProducts(filters: SalesReportFilters, page = 1, limit = 10) {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;
    const { startDate, endDate } = getDateRange(filters);
    const skip = (page - 1) * limit;

    // Build where clause based on filters
    const salesOrderWhere: any = {
      orgId,
      date: { gte: startDate, lte: endDate },
    };

    // Add optional filters
    if (filters.locationIds?.length) {
      salesOrderWhere.locationId = { in: filters.locationIds };
    }
    if (filters.paymentMethods?.length) {
      salesOrderWhere.paymentMethod = { in: filters.paymentMethods };
    }
    if (filters.paymentStatus?.length) {
      salesOrderWhere.paymentStatus = { in: filters.paymentStatus };
    }
    if (filters.orderStatus?.length) {
      salesOrderWhere.status = { in: filters.orderStatus };
    }
    if (filters.minAmount !== undefined) {
      salesOrderWhere.total = { ...salesOrderWhere.total, gte: filters.minAmount };
    }
    if (filters.maxAmount !== undefined) {
      salesOrderWhere.total = { ...salesOrderWhere.total, lte: filters.maxAmount };
    }
    if (filters.search) {
      salesOrderWhere.OR = [
        { orderNumber: { contains: filters.search, mode: 'insensitive' } },
        { customer: { name: { contains: filters.search, mode: 'insensitive' } } },
      ];
    }

    const where = {
      salesOrder: salesOrderWhere,
    };

    // Get sales grouped by product
    const salesByProduct = await db.salesOrderLine.groupBy({
      by: ['itemId'],
      where,
      _sum: {
        quantity: true,
        total: true,
      },
      orderBy: {
        _sum: {
          total: filters.sortOrder === 'asc' ? 'asc' : 'desc',
        },
      },
      skip,
      take: limit,
    });

    // Get total count for pagination
    const totalCount = await db.salesOrderLine.groupBy({
      by: ['itemId'],
      where,
      _count: true,
    });

    // Get product details
    const productIds = salesByProduct.map((item) => item.itemId);
    const products =
      productIds.length > 0
        ? await db.item.findMany({
            where: { id: { in: productIds } },
            select: {
              id: true,
              name: true,
              sku: true,
              costPrice: true,
              sellingPrice: true,
              category: { select: { title: true } },
            },
          })
        : [];

    // Format the data
    const formattedSalesByProduct = salesByProduct.map((item) => {
      const product = products.find((p) => p.id === item.itemId);
      const totalSales = Number(item._sum?.total || 0);
      const quantitySold = Number(item._sum?.quantity || 0);
      const costPrice = Number(product?.costPrice || 0);
      const grossProfit = totalSales - costPrice * quantitySold;

      return {
        productId: item.itemId,
        productName: product?.name || 'Unknown Product',
        sku: product?.sku || 'N/A',
        category: product?.category?.title || 'Uncategorized',
        quantitySold,
        totalSales,
        averagePrice: quantitySold > 0 ? totalSales / quantitySold : 0,
        costPrice,
        grossProfit,
        profitMargin: totalSales > 0 ? (grossProfit / totalSales) * 100 : 0,
      };
    });

    return {
      products: formattedSalesByProduct,
      pagination: {
        page,
        limit,
        total: totalCount.length,
        pages: Math.ceil(totalCount.length / limit),
      },
    };
  } catch (error) {
    console.error('Error fetching sales report by products:', error);
    throw new Error('Failed to fetch sales report by products');
  }
}

export async function getFilterOptions() {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;

    const [locations, paymentMethods, orderStatuses, paymentStatuses] = await Promise.all([
      // Get all active locations
      db.location.findMany({
        where: { orgId, isActive: true },
        select: { id: true, name: true },
        orderBy: { name: 'asc' },
      }),

      // Get distinct payment methods
      db.salesOrder.groupBy({
        by: ['paymentMethod'],
        where: { orgId },
      }),

      // Get distinct order statuses
      db.salesOrder.groupBy({
        by: ['status'],
        where: { orgId },
      }),

      // Get distinct payment statuses
      db.salesOrder.groupBy({
        by: ['paymentStatus'],
        where: { orgId },
      }),
    ]);

    return {
      locations: locations.map((loc) => ({ id: loc.id, name: loc.name })),
      paymentMethods: paymentMethods.map((pm) => pm.paymentMethod).filter(Boolean) as string[],
      orderStatuses: orderStatuses.map((os) => os.status).filter(Boolean) as string[],
      paymentStatuses: paymentStatuses.map((ps) => ps.paymentStatus).filter(Boolean) as string[],
    };
  } catch (error) {
    console.error('Error fetching filter options:', error);
    throw new Error('Failed to fetch filter options');
  }
}
