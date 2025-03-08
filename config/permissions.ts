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
    display: "Dashboard",
    name: "dashboard",
    permissions: {
      create: "dashboard.create",
      read: "dashboard.read",
      update: "dashboard.update",
      delete: "dashboard.delete",
    },
  },
  {
    display: "Users",
    name: "users",
    permissions: {
      create: "users.create",
      read: "users.read",
      update: "users.update",
      delete: "users.delete",
    },
  },
  {
    display: "Roles",
    name: "roles",
    permissions: {
      create: "roles.create",
      read: "roles.read",
      update: "roles.update",
      delete: "roles.delete",
    },
  },
  {
    display: "Sales",
    name: "sales",
    permissions: {
      create: "sales.create",
      read: "sales.read",
      update: "sales.update",
      delete: "sales.delete",
    },
  },
  {
    display: "Customers",
    name: "customers",
    permissions: {
      create: "customers.create",
      read: "customers.read",
      update: "customers.update",
      delete: "customers.delete",
    },
  },
  {
    display: "Orders",
    name: "orders",
    permissions: {
      create: "orders.create",
      read: "orders.read",
      update: "orders.update",
      delete: "orders.delete",
    },
  },
  {
    display: "Reports",
    name: "reports",
    permissions: {
      create: "reports.create",
      read: "reports.read",
      update: "reports.update",
      delete: "reports.delete",
    },
  },
  {
    display: "Settings",
    name: "settings",
    permissions: {
      create: "settings.create",
      read: "settings.read",
      update: "settings.update",
      delete: "settings.delete",
    },
  },
  {
    display: "Categories",
    name: "categories",
    permissions: {
      create: "categories.create",
      read: "categories.read",
      update: "categories.update",
      delete: "categories.delete",
    },
  },
  {
    display: "Products",
    name: "products",
    permissions: {
      create: "products.create",
      read: "products.read",
      update: "products.update",
      delete: "products.delete",
    },
  },
  {
    display: "Blogs",
    name: "blogs",
    permissions: {
      create: "blogs.create",
      read: "blogs.read",
      update: "blogs.update",
      delete: "blogs.delete",
    },
  },
];

// Helper function to get all permission strings
export function getAllPermissions(): string[] {
  return permissions.flatMap((module) => Object.values(module.permissions));
}

// Helper function to check if a permission exists
export function isValidPermission(permission: string): boolean {
  return getAllPermissions().includes(permission);
}

// Helper to get module permissions by name
export function getModulePermissions(
  moduleName: string
): Permission | undefined {
  const module = permissions.find((m) => m.name === moduleName);
  return module?.permissions;
}

// Type for the permissions object
export type PermissionsType = {
  [K in (typeof permissions)[number]["name"]]: Permission;
};
