// 'use server';

// import { db } from '@/prisma/db';
// import type { GoodsReceiptStatus } from '@prisma/client';
// import { revalidatePath } from 'next/cache';
// import { getAuthenticatedUser } from '@/config/useAuth';

// // Define proper types to avoid TypeScript errors
// interface GoodsReceiptLine {
//   purchaseOrderLineId: string;
//   itemId: string;
//   receivedQuantity: number;
//   notes: string | null;
//   serialNumbers: string[];
// }

// interface CreateGoodsReceiptData {
//   purchaseOrderId: string;
//   locationId: string;
//   notes?: string | null;
//   lines: GoodsReceiptLine[];
// }

// export async function getGoodsReceipts() {
//   try {
//     const user = await getAuthenticatedUser();
//     const orgId = user.orgId;

//     const goodsReceipts = await db.goodsReceipt.findMany({
//       where: {
//         orgId,
//       },
//       include: {
//         purchaseOrder: {
//           include: {
//             supplier: {
//               select: {
//                 id: true,
//                 name: true,
//                 email: true,
//                 contactPerson: true,
//                 phone: true,
//               },
//             },
//           },
//         },
//         location: {
//           select: {
//             id: true,
//             name: true,
//             address: true,
//           },
//         },
//         receivedBy: {
//           select: {
//             id: true,
//             firstName: true,
//             lastName: true,
//             email: true,
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
//             purchaseOrderLine: {
//               select: {
//                 id: true,
//                 quantity: true,
//                 unitPrice: true,
//                 total: true,
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
//     return goodsReceipts.map((gr) => ({
//       ...gr,
//       date: gr.date.toISOString(),
//       createdAt: gr.createdAt.toISOString(),
//       updatedAt: gr.updatedAt.toISOString(),
//       lines: gr.lines.map((line: any) => ({
//         ...line,
//         createdAt: line.createdAt.toISOString(),
//         updatedAt: line.updatedAt.toISOString(),
//         purchaseOrderLine: {
//           ...line.purchaseOrderLine,
//           unitPrice: Number(line.purchaseOrderLine.unitPrice),
//           total: Number(line.purchaseOrderLine.total),
//         },
//       })),
//       totalValue: gr.lines.reduce((sum: number, line: any) => {
//         return sum + line.receivedQuantity * Number(line.purchaseOrderLine.unitPrice);
//       }, 0),
//     }));
//   } catch (error) {
//     console.error('Error fetching goods receipts:', error);
//     return [];
//   }
// }

// export async function createGoodsReceipt(data: CreateGoodsReceiptData) {
//   try {
//     console.log('=== createGoodsReceipt Debug ===');
//     console.log('Creating goods receipt with data:', JSON.stringify(data, null, 2));

//     const user = await getAuthenticatedUser();
//     const orgId = user.orgId;

//     // Validate input data
//     if (!data.purchaseOrderId || !data.locationId || !data.lines || data.lines.length === 0) {
//       return {
//         success: false,
//         error: 'Missing required fields',
//       };
//     }

//     // Verify the purchase order belongs to the user's organization
//     const purchaseOrder = await db.purchaseOrder.findFirst({
//       where: {
//         id: data.purchaseOrderId,
//         orgId,
//       },
//       include: {
//         supplier: {
//           select: {
//             name: true,
//           },
//         },
//       },
//     });

//     if (!purchaseOrder) {
//       return {
//         success: false,
//         error: 'Purchase order not found',
//       };
//     }

//     // Verify location exists and belongs to the organization
//     const location = await db.location.findFirst({
//       where: {
//         id: data.locationId,
//         orgId,
//       },
//       select: { id: true },
//     });

//     if (!location) {
//       return {
//         success: false,
//         error: 'Location not found',
//       };
//     }

//     // Generate GR number
//     const lastGR = await db.goodsReceipt.findFirst({
//       where: { orgId },
//       orderBy: { createdAt: 'desc' },
//       select: { receiptNumber: true },
//     });

