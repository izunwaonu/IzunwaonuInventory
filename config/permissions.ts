// permissions.ts
export type Permission = {
  create: string;
  read: string;
  update: string;
  delete: string;
};

export type ModulePermissions = {
  display: string;
  name: string;
  permissions: Permission;
};

export const permissions: ModulePermissions[] = [
  {
    display: 'Dashboard',
    name: 'dashboard',
    permissions: {
      create: 'dashboard.create',
      read: 'dashboard.read',
      update: 'dashboard.update',
      delete: 'dashboard.delete',
    },
  },
  // Inventory and related modules
  {
    display: 'Inventory',
    name: 'inventory',
    permissions: {
      create: 'inventory.create',
      read: 'inventory.read',
      update: 'inventory.update',
      delete: 'inventory.delete',
    },
  },
  {
    display: 'Items',
    name: 'items',
    permissions: {
      create: 'items.create',
      read: 'items.read',
      update: 'items.update',
      delete: 'items.delete',
    },
  },
  {
    display: 'Categories',
    name: 'categories',
    permissions: {
      create: 'categories.create',
      read: 'categories.read',
      update: 'categories.update',
      delete: 'categories.delete',
    },
  },
  {
    display: 'Brands',
    name: 'brands',
    permissions: {
      create: 'brands.create',
      read: 'brands.read',
      update: 'brands.update',
      delete: 'brands.delete',
    },
  },
  {
    display: 'Units',
    name: 'units',
    permissions: {
      create: 'units.create',
      read: 'units.read',
      update: 'units.update',
      delete: 'units.delete',
    },
  },
  {
    display: 'Tax Rates',
    name: 'tax',
    permissions: {
      create: 'tax.create',
      read: 'tax.read',
      update: 'tax.update',
      delete: 'tax.delete',
    },
  },
  {
    display: 'Serial Numbers',
    name: 'serialNumbers',
    permissions: {
      create: 'serialNumbers.create',
      read: 'serialNumbers.read',
      update: 'serialNumbers.update',
      delete: 'serialNumbers.delete',
    },
  },
  {
    display: 'Stock Transfers',
    name: 'transfers',
    permissions: {
      create: 'transfers.create',
      read: 'transfers.read',
      update: 'transfers.update',
      delete: 'transfers.delete',
    },
  },
  {
    display: 'Stock Adjustments',
    name: 'adjustments',
    permissions: {
      create: 'adjustments.create',
      read: 'adjustments.read',
      update: 'adjustments.update',
      delete: 'adjustments.delete',
    },
  },
  // Purchases and related modules
  {
    display: 'Purchases',
    name: 'purchases',
    permissions: {
      create: 'purchases.create',
      read: 'purchases.read',
      update: 'purchases.update',
      delete: 'purchases.delete',
    },
  },
  {
    display: 'Purchase Orders',
    name: 'purchaseOrders',
    permissions: {
      create: 'purchaseOrders.create',
      read: 'purchaseOrders.read',
      update: 'purchaseOrders.update',
      delete: 'purchaseOrders.delete',
    },
  },
  {
    display: 'Goods Receipt',
    name: 'goodsReceipt',
    permissions: {
      create: 'goodsReceipt.create',
      read: 'goodsReceipt.read',
      update: 'goodsReceipt.update',
      delete: 'goodsReceipt.delete',
    },
  },
  {
    display: 'Suppliers',
    name: 'suppliers',
    permissions: {
      create: 'suppliers.create',
      read: 'suppliers.read',
      update: 'suppliers.update',
      delete: 'suppliers.delete',
    },
  },
  // Sales and related modules
  {
    display: 'Sales',
    name: 'sales',
    permissions: {
      create: 'sales.create',
      read: 'sales.read',
      update: 'sales.update',
      delete: 'sales.delete',
    },
  },
  {
    display: 'POS Sales',
    name: 'posSales',
    permissions: {
      create: 'posSales.create',
      read: 'posSales.read',
      update: 'posSales.update',
      delete: 'posSales.delete',
    },
  },
  {
    display: 'Sales Orders',
    name: 'salesOrders',
    permissions: {
      create: 'salesOrders.create',
      read: 'salesOrders.read',
      update: 'salesOrders.update',
      delete: 'salesOrders.delete',
    },
  },
  {
    display: 'Returns',
    name: 'returns',
    permissions: {
      create: 'returns.create',
      read: 'returns.read',
      update: 'returns.update',
      delete: 'returns.delete',
    },
  },
  {
    display: 'Customers',
    name: 'customers',
    permissions: {
      create: 'customers.create',
      read: 'customers.read',
      update: 'customers.update',
      delete: 'customers.delete',
    },
  },
  // Reports
  {
    display: 'Reports',
    name: 'reports',
    permissions: {
      create: 'reports.create',
      read: 'reports.read',
      update: 'reports.update',
      delete: 'reports.delete',
    },
  },
  {
    display: 'Inventory Reports',
    name: 'reports.inventory',
    permissions: {
      create: 'reports.inventory.create',
      read: 'reports.inventory.read',
      update: 'reports.inventory.update',
      delete: 'reports.inventory.delete',
    },
  },
  {
    display: 'Purchase Reports',
    name: 'reports.purchases',
    permissions: {
      create: 'reports.purchases.create',
      read: 'reports.purchases.read',
      update: 'reports.purchases.update',
      delete: 'reports.purchases.delete',
    },
  },
  {
    display: 'Sales Reports',
    name: 'reports.sales',
    permissions: {
      create: 'reports.sales.create',
      read: 'reports.sales.read',
      update: 'reports.sales.update',
      delete: 'reports.sales.delete',
    },
  },
  {
    display: 'Product Reports',
    name: 'reports.products',
    permissions: {
      create: 'reports.products.create',
      read: 'reports.products.read',
      update: 'reports.products.update',
      delete: 'reports.products.delete',
    },
  },
  {
    display: 'Supplier Reports',
    name: 'reports.suppliers',
    permissions: {
      create: 'reports.suppliers.create',
      read: 'reports.suppliers.read',
      update: 'reports.suppliers.update',
      delete: 'reports.suppliers.delete',
    },
  },
  {
    display: 'Customer Reports',
    name: 'reports.customers',
    permissions: {
      create: 'reports.customers.create',
      read: 'reports.customers.read',
      update: 'reports.customers.update',
      delete: 'reports.customers.delete',
    },
  },
  // Settings and related modules
  {
    display: 'Settings',
    name: 'settings',
    permissions: {
      create: 'settings.create',
      read: 'settings.read',
      update: 'settings.update',
      delete: 'settings.delete',
    },
  },
  {
    display: 'Locations',
    name: 'locations',
    permissions: {
      create: 'locations.create',
      read: 'locations.read',
      update: 'locations.update',
      delete: 'locations.delete',
    },
  },
  {
    display: 'Users',
    name: 'users',
    permissions: {
      create: 'users.create',
      read: 'users.read',
      update: 'users.update',
      delete: 'users.delete',
    },
  },
  {
    display: 'Roles',
    name: 'roles',
    permissions: {
      create: 'roles.create',
      read: 'roles.read',
      update: 'roles.update',
      delete: 'roles.delete',
    },
  },
  {
    display: 'Company Settings',
    name: 'company',
    permissions: {
      create: 'company.create',
      read: 'company.read',
      update: 'company.update',
      delete: 'company.delete',
    },
  },
  {
    display: 'Tax Rates',
    name: 'tax.settings',
    permissions: {
      create: 'tax.settings.create',
      read: 'tax.settings.read',
      update: 'tax.settings.update',
      delete: 'tax.settings.delete',
    },
  },
  {
    display: 'Profile',
    name: 'profile',
    permissions: {
      create: 'profile.create',
      read: 'profile.read',
      update: 'profile.update',
      delete: 'profile.delete',
    },
  },
  {
    display: 'Password',
    name: 'password',
    permissions: {
      create: 'password.create',
      read: 'password.read',
      update: 'password.update',
      delete: 'password.delete',
    },
  },
  {
    display: 'Api Keys',
    name: 'api.keys',
    permissions: {
      create: 'api.keys.create',
      read: 'api.keys.read',
      update: 'api.keys.update',
      delete: 'api.keys.delete',
    },
  },
  // Integrations and related modules
  {
    display: 'Integrations',
    name: 'integrations',
    permissions: {
      create: 'integrations.create',
      read: 'integrations.read',
      update: 'integrations.update',
      delete: 'integrations.delete',
    },
  },
  {
    display: 'POS Integration',
    name: 'posIntegration',
    permissions: {
      create: 'posIntegration.create',
      read: 'posIntegration.read',
      update: 'posIntegration.update',
      delete: 'posIntegration.delete',
    },
  },
  {
    display: 'Accounting Integration',
    name: 'accountingIntegration',
    permissions: {
      create: 'accountingIntegration.create',
      read: 'accountingIntegration.read',
      update: 'accountingIntegration.update',
      delete: 'accountingIntegration.delete',
    },
  },
  {
    display: 'API Keys',
    name: 'apiKeys',
    permissions: {
      create: 'apiKeys.create',
      read: 'apiKeys.read',
      update: 'apiKeys.update',
      delete: 'apiKeys.delete',
    },
  },
  {
    display: 'E-Commerce Integration',
    name: 'integrations.ecommerce',
    permissions: {
      create: 'integrations.ecommerce.create',
      read: 'integrations.ecommerce.read',
      update: 'integrations.ecommerce.update',
      delete: 'integrations.ecommerce.delete',
    },
  },
  // Keep existing modules
  {
    display: 'Orders',
    name: 'order',
    permissions: {
      create: 'order.create',
      read: 'order.read',
      update: 'order.update',
      delete: 'order.delete',
    },
  },
];

