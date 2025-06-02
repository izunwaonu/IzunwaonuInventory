// 'use server';

// import { db } from '@/prisma/db';
// import type { PurchaseOrderStatus } from '@prisma/client';
// import { revalidatePath } from 'next/cache';
// // import { auth } from "@/auth"

// export async function getPurchaseOrders() {
//   try {
//     // Mock orgId for demo purposes - replace with actual auth when available
//     const mockOrgId = 'demo-org-id';

//     const purchaseOrders = await db.purchaseOrder.findMany({
//       where: {
//         // orgId: mockOrgId, // Commented out for demo
//       },
//       include: {
//         supplier: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//             contactPerson: true,
//             phone: true,
//           },
//         },
//         deliveryLocation: {
//           select: {
//             id: true,
//             name: true,
//             address: true,
//           },
//         },
//         lines: {
//           include: {
//             item: {
//               select: {
//                 id: true,
//                 name: true,
//                 sku: true,
//               },
//             },
//           },
//         },
//       },
//       orderBy: {
//         createdAt: 'desc',
//       },
//     });

//     // Serialize the data properly
//     return purchaseOrders.map((po) => ({
//       ...po,
//       subtotal: Number(po.subtotal),
//       taxAmount: Number(po.taxAmount),
//       total: Number(po.total),
//       shippingCost: po.shippingCost ? Number(po.shippingCost) : null,
//       discount: po.discount ? Number(po.discount) : null,
//       date: po.date.toISOString(),
//       expectedDeliveryDate: po.expectedDeliveryDate?.toISOString() || null,
//       createdAt: po.createdAt.toISOString(),
//       updatedAt: po.updatedAt.toISOString(),
//       lines: po.lines.map((line) => ({
//         ...line,
//         unitPrice: Number(line.unitPrice),
//         total: Number(line.total),
//         taxAmount: Number(line.taxAmount),
//         taxRate: Number(line.taxRate),
//         discount: line.discount ? Number(line.discount) : null,
//         createdAt: line.createdAt.toISOString(),
//         updatedAt: line.updatedAt.toISOString(),
//       })),
//     }));
//   } catch (error) {
//     console.error('Error fetching purchase orders:', String(error));
//     return [];
//   }
// }

// export async function getSuppliers() {
//   try {
//     // Mock orgId for demo purposes - replace with actual auth when available
//     const mockOrgId = 'demo-org-id';

//     const suppliers = await db.supplier.findMany({
//       where: {
//         // orgId: mockOrgId, // Commented out for demo
//       },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         phone: true,
//       },
//       orderBy: {
//         name: 'asc',
//       },
//     });

//     return suppliers;
//   } catch (error) {
//     console.error('Error fetching suppliers:', String(error));
//     return [];
//   }
// }

// export async function getLocations() {
//   try {
//     // Mock orgId for demo purposes - replace with actual auth when available
//     const mockOrgId = 'demo-org-id';

//     const locations = await db.location.findMany({
//       where: {
//         // orgId: mockOrgId, // Commented out for demo
//       },
//       select: {
//         id: true,
//         name: true,
//         address: true,
//       },
//       orderBy: {
//         name: 'asc',
//       },
//     });

//     return locations;
//   } catch (error) {
//     console.error('Error fetching locations:', String(error));
//     return [];
//   }
// }

// export async function getItems() {
//   try {
//     // Mock orgId for demo purposes - replace with actual auth when available
//     const mockOrgId = 'demo-org-id';

//     const items = await db.item.findMany({
//       where: {
//         // orgId: mockOrgId, // Commented out for demo
//       },
//       select: {
//         id: true,
//         name: true,
//         sku: true,
//         description: true,
//       },
//       orderBy: {
//         name: 'asc',
//       },
//     });

//     return items;
//   } catch (error) {
//     console.error('Error fetching items:', String(error));
//     return [];
//   }
// }

// export async function createPurchaseOrder(data: {
//   supplierId: string;
//   deliveryLocationId: string;
//   expectedDeliveryDate?: Date;
//   notes?: string;
//   paymentTerms?: string;
//   lines: Array<{
//     itemId: string;
//     quantity: number;
//     unitPrice: number;
//     taxRate?: number;
//     discount?: number;
//     notes?: string;
//   }>;
// }) {
//   try {
//     // Mock session for demo purposes - replace with actual auth when available
//     const mockSession = {
//       user: {
//         id: 'demo-user-id',
//         orgId: 'demo-org-id',
//       },
//     };

