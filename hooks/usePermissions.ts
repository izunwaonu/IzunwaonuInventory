"use client";

import { useSession } from "next-auth/react";

export function usePermission() {
  const { data: session } = useSession();

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