export const adminPermissions = [
  // Dashboard
  'dashboard.create',
  'dashboard.read',
  'dashboard.update',
  'dashboard.delete',

  //User Management
  'users.create',
  'users.read',
  'users.update',
  'users.delete',
  'roles.create',
  'roles.read',
  'roles.update',
  'roles.delete',

  // Inventory and related
  'inventory.create',
  'inventory.read',
  'inventory.update',
  'inventory.delete',

  'items.create',
  'items.read',
  'items.update',
  'items.delete',

  'categories.create',
  'categories.read',
  'categories.update',
  'categories.delete',

  'brands.create',
  'brands.read',
  'brands.update',
  'brands.delete',

  'units.create',
  'units.read',
  'units.update',
  'units.delete',

  'tax.create',
  'tax.read',
  'tax.update',
  'tax.delete',

  'stock.create',
  'stock.read',
  'stock.update',
  'stock.delete',

  'serial.numbers.create',
  'serial.numbers.read',
  'serial.numbers.update',
  'serial.numbers.delete',

  // "serialNumbers.create", "serialNumbers.read", "serialNumbers.update", "serialNumbers.delete",
  'transfers.create',
  'transfers.read',
  'transfers.update',
  'transfers.delete',

  'adjustments.create',
  'adjustments.read',
  'adjustments.update',
  'adjustments.delete',

  // Purchases and related
  'purchase.orders.create',
  'purchase.orders.read',
  'purchase.orders.update',
  'purchase.orders.delete',

  'goods.receipts.create',
  'goods.receipts.read',
  'goods.receipts.update',
  'goods.receipts.delete',

  'suppliers.create',
  'suppliers.read',
  'suppliers.update',
  'suppliers.delete',

  // "purchaseOrders.create", "purchaseOrders.read", "purchaseOrders.update", "purchaseOrders.delete",
  // "goodsReceipt.create", "goodsReceipt.read", "goodsReceipt.update", "goodsReceipt.delete",
  // "suppliers.create", "suppliers.read", "suppliers.update", "suppliers.delete",

  // Sales and related
  'sales.create',
  'sales.read',
  'sales.update',
  'sales.delete',

  'sales.orders.create',
  'sales.orders.read',
  'sales.orders.update',
  'sales.orders.delete',

  'pos.create',
  'pos.read',
  'pos.update',
  'pos.delete',

  // "posSales.create", "posSales.read", "posSales.update", "posSales.delete",
  // "salesOrders.create", "salesOrders.read", "salesOrders.update", "salesOrders.delete",
  'returns.create',
  'returns.read',
  'returns.update',
  'returns.delete',

  'customers.create',
  'customers.read',
  'customers.update',
  'customers.delete',

  // Reports
  'reports.create',
  'reports.read',
  'reports.update',
  'reports.delete',

  'reports.inventory.create',
  'reports.inventory.read',
  'reports.inventory.update',
  'reports.inventory.delete',

  'reports.purchases.create',
  'reports.purchases.read',
  'reports.purchases.update',
  'reports.purchases.delete',

  'reports.sales.create',
  'reports.sales.read',
  'reports.sales.update',
  'reports.sales.delete',

  'reports.products.create',
  'reports.products.read',
  'reports.products.update',
  'reports.products.delete',

  // Integrations and related
  'integrations.create',
  'integrations.read',
  'integrations.update',
  'integrations.delete',

  'integrations.pos.create',
  'integrations.pos.read',
  'integrations.pos.update',
  'integrations.pos.delete',

  'integrations.accounting.create',
  'integrations.accounting.read',
  'integrations.accounting.update',
  'integrations.accounting.delete',

  'integrations.api.create',
  'integrations.api.read',
  'integrations.api.update',
  'integrations.api.delete',

  // "posIntegration.create", "posIntegration.read", "posIntegration.update", "posIntegration.delete",
  // "accountingIntegration.create", "accountingIntegration.read", "accountingIntegration.update", "accountingIntegration.delete",
  // "apiKeys.create", "apiKeys.read", "apiKeys.update", "apiKeys.delete",

  // Settings and related
  'settings.create',
  'settings.read',
  'settings.update',
  'settings.delete',
  'settings.access',

  'locations.create',
  'locations.read',
  'locations.update',
  'locations.delete',

  'company.settings.create',
  'company.settings.read',
  'company.settings.update',
  'company.settings.delete',

  'profile.create',
  'profile.read',
  'profile.update',
  'profile.delete',

  'password.create',
  'password.read',
  'password.update',
  'password.delete',

  // "users.create", "users.read", "users.update", "users.delete",
  // "roles.create", "roles.read", "roles.update", "roles.delete",
  // "tax.settings.create", "tax.settings.read", "tax.settings.update", "tax.settings.delete",
  // // "taxes.create", "taxes.read", "taxes.update", "taxes.delete",
  // "company.create", "company.read", "company.update", "company.delete",
  // "profile.create", "profile.read", "profile.update", "profile.delete",

  //Legacy permissions kept for backward compatibility

  'orders.create',
  'orders.read',
  'orders.update',
  'orders.delete',
];

