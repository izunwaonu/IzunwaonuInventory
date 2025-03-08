// config/sidebar.ts
import {
  BaggageClaim,
  BarChart2,
  BarChart4,
  Book,
  Cable,
  CircleDollarSign,
  FolderTree,
  Home,
  LucideIcon,
  Presentation,
  Settings,
  Users,
} from "lucide-react";

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
    title: "Users",
    icon: Users,
    href: "/dashboard/users",
    dropdown: true,
    permission: "users.read",
    dropdownMenu: [
      {
        title: "Users",
        href: "/dashboard/users",
        permission: "users.read",
      },
      {
        title: "Roles",
        href: "/dashboard/users/roles",
        permission: "roles.read",
      },
      {
        title: "Change Password",
        href: "/dashboard/change-password",
        permission: "roles.read",
      },
      {
        title: "Profile",
        href: "/dashboard/profile",
        permission: "roles.read",
      },
    ],
  },
  {
    title: "Inventory",
    icon: BaggageClaim,
    dropdown: true,
    href: "/dashboard/inventory/products",
    permission: "products.read",
    dropdownMenu: [
      {
        title: "Categories",
        href: "/dashboard/inventory/categories",
        permission: "categories.read",
      },
      {
        title: "Products",
        href: "/dashboard/inventory/products",
        permission: "products.read",
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
        title: "Sales",
        href: "/dashboard/sales",
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
    title: "Blogs",
    icon: Book,
    dropdown: false,
    href: "/dashboard/blogs",
    permission: "blogs.read",
  },
  {
    title: "Orders",
    href: "/dashboard/orders",
    icon: BarChart2,
    dropdown: false,
    permission: "orders.read",
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    dropdown: false,
    permission: "settings.read",
  },
  {
    title: "Reports",
    icon: BarChart4,
    dropdown: true,
    href: "/dashboard/reports/products",
    permission: "reports.read",
    dropdownMenu: [
      {
        title: "Product Report",
        href: "/dashboard/reports/products",
        permission: "reports.read",
      },
      {
        title: "Inventory Report",
        href: "/dashboard/reports/inventory",
        permission: "reports.read",
      },
      {
        title: "Customers Report",
        href: "/dashboard/reports/customers",
        permission: "reports.read",
      },
    ],
  },
];
