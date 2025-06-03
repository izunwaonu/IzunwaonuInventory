// 'use server';

// import { db } from '@/prisma/db';
// import type { TransferStatus } from '@prisma/client';
// import { revalidatePath } from 'next/cache';
// import { getAuthenticatedUser } from '@/config/useAuth';

// interface CreateTransferData {
//   fromLocationId: string;
//   toLocationId: string;
//   notes?: string;
//   lines: Array<{
//     itemId: string;
//     quantity: number;
//     notes?: string;
//   }>;
// }

// export async function getTransfers() {
//   try {
//     const user = await getAuthenticatedUser();
//     const orgId = user.orgId;

//     const transfers = await db.transfer.findMany({
//       where: {
//         orgId,
//       },
//       include: {
//         fromLocation: {
//           select: {
//             id: true,
//             name: true,
//             address: true,
//           },
//         },
//         toLocation: {
//           select: {
//             id: true,
//             name: true,
//             address: true,
//           },
//         },
//         createdBy: {
//           select: {
//             id: true,
//             firstName: true,
//             lastName: true,
//             email: true,
//           },
//         },
//         approvedBy: {
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
//                 thumbnail: true,
//               },
//             },
//           },
//         },
//       },
//       orderBy: {
//         createdAt: 'desc',
//       },
//     });

//     return transfers.map((transfer) => ({
//       ...transfer,
//       date: transfer.date.toISOString(),
//       createdAt: transfer.createdAt.toISOString(),
//       updatedAt: transfer.updatedAt.toISOString(),
//       lines: transfer.lines.map((line) => ({
//         ...line,
//         createdAt: line.createdAt.toISOString(),
//         updatedAt: line.updatedAt.toISOString(),
//       })),
//     }));
//   } catch (error) {
//     console.error('Error fetching transfers:', error);
//     return [];
//   }
// }

// export async function getTransferById(id: string) {
//   try {
//     const user = await getAuthenticatedUser();
//     const orgId = user.orgId;

//     const transfer = await db.transfer.findFirst({
//       where: {
//         id,
//         orgId,
//       },
//       include: {
//         fromLocation: {
//           select: {
//             id: true,
//             name: true,
//             address: true,
//           },
//         },
//         toLocation: {
//           select: {
//             id: true,
//             name: true,
//             address: true,
//           },
//         },
//         createdBy: {
//           select: {
//             id: true,
//             firstName: true,
//             lastName: true,
//             email: true,
//           },
//         },
//         approvedBy: {
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
//                 thumbnail: true,
//               },
//             },
//           },
//         },
//       },
//     });

//     if (!transfer) {
//       return null;
//     }

//     return {
//       ...transfer,
//       date: transfer.date.toISOString(),
//       createdAt: transfer.createdAt.toISOString(),
//       updatedAt: transfer.updatedAt.toISOString(),
//       lines: transfer.lines.map((line) => ({
//         ...line,
//         createdAt: line.createdAt.toISOString(),
//         updatedAt: line.updatedAt.toISOString(),
//       })),
//     };
//   } catch (error) {
//     console.error('Error fetching transfer:', error);
//     return null;
//   }
// }

// export async function getLocations() {
//   try {
//     const user = await getAuthenticatedUser();
//     const orgId = user.orgId;

//     const locations = await db.location.findMany({
//       where: {
//         orgId,
//         isActive: true,
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
//     console.error('Error fetching locations:', error);
//     return [];
//   }
// }

// export async function getItemsWithInventory() {
//   try {
//     const user = await getAuthenticatedUser();
//     const orgId = user.orgId;

//     const items = await db.item.findMany({
//       where: {
//         orgId,
//         isActive: true,
//       },
//       select: {
//         id: true,
//         name: true,
//         sku: true,
//         thumbnail: true,
//         inventories: {
//           include: {
//             location: {
//               select: {
//                 id: true,
//                 name: true,
//               },
//             },
//           },
//         },
//       },
//       orderBy: {
//         name: 'asc',
//       },
//     });

//     return items;
//   } catch (error) {
//     console.error('Error fetching items with inventory:', error);
//     return [];
//   }
// }

// export async function createTransfer(data: CreateTransferData) {
//   try {
//     const user = await getAuthenticatedUser();
//     const orgId = user.orgId;

//     // Validate input data
//     if (!data.fromLocationId || !data.toLocationId || !data.lines || data.lines.length === 0) {
//       return {
//         success: false,
//         error: 'Missing required fields',
//       };
//     }

//     if (data.fromLocationId === data.toLocationId) {
//       return {
//         success: false,
//         error: 'From and To locations cannot be the same',
//       };
//     }