export const userPermissions = [
  'dashboard.read',
  'profile.read',
  'profile.update',
  'password.change',

  //Inventory view access

  'items.read',
  'categories.read',
  'brands.read',
  'tax.read',
  'stock.read',
  'units.read',

  //Basic Sales capability

  'sales.orders.read',
  'sales.orders.create',
  'pos.access',
  'customers.read',

  // Legacy permissions for backward compatibility

  'product.read',
  'orders.read',
  'orders.create',

  // "salesOrders.read",
  // "salesOrders.create",
  // "customers.read",
  // "tax.settings.read",
];
export const managerPermissions = [
  //All user permissiom
  ...userPermissions,
  'items.create',
  'items.update',
  'categories.read',
  'brands.read',
  'transfer.create',
  'transfer.read',
  'transfer.update',
  'purchase.orders.create',
  'purchase.orders.read',
  'purchase.orders.update',
  'goods.receipts.create',
  'goods.receipts.read',
  'suppliers.read',
  'sales.read',
  'sales.update',
  'sales.orders.update',
  'customers.create',
  'customers.update',
  'reports.read',
  'adjustments.create',
  'adjustments.read',
];
// export type Permission = {
//   create: string;
//   read: string;
//   update: string;
//   delete: string;
// };

// export type ModulePermissions = {
//   display: string;
//   name: string;
//   permissions: Permission;
// };