//     let receiptNumber = 'GR-00001';
//     if (lastGR && lastGR.receiptNumber) {
//       const lastNumber = Number.parseInt(lastGR.receiptNumber.split('-')[1]);
//       if (!isNaN(lastNumber)) {
//         receiptNumber = `GR-${String(lastNumber + 1).padStart(5, '0')}`;
//       }
//     }

//     console.log('Creating goods receipt with receipt number:', receiptNumber);

//     // Use a transaction to ensure all operations succeed or fail together
//     const result = await db.$transaction(async (tx) => {
//       // Create goods receipt
//       const goodsReceipt = await tx.goodsReceipt.create({
//         data: {
//           receiptNumber,
//           date: new Date(),
//           purchaseOrderId: data.purchaseOrderId,
//           locationId: data.locationId,
//           notes: data.notes || null,
//           orgId,
//           receivedById: user.id,
//           status: 'COMPLETED',
//         },
//         include: {
//           purchaseOrder: {
//             include: {
//               supplier: {
//                 select: {
//                   id: true,
//                   name: true,
//                 },
//               },
//             },
//           },
//           location: {
//             select: {
//               id: true,
//               name: true,
//             },
//           },
//           lines: {
//             include: {
//               item: {
//                 select: {
//                   id: true,
//                   name: true,
//                   sku: true,
//                 },
//               },
//             },
//           },
//         },
//       });

//       console.log('✅ Goods receipt created:', goodsReceipt.id);

//       // Create goods receipt lines and update inventory
//       for (const lineData of data.lines) {
//         // Create goods receipt line
//         await tx.goodsReceiptLine.create({
//           data: {
//             goodsReceiptId: goodsReceipt.id,
//             purchaseOrderLineId: lineData.purchaseOrderLineId,
//             itemId: lineData.itemId,
//             receivedQuantity: lineData.receivedQuantity,
//             notes: lineData.notes,
//             serialNumbers: lineData.serialNumbers || [],
//           },
//         });

//         console.log(`✅ Created goods receipt line for item: ${lineData.itemId}`);

//         // Update purchase order line received quantities
//         await tx.purchaseOrderLine.update({
//           where: {
//             id: lineData.purchaseOrderLineId,
//           },
//           data: {
//             receivedQuantity: {
//               increment: lineData.receivedQuantity,
//             },
//           },
//         });

//         console.log(`✅ Updated purchase order line: ${lineData.purchaseOrderLineId}`);

//         // Update or create inventory record
//         const existingInventory = await tx.inventory.findFirst({
//           where: {
//             itemId: lineData.itemId,
//             locationId: data.locationId,
//             orgId,
//           },
//         });

//         if (existingInventory) {
//           // Update existing inventory
//           await tx.inventory.update({
//             where: { id: existingInventory.id },
//             data: {
//               quantity: {
//                 increment: lineData.receivedQuantity,
//               },
//             },
//           });
//           console.log(`✅ Updated existing inventory for item: ${lineData.itemId}`);
//         } else {
//           // Create new inventory record
//           await tx.inventory.create({
//             data: {
//               itemId: lineData.itemId,
//               locationId: data.locationId,
//               quantity: lineData.receivedQuantity,
//               reservedQuantity: 0,
//               orgId,
//             },
//           });
//           console.log(`✅ Created new inventory for item: ${lineData.itemId}`);
//         }
//       }

//       // Update purchase order status
//       const updatedPOLines = await tx.purchaseOrderLine.findMany({
//         where: {
//           purchaseOrderId: data.purchaseOrderId,
//         },
//       });

//       const allItemsReceived = updatedPOLines.every(
//         (line) => line.receivedQuantity >= line.quantity,
//       );
//       const someItemsReceived = updatedPOLines.some((line) => line.receivedQuantity > 0);