//     // Validate input data
//     if (!data.supplierId || !data.deliveryLocationId || !data.lines || data.lines.length === 0) {
//       return {
//         success: false,
//         error: 'Missing required fields',
//       };
//     }

//     // Validate each line
//     for (const line of data.lines) {
//       if (!line.itemId || line.quantity <= 0 || line.unitPrice < 0) {
//         return {
//           success: false,
//           error: 'Invalid line item data',
//         };
//       }
//     }

//     // Get supplier name
//     const supplier = await db.supplier.findUnique({
//       where: {
//         id: data.supplierId,
//         // orgId: mockSession.user.orgId, // Commented out for demo
//       },
//       select: { name: true },
//     });

//     if (!supplier) {
//       return {
//         success: false,
//         error: 'Supplier not found',
//       };
//     }

//     // Verify delivery location exists
//     const location = await db.location.findUnique({
//       where: {
//         id: data.deliveryLocationId,
//         // orgId: mockSession.user.orgId, // Commented out for demo
//       },
//       select: { id: true },
//     });

//     if (!location) {
//       return {
//         success: false,
//         error: 'Delivery location not found',
//       };
//     }

//     // Generate PO number
//     const lastPO = await db.purchaseOrder.findFirst({
//       where: {
//         /*orgId: mockSession.user.orgId*/
//       }, // Commented out for demo
//       orderBy: { createdAt: 'desc' },
//       select: { poNumber: true },
//     });

//     let poNumber = 'PO-00001';
//     if (lastPO && lastPO.poNumber) {
//       const lastNumber = Number.parseInt(lastPO.poNumber.split('-')[1]);
//       if (!isNaN(lastNumber)) {
//         poNumber = `PO-${String(lastNumber + 1).padStart(5, '0')}`;
//       }
//     }

//     // Calculate totals
//     const lineCalculations = data.lines.map((line) => {
//       const lineSubtotal = line.quantity * line.unitPrice;
//       const lineDiscount = line.discount || 0;
//       const discountedAmount = lineSubtotal - lineDiscount;
//       const lineTaxRate = line.taxRate || 0;
//       const lineTaxAmount = discountedAmount * (lineTaxRate / 100);
//       const lineTotal = discountedAmount + lineTaxAmount;

//       return {
//         ...line,
//         taxRate: lineTaxRate,
//         taxAmount: lineTaxAmount,
//         total: lineTotal,
//       };
//     });

//     const subtotal = lineCalculations.reduce(
//       (sum, line) => sum + line.quantity * line.unitPrice,
//       0,
//     );
//     const totalDiscount = lineCalculations.reduce((sum, line) => sum + (line.discount || 0), 0);
//     const taxAmount = lineCalculations.reduce((sum, line) => sum + line.taxAmount, 0);
//     const total = subtotal - totalDiscount + taxAmount;

//     // Create purchase order
//     const purchaseOrder = await db.purchaseOrder.create({
//       data: {
//         poNumber,
//         date: new Date(),
//         supplierId: data.supplierId,
//         supplierName: supplier.name,
//         deliveryLocationId: data.deliveryLocationId,
//         expectedDeliveryDate: data.expectedDeliveryDate || null,
//         notes: data.notes || null,
//         paymentTerms: data.paymentTerms || null,
//         subtotal,
//         taxAmount,
//         discount: totalDiscount > 0 ? totalDiscount : null,
//         total,
//         orgId: mockSession.user.orgId,
//         createdById: mockSession.user.id,
//         lines: {
//           create: lineCalculations.map((line) => ({
//             itemId: line.itemId,
//             quantity: line.quantity,
//             unitPrice: line.unitPrice,
//             taxRate: line.taxRate,
//             taxAmount: line.taxAmount,
//             discount: line.discount && line.discount > 0 ? line.discount : null,
//             total: line.total,
//             notes: line.notes || null,
//           })),
//         },
//       },
//       include: {
//         supplier: {
//           select: {
//             id: true,
//             name: true,
//           },
//         },
//         deliveryLocation: {
//           select: {
//             id: true,
//             name: true,
//           },
//         },
//         lines: {
//           include: {
//             item: {
//               select: {
//                 id: true,
//                 name: true,
//                 sku: true,
//               },
//             },
//           },
//         },
//       },
//     });