// export const permissions: ModulePermissions[] = [
//   {
//     display: "Dashboard",
//     name: "dashboard",
//     permissions: {
//       create: "dashboard.create",
//       read: "dashboard.read",
//       update: "dashboard.update",
//       delete: "dashboard.delete",
//     },
//   },
//   {
//     display: "Users",
//     name: "users",
//     permissions: {
//       create: "users.create",
//       read: "users.read",
//       update: "users.update",
//       delete: "users.delete",
//     },
//   },
//   {
//     display: "Roles",
//     name: "roles",
//     permissions: {
//       create: "roles.create",
//       read: "roles.read",
//       update: "roles.update",
//       delete: "roles.delete",
//     },
//   },
//   {
//     display: "Sales",
//     name: "sales",
//     permissions: {
//       create: "sales.create",
//       read: "sales.read",
//       update: "sales.update",
//       delete: "sales.delete",
//     },
//   },
//   {
//     display: "Customers",
//     name: "customers",
//     permissions: {
//       create: "customers.create",
//       read: "customers.read",
//       update: "customers.update",
//       delete: "customers.delete",
//     },
//   },
//   {
//     display: "Orders",
//     name: "orders",
//     permissions: {
//       create: "orders.create",
//       read: "orders.read",
//       update: "orders.update",
//       delete: "orders.delete",
//     },
//   },
//   {
//     display: "Reports",
//     name: "reports",
//     permissions: {
//       create: "reports.create",
//       read: "reports.read",
//       update: "reports.update",
//       delete: "reports.delete",
//     },
//   },
//   {
//     display: "Settings",
//     name: "settings",
//     permissions: {
//       create: "settings.create",
//       read: "settings.read",
//       update: "settings.update",
//       delete: "settings.delete",
//     },
//   },
//   {
//     display: "Categories",
//     name: "categories",
//     permissions: {
//       create: "categories.create",
//       read: "categories.read",
//       update: "categories.update",
//       delete: "categories.delete",
//     },
//   },
//   {
//     display: "Products",
//     name: "products",
//     permissions: {
//       create: "products.create",
//       read: "products.read",
//       update: "products.update",
//       delete: "products.delete",
//     },
//   },
//   {
//     display: "Blogs",
//     name: "blogs",
//     permissions: {
//       create: "blogs.create",
//       read: "blogs.read",
//       update: "blogs.update",
//       delete: "blogs.delete",
//     },
//   },
// ];