//       if (allItemsReceived) {
//         await tx.purchaseOrder.update({
//           where: { id: data.purchaseOrderId },
//           data: { status: 'RECEIVED' },
//         });
//         console.log('✅ PO status updated to RECEIVED');
//       } else if (someItemsReceived) {
//         await tx.purchaseOrder.update({
//           where: { id: data.purchaseOrderId },
//           data: { status: 'PARTIALLY_RECEIVED' },
//         });
//         console.log('✅ PO status updated to PARTIALLY_RECEIVED');
//       }

//       return goodsReceipt;
//     });

//     revalidatePath('/dashboard/purchase-orders');
//     revalidatePath('/dashboard/purchases/goods-receipts');
//     revalidatePath('/dashboard/inventory'); // Revalidate inventory page

//     return {
//       success: true,
//       data: {
//         id: result.id,
//         receiptNumber: result.receiptNumber,
//       },
//     };
//   } catch (error: any) {
//     console.error('❌ Error in createGoodsReceipt:', error);
//     console.error('Error details:', {
//       message: error.message,
//       code: error.code,
//       meta: error.meta,
//     });

//     // Provide more specific error messages
//     let errorMessage = 'Failed to create goods receipt';
//     if (error.code === 'P2002') {
//       errorMessage = 'Duplicate entry detected. This item may have already been received.';
//     } else if (error.code === 'P2003') {
//       errorMessage = 'Invalid reference data. Please check your purchase order and items.';
//     } else if (error.message?.includes('unique constraint')) {
//       errorMessage = 'This item has already been received in another goods receipt.';
//     }

//     return {
//       success: false,
//       error: errorMessage,
//     };
//   }
// }

// export async function updateGoodsReceiptStatus(id: string, status: GoodsReceiptStatus) {
//   try {
//     const user = await getAuthenticatedUser();
//     const orgId = user.orgId;

//     const goodsReceipt = await db.goodsReceipt.update({
//       where: {
//         id,
//         orgId,
//       },
//       data: { status },
//     });

//     revalidatePath('/dashboard/purchases/goods-receipts');

//     return {
//       success: true,
//       data: goodsReceipt,
//     };
//   } catch (error) {
//     console.error('Error updating goods receipt status:', error);
//     return {
//       success: false,
//       error: 'Failed to update goods receipt status',
//     };
//   }
// }

// export async function getGoodsReceiptById(id: string) {
//   try {
//     const user = await getAuthenticatedUser();
//     const orgId = user.orgId;

//     const goodsReceipt = await db.goodsReceipt.findFirst({
//       where: {
//         id,
//         orgId,
//       },
//       include: {
//         purchaseOrder: {
//           include: {
//             supplier: {
//               select: {
//                 id: true,
//                 name: true,
//                 email: true,
//                 contactPerson: true,
//                 phone: true,
//               },
//             },
//           },
//         },
//         location: {
//           select: {
//             id: true,
//             name: true,
//             address: true,
//           },
//         },
//         receivedBy: {
//           select: {
//             id: true,
//             firstName: true,
//             lastName: true,
//             email: true,
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
//             purchaseOrderLine: {
//               select: {
//                 id: true,
//                 quantity: true,
//                 unitPrice: true,
//                 total: true,
//               },
//             },
//           },
//         },
//       },
//     });

//     if (!goodsReceipt) {
//       return null;
//     }

//     // Serialize the data properly
//     return {
//       ...goodsReceipt,
//       date: goodsReceipt.date.toISOString(),
//       createdAt: goodsReceipt.createdAt.toISOString(),
//       updatedAt: goodsReceipt.updatedAt.toISOString(),
//       lines: goodsReceipt.lines.map((line: any) => ({
//         ...line,
//         createdAt: line.createdAt.toISOString(),
//         updatedAt: line.updatedAt.toISOString(),
//         purchaseOrderLine: {
//           ...line.purchaseOrderLine,
//           unitPrice: Number(line.purchaseOrderLine.unitPrice),
//           total: Number(line.purchaseOrderLine.total),
//         },
//       })),
//       totalValue: goodsReceipt.lines.reduce((sum: number, line: any) => {
//         return sum + line.receivedQuantity * Number(line.purchaseOrderLine.unitPrice);
//       }, 0),
//     };
//   } catch (error) {
//     console.error('Error fetching goods receipt:', error);
//     return null;
//   }
// }

