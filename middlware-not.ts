// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Define routes that don't require authentication
const publicRoutes = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/",
];

// Define route permissions mapping
const routePermissions: Record<string, string[]> = {
  // Dashboard routes
  "/dashboard": ["dashboard.read"],
  "/dashboard/users": ["users.read"],
  "/dashboard/users/create": ["users.create"],
  "/dashboard/users/edit": ["users.update"],
  "/dashboard/roles": ["roles.read"],
  "/dashboard/roles/create": ["roles.create"],
  "/dashboard/roles/edit": ["roles.update"],

  // Sales routes
  "/dashboard/sales": ["sales.read"],
  "/dashboard/sales/create": ["sales.create"],
  "/dashboard/pos": ["pos.read"],

  // Inventory routes
  "/dashboard/stock-purchase": ["stockPurchase.read"],
  "/dashboard/stock-adjustment": ["stockAdjustment.read"],

  // Product management routes
  "/dashboard/products": ["products.read"],
  "/dashboard/products/create": ["products.create"],
  "/dashboard/categories": ["categories.read"],
  "/dashboard/brands": ["brands.read"],

  // Customer management routes
  "/dashboard/customers": ["customers.read"],
  "/dashboard/orders": ["orders.read"],

  // Settings and configuration routes
  "/dashboard/settings": ["settings.read"],
  "/dashboard/api-integration": ["api.read"],
  "/dashboard/reports": ["reports.read"],
};

// Helper function to check if the route requires authentication
function isPublicRoute(path: string): boolean {
  return publicRoutes.some((route) => path.startsWith(route));
}

// Helper function to check if the route requires specific permissions
function getRequiredPermissions(path: string): string[] {
  // Remove query parameters and hash from path
  const cleanPath = path.split("?")[0].split("#")[0];

  // Check exact match first
  if (routePermissions[cleanPath]) {
    return routePermissions[cleanPath];
  }

  // Check parent routes if no exact match
  const pathParts = cleanPath.split("/").filter(Boolean);
  while (pathParts.length > 0) {
    const parentPath = "/" + pathParts.join("/");
    if (routePermissions[parentPath]) {
      return routePermissions[parentPath];
    }
    pathParts.pop();
  }

  return [];
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Allow access to public routes
  if (isPublicRoute(path)) {
    return NextResponse.next();
  }

  // Get the token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // If no token, redirect to login
  if (!token) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Skip permission check for non-dashboard routes
  if (!path.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  // Get required permissions for the route
  const requiredPermissions = getRequiredPermissions(path);

  // If route doesn't require specific permissions
  if (requiredPermissions.length === 0) {
    return NextResponse.next();
  }

  // Check user permissions
  const userPermissions = (token.permissions as string[]) || [];
  const hasRequiredPermissions = requiredPermissions.some((permission) =>
    userPermissions.includes(permission)
  );

  // If user doesn't have required permissions, redirect to unauthorized page
  if (!hasRequiredPermissions) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // Allow access if all checks pass
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    // Match all routes except static files and api routes
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
