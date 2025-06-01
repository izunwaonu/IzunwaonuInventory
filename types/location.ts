import { LocationType } from '@prisma/client';

export type LocationCreateDTO = {
  name: string;
  type: string;
  address?: string;
  phone?: string;
  email?: string;
};

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string | null;
}

// types/product.ts
export interface LocationDTO {
  id: string;
  name: string;
  type: LocationType;
  address: string | null;
  phone: string | null;
  email: string | null;
  createdAt: Date;
}
//Pagination interface

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}