//     revalidatePath('/dashboard/purchase-orders');

//     return {
//       success: true,
//       data: {
//         id: purchaseOrder.id,
//         poNumber: purchaseOrder.poNumber,
//       },
//     };
//   } catch (error) {
//     const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
//     console.error('Error creating purchase order:', errorMessage);
//     return {
//       success: false,
//       error: 'Failed to create purchase order',
//     };
//   }
// }

// export async function updatePurchaseOrderStatus(id: string, status: PurchaseOrderStatus) {
//   try {
//     // Mock orgId for demo purposes - replace with actual auth when available
//     const mockOrgId = 'demo-org-id';

//     const purchaseOrder = await db.purchaseOrder.update({
//       where: {
//         id,
//         // orgId: mockOrgId, // Commented out for demo
//       },
//       data: { status },
//     });

//     revalidatePath('/dashboard/purchase-orders');

//     return {
//       success: true,
//       data: purchaseOrder,
//     };
//   } catch (error) {
//     const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
//     console.error('Error updating purchase order status:', errorMessage);
//     return {
//       success: false,
//       error: 'Failed to update purchase order status',
//     };
//   }
// }

'use server';

import { db } from '@/prisma/db';
import { PurchaseOrderStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { getAuthenticatedUser } from '@/config/useAuth';

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
    console.log(error);
    return [];
  }
}

export async function receiveOrderItems(
  purchaseOrderId: string,
  receiveData: Array<{ lineId: string; receivedQuantity: number }>,
) {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;

    // Verify the purchase order belongs to the user's organization
    const purchaseOrder = await db.purchaseOrder.findFirst({
      where: {
        id: purchaseOrderId,
        orgId,
      },
    });

    if (!purchaseOrder) {
      return {
        success: false,
        error: 'Purchase order not found',
      };
    }

    // Update each line item with received quantities
    for (const { lineId, receivedQuantity } of receiveData) {
      await db.purchaseOrderLine.update({
        where: {
          id: lineId,
        },
        data: {
          receivedQuantity: {
            increment: receivedQuantity,
          },
        },
      });
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

    // Calculate if all items are received
    const allItemsReceived = updatedPO.lines.every(
      (line) => line.receivedQuantity >= line.quantity,
    );
    const someItemsReceived = updatedPO.lines.some((line) => line.receivedQuantity > 0);

    // Update PO status based on received quantities
    let newStatus: PurchaseOrderStatus = updatedPO.status as PurchaseOrderStatus;
    if (allItemsReceived) {
      newStatus = PurchaseOrderStatus.RECEIVED;
    } else if (someItemsReceived) {
      newStatus = PurchaseOrderStatus.PARTIALLY_RECEIVED;
    }

    // Update the PO status if it changed
    if (newStatus !== updatedPO.status) {
      await db.purchaseOrder.update({
        where: {
          id: purchaseOrderId,
        },
        data: {
          status: newStatus,
        },
      });
    }

    // Return the updated PO with proper serialization
    const serializedPO = {
      ...updatedPO,
      status: newStatus,
      subtotal: Number(updatedPO.subtotal),
      taxAmount: Number(updatedPO.taxAmount),
      total: Number(updatedPO.total),
      shippingCost: updatedPO.shippingCost ? Number(updatedPO.shippingCost) : null,
      discount: updatedPO.discount ? Number(updatedPO.discount) : null,
      date: updatedPO.date.toISOString(),
      expectedDeliveryDate: updatedPO.expectedDeliveryDate?.toISOString() || null,
      createdAt: updatedPO.createdAt.toISOString(),
      updatedAt: updatedPO.updatedAt.toISOString(),
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

    revalidatePath('/dashboard/purchase-orders');

    return {
      success: true,
      data: serializedPO,
    };
  } catch (error) {
    console.log(error);
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
    console.log(error);
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
    console.log(error);
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
    console.log(error);
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
    console.log(error);
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
    console.log(error);
    return {
      success: false,
      error: 'Failed to update purchase order status',
    };
  }
}