// // Define proper types to avoid TypeScript errors
// interface ReceiveItemData {
//   lineId: string;
//   receivedQuantity: number;
// }

// interface ValidatedLineData {
//   purchaseOrderLineId: string;
//   itemId: string;
//   receivedQuantity: number;
//   notes: string | null;
//   serialNumbers: string[];
// }

// export async function getPurchaseOrders() {
//   try {
//     const user = await getAuthenticatedUser();
//     const orgId = user.orgId;

//     const purchaseOrders = await db.purchaseOrder.findMany({
//       where: {
//         orgId,
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
//         CreatedBy: {
//           select: {
//             id: true,
//             firstName: true,
//             lastName: true,
//             email: true,
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
//       createdBy: po.CreatedBy
//         ? {
//             id: po.CreatedBy.id,
//             firstName: po.CreatedBy.firstName,
//             lastName: po.CreatedBy.lastName,
//             email: po.CreatedBy.email,
//           }
//         : null,
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
//     console.error('Error fetching purchase orders:', error);
//     return [];
//   }
// }

// export async function receiveOrderItems(purchaseOrderId: string, receiveData: ReceiveItemData[]) {
//   try {
//     console.log('=== receiveOrderItems Debug ===');
//     console.log('purchaseOrderId:', purchaseOrderId);
//     console.log('receiveData:', JSON.stringify(receiveData, null, 2));

//     const user = await getAuthenticatedUser();
//     const orgId = user.orgId;

//     // Validate input data
//     if (!purchaseOrderId || !receiveData || receiveData.length === 0) {
//       console.log('❌ Missing required data');
//       return {
//         success: false,
//         error: 'Missing required data',
//       };
//     }

//     // Validate each receive item
//     for (const item of receiveData) {
//       console.log('Validating item:', item);
//       if (!item.lineId || typeof item.receivedQuantity !== 'number' || item.receivedQuantity <= 0) {
//         console.log('❌ Invalid receive data for item:', item);
//         return {
//           success: false,
//           error: 'Invalid receive data',
//         };
//       }
//     }

//     // Verify the purchase order belongs to the user's organization
//     const purchaseOrder = await db.purchaseOrder.findFirst({
//       where: {
//         id: purchaseOrderId,
//         orgId,
//       },
//       include: {
//         deliveryLocation: {
//           select: {
//             id: true,
//           },
//         },
//         lines: {
//           include: {
//             item: {
//               select: {
//                 id: true,
//                 name: true,
//               },
//             },
//           },
//         },
//       },
//     });

//     if (!purchaseOrder) {
//       console.log('❌ Purchase order not found');
//       return {
//         success: false,
//         error: 'Purchase order not found',
//       };
//     }

//     console.log('✅ Purchase order found:', purchaseOrder.poNumber);
//     console.log('Purchase order lines:', purchaseOrder.lines.length);

//     // Validate that all line IDs exist and quantities are valid
//     const validatedLines: ValidatedLineData[] = [];
//     for (const data of receiveData) {
//       console.log('Processing line data:', data);

//       const line = purchaseOrder.lines.find((l) => l.id === data.lineId);
//       if (!line) {
//         console.log('❌ Line not found:', data.lineId);
//         return {
//           success: false,
//           error: `Line item not found: ${data.lineId}`,
//         };
//       }

