'use server';

import { CategoryFormProps } from '@/components/Forms/inventory/CategoryFormModal';
import { api, getAuthenticatedApi } from '@/config/axios';
import { db } from '@/prisma/db';
import { BriefItemsResponse, ItemCreateDTO, ProductData, ProductResponse } from '@/types/item';
import { CategoryProps } from '@/types/types';
import axios from 'axios';
import { revalidatePath } from 'next/cache';
import { getOrgKey } from './apiKey';
import { resolve } from 'path';
import { LocationCreateDTO, LocationDTO } from '@/types/location';
import { getAuthenticatedUser } from '@/config/useAuth';
import { LocationType } from '@prisma/client';

export async function createLocation(data: LocationCreateDTO) {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;
    const location = await db.location.create({
      data: {
        ...data,
        type: data.type as LocationType,
        orgId,
      },
    });
    // console.log(newCategory);

    return {
      success: true,
      data: location,
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      success: true,
      error: 'Failed to create an item',
      data: null,
    };
  }
}
export async function getOrgLocations() {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;
    const locations = await db.location.findMany({
      where: {
        orgId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        type: true,
        address: true,
        phone: true,
        email: true,
        createdAt: true,
      },
    });

    return locations;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getLocationById(id: string) {
  try {
    const location = await db.location.findUnique({
      where: {
        id,
      },
    });

    return location;
  } catch (error) {
    console.log(error);

    throw new Error('An unexpected error occurred');
  }
}

export async function updateLocationById(id: string, data: Partial<LocationDTO>) {
  try {
    await db.location.update({
      where: {
        id,
      },
      data,
    });

    console.log('Updating Location', id, data);
    // revalidatePath(`/dashboard/inventory/items/${id}`);
    return { success: true };
  } catch (error) {
    console.log(error);
    return {
      success: false,
    };
  }
}

export async function deleteLocation(id: string) {
  try {
    const location = await db.location.findUnique({
      where: {
        id,
      },
    });
    if (!location) {
      return {
        success: false,
        data: null,
        error: 'No Location found',
      };
    }

    const deleted = await db.location.delete({
      where: {
        id,
      },
    });

    return {
      success: true,
      data: deleted,
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      data: null,
      error: 'Failed to delete the Location',
    };
  }
}
