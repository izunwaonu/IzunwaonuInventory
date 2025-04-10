import { adminPermissions, userPermissions } from "@/config/permissions";
import { db } from "./db";
import bcrypt from "bcrypt";
// import bcrypt from "bcryptjs";

// Get current year for password generation
const currentYear = new Date().getFullYear();

// Define all possible permissions
// const allPermissions = [
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

// Define user role permissions (basic access)

async function cleanDatabase() {
  console.log("Cleaning up existing data...");
  try {
    // Use a transaction to ensure data consistency
    await db.$transaction(async (tx) => {
      // Get all users
      const users = await tx.user.findMany({
        include: {
          roles: true,
        },
      });
      // Disconnect all roles from users
      for (const user of users) {
        if (user.roles.length > 0) {
          await tx.user.update({
            where: { id: user.id },
            data: {
              roles: {
                disconnect: user.roles.map((role) => ({ id: role.id })),
              },
            },
          });
        }
      }

      // Delete all sessions first (if you have them)
      await tx.session.deleteMany({});
      // Delete all sessions first (if you have them)
      await tx.organization.deleteMany({});

      // Delete all accounts (if you have them)
      await tx.account.deleteMany({});

      // Delete all Blogs and Blog cats (if you have them)
      await tx.blog.deleteMany({});
      await tx.blogCategory.deleteMany({});

      // Delete all Savings and Categories  (if you have them)
      await tx.saving.deleteMany({});
      await tx.category.deleteMany({});

      // Now safely delete all users
      const deleteUsers = await tx.user.deleteMany({});
      console.log("Deleted users:", deleteUsers.count);

      // Finally delete all roles
      const deleteRoles = await tx.role.deleteMany({});
      console.log("Deleted roles:", deleteRoles.count);
    });

    console.log("Database cleanup completed.");
  } catch (error) {
    console.error("Error during cleanup:", error);
    throw error;
  }
}

async function seedDatabase() {
  try {
    console.log("Starting to seed new data...");

    //Creating organization
    console.log("Creating Organization...");
    const org = await db.organization.create({
      data:{
        name: "Default Organization",
        slug: "default-organization",
      }
    })
    

    // Create admin role with all permissions
    console.log("Creating admin role...");
    const adminRole = await db.role.create({
      data: {
        displayName: "Administrator",
        roleName: "admin",
        description: "Full system access",
        permissions: adminPermissions,
        orgId:org.id
      },
    });

    // Create user role with limited permissions
    console.log("Creating user role...");
    const userRole = await db.role.create({
      data: {
        displayName: "User",
        roleName: "user",
        description: "Basic user access",
        permissions: userPermissions,
        orgId:org.id
      },
    });

    // Create admin user
    console.log("Creating admin user...");
    const adminPassword = `Admin@${currentYear}`;
    const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);

    const adminUser = await db.user.create({
      data: {
        email: "admin@admin.com",
        name: "System Admin",
        firstName: "System",
        lastName: "Admin",
        phone: "+2348120337154",
        orgName: org.name,
        password: hashedAdminPassword,
        orgId: org.id,
        roles: {
          connect: { id: adminRole.id },
        },
      },
    });

    // Create regular user
    console.log("Creating regular user...");
    const userPassword = `User@${currentYear}`;
    const hashedUserPassword = await bcrypt.hash(userPassword, 10);

    const regularUser = await db.user.create({
      data: {
        email: "user@user.com",
        name: "Regular User",
        firstName: "Regular",
        lastName: "User",
        phone: "+2348138390681",
        orgName: org.name,
        password: hashedUserPassword,
        orgId: org.id,
        roles: {
          connect: { id: userRole.id },
        },
      },
    });

    console.log("Seed completed successfully!");
    console.log("Admin credentials:", {
      email: "admin@admin.com",
      password: adminPassword,
    });
    console.log("User credentials:", {
      email: "user@user.com",
      password: userPassword,
    });
  } catch (error) {
    console.error("Error during seeding:", error);
    throw error;
  }
}
async function main() {
  console.log("Starting database seed process...");

  try {
    // First clean up existing data
    await cleanDatabase();

    // Then seed new data
    await seedDatabase();

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error in main seed process:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error("Failed to seed database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
