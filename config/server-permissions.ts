// utils/server-permissions.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth";

export async function getServerPermissions() {
  const session = await getServerSession(authOptions);

  const hasPermission = (permission: string): boolean => {
    if (!session?.user?.permissions) return false;
    return session.user.permissions.includes(permission);
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!session?.user?.permissions) return false;
    return permissions.some((permission) =>
      session.user.permissions.includes(permission)
    );
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!session?.user?.permissions) return false;
    return permissions.every((permission) =>
      session.user.permissions.includes(permission)
    );
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
}

// Optional: Create a wrapper component for conditional rendering in Server Components
interface PermissionGateProps {
  permission: string;
  children: React.ReactNode;
}

export async function PermissionGate({
  permission,
  children,
}: PermissionGateProps) {
  const { hasPermission } = await getServerPermissions();

  if (!hasPermission(permission)) {
    return null;
  }

  return children;
}