//     // Validate each line
//     for (const line of data.lines) {
//       if (!line.itemId || line.quantity <= 0) {
//         return {
//           success: false,
//           error: 'Invalid line item data',
//         };
//       }

//       // Check if item has sufficient inventory at from location
//       const inventory = await db.inventory.findFirst({
//         where: {
//           itemId: line.itemId,
//           locationId: data.fromLocationId,
//           orgId,
//         },
//       });

//       if (!inventory || inventory.quantity - inventory.reservedQuantity < line.quantity) {
//         const item = await db.item.findUnique({
//           where: { id: line.itemId },
//           select: { name: true },
//         });
//         return {
//           success: false,
//           error: `Insufficient inventory for ${item?.name || 'item'}`,
//         };
//       }
//     }

//     // Verify locations exist and belong to the organization
//     const [fromLocation, toLocation] = await Promise.all([
//       db.location.findFirst({
//         where: { id: data.fromLocationId, orgId },
//         select: { id: true },
//       }),
//       db.location.findFirst({
//         where: { id: data.toLocationId, orgId },
//         select: { id: true },
//       }),
//     ]);

//     if (!fromLocation || !toLocation) {
//       return {
//         success: false,
//         error: 'Invalid location(s)',
//       };
//     }

//     // Generate transfer number
//     const lastTransfer = await db.transfer.findFirst({
//       where: { orgId },
//       orderBy: { createdAt: 'desc' },
//       select: { transferNumber: true },
//     });

//     let transferNumber = 'TR-00001';
//     if (lastTransfer && lastTransfer.transferNumber) {
//       const lastNumber = Number.parseInt(lastTransfer.transferNumber.split('-')[1]);
//       if (!isNaN(lastNumber)) {
//         transferNumber = `TR-${String(lastNumber + 1).padStart(5, '0')}`;
//       }
//     }

//     // Create transfer
//     const transfer = await db.transfer.create({
//       data: {
//         transferNumber,
//         date: new Date(),
//         fromLocationId: data.fromLocationId,
//         toLocationId: data.toLocationId,
//         notes: data.notes || null,
//         orgId,
//         createdById: user.id,
//         lines: {
//           create: data.lines.map((line) => ({
//             itemId: line.itemId,
//             quantity: line.quantity,
//             notes: line.notes || null,
//             serialNumbers: [],
//           })),
//         },
//       },
//       include: {
//         fromLocation: {
//           select: {
//             id: true,
//             name: true,
//           },
//         },
//         toLocation: {
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

//     revalidatePath('/dashboard/inventory/transfers');

//     return {
//       success: true,
//       data: {
//         id: transfer.id,
//         transferNumber: transfer.transferNumber,
//       },
//     };
//   } catch (error) {
//     console.error('Error creating transfer:', error);
//     return {
//       success: false,
//       error: 'Failed to create transfer',
//     };
//   }
// }

// export async function updateTransferStatus(transferId: string, status: TransferStatus) {
//   try {
//     const user = await getAuthenticatedUser();
//     const orgId = user.orgId;

//     // Get the transfer with its lines
//     const transfer = await db.transfer.findFirst({
//       where: {
//         id: transferId,
//         orgId,
//       },
//       include: {
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

//     if (!transfer) {
//       return {
//         success: false,
//         error: 'Transfer not found',
//       };
//     }

//     // Use transaction for status updates that affect inventory
//     const result = await db.$transaction(async (tx) => {
//       // Update transfer status
//       const updatedTransfer = await tx.transfer.update({
//         where: { id: transferId },
//         data: {
//           status,
//           approvedById: status === 'APPROVED' ? user.id : transfer.approvedById,
//         },
//       });

//       // If completing the transfer, update inventory
//       if (status === 'COMPLETED') {
//         for (const line of transfer.lines) {
//           // Reduce inventory at from location
//           const fromInventory = await tx.inventory.findFirst({
//             where: {
//               itemId: line.itemId,
//               locationId: transfer.fromLocationId,
//               orgId,
//             },
//           });

//           if (fromInventory) {
//             await tx.inventory.update({
//               where: { id: fromInventory.id },
//               data: {
//                 quantity: {
//                   decrement: line.quantity,
//                 },
//               },
//             });
//           }

//           // Increase inventory at to location
//           const toInventory = await tx.inventory.findFirst({
//             where: {
//               itemId: line.itemId,
//               locationId: transfer.toLocationId,
//               orgId,
//             },
//           });

//           if (toInventory) {
//             // Update existing inventory
//             await tx.inventory.update({
//               where: { id: toInventory.id },
//               data: {
//                 quantity: {
//                   increment: line.quantity,
//                 },
//               },
//             });
//           } else {
//             // Create new inventory record
//             await tx.inventory.create({
//               data: {
//                 itemId: line.itemId,
//                 locationId: transfer.toLocationId,
//                 quantity: line.quantity,
//                 reservedQuantity: 0,
//                 orgId,
//               },
//             });
//           }
//         }
//       }