// export const adminPermissions = [
//   "dashboard.create",
//   "dashboard.read",
//   "dashboard.update",
//   "dashboard.delete",

//   "users.create",
//   "users.read",
//   "users.update",
//   "users.delete",

//   "roles.create",
//   "roles.read",
//   "roles.update",
//   "roles.delete",

//   "sales.create",
//   "sales.read",
//   "sales.update",
//   "sales.delete",

//   "customers.create",
//   "customers.read",
//   "customers.update",
//   "customers.delete",

//   "orders.create",
//   "orders.read",
//   "orders.update",
//   "orders.delete",

//   "reports.create",
//   "reports.read",
//   "reports.update",
//   "reports.delete",

//   "settings.create",
//   "settings.read",
//   "settings.update",
//   "settings.delete",

//   "categories.create",
//   "categories.read",
//   "categories.update",
//   "categories.delete",

//   "products.create",
//   "products.read",
//   "products.update",
//   "products.delete",

//   "blogs.create",
//   "blogs.read",
//   "blogs.update",
//   "blogs.delete",
// ];
// export const userPermissions = [
//   "dashboard.read",
//   "profile.read",
//   "profile.update",
//   "products.read",
//   "orders.read",
//   "orders.create",
// ];

// Helper function to get all permission strings
export function getAllPermissions(): string[] {
  return permissions.flatMap((module) => Object.values(module.permissions));
}

// Helper function to check if a permission exists
export function isValidPermission(permission: string): boolean {
  return getAllPermissions().includes(permission);
}

// Helper to get module permissions by name
export function getModulePermissions(moduleName: string): Permission | undefined {
  const module = permissions.find((m) => m.name === moduleName);
  return module?.permissions;
}

// Type for the permissions object
export type PermissionsType = {
  [K in (typeof permissions)[number]['name']]: Permission;
};
