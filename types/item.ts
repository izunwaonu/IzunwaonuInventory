export type ItemCreateDTO = {
    name: string;
    slug: string;
    orgId: string;
    sku: string;
    costPrice: number;
    sellingPrice: number;
    thumbnail?: string;
  }

  interface ApiResponse<T>{
    success: boolean;
    data: T;
    error?: string | null;
  }

  // types/product.ts
export interface BriefItemDTO {
    id: string;
    name: string;
    slug: string;
    sellingPrice: number;
    costPrice: number;
    salesCount: number;
    salesTotal: number;
    thumbnail: string | null;
    createdAt: Date;
    
  }
//Pagination interface

  export interface Pagination {
    total : number;
    page : number;
    limit : number;
    pages : number;
  }

  interface BriefItemData{
    data: BriefItemDTO[];
    pagination: Pagination;
  }

  export type BriefItemsResponse = ApiResponse<BriefItemData>

  //Complete Response Structure
  // export interface BriefItemsResponse{
  //   data: BriefItemDTO[];
  //   pagination: Pagination;
  //   success: boolean;
  // }
  // export interface PaginatedResponse<T>{
  //   data: T[];
  //   pagination: Pagination;
  // }
  // type BriefItemsResponse = PaginatedResponse <BriefItemDTO>
  // Product data interface
interface ProductData {
  id: string;
  name: string;
  slug: string;
  sku: string;
  barcode?: string;
  description?: string ;
  dimensions?: string ;
  weight?: number;
  upc?: string ;
  ean?: string ;
  mpn?: string ;
  isbn?: string ;
  thumbnail: string;
  imageUrls: string[];
  categoryId?: string ;
  salesCount: number;
  salesTotal: number;
  taxRateId?: string ;
  orgId: string;
  tax: number;
  brandId?: string ;
  unitId?: string;
  unitOfMeasure?: string ;
  costPrice: number;
  sellingPrice: number;
  minStockLevel: number;
  maxStockLevel?: number ;
  isActive: boolean;
  isSerialTracked: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// API response interface
 interface ProductResponse {
  success: boolean;
  data: ProductData;
  error: string | null;
}

interface ProductListResponse {
  success: boolean;
  data: ProductData[];
  error: string | null;
}

export type{ProductData, ProductResponse, ProductListResponse};
// Alternative generic response type if you have multiple similar endpoints


// Usage example:
// type ProductApiResponse = ApiResponse<Product>;