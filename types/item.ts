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
  