'use server';

import { db } from '@/prisma/db';
import type { GoodsReceiptStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { getAuthenticatedUser } from '@/config/useAuth';

interface GoodsReceiptLine {
  id: string;
  goodsReceiptId: string;
  purchaseOrderLineId: string;
  itemId: string;
  receivedQuantity: number;
  notes: string | null;
  serialNumbers: string[];
  createdAt: Date;
  updatedAt: Date;
  item: {
    id: string;
    name: string;
    sku: string | null;
  };
  purchaseOrderLine: {
    id: string;
    quantity: number;
    unitPrice: number | string;
    total: number | string;
  };
}

interface GoodsReceiptData {
  id: string;
  receiptNumber: string;
  date: Date;
  purchaseOrderId: string;
  locationId: string;
  status: GoodsReceiptStatus;
  notes: string | null;
  orgId: string;
  receivedById: string;
  createdAt: Date;
  updatedAt: Date;
  receivedBy: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  purchaseOrder: {
    id: string;
    poNumber: string;
    supplier: {
      id: string;
      name: string;
      email: string | null;
      contactPerson: string | null;
      phone: string | null;
    };
  };
  location: {
    id: string;
    name: string;
    address: string | null;
  };
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
      lines: gr.lines.map((line: GoodsReceiptLine) => ({
        ...line,
        createdAt: line.createdAt.toISOString(),
        updatedAt: line.updatedAt.toISOString(),
        purchaseOrderLine: {
          ...line.purchaseOrderLine,
          unitPrice: Number(line.purchaseOrderLine.unitPrice),
          total: Number(line.purchaseOrderLine.total),
        },
      })),
      totalValue: gr.lines.reduce((sum: number, line: GoodsReceiptLine) => {
        return sum + line.receivedQuantity * Number(line.purchaseOrderLine.unitPrice);
      }, 0),
    }));
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function createGoodsReceipt(data: {
  purchaseOrderId: string;
  locationId: string;
  notes?: string | null;
  lines: Array<{
    purchaseOrderLineId: string;
    itemId: string;
    receivedQuantity: number;
    notes?: string | null;
    serialNumbers?: string[];
  }>;
}) {
  try {
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

    // Generate GR number
    const lastGR = await db.goodsReceipt.findFirst({
      where: { orgId },
      orderBy: { createdAt: 'desc' },
      select: { receiptNumber: true },
    });

    let receiptNumber = 'GR-00001';
    if (lastGR && lastGR.receiptNumber) {
      const lastNumber = Number.parseInt(lastGR.receiptNumber.split('-')[1]);
      if (!isNaN(lastNumber)) {
        receiptNumber = `GR-${String(lastNumber + 1).padStart(5, '0')}`;
      }
    }

    // Create goods receipt
    const goodsReceipt = await db.goodsReceipt.create({
      data: {
        receiptNumber,
        date: new Date(),
        purchaseOrderId: data.purchaseOrderId,
        locationId: data.locationId,
        notes: data.notes || null,
        orgId,
        receivedById: user.id,
        lines: {
          create: data.lines.map((line) => ({
            purchaseOrderLineId: line.purchaseOrderLineId,
            itemId: line.itemId,
            receivedQuantity: line.receivedQuantity,
            notes: line.notes || null,
            serialNumbers: line.serialNumbers || [],
          })),
        },
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

    // Update purchase order line received quantities
    for (const line of data.lines) {
      await db.purchaseOrderLine.update({
        where: {
          id: line.purchaseOrderLineId,
        },
        data: {
          receivedQuantity: {
            increment: line.receivedQuantity,
          },
        },
      });
    }

    // Update purchase order status if all items are received
    const updatedPOLines = await db.purchaseOrderLine.findMany({
      where: {
        purchaseOrderId: data.purchaseOrderId,
      },
    });

    const allItemsReceived = updatedPOLines.every((line) => line.receivedQuantity >= line.quantity);
    const someItemsReceived = updatedPOLines.some((line) => line.receivedQuantity > 0);

    if (allItemsReceived) {
      await db.purchaseOrder.update({
        where: { id: data.purchaseOrderId },
        data: { status: 'RECEIVED' },
      });
    } else if (someItemsReceived) {
      await db.purchaseOrder.update({
        where: { id: data.purchaseOrderId },
        data: { status: 'PARTIALLY_RECEIVED' },
      });
    }

    revalidatePath('/dashboard/purchase-orders');
    revalidatePath('/dashboard/purchases/goods-receipts');

    return {
      success: true,
      data: {
        id: goodsReceipt.id,
        receiptNumber: goodsReceipt.receiptNumber,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: 'Failed to create goods receipt',
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
    console.log(error);
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
      lines: goodsReceipt.lines.map((line: GoodsReceiptLine) => ({
        ...line,
        createdAt: line.createdAt.toISOString(),
        updatedAt: line.updatedAt.toISOString(),
        purchaseOrderLine: {
          ...line.purchaseOrderLine,
          unitPrice: Number(line.purchaseOrderLine.unitPrice),
          total: Number(line.purchaseOrderLine.total),
        },
      })),
      totalValue: goodsReceipt.lines.reduce((sum: number, line: GoodsReceiptLine) => {
        return sum + line.receivedQuantity * Number(line.purchaseOrderLine.unitPrice);
      }, 0),
    };
  } catch (error) {
    console.log(error);
    return null;
  }
}

// 'use server';

// import { db } from '@/prisma/db';
// import type { GoodsReceiptStatus } from '@prisma/client';
// import { revalidatePath } from 'next/cache';
// import { getAuthenticatedUser } from '@/config/useAuth';

// interface GoodsReceiptLine {
//   id: string;
//   goodsReceiptId: string;
//   purchaseOrderLineId: string;
//   itemId: string;
//   receivedQuantity: number;
//   notes: string | null;
//   serialNumbers: string[];
//   createdAt: Date;
//   updatedAt: Date;
//   item: {
//     id: string;
//     name: string;
//     sku: string | null;
//   };
//   purchaseOrderLine: {
//     id: string;
//     quantity: number;
//     unitPrice: number | string;
//     total: number | string;
//   };
// }

// interface GoodsReceiptData {
//   id: string;
//   receiptNumber: string;
//   date: Date;
//   purchaseOrderId: string;
//   locationId: string;
//   status: GoodsReceiptStatus;
//   notes: string | null;
//   orgId: string;
//   receivedById: string;
//   createdAt: Date;
//   updatedAt: Date;
//   receivedBy: {
//     id: string;
//     firstName: string;
//     lastName: string;
//     email: string;
//   } | null;
//   purchaseOrder: {
//     id: string;
//     poNumber: string;
//     supplier: {
//       id: string;
//       name: string;
//       email: string | null;
//       contactPerson: string | null;
//       phone: string | null;
//     };
//   };
//   location: {
//     id: string;
//     name: string;
//     address: string | null;
//   };
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
//       lines: gr.lines.map((line: GoodsReceiptLine) => ({
//         ...line,
//         createdAt: line.createdAt.toISOString(),
//         updatedAt: line.updatedAt.toISOString(),
//         purchaseOrderLine: {
//           ...line.purchaseOrderLine,
//           unitPrice: Number(line.purchaseOrderLine.unitPrice),
//           total: Number(line.purchaseOrderLine.total),
//         },
//       })),
//       totalValue: gr.lines.reduce((sum: number, line: GoodsReceiptLine) => {
//         return sum + line.receivedQuantity * Number(line.purchaseOrderLine.unitPrice);
//       }, 0),
//     }));
//   } catch (error) {
//     console.error('Error fetching goods receipts:', error);
//     return [];
//   }
// }

// export async function createGoodsReceipt(data: {
//   purchaseOrderId: string;
//   locationId: string;
//   notes?: string | null;
//   lines: Array<{
//     purchaseOrderLineId: string;
//     itemId: string;
//     receivedQuantity: number;
//     notes?: string | null;
//     serialNumbers?: string[];
//   }>;
// }) {
//   try {
//     console.log('=== createGoodsReceipt FINAL FIX ===');

//     const user = await getAuthenticatedUser();
//     const orgId = user.orgId;

//     // Validate input data
//     if (!data.purchaseOrderId || !data.locationId || !data.lines || data.lines.length === 0) {
//       return {
//         success: false,
//         error: 'Missing required fields',
//       };
//     }

//     // Validate each line
//     for (const line of data.lines) {
//       if (
//         !line.purchaseOrderLineId ||
//         !line.itemId ||
//         typeof line.receivedQuantity !== 'number' ||
//         line.receivedQuantity <= 0
//       ) {
//         return {
//           success: false,
//           error: 'Invalid line item data',
//         };
//       }
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

//     // Use a single transaction to create everything at once
//     const result = await db.$transaction(async (tx) => {
//       // Create goods receipt
//       const goodsReceipt = await tx.goodsReceipt.create({
//         data: {
//           receiptNumber,
//           date: new Date(),
//           purchaseOrderId: data.purchaseOrderId,
//           locationId: data.locationId,
//           notes: data.notes || undefined, // Use undefined instead of null
//           orgId,
//           receivedById: user.id,
//         },
//       });

//       console.log('✅ Goods receipt created:', goodsReceipt.id);

//       // Create all lines using createMany for better performance and reliability
//       const lineData = data.lines.map((line) => ({
//         goodsReceiptId: goodsReceipt.id,
//         purchaseOrderLineId: line.purchaseOrderLineId,
//         itemId: line.itemId,
//         receivedQuantity: line.receivedQuantity,
//         // Completely omit optional fields to avoid any serialization issues
//       }));

//       console.log('Creating lines with data:', lineData);

//       await tx.goodsReceiptLine.createMany({
//         data: lineData,
//       });

//       console.log('✅ All lines created successfully');

//       return goodsReceipt;
//     });

//     console.log('✅ Transaction completed successfully');

//     // Update purchase order line received quantities outside the transaction
//     for (const line of data.lines) {
//       await db.purchaseOrderLine.update({
//         where: {
//           id: line.purchaseOrderLineId,
//         },
//         data: {
//           receivedQuantity: {
//             increment: line.receivedQuantity,
//           },
//         },
//       });
//     }

//     console.log('✅ PO lines updated');

//     // Update purchase order status if all items are received
//     const updatedPOLines = await db.purchaseOrderLine.findMany({
//       where: {
//         purchaseOrderId: data.purchaseOrderId,
//       },
//     });

//     const allItemsReceived = updatedPOLines.every((line) => line.receivedQuantity >= line.quantity);
//     const someItemsReceived = updatedPOLines.some((line) => line.receivedQuantity > 0);

//     if (allItemsReceived) {
//       await db.purchaseOrder.update({
//         where: { id: data.purchaseOrderId },
//         data: { status: 'RECEIVED' },
//       });
//       console.log('✅ PO status updated to RECEIVED');
//     } else if (someItemsReceived) {
//       await db.purchaseOrder.update({
//         where: { id: data.purchaseOrderId },
//         data: { status: 'PARTIALLY_RECEIVED' },
//       });
//       console.log('✅ PO status updated to PARTIALLY_RECEIVED');
//     }

//     revalidatePath('/dashboard/purchase-orders');
//     revalidatePath('/dashboard/purchases/goods-receipts');

//     console.log('✅ createGoodsReceipt completed successfully');

//     return {
//       success: true,
//       data: {
//         id: result.id,
//         receiptNumber: result.receiptNumber,
//       },
//     };
//   } catch (error) {
//     console.error('❌ FINAL ERROR:', error);
//     console.error('❌ Error details:', {
//       //   message: error.message,
//       //   code: (error as any).code,
//       //   stack: error.stack,
//     });
//     return {
//       success: false,
//       error: 'Failed to create goods receipt',
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
//       lines: goodsReceipt.lines.map((line: GoodsReceiptLine) => ({
//         ...line,
//         createdAt: line.createdAt.toISOString(),
//         updatedAt: line.updatedAt.toISOString(),
//         purchaseOrderLine: {
//           ...line.purchaseOrderLine,
//           unitPrice: Number(line.purchaseOrderLine.unitPrice),
//           total: Number(line.purchaseOrderLine.total),
//         },
//       })),
//       totalValue: goodsReceipt.lines.reduce((sum: number, line: GoodsReceiptLine) => {
//         return sum + line.receivedQuantity * Number(line.purchaseOrderLine.unitPrice);
//       }, 0),
//     };
//   } catch (error) {
//     console.error('Error fetching goods receipt:', error);
//     return null;
//   }
// }
