import { checkPermission } from "@/config/useAuth";
import React, { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  // This will automatically redirect if not authorized
  await checkPermission("roles.read");

  // Get the authenticated user
  // const user = await getAuthenticatedUser();
  return <div>{children}</div>;
}
