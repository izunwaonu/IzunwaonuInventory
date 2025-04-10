// config/sidebar.ts
// import {
//   BaggageClaim,
//   BarChart2,
//   BarChart4,
//   Book,
//   Cable,
//   CircleDollarSign,
//   FolderTree,
//   Home,
//   LucideIcon,
//   Presentation,
//   Settings,
//   Users,
// } from "lucide-react";

// export interface ISidebarLink {
//   title: string;
//   href?: string;
//   icon: LucideIcon;
//   dropdown: boolean;
//   permission: string; // Required permission to view this item
//   dropdownMenu?: MenuItem[];
// }

// type MenuItem = {
//   title: string;
//   href: string;
//   permission: string; // Required permission to view this menu item
// };

// export const sidebarLinks: ISidebarLink[] = [
//   {
//     title: "Dashboard",
//     href: "/dashboard",
//     icon: Home,
//     dropdown: false,
//     permission: "dashboard.read",
//   },
//   {
//     title: "Users",
//     icon: Users,
//     href: "/dashboard/users",
//     dropdown: true,
//     permission: "users.read",
//     dropdownMenu: [
//       {
//         title: "Users",
//         href: "/dashboard/users",
//         permission: "users.read",
//       },
//       {
//         title: "Roles",
//         href: "/dashboard/users/roles",
//         permission: "roles.read",
//       },
//       {
//         title: "Change Password",
//         href: "/dashboard/change-password",
//         permission: "roles.read",
//       },
//       {
//         title: "Profile",
//         href: "/dashboard/profile",
//         permission: "roles.read",
//       },
//     ],
//   },
//   {
//     title: "Inventory",
//     icon: BaggageClaim,
//     dropdown: true,
//     href: "/dashboard/inventory/products",
//     permission: "products.read",
//     dropdownMenu: [
//       {
//         title: "Categories",
//         href: "/dashboard/inventory/categories",
//         permission: "categories.read",
//       },
//       {
//         title: "Products",
//         href: "/dashboard/inventory/products",
//         permission: "products.read",
//       },
//     ],
//   },
//   {
//     title: "Sales",
//     icon: CircleDollarSign,
//     dropdown: true,
//     href: "/dashboard/sales",
//     permission: "sales.read",
//     dropdownMenu: [
//       {
//         title: "Sales",
//         href: "/dashboard/sales",
//         permission: "sales.read",
//       },
//       {
//         title: "Customers",
//         href: "/dashboard/sales/customers",
//         permission: "customers.read",
//       },
//     ],
//   },
//   {
//     title: "Blogs",
//     icon: Book,
//     dropdown: false,
//     href: "/dashboard/blogs",
//     permission: "blogs.read",
//   },
//   {
//     title: "Orders",
//     href: "/dashboard/orders",
//     icon: BarChart2,
//     dropdown: false,
//     permission: "orders.read",
//   },
//   {
//     title: "Settings",
//     href: "/dashboard/settings",
//     icon: Settings,
//     dropdown: false,
//     permission: "settings.read",
//   },
//   {
//     title: "Reports",
//     icon: BarChart4,
//     dropdown: true,
//     href: "/dashboard/reports/products",
//     permission: "reports.read",
//     dropdownMenu: [
//       {
//         title: "Product Report",
//         href: "/dashboard/reports/products",
//         permission: "reports.read",
//       },
//       {
//         title: "Inventory Report",
//         href: "/dashboard/reports/inventory",
//         permission: "reports.read",
//       },
//       {
//         title: "Customers Report",
//         href: "/dashboard/reports/customers",
//         permission: "reports.read",
//       },
//     ],
//   },
// ];

import { BaggageClaim, BarChart4, Book, CircleDollarSign, Home, type LucideIcon, Settings, ShoppingCart, Link } from 'lucide-react';

export interface ISidebarLink {
  title: string;
  href?: string;
  icon: LucideIcon;
  dropdown: boolean;
  permission: string; // Required permission to view this item
  dropdownMenu?: MenuItem[];
}

type MenuItem = {
  title: string;
  href: string;
  permission: string; // Required permission to view this menu item
};

