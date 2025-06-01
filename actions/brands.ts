'use server';

import { BrandFormProps } from '@/components/Forms/inventory/BrandForm';

import { db } from '@/prisma/db';
import { revalidatePath } from 'next/cache';

export async function createBrand(data: BrandFormProps) {
  try {
    const existingBrand = await db.brand.findUnique({
      where: {
        slug: data.slug,
      },
    });
    if (existingBrand) {
      return {
        status: 409,
        data: null,
        error: 'Brand already exists',
      };
    }
    const newBrand = await db.brand.create({
      data: {
        name: data.name,
        slug: data.slug,
        orgId: data.orgId,
      },
    });

    revalidatePath('/dashboard/inventory/brands');
    return {
      status: 200,
      data: newBrand,
      error: null,
    };
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      data: null,
      error: 'Something went wrong while creating unit',
    };
  }
}

export async function getOrgBrand(orgId: string) {
  try {
    const brands = await db.brand.findMany({
      where: {
        orgId,
      },
    });
    return brands;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function deleteBrand(id: string) {
  try {
    const deleted = await db.brand.delete({
      where: {
        id,
      },
    });

    revalidatePath('/dashboard/inventory/brands');

    return {
      ok: true,
      data: deleted,
    };
  } catch (error) {
    console.log(error);
  }
}
