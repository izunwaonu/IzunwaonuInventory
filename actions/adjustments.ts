'use server';

import { db } from '@/prisma/db';
import type { AdjustmentStatus, AdjustmentType } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { getAuthenticatedUser } from '@/config/useAuth';

interface CreateAdjustmentData {
  locationId: string;
  adjustmentType: AdjustmentType;
  reason: string;
  notes?: string;
  lines: Array<{
    itemId: string;
    beforeQuantity: number;
    afterQuantity: number;
    notes?: string;
  }>;
}

export async function getAdjustments() {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;

    const adjustments = await db.adjustment.findMany({
      where: {
        orgId,
      },
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

    return adjustments.map((adjustment) => ({
      ...adjustment,
      date: adjustment.date.toISOString(),
      createdAt: adjustment.createdAt.toISOString(),
      updatedAt: adjustment.updatedAt.toISOString(),
      lines: adjustment.lines.map((line) => ({
        ...line,
        createdAt: line.createdAt.toISOString(),
        updatedAt: line.updatedAt.toISOString(),
      })),
      totalQuantityChange: adjustment.lines.reduce((sum, line) => sum + line.adjustedQuantity, 0),
      itemsCount: adjustment.lines.length,
    }));
  } catch (error) {
    console.error('Error fetching adjustments:', error);
    return [];
  }
}

export async function getAdjustmentById(id: string) {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;

    const adjustment = await db.adjustment.findFirst({
      where: {
        id,
        orgId,
      },
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

    if (!adjustment) {
      return null;
    }

    return {
      ...adjustment,
      date: adjustment.date.toISOString(),
      createdAt: adjustment.createdAt.toISOString(),
      updatedAt: adjustment.updatedAt.toISOString(),
      lines: adjustment.lines.map((line) => ({
        ...line,
        createdAt: line.createdAt.toISOString(),
        updatedAt: line.updatedAt.toISOString(),
      })),
      totalQuantityChange: adjustment.lines.reduce((sum, line) => sum + line.adjustedQuantity, 0),
      itemsCount: adjustment.lines.length,
      increasedItems: adjustment.lines.filter((line) => line.adjustedQuantity > 0).length,
      decreasedItems: adjustment.lines.filter((line) => line.adjustedQuantity < 0).length,
      unchangedItems: adjustment.lines.filter((line) => line.adjustedQuantity === 0).length,
    };
  } catch (error) {
    console.error('Error fetching adjustment:', error);
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

export async function getItemsWithInventory(locationId?: string) {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;

    const items = await db.item.findMany({
      where: {
        orgId,
        isActive: true,
        ...(locationId && {
          inventories: {
            some: {
              locationId,
            },
          },
        }),
      },
      select: {
        id: true,
        name: true,
        sku: true,
        thumbnail: true,
        inventories: {
          where: locationId ? { locationId } : undefined,
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

export async function createAdjustment(data: CreateAdjustmentData) {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;

    // Validate input data
    if (
      !data.locationId ||
      !data.adjustmentType ||
      !data.reason ||
      !data.lines ||
      data.lines.length === 0
    ) {
      return {
        success: false,
        error: 'Missing required fields',
      };
    }

    // Validate each line
    for (const line of data.lines) {
      if (!line.itemId || line.beforeQuantity < 0 || line.afterQuantity < 0) {
        return {
          success: false,
          error: 'Invalid line item data',
        };
      }
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

    // Generate organization-specific adjustment number
    const lastAdjustment = await db.adjustment.findFirst({
      where: { orgId },
      orderBy: { createdAt: 'desc' },
      select: { adjustmentNumber: true },
    });

    // Get organization prefix (first 4 characters of orgId)
    const orgPrefix = orgId.substring(0, 4).toUpperCase();

    let adjustmentNumber = `ADJ-${orgPrefix}-00001`;
    if (lastAdjustment && lastAdjustment.adjustmentNumber) {
      // Check if the last adjustment number has the new format with org prefix
      if (lastAdjustment.adjustmentNumber.includes(`ADJ-${orgPrefix}-`)) {
        // Extract number from new format: ADJ-ORGX-00001
        const parts = lastAdjustment.adjustmentNumber.split('-');
        if (parts.length === 3) {
          const lastNumber = Number.parseInt(parts[2]);
          if (!isNaN(lastNumber)) {
            adjustmentNumber = `ADJ-${orgPrefix}-${String(lastNumber + 1).padStart(5, '0')}`;
          }
        }
      } else {
        // Handle old format or mixed formats
        const allOrgAdjustments = await db.adjustment.findMany({
          where: {
            orgId,
            adjustmentNumber: {
              startsWith: `ADJ-${orgPrefix}-`,
            },
          },
          orderBy: { createdAt: 'desc' },
          select: { adjustmentNumber: true },
          take: 1,
        });

        if (allOrgAdjustments.length > 0) {
          const parts = allOrgAdjustments[0].adjustmentNumber.split('-');
          if (parts.length === 3) {
            const lastNumber = Number.parseInt(parts[2]);
            if (!isNaN(lastNumber)) {
              adjustmentNumber = `ADJ-${orgPrefix}-${String(lastNumber + 1).padStart(5, '0')}`;
            }
          }
        }
        // If no org-specific adjustments found, start with 00001
      }
    }

    console.log(`Generated adjustment number: ${adjustmentNumber} for organization: ${orgId}`);

    // Create adjustment with lines
    const adjustment = await db.adjustment.create({
      data: {
        adjustmentNumber,
        date: new Date(),
        locationId: data.locationId,
        adjustmentType: data.adjustmentType,
        reason: data.reason,
        notes: data.notes || null,
        orgId,
        createdById: user.id,
        lines: {
          create: data.lines.map((line) => ({
            itemId: line.itemId,
            beforeQuantity: line.beforeQuantity,
            afterQuantity: line.afterQuantity,
            adjustedQuantity: line.afterQuantity - line.beforeQuantity,
            notes: line.notes || '',
            serialNumbers: [],
          })),
        },
      },
      include: {
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

    revalidatePath('/dashboard/adjustments');

    return {
      success: true,
      data: {
        id: adjustment.id,
        adjustmentNumber: adjustment.adjustmentNumber,
      },
    };
  } catch (error) {
    console.error('Error creating adjustment:', error);
    return {
      success: false,
      error: 'Failed to create adjustment',
    };
  }
}

export async function updateAdjustmentStatus(adjustmentId: string, status: AdjustmentStatus) {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;

    // Get the adjustment with its lines
    const adjustment = await db.adjustment.findFirst({
      where: {
        id: adjustmentId,
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

    if (!adjustment) {
      return {
        success: false,
        error: 'Adjustment not found',
      };
    }

    // Use transaction for status updates that affect inventory
    const result = await db.$transaction(async (tx) => {
      // Update adjustment status
      const updatedAdjustment = await tx.adjustment.update({
        where: { id: adjustmentId },
        data: {
          status,
          approvedById: status === 'APPROVED' ? user.id : adjustment.approvedById,
        },
      });

      // If completing the adjustment, update inventory
      if (status === 'COMPLETED') {
        for (const line of adjustment.lines) {
          // Update inventory at the location
          const inventory = await tx.inventory.findFirst({
            where: {
              itemId: line.itemId,
              locationId: adjustment.locationId,
              orgId,
            },
          });

          if (inventory) {
            // Update existing inventory
            await tx.inventory.update({
              where: { id: inventory.id },
              data: {
                quantity: line.afterQuantity,
              },
            });
          } else if (line.afterQuantity > 0) {
            // Create new inventory record if after quantity is positive
            await tx.inventory.create({
              data: {
                itemId: line.itemId,
                locationId: adjustment.locationId,
                quantity: line.afterQuantity,
                reservedQuantity: 0,
                orgId,
              },
            });
          }
        }
      }

      return updatedAdjustment;
    });

    revalidatePath('/dashboard/adjustments');
    revalidatePath(`/dashboard/adjustments/${adjustmentId}`);
    revalidatePath('/dashboard/inventory');

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('Error updating adjustment status:', error);
    return {
      success: false,
      error: 'Failed to update adjustment status',
    };
  }
}
