"use server";

import { revalidatePath } from "next/cache";
import { RoleFormData } from "@/types/types";
import { getAllPermissions, isValidPermission } from "@/config/permissions";
import { db } from "@/prisma/db";
import { createRoleName } from "@/lib/createRoleName";
import { UpdateUserRoleResponse } from "@/types/types";

export async function updateUserRole(
  userId: string,
  roleId: string
): Promise<UpdateUserRoleResponse> {
  try {
    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id: userId },
      include: { roles: true },
    });

    if (!existingUser) {
      return {
        error: "User not found",
        status: 404,
        data: null,
      };
    }

    // Check if role exists
    const role = await db.role.findUnique({
      where: { id: roleId },
    });

    if (!role) {
      return {
        error: "Role not found",
        status: 404,
        data: null,
      };
    }

    // Update user's roles
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        roles: {
          set: [], // First clear existing roles
          connect: { id: roleId }, // Then connect new role
        },
      },
      include: {
        roles: true,
      },
    });

    // Revalidate relevant paths
    revalidatePath("/dashboard/users");
    revalidatePath(`/dashboard/users/${userId}`);

    return {
      error: null,
      status: 200,
      data: updatedUser,
    };
  } catch (error) {
    console.error("Error updating user role:", error);
    return {
      error: "Failed to update user role",
      status: 500,
      data: null,
    };
  }
}
export async function createRole(data: RoleFormData) {
  try {
    // Validate permissions
    const validPermissions = getAllPermissions();
    const invalidPermissions = data.permissions.filter(
      (permission) => !validPermissions.includes(permission)
    );

    if (invalidPermissions.length > 0) {
      throw new Error(
        `Invalid permissions detected: ${invalidPermissions.join(", ")}`
      );
    }

    // Check if role with same name exists
    const existingRole = await db.role.findFirst({
      where: {
        displayName: data.displayName,
      },
    });

    if (existingRole) {
      throw new Error("A role with this name already exists");
    }

    // Create role with permissions
    const role = await db.role.create({
      data: {
        displayName: data.displayName,
        roleName: createRoleName(data.displayName),
        description: data.description,
        permissions: data.permissions,
      },
    });

    revalidatePath("/dashboard/users/roles");
    return { success: true, data: role };
  } catch (error) {
    console.error("Error creating role:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create role",
    };
  }
}

export async function updateRole(id: string, data: Partial<RoleFormData>) {
  try {
    // Validate permissions if they're being updated
    if (data.permissions) {
      const validPermissions = getAllPermissions();
      const invalidPermissions = data.permissions.filter(
        (permission) => !validPermissions.includes(permission)
      );

      if (invalidPermissions.length > 0) {
        throw new Error(
          `Invalid permissions detected: ${invalidPermissions.join(", ")}`
        );
      }
    }

    // Check if new name conflicts with existing role
    if (data.displayName) {
      const existingRole = await db.role.findFirst({
        where: {
          displayName: data.displayName,
          NOT: {
            id: id,
          },
        },
      });

      if (existingRole) {
        throw new Error("A role with this name already exists");
      }
    }

    // Update role
    const role = await db.role.update({
      where: { id },
      data: {
        ...(data.displayName && {
          displayName: data.displayName,
          roleName: createRoleName(data.displayName),
        }),
        ...(data.description && { description: data.description }),
        ...(data.permissions && { permissions: data.permissions }),
      },
    });

    revalidatePath("/dashboard/users/roles");
    return { success: true, data: role };
  } catch (error) {
    console.error("Error updating role:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update role",
    };
  }
}

export async function deleteRole(id: string) {
  try {
    // Check if role is assigned to any users
    const usersWithRole = await db.user.findMany({
      where: {
        roles: {
          some: {
            id: id,
          },
        },
      },
      select: {
        id: true,
      },
    });

    if (usersWithRole.length > 0) {
      throw new Error("Cannot delete role as it is assigned to users");
    }

    // Delete role
    await db.role.delete({
      where: { id },
    });
    revalidatePath("/dashboard/users/roles");
    return { success: true };
  } catch (error) {
    console.error("Error deleting role:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete role",
    };
  }
}

export async function getRoles() {
  try {
    const roles = await db.role.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return { success: true, data: roles };
  } catch (error) {
    console.error("Error fetching roles:", error);
    return {
      success: false,
      error: "Failed to fetch roles",
    };
  }
}

export async function getRoleById(id: string) {
  try {
    const role = await db.role.findUnique({
      where: { id },
    });

    if (!role) {
      throw new Error("Role not found");
    }

    return { success: true, data: role };
  } catch (error) {
    console.error("Error fetching role:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch role",
    };
  }
}

// Helper function to get users by role
export async function getUsersByRole(roleId: string) {
  try {
    const users = await db.user.findMany({
      where: {
        roles: {
          some: {
            id: roleId,
          },
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return { success: true, data: users };
  } catch (error) {
    console.error("Error fetching users by role:", error);
    return {
      success: false,
      error: "Failed to fetch users",
    };
  }
}