//       return updatedTransfer;
//     });

//     revalidatePath('/dashboard/inventory/transfers');
//     revalidatePath(`/dashboard/inventory/transfers/${transferId}`);
//     revalidatePath('/dashboard/inventory/inventory');

//     return {
//       success: true,
//       data: result,
//     };
//   } catch (error) {
//     console.error('Error updating transfer status:', error);
//     return {
//       success: false,
//       error: 'Failed to update transfer status',
//     };
//   }
// }

'use server';

import { db } from '@/prisma/db';
import type { TransferStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { getAuthenticatedUser } from '@/config/useAuth';

interface CreateTransferData {
  fromLocationId: string;
  toLocationId: string;
  notes?: string;
  lines: Array<{
    itemId: string;
    quantity: number;
    notes?: string;
  }>;
}

export async function getTransfers() {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;

    const transfers = await db.transfer.findMany({
      where: {
        orgId,
      },
      include: {
        fromLocation: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
        toLocation: {
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
        approvedBy: {
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
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return transfers.map((transfer) => ({
      ...transfer,
      date: transfer.date.toISOString(),
      createdAt: transfer.createdAt.toISOString(),
      updatedAt: transfer.updatedAt.toISOString(),
      lines: transfer.lines.map((line) => ({
        ...line,
        createdAt: line.createdAt.toISOString(),
        updatedAt: line.updatedAt.toISOString(),
      })),
    }));
  } catch (error) {
    console.error('Error fetching transfers:', error);
    return [];
  }
}

export async function getTransferById(id: string) {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;

    const transfer = await db.transfer.findFirst({
      where: {
        id,
        orgId,
      },
      include: {
        fromLocation: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
        toLocation: {
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
        approvedBy: {
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
              },
            },
          },
        },
      },
    });

    if (!transfer) {
      return null;
    }

    return {
      ...transfer,
      date: transfer.date.toISOString(),
      createdAt: transfer.createdAt.toISOString(),
      updatedAt: transfer.updatedAt.toISOString(),
      lines: transfer.lines.map((line) => ({
        ...line,
        createdAt: line.createdAt.toISOString(),
        updatedAt: line.updatedAt.toISOString(),
      })),
    };
  } catch (error) {
    console.error('Error fetching transfer:', error);
    return null;
  }
}

export async function getLocations() {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;

    const locations = await db.location.findMany({
      where: {
        orgId,
        isActive: true,
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

export async function getItemsWithInventory() {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;

    const items = await db.item.findMany({
      where: {
        orgId,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        sku: true,
        thumbnail: true,
        inventories: {
          include: {
            location: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return items;
  } catch (error) {
    console.error('Error fetching items with inventory:', error);
    return [];
  }
}

export async function createTransfer(data: CreateTransferData) {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;

    // Validate input data
    if (!data.fromLocationId || !data.toLocationId || !data.lines || data.lines.length === 0) {
      return {
        success: false,
        error: 'Missing required fields',
      };
    }

    if (data.fromLocationId === data.toLocationId) {
      return {
        success: false,
        error: 'From and To locations cannot be the same',
      };
    }

    // Validate each line
    for (const line of data.lines) {
      if (!line.itemId || line.quantity <= 0) {
        return {
          success: false,
          error: 'Invalid line item data',
        };
      }

      // Check if item has sufficient inventory at from location
      const inventory = await db.inventory.findFirst({
        where: {
          itemId: line.itemId,
          locationId: data.fromLocationId,
          orgId,
        },
      });

      if (!inventory || inventory.quantity - inventory.reservedQuantity < line.quantity) {
        const item = await db.item.findUnique({
          where: { id: line.itemId },
          select: { name: true },
        });
        return {
          success: false,
          error: `Insufficient inventory for ${item?.name || 'item'}`,
        };
      }
    }

    // Verify locations exist and belong to the organization
    const [fromLocation, toLocation] = await Promise.all([
      db.location.findFirst({
        where: { id: data.fromLocationId, orgId },
        select: { id: true },
      }),
      db.location.findFirst({
        where: { id: data.toLocationId, orgId },
        select: { id: true },
      }),
    ]);

    if (!fromLocation || !toLocation) {
      return {
        success: false,
        error: 'Invalid location(s)',
      };
    }

    // Generate organization-specific transfer number
    const lastTransfer = await db.transfer.findFirst({
      where: { orgId },
      orderBy: { createdAt: 'desc' },
      select: { transferNumber: true },
    });

    // Get organization prefix (first 4 characters of orgId)
    const orgPrefix = orgId.substring(0, 4).toUpperCase();

    let transferNumber = `TR-${orgPrefix}-00001`;
    if (lastTransfer && lastTransfer.transferNumber) {
      // Check if the last transfer number has the new format with org prefix
      if (lastTransfer.transferNumber.includes(`TR-${orgPrefix}-`)) {
        // Extract number from new format: TR-ORGX-00001
        const parts = lastTransfer.transferNumber.split('-');
        if (parts.length === 3) {
          const lastNumber = Number.parseInt(parts[2]);
          if (!isNaN(lastNumber)) {
            transferNumber = `TR-${orgPrefix}-${String(lastNumber + 1).padStart(5, '0')}`;
          }
        }
      } else {
        // Handle old format or mixed formats
        const allOrgTransfers = await db.transfer.findMany({
          where: {
            orgId,
            transferNumber: {
              startsWith: `TR-${orgPrefix}-`,
            },
          },
          orderBy: { createdAt: 'desc' },
          select: { transferNumber: true },
          take: 1,
        });

        if (allOrgTransfers.length > 0) {
          const parts = allOrgTransfers[0].transferNumber.split('-');
          if (parts.length === 3) {
            const lastNumber = Number.parseInt(parts[2]);
            if (!isNaN(lastNumber)) {
              transferNumber = `TR-${orgPrefix}-${String(lastNumber + 1).padStart(5, '0')}`;
            }
          }
        }
        // If no org-specific transfers found, start with 00001
      }
    }

    console.log(`Generated transfer number: ${transferNumber} for organization: ${orgId}`);

    // Create transfer
    const transfer = await db.transfer.create({
      data: {
        transferNumber,
        date: new Date(),
        fromLocationId: data.fromLocationId,
        toLocationId: data.toLocationId,
        notes: data.notes || null,
        orgId,
        createdById: user.id,
        lines: {
          create: data.lines.map((line) => ({
            itemId: line.itemId,
            quantity: line.quantity,
            notes: line.notes || null,
            serialNumbers: [],
          })),
        },
      },
      include: {
        fromLocation: {
          select: {
            id: true,
            name: true,
          },
        },
        toLocation: {
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

    revalidatePath('/dashboard/transfers');

    return {
      success: true,
      data: {
        id: transfer.id,
        transferNumber: transfer.transferNumber,
      },
    };
  } catch (error) {
    console.error('Error creating transfer:', error);
    return {
      success: false,
      error: 'Failed to create transfer',
    };
  }
}

export async function updateTransferStatus(transferId: string, status: TransferStatus) {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;

    // Get the transfer with its lines
    const transfer = await db.transfer.findFirst({
      where: {
        id: transferId,
        orgId,
      },
      include: {
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

    if (!transfer) {
      return {
        success: false,
        error: 'Transfer not found',
      };
    }

    // Use transaction for status updates that affect inventory
    const result = await db.$transaction(async (tx) => {
      // Update transfer status
      const updatedTransfer = await tx.transfer.update({
        where: { id: transferId },
        data: {
          status,
          approvedById: status === 'APPROVED' ? user.id : transfer.approvedById,
        },
      });

      // If completing the transfer, update inventory
      if (status === 'COMPLETED') {
        for (const line of transfer.lines) {
          // Reduce inventory at from location
          const fromInventory = await tx.inventory.findFirst({
            where: {
              itemId: line.itemId,
              locationId: transfer.fromLocationId,
              orgId,
            },
          });

          if (fromInventory) {
            await tx.inventory.update({
              where: { id: fromInventory.id },
              data: {
                quantity: {
                  decrement: line.quantity,
                },
              },
            });
          }

          // Increase inventory at to location
          const toInventory = await tx.inventory.findFirst({
            where: {
              itemId: line.itemId,
              locationId: transfer.toLocationId,
              orgId,
            },
          });

          if (toInventory) {
            // Update existing inventory
            await tx.inventory.update({
              where: { id: toInventory.id },
              data: {
                quantity: {
                  increment: line.quantity,
                },
              },
            });
          } else {
            // Create new inventory record
            await tx.inventory.create({
              data: {
                itemId: line.itemId,
                locationId: transfer.toLocationId,
                quantity: line.quantity,
                reservedQuantity: 0,
                orgId,
              },
            });
          }
        }
      }

      return updatedTransfer;
    });

    revalidatePath('/dashboard/transfers');
    revalidatePath(`/dashboard/transfers/${transferId}`);
    revalidatePath('/dashboard/inventory');

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('Error updating transfer status:', error);
    return {
      success: false,
      error: 'Failed to update transfer status',
    };
  }
}