export const sidebarLinks: ISidebarLink[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
    dropdown: false,
    permission: "dashboard.read",
  },
  {
    title: "Inventory",
    icon: BaggageClaim,
    dropdown: true,
    href: "/dashboard/inventory",
    permission: "inventory.read",
    dropdownMenu: [
      {
        title: "Items",
        href: "/dashboard/inventory/items",
        permission: "inventory.read",
      },
      {
        title: "Categories",
        href: "/dashboard/inventory/categories",
        permission: "categories.read",
      },
      {
        title: "Brands",
        href: "/dashboard/inventory/brands",
        permission: "inventory.read",
      },
      {
        title: "Units",
        href: "/dashboard/inventory/units",
        permission: "inventory.read",
      },
      {
        title: "Current Stock",
        href: "/dashboard/inventory/current-stock",
        permission: "inventory.read",
      },
      {
        title: "Low Stock Items",
        href: "/dashboard/inventory/low-stock",
        permission: "inventory.read",
      },
      {
        title: "Serial Numbers",
        href: "/dashboard/inventory/serial-numbers",
        permission: "inventory.read",
      },
      {
        title: "Stock Transfers",
        href: "/dashboard/inventory/transfers",
        permission: "inventory.read",
      },
      {
        title: "Stock Adjustments",
        href: "/dashboard/inventory/adjustments",
        permission: "inventory.read",
      },
    ],
  },
  {
    title: "Purchases",
    icon: ShoppingCart,
    dropdown: true,
    href: "/dashboard/purchases",
    permission: "purchases.read",
    dropdownMenu: [
      {
        title: "Purchase Orders",
        href: "/dashboard/purchases/orders",
        permission: "purchases.read",
      },
      {
        title: "Goods Receipt",
        href: "/dashboard/purchases/receipts",
        permission: "purchases.read",
      },
      {
        title: "Suppliers",
        href: "/dashboard/purchases/suppliers",
        permission: "suppliers.read",
      },
    ],
  },
  {
    title: "Sales",
    icon: CircleDollarSign,
    dropdown: true,
    href: "/dashboard/sales",
    permission: "sales.read",
    dropdownMenu: [
      {
        title: "POS Sales",
        href: "/dashboard/sales/pos",
        permission: "sales.read",
      },
      {
        title: "Sales Orders",
        href: "/dashboard/sales/orders",
        permission: "sales.read",
      },
      {
        title: "Returns",
        href: "/dashboard/sales/returns",
        permission: "sales.read",
      },
      {
        title: "Customers",
        href: "/dashboard/sales/customers",
        permission: "customers.read",
      },
    ],
  },
  {
    title: "Reports",
    icon: BarChart4,
    dropdown: true,
    href: "/dashboard/reports",
    permission: "reports.read",
    dropdownMenu: [
      {
        title: "Stock Movement",
        href: "/dashboard/reports/stock-movement",
        permission: "reports.read",
      },
      {
        title: "Inventory Valuation",
        href: "/dashboard/reports/inventory-valuation",
        permission: "reports.read",
      },
      {
        title: "Aging Analysis",
        href: "/dashboard/reports/aging-analysis",
        permission: "reports.read",
      },
      {
        title: "Purchase Summary",
        href: "/dashboard/reports/purchase-summary",
        permission: "reports.read",
      },
      {
        title: "Supplier Performance",
        href: "/dashboard/reports/supplier-performance",
        permission: "reports.read",
      },
      {
        title: "Purchase History",
        href: "/dashboard/reports/purchase-history",
        permission: "reports.read",
      },
      {
        title: "Sales Summary",
        href: "/dashboard/reports/sales-summary",
        permission: "reports.read",
      },
      {
        title: "Item Performance",
        href: "/dashboard/reports/item-performance",
        permission: "reports.read",
      },
      {
        title: "Sales History",
        href: "/dashboard/reports/sales-history",
        permission: "reports.read",
      },
    ],
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    dropdown: true,
    permission: "settings.read",
    dropdownMenu: [
      {
        title: "Locations",
        href: "/dashboard/settings/locations",
        permission: "settings.read",
      },
      {
        title: "Tax Rates",
        href: "/dashboard/settings/tax-rates",
        permission: "tax.read",
      },
      {
        title: "Add Tax Rates",
        href: "/dashboard/settings/tax-rates/create",
        permission: "tax.read",
      },
      {
        title: "Users & Invites",
        href: "/dashboard/users",
        permission: "users.read",
      },
      {
        title: "Roles & Permissions",
        href: "/dashboard/users/roles",
        permission: "roles.read",
      },
      {
        title: "Company Settings",
        href: "/dashboard/settings/company",
        permission: "settings.read",
      },
      {
        title: "Profile",
        href: "/dashboard/profile",
        permission: "settings.read",
      },
      {
        title: "Change Password",
        href: "/dashboard/change-password",
        permission: "settings.read",
      },
    ],
  },
  {
    title: "Integrations",
    href: "/dashboard/integrations",
    icon: Link,
    dropdown: true,
    permission: "integrations.read",
    dropdownMenu: [
      {
        title: "POS Integration",
        href: "/dashboard/integrations/pos",
        permission: "integrations.read",
      },
      {
        title: "Accounting Integration",
        href: "/dashboard/integrations/accounting",
        permission: "integrations.read",
      },
      {
        title: "API Keys",
        href: "/dashboard/integrations/api-keys",
        permission: "integrations.read",
      },
    ],
  },
  // Keeping your existing Blogs section
  {
    title: "Blogs",
    icon: Book,
    dropdown: false,
    href: "/dashboard/blogs",
    permission: "blogs.read",
  },
];