//       const remainingQuantity = line.quantity - line.receivedQuantity;
//       console.log(
//         `Line ${line.item.name}: ordered=${line.quantity}, received=${line.receivedQuantity}, remaining=${remainingQuantity}, requesting=${data.receivedQuantity}`,
//       );

//       if (data.receivedQuantity > remainingQuantity) {
//         console.log('❌ Quantity exceeds remaining');
//         return {
//           success: false,
//           error: `Cannot receive more than remaining quantity for ${line.item.name}`,
//         };
//       }

//       const validatedLine: ValidatedLineData = {
//         purchaseOrderLineId: data.lineId,
//         itemId: line.item.id,
//         receivedQuantity: Number(data.receivedQuantity),
//         notes: null,
//         serialNumbers: [],
//       };

//       console.log('✅ Validated line:', validatedLine);
//       validatedLines.push(validatedLine);
//     }

//     console.log('All validated lines:', JSON.stringify(validatedLines, null, 2));

//     // Create goods receipt with validated data
//     const goodsReceiptData = {
//       purchaseOrderId,
//       locationId: purchaseOrder.deliveryLocation.id,
//       notes: `Goods received for PO ${purchaseOrder.poNumber}`,
//       lines: validatedLines,
//     };

//     console.log('Creating goods receipt with data:', JSON.stringify(goodsReceiptData, null, 2));

//     const goodsReceiptResult = await createGoodsReceipt(goodsReceiptData);

//     console.log('Goods receipt result:', goodsReceiptResult);

//     if (!goodsReceiptResult.success) {
//       console.log('❌ Goods receipt creation failed:', goodsReceiptResult.error);
//       return {
//         success: false,
//         error: goodsReceiptResult.error,
//       };
//     }

//     // Get updated purchase order with all lines
//     const updatedPO = await db.purchaseOrder.findUnique({
//       where: {
//         id: purchaseOrderId,
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
//         CreatedBy: {
//           select: {
//             id: true,
//             firstName: true,
//             lastName: true,
//             email: true,
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

//     if (!updatedPO) {
//       return {
//         success: false,
//         error: 'Purchase order not found',
//       };
//     }

//     // Return the updated PO with proper serialization
//     const serializedPO = {
//       ...updatedPO,
//       subtotal: Number(updatedPO.subtotal),
//       taxAmount: Number(updatedPO.taxAmount),
//       total: Number(updatedPO.total),
//       shippingCost: updatedPO.shippingCost ? Number(updatedPO.shippingCost) : null,
//       discount: updatedPO.discount ? Number(updatedPO.discount) : null,
//       date: updatedPO.date.toISOString(),
//       expectedDeliveryDate: updatedPO.expectedDeliveryDate?.toISOString() || null,
//       createdAt: updatedPO.createdAt.toISOString(),
//       updatedAt: updatedPO.updatedAt.toISOString(),
//       createdBy: updatedPO.CreatedBy
//         ? {
//             id: updatedPO.CreatedBy.id,
//             firstName: updatedPO.CreatedBy.firstName,
//             lastName: updatedPO.CreatedBy.lastName,
//             email: updatedPO.CreatedBy.email,
//           }
//         : null,
//       lines: updatedPO.lines.map((line) => ({
//         ...line,
//         unitPrice: Number(line.unitPrice),
//         total: Number(line.total),
//         taxAmount: Number(line.taxAmount),
//         taxRate: Number(line.taxRate),
//         discount: line.discount ? Number(line.discount) : null,
//         createdAt: line.createdAt.toISOString(),
//         updatedAt: line.updatedAt.toISOString(),
//       })),
//     };

//     revalidatePath('/dashboard/purchases/purchase-order');
//     revalidatePath('/dashboard/purchases/goods-receipts');
//     revalidatePath('/dashboard/inventory'); // Revalidate inventory page

//     console.log('✅ receiveOrderItems completed successfully');

