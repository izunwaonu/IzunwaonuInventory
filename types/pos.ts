export type Source = 'POS' | 'SALES_ORDER';

export type CartItem = {
  id: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  discount: number;
  total: number;
  thumbnail?: string;
  unit?: { name: string };
};

export type Customer = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  taxId?: string | null;
  notes?: string | null;
  isActive?: boolean;
  orgId?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

export type Item = {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  thumbnail?: string;
  sellingPrice: number;
  costPrice: number;
  category?: { id: string; title: string };
  brand?: { id: string; name: string };
  unit?: { id: string; name: string };
  totalStock: number;
  available: number;
};

export type POSOrder = {
  id: string;
  orderNumber: string;
  date: string;
  customerId?: string;
  customer?: Customer;
  source: Source;
  status: string;
  paymentStatus: string;
  paymentMethod?: string;
  subtotal: number;
  taxAmount: number;
  discount?: number;
  total: number;
  notes?: string;
  lines: Array<{
    id: string;
    itemId: string;
    item: {
      id: string;
      name: string;
      sku: string;
      thumbnail?: string;
    };
    quantity: number;
    unitPrice: number;
    discount?: number;
    taxRate: number;
    taxAmount: number;
    total: number;
  }>;
  organization?: {
    id: string;
    name: string;
    address?: string;
  };
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
  };
};
