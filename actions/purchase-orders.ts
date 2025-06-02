'use server';

import { db } from '@/prisma/db';
import type { PurchaseOrderStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { getAuthenticatedUser } from '@/config/useAuth';
import { createGoodsReceipt } from './goods-receipts';

export async function getPurchaseOrders() {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;

    const purchaseOrders = await db.purchaseOrder.findMany({
      where: {
        orgId,
      },
      include: {
        supplier: {
          select: {
            id: true,
            name: true,
            email: true,
            contactPerson: true,
            phone: true,
          },
        },
        deliveryLocation: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
        CreatedBy: {
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
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Serialize the data properly
    return purchaseOrders.map((po) => ({
      ...po,
      subtotal: Number(po.subtotal),
      taxAmount: Number(po.taxAmount),
      total: Number(po.total),
      shippingCost: po.shippingCost ? Number(po.shippingCost) : null,
      discount: po.discount ? Number(po.discount) : null,
      date: po.date.toISOString(),
      expectedDeliveryDate: po.expectedDeliveryDate?.toISOString() || null,
      createdAt: po.createdAt.toISOString(),
      updatedAt: po.updatedAt.toISOString(),
      createdBy: po.CreatedBy
        ? {
            id: po.CreatedBy.id,
            firstName: po.CreatedBy.firstName,
            lastName: po.CreatedBy.lastName,
            email: po.CreatedBy.email,
          }
        : null,
      lines: po.lines.map((line) => ({
        ...line,
        unitPrice: Number(line.unitPrice),
        total: Number(line.total),
        taxAmount: Number(line.taxAmount),
        taxRate: Number(line.taxRate),
        discount: line.discount ? Number(line.discount) : null,
        createdAt: line.createdAt.toISOString(),
        updatedAt: line.updatedAt.toISOString(),
      })),
    }));
  } catch (error) {
    console.error('Error fetching purchase orders:', error);
    return [];
  }
}

export async function receiveOrderItems(
  purchaseOrderId: string,
  receiveData: Array<{ lineId: string; receivedQuantity: number }>,
) {
  try {
    console.log('=== receiveOrderItems Debug ===');
    console.log('purchaseOrderId:', purchaseOrderId);
    console.log('receiveData:', JSON.stringify(receiveData, null, 2));

    const user = await getAuthenticatedUser();
    const orgId = user.orgId;

    // Validate input data
    if (!purchaseOrderId || !receiveData || receiveData.length === 0) {
      console.log('❌ Missing required data');
      return {
        success: false,
        error: 'Missing required data',
      };
    }

    // Validate each receive item
    for (const item of receiveData) {
      console.log('Validating item:', item);
      if (!item.lineId || typeof item.receivedQuantity !== 'number' || item.receivedQuantity <= 0) {
        console.log('❌ Invalid receive data for item:', item);
        return {
          success: false,
          error: 'Invalid receive data',
        };
      }
    }

    // Verify the purchase order belongs to the user's organization
    const purchaseOrder = await db.purchaseOrder.findFirst({
      where: {
        id: purchaseOrderId,
        orgId,
      },
      include: {
        deliveryLocation: {
          select: {
            id: true,
          },
        },
        lines: {
          include: {
            item: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!purchaseOrder) {
      console.log('❌ Purchase order not found');
      return {
        success: false,
        error: 'Purchase order not found',
      };
    }

    console.log('✅ Purchase order found:', purchaseOrder.poNumber);
    console.log('Purchase order lines:', purchaseOrder.lines.length);

    // Validate that all line IDs exist and quantities are valid
    const validatedLines = [];
    for (const data of receiveData) {
      console.log('Processing line data:', data);

      const line = purchaseOrder.lines.find((l) => l.id === data.lineId);
      if (!line) {
        console.log('❌ Line not found:', data.lineId);
        return {
          success: false,
          error: `Line item not found: ${data.lineId}`,
        };
      }

      const remainingQuantity = line.quantity - line.receivedQuantity;
      console.log(
        `Line ${line.item.name}: ordered=${line.quantity}, received=${line.receivedQuantity}, remaining=${remainingQuantity}, requesting=${data.receivedQuantity}`,
      );

      if (data.receivedQuantity > remainingQuantity) {
        console.log('❌ Quantity exceeds remaining');
        return {
          success: false,
          error: `Cannot receive more than remaining quantity for ${line.item.name}`,
        };
      }

      const validatedLine = {
        purchaseOrderLineId: data.lineId,
        itemId: line.item.id,
        receivedQuantity: Number(data.receivedQuantity),
        notes: null,
        serialNumbers: [],
      };

      console.log('✅ Validated line:', validatedLine);
      validatedLines.push(validatedLine);
    }

    console.log('All validated lines:', JSON.stringify(validatedLines, null, 2));

    // Create goods receipt with validated data
    const goodsReceiptData = {
      purchaseOrderId,
      locationId: purchaseOrder.deliveryLocation.id,
      notes: `Goods received for PO ${purchaseOrder.poNumber}`,
      lines: validatedLines,
    };

    console.log('Creating goods receipt with data:', JSON.stringify(goodsReceiptData, null, 2));

    const goodsReceiptResult = await createGoodsReceipt(goodsReceiptData);

    console.log('Goods receipt result:', goodsReceiptResult);

    if (!goodsReceiptResult.success) {
      console.log('❌ Goods receipt creation failed:', goodsReceiptResult.error);
      return {
        success: false,
        error: goodsReceiptResult.error,
      };
    }

    // Get updated purchase order with all lines
    const updatedPO = await db.purchaseOrder.findUnique({
      where: {
        id: purchaseOrderId,
      },
      include: {
        supplier: {
          select: {
            id: true,
            name: true,
            email: true,
            contactPerson: true,
            phone: true,
          },
        },
        deliveryLocation: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
        CreatedBy: {
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
              },
            },
          },
        },
      },
    });

    if (!updatedPO) {
      return {
        success: false,
        error: 'Purchase order not found',
      };
    }

    // Return the updated PO with proper serialization
    const serializedPO = {
      ...updatedPO,
      subtotal: Number(updatedPO.subtotal),
      taxAmount: Number(updatedPO.taxAmount),
      total: Number(updatedPO.total),
      shippingCost: updatedPO.shippingCost ? Number(updatedPO.shippingCost) : null,
      discount: updatedPO.discount ? Number(updatedPO.discount) : null,
      date: updatedPO.date.toISOString(),
      expectedDeliveryDate: updatedPO.expectedDeliveryDate?.toISOString() || null,
      createdAt: updatedPO.createdAt.toISOString(),
      updatedAt: updatedPO.updatedAt.toISOString(),
      createdBy: updatedPO.CreatedBy
        ? {
            id: updatedPO.CreatedBy.id,
            firstName: updatedPO.CreatedBy.firstName,
            lastName: updatedPO.CreatedBy.lastName,
            email: updatedPO.CreatedBy.email,
          }
        : null,
      lines: updatedPO.lines.map((line) => ({
        ...line,
        unitPrice: Number(line.unitPrice),
        total: Number(line.total),
        taxAmount: Number(line.taxAmount),
        taxRate: Number(line.taxRate),
        discount: line.discount ? Number(line.discount) : null,
        createdAt: line.createdAt.toISOString(),
        updatedAt: line.updatedAt.toISOString(),
      })),
    };

    revalidatePath('/dashboard/purchases/purchase-order');
    revalidatePath('/dashboard/purchases/goods-receipts');

    console.log('✅ receiveOrderItems completed successfully');

    return {
      success: true,
      data: serializedPO,
    };
  } catch (error) {
    console.error('❌ Error in receiveOrderItems:', error);
    return {
      success: false,
      error: 'Failed to receive items',
    };
  }
}

export async function getSuppliers() {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;

    const suppliers = await db.supplier.findMany({
      where: {
        orgId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return suppliers;
  } catch (error) {
    console.error('Error fetching suppliers:', error);
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
      },
      select: {
        id: true,
        name: true,
        address: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return locations;
  } catch (error) {
    console.error('Error fetching locations:', error);
    return [];
  }
}

export async function getItems() {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;

    const items = await db.item.findMany({
      where: {
        orgId,
      },
      select: {
        id: true,
        name: true,
        sku: true,
        description: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return items;
  } catch (error) {
    console.error('Error fetching items:', error);
    return [];
  }
}

export async function createPurchaseOrder(data: {
  supplierId: string;
  deliveryLocationId: string;
  expectedDeliveryDate?: Date;
  notes?: string;
  paymentTerms?: string;
  lines: Array<{
    itemId: string;
    quantity: number;
    unitPrice: number;
    taxRate?: number;
    discount?: number;
    notes?: string;
  }>;
}) {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;

    // Validate input data
    if (!data.supplierId || !data.deliveryLocationId || !data.lines || data.lines.length === 0) {
      return {
        success: false,
        error: 'Missing required fields',
      };
    }

    // Validate each line
    for (const line of data.lines) {
      if (!line.itemId || line.quantity <= 0 || line.unitPrice < 0) {
        return {
          success: false,
          error: 'Invalid line item data',
        };
      }
    }

    // Get supplier name and verify it belongs to the organization
    const supplier = await db.supplier.findFirst({
      where: {
        id: data.supplierId,
        orgId,
      },
      select: { name: true },
    });

    if (!supplier) {
      return {
        success: false,
        error: 'Supplier not found',
      };
    }

    // Verify delivery location exists and belongs to the organization
    const location = await db.location.findFirst({
      where: {
        id: data.deliveryLocationId,
        orgId,
      },
      select: { id: true },
    });

    if (!location) {
      return {
        success: false,
        error: 'Delivery location not found',
      };
    }

    // Generate PO number
    const lastPO = await db.purchaseOrder.findFirst({
      where: { orgId },
      orderBy: { createdAt: 'desc' },
      select: { poNumber: true },
    });

    let poNumber = 'PO-00001';
    if (lastPO && lastPO.poNumber) {
      const lastNumber = Number.parseInt(lastPO.poNumber.split('-')[1]);
      if (!isNaN(lastNumber)) {
        poNumber = `PO-${String(lastNumber + 1).padStart(5, '0')}`;
      }
    }

    // Calculate totals
    const lineCalculations = data.lines.map((line) => {
      const lineSubtotal = line.quantity * line.unitPrice;
      const lineDiscount = line.discount || 0;
      const discountedAmount = lineSubtotal - lineDiscount;
      const lineTaxRate = line.taxRate || 0;
      const lineTaxAmount = discountedAmount * (lineTaxRate / 100);
      const lineTotal = discountedAmount + lineTaxAmount;

      return {
        ...line,
        taxRate: lineTaxRate,
        taxAmount: lineTaxAmount,
        total: lineTotal,
      };
    });

    const subtotal = lineCalculations.reduce(
      (sum, line) => sum + line.quantity * line.unitPrice,
      0,
    );
    const totalDiscount = lineCalculations.reduce((sum, line) => sum + (line.discount || 0), 0);
    const taxAmount = lineCalculations.reduce((sum, line) => sum + line.taxAmount, 0);
    const total = subtotal - totalDiscount + taxAmount;

    // Create purchase order
    const purchaseOrder = await db.purchaseOrder.create({
      data: {
        poNumber,
        date: new Date(),
        supplierId: data.supplierId,
        supplierName: supplier.name,
        deliveryLocationId: data.deliveryLocationId,
        expectedDeliveryDate: data.expectedDeliveryDate || null,
        notes: data.notes || null,
        paymentTerms: data.paymentTerms || null,
        subtotal,
        taxAmount,
        discount: totalDiscount > 0 ? totalDiscount : null,
        total,
        orgId,
        createdById: user.id,
        lines: {
          create: lineCalculations.map((line) => ({
            itemId: line.itemId,
            quantity: line.quantity,
            unitPrice: line.unitPrice,
            taxRate: line.taxRate,
            taxAmount: line.taxAmount,
            discount: line.discount && line.discount > 0 ? line.discount : null,
            total: line.total,
            notes: line.notes || null,
          })),
        },
      },
      include: {
        supplier: {
          select: {
            id: true,
            name: true,
          },
        },
        deliveryLocation: {
          select: {
            id: true,
            name: true,
          },
        },
        lines: {
          include: {
            item: {
              select: {
                id: true,
                name: true,
                sku: true,
              },
            },
          },
        },
      },
    });

    revalidatePath('/dashboard/purchases/purchase-order');

    return {
      success: true,
      data: {
        id: purchaseOrder.id,
        poNumber: purchaseOrder.poNumber,
      },
    };
  } catch (error) {
    console.error('Error creating purchase order:', error);
    return {
      success: false,
      error: 'Failed to create purchase order',
    };
  }
}

export async function updatePurchaseOrderStatus(id: string, status: PurchaseOrderStatus) {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;

    const purchaseOrder = await db.purchaseOrder.update({
      where: {
        id,
        orgId,
      },
      data: { status },
    });

    revalidatePath('/dashboard/purchases/purchase-order');

    return {
      success: true,
      data: purchaseOrder,
    };
  } catch (error) {
    console.error('Error updating purchase order status:', error);
    return {
      success: false,
      error: 'Failed to update purchase order status',
    };
  }
}