//     return {
//       success: true,
//       data: serializedPO,
//     };
//   } catch (error) {
//     console.error('❌ Error in receiveOrderItems:', error);
//     return {
//       success: false,
//       error: 'Failed to receive items',
//     };
//   }
// }

// // Other functions remain unchanged

'use server';

import { db } from '@/prisma/db';
import type { GoodsReceiptStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { getAuthenticatedUser } from '@/config/useAuth';

// Define proper types to avoid TypeScript errors
interface GoodsReceiptLine {
  purchaseOrderLineId: string;
  itemId: string;
  receivedQuantity: number;
  notes: string | null;
  serialNumbers: string[];
}

interface CreateGoodsReceiptData {
  purchaseOrderId: string;
  locationId: string;
  notes?: string | null;
  lines: GoodsReceiptLine[];
}

export async function getGoodsReceipts() {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;

    const goodsReceipts = await db.goodsReceipt.findMany({
      where: {
        orgId,
      },
      include: {
        purchaseOrder: {
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
          },
        },
        location: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
        receivedBy: {
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
            purchaseOrderLine: {
              select: {
                id: true,
                quantity: true,
                unitPrice: true,
                total: true,
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
    return goodsReceipts.map((gr) => ({
      ...gr,
      date: gr.date.toISOString(),
      createdAt: gr.createdAt.toISOString(),
      updatedAt: gr.updatedAt.toISOString(),
      lines: gr.lines.map((line: any) => ({
        ...line,
        createdAt: line.createdAt.toISOString(),
        updatedAt: line.updatedAt.toISOString(),
        purchaseOrderLine: {
          ...line.purchaseOrderLine,
          unitPrice: Number(line.purchaseOrderLine.unitPrice),
          total: Number(line.purchaseOrderLine.total),
        },
      })),
      totalValue: gr.lines.reduce((sum: number, line: any) => {
        return sum + line.receivedQuantity * Number(line.purchaseOrderLine.unitPrice);
      }, 0),
    }));
  } catch (error) {
    console.error('Error fetching goods receipts:', error);
    return [];
  }
}

export async function createGoodsReceipt(data: CreateGoodsReceiptData) {
  try {
    console.log('=== createGoodsReceipt Debug ===');
    console.log('Creating goods receipt with data:', JSON.stringify(data, null, 2));

    const user = await getAuthenticatedUser();
    const orgId = user.orgId;

    // Validate input data
    if (!data.purchaseOrderId || !data.locationId || !data.lines || data.lines.length === 0) {
      return {
        success: false,
        error: 'Missing required fields',
      };
    }

    // Verify the purchase order belongs to the user's organization
    const purchaseOrder = await db.purchaseOrder.findFirst({
      where: {
        id: data.purchaseOrderId,
        orgId,
      },
      include: {
        supplier: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!purchaseOrder) {
      return {
        success: false,
        error: 'Purchase order not found',
      };
    }

    // Verify location exists and belongs to the organization
    const location = await db.location.findFirst({
      where: {
        id: data.locationId,
        orgId,
      },
      select: { id: true },
    });

    if (!location) {
      return {
        success: false,
        error: 'Location not found',
      };
    }

    // Generate organization-specific GR number
    const lastGR = await db.goodsReceipt.findFirst({
      where: { orgId },
      orderBy: { createdAt: 'desc' },
      select: { receiptNumber: true },
    });

    // Get organization prefix (first 4 characters of orgId)
    const orgPrefix = orgId.substring(0, 4).toUpperCase();

    let receiptNumber = `GR-${orgPrefix}-00001`;
    if (lastGR && lastGR.receiptNumber) {
      // Check if the last receipt number has the new format with org prefix
      if (lastGR.receiptNumber.includes(`GR-${orgPrefix}-`)) {
        // Extract number from new format: GR-ORGX-00001
        const parts = lastGR.receiptNumber.split('-');
        if (parts.length === 3) {
          const lastNumber = Number.parseInt(parts[2]);
          if (!isNaN(lastNumber)) {
            receiptNumber = `GR-${orgPrefix}-${String(lastNumber + 1).padStart(5, '0')}`;
          }
        }
      } else {
        // Handle old format or mixed formats
        const allOrgGRs = await db.goodsReceipt.findMany({
          where: {
            orgId,
            receiptNumber: {
              startsWith: `GR-${orgPrefix}-`,
            },
          },
          orderBy: { createdAt: 'desc' },
          select: { receiptNumber: true },
          take: 1,
        });

        if (allOrgGRs.length > 0) {
          const parts = allOrgGRs[0].receiptNumber.split('-');
          if (parts.length === 3) {
            const lastNumber = Number.parseInt(parts[2]);
            if (!isNaN(lastNumber)) {
              receiptNumber = `GR-${orgPrefix}-${String(lastNumber + 1).padStart(5, '0')}`;
            }
          }
        }
        // If no org-specific GRs found, start with 00001
      }
    }

    console.log('Creating goods receipt with receipt number:', receiptNumber);

    // Use a transaction to ensure all operations succeed or fail together
    const result = await db.$transaction(async (tx) => {
      // Create goods receipt
      const goodsReceipt = await tx.goodsReceipt.create({
        data: {
          receiptNumber,
          date: new Date(),
          purchaseOrderId: data.purchaseOrderId,
          locationId: data.locationId,
          notes: data.notes || null,
          orgId,
          receivedById: user.id,
          status: 'COMPLETED',
        },
        include: {
          purchaseOrder: {
            include: {
              supplier: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          location: {
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

      console.log('✅ Goods receipt created:', goodsReceipt.id);

      // Create goods receipt lines and update inventory
      for (const lineData of data.lines) {
        // Create goods receipt line
        await tx.goodsReceiptLine.create({
          data: {
            goodsReceiptId: goodsReceipt.id,
            purchaseOrderLineId: lineData.purchaseOrderLineId,
            itemId: lineData.itemId,
            receivedQuantity: lineData.receivedQuantity,
            notes: lineData.notes,
            serialNumbers: lineData.serialNumbers || [],
          },
        });

        console.log(`✅ Created goods receipt line for item: ${lineData.itemId}`);

        // Update purchase order line received quantities
        await tx.purchaseOrderLine.update({
          where: {
            id: lineData.purchaseOrderLineId,
          },
          data: {
            receivedQuantity: {
              increment: lineData.receivedQuantity,
            },
          },
        });

        console.log(`✅ Updated purchase order line: ${lineData.purchaseOrderLineId}`);

        // Update or create inventory record
        const existingInventory = await tx.inventory.findFirst({
          where: {
            itemId: lineData.itemId,
            locationId: data.locationId,
            orgId,
          },
        });

        if (existingInventory) {
          // Update existing inventory
          await tx.inventory.update({
            where: { id: existingInventory.id },
            data: {
              quantity: {
                increment: lineData.receivedQuantity,
              },
            },
          });
          console.log(`✅ Updated existing inventory for item: ${lineData.itemId}`);
        } else {
          // Create new inventory record
          await tx.inventory.create({
            data: {
              itemId: lineData.itemId,
              locationId: data.locationId,
              quantity: lineData.receivedQuantity,
              reservedQuantity: 0,
              orgId,
            },
          });
          console.log(`✅ Created new inventory for item: ${lineData.itemId}`);
        }
      }

      // Update purchase order status
      const updatedPOLines = await tx.purchaseOrderLine.findMany({
        where: {
          purchaseOrderId: data.purchaseOrderId,
        },
      });

      const allItemsReceived = updatedPOLines.every(
        (line) => line.receivedQuantity >= line.quantity,
      );
      const someItemsReceived = updatedPOLines.some((line) => line.receivedQuantity > 0);

      if (allItemsReceived) {
        await tx.purchaseOrder.update({
          where: { id: data.purchaseOrderId },
          data: { status: 'RECEIVED' },
        });
        console.log('✅ PO status updated to RECEIVED');
      } else if (someItemsReceived) {
        await tx.purchaseOrder.update({
          where: { id: data.purchaseOrderId },
          data: { status: 'PARTIALLY_RECEIVED' },
        });
        console.log('✅ PO status updated to PARTIALLY_RECEIVED');
      }

      return goodsReceipt;
    });

    revalidatePath('/dashboard/purchase-orders');
    revalidatePath('/dashboard/purchases/goods-receipts');
    revalidatePath('/dashboard/inventory'); // Revalidate inventory page

    return {
      success: true,
      data: {
        id: result.id,
        receiptNumber: result.receiptNumber,
      },
    };
  } catch (error: any) {
    console.error('❌ Error in createGoodsReceipt:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      meta: error.meta,
    });

    // Provide more specific error messages
    let errorMessage = 'Failed to create goods receipt';
    if (error.code === 'P2002') {
      errorMessage = 'Duplicate entry detected. This item may have already been received.';
    } else if (error.code === 'P2003') {
      errorMessage = 'Invalid reference data. Please check your purchase order and items.';
    } else if (error.message?.includes('unique constraint')) {
      errorMessage = 'This item has already been received in another goods receipt.';
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}

export async function updateGoodsReceiptStatus(id: string, status: GoodsReceiptStatus) {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;

    const goodsReceipt = await db.goodsReceipt.update({
      where: {
        id,
        orgId,
      },
      data: { status },
    });

    revalidatePath('/dashboard/purchases/goods-receipts');

    return {
      success: true,
      data: goodsReceipt,
    };
  } catch (error) {
    console.error('Error updating goods receipt status:', error);
    return {
      success: false,
      error: 'Failed to update goods receipt status',
    };
  }
}

export async function getGoodsReceiptById(id: string) {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;

    const goodsReceipt = await db.goodsReceipt.findFirst({
      where: {
        id,
        orgId,
      },
      include: {
        purchaseOrder: {
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
          },
        },
        location: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
        receivedBy: {
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
            purchaseOrderLine: {
              select: {
                id: true,
                quantity: true,
                unitPrice: true,
                total: true,
              },
            },
          },
        },
      },
    });

    if (!goodsReceipt) {
      return null;
    }

    // Serialize the data properly
    return {
      ...goodsReceipt,
      date: goodsReceipt.date.toISOString(),
      createdAt: goodsReceipt.createdAt.toISOString(),
      updatedAt: goodsReceipt.updatedAt.toISOString(),
      lines: goodsReceipt.lines.map((line: any) => ({
        ...line,
        createdAt: line.createdAt.toISOString(),
        updatedAt: line.updatedAt.toISOString(),
        purchaseOrderLine: {
          ...line.purchaseOrderLine,
          unitPrice: Number(line.purchaseOrderLine.unitPrice),
          total: Number(line.purchaseOrderLine.total),
        },
      })),
      totalValue: goodsReceipt.lines.reduce((sum: number, line: any) => {
        return sum + line.receivedQuantity * Number(line.purchaseOrderLine.unitPrice);
      }, 0),
    };
  } catch (error) {
    console.error('Error fetching goods receipt:', error);
    return null;
  }
}

// Define proper types to avoid TypeScript errors
interface ReceiveItemData {
  lineId: string;
  receivedQuantity: number;
}

interface ValidatedLineData {
  purchaseOrderLineId: string;
  itemId: string;
  receivedQuantity: number;
  notes: string | null;
  serialNumbers: string[];
}

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

export async function receiveOrderItems(purchaseOrderId: string, receiveData: ReceiveItemData[]) {
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
    const validatedLines: ValidatedLineData[] = [];
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

      const validatedLine: ValidatedLineData = {
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
    revalidatePath('/dashboard/inventory'); // Revalidate inventory page

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
