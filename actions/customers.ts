'use server';

import { CategoryFormProps } from '@/components/Forms/inventory/CategoryFormModal';
import { api, getAuthenticatedApi } from '@/config/axios';
import { db } from '@/prisma/db';
import { BriefItemsResponse, ItemCreateDTO, ProductData, ProductResponse } from '@/types/item';
import {
  CategoryProps,
  CustomerCreateDTO,
  CustomerDTO,
  SupplierCreateDTO,
  SupplierDTO,
} from '@/types/types';
import axios from 'axios';
import { revalidatePath } from 'next/cache';
import { getOrgKey } from './apiKey';
import { resolve } from 'path';
import { LocationCreateDTO, LocationDTO } from '@/types/location';
import { getAuthenticatedUser } from '@/config/useAuth';
import { LocationType } from '@prisma/client';

export async function createCustomer(data: CustomerCreateDTO) {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;
    const customers = await db.customer.create({
      data: {
        ...data,
        orgId,
      },
    });
    // console.log(newCategory);

    return {
      success: true,
      data: customers,
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      success: true,
      error: 'Failed to create an customer',
      data: null,
    };
  }
}
export async function getOrgCustomers() {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;
    const customers = await db.customer.findMany({
      where: {
        orgId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        address: true,
        phone: true,
        email: true,
        createdAt: true,
      },
    });

    return customers;
  } catch (error) {
    console.log(error);
    return [];
  }
}
export async function getBriefCustomers() {
  try {
    const user = await getAuthenticatedUser();
    const orgId = user.orgId;
    const customers = await db.customer.findMany({
      where: {
        orgId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
      },
    });

    return customers;
  } catch (error) {
    console.log(error);
    return [];
  }
}
export async function getCustomerId(id: string) {
  try {
    const customers = await db.customer.findUnique({
      where: {
        id,
      },
    });

    return customers;
  } catch (error) {
    console.log(error);

    throw new Error('An unexpected error occurred');
  }
}

export async function updateCustomerById(id: string, data: Partial<CustomerDTO>) {
  try {
    await db.customer.update({
      where: {
        id,
      },
      data,
    });

    revalidatePath(`/dashboard/sales/customers/${id}`);
    revalidatePath(`/dashboard/sales/customers`);
    return { success: true };
  } catch (error) {
    console.log(error);
    return {
      success: false,
    };
  }
}

export async function deleteCustomer(id: string) {
  try {
    const customer = await db.customer.findUnique({
      where: {
        id,
      },
      include: {
        salesOrders: true,
      },
    });
    if (!customer) {
      return {
        success: false,
        data: null,
        error: 'No Customer found',
      };
    }
    if (customer.salesOrders.length > 0) {
      return {
        success: false,
        data: null,
        error: 'Customer with sales  can not be deleted',
      };
    }

    const deleted = await db.customer.delete({
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
      error: 'Failed to delete the customer',
    };
  }
}
