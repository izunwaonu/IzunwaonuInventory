// import { adminPermissions, managerPermissions, userPermissions } from '@/config/permissions';
// import { db } from './db';
// import bcrypt from 'bcrypt';
// import { generateApiKey } from '@/lib/generateAPIKey';
// import { symbol } from 'zod';
// import { generateSlug } from '@/lib/generateSlug';
// // import bcrypt from "bcryptjs";

// // Get current year for password generation
// const currentYear = new Date().getFullYear();

// // Define all possible permissions
// // const allPermissions = [
// //   "dashboard.create",
// //   "dashboard.read",
// //   "dashboard.update",
// //   "dashboard.delete",

// //   "users.create",
// //   "users.read",
// //   "users.update",
// //   "users.delete",

// //   "roles.create",
// //   "roles.read",
// //   "roles.update",
// //   "roles.delete",

// //   "sales.create",
// //   "sales.read",
// //   "sales.update",
// //   "sales.delete",

// //   "customers.create",
// //   "customers.read",
// //   "customers.update",
// //   "customers.delete",

// //   "orders.create",
// //   "orders.read",
// //   "orders.update",
// //   "orders.delete",

// //   "reports.create",
// //   "reports.read",
// //   "reports.update",
// //   "reports.delete",

// //   "settings.create",
// //   "settings.read",
// //   "settings.update",
// //   "settings.delete",

// //   "categories.create",
// //   "categories.read",
// //   "categories.update",
// //   "categories.delete",

// //   "products.create",
// //   "products.read",
// //   "products.update",
// //   "products.delete",

// //   "blogs.create",
// //   "blogs.read",
// //   "blogs.update",
// //   "blogs.delete",
// // ];

// // Define user role permissions (basic access)

// async function cleanDatabase() {
//   console.log('Cleaning up existing data...');
//   try {
//     // Use a transaction to ensure data consistency
//     await db.$transaction(async (tx) => {
//       // Get all users
//       const users = await tx.user.findMany({
//         include: {
//           roles: true,
//         },
//       });
//       // Disconnect all roles from users
//       for (const user of users) {
//         if (user.roles.length > 0) {
//           await tx.user.update({
//             where: { id: user.id },
//             data: {
//               roles: {
//                 disconnect: user.roles.map((role) => ({ id: role.id })),
//               },
//             },
//           });
//         }
//       }

//       // Delete all sessions first (if you have them)
//       //Delete Transaction Data first

//       await tx.adjustmentLine.deleteMany({});
//       await tx.adjustment.deleteMany({});
//       await tx.transferLine.deleteMany({});
//       await tx.transfer.deleteMany({});
//       await tx.salesOrderLine.deleteMany({});
//       await tx.salesOrder.deleteMany({});
//       await tx.customer.deleteMany({});
//       await tx.goodsReceiptLine.deleteMany({});
//       await tx.goodsReceipt.deleteMany({});
//       await tx.purchaseOrderLine.deleteMany({});
//       await tx.purchaseOrder.deleteMany({});

//       //Delete Inventory Items
//       await tx.serialNumber.deleteMany({});
//       await tx.inventory.deleteMany({});

//       //Delete master data
//       await tx.itemSupplier.deleteMany({});
//       await tx.apiKey.deleteMany({});
//       await tx.category.deleteMany({});
//       await tx.brand.deleteMany({});
//       await tx.unit.deleteMany({});
//       await tx.supplier.deleteMany({});
//       await tx.taxRate.deleteMany({});
//       await tx.item.deleteMany({});
//       await tx.location.deleteMany({});
//       await tx.organization.deleteMany({});

//       //Delete session data
//       await tx.session.deleteMany({});
//       await tx.account.deleteMany({});

//       //Safely Delete all user
//       const deleteUsers = await tx.user.deleteMany({});
//       console.log('Deleted roles: ', deleteUsers.count);

//       //Safely Delete all roles
//       const deleteRoles = await tx.role.deleteMany({});
//       console.log('Deleted roles: ', deleteRoles.count);
//     });

//     console.log('Database cleanup completed.');
//   } catch (error) {
//     console.error('Error during cleanup:', error);
//     throw error;
//   }
// }

// async function seedDatabase() {
//   try {
//     console.log('Starting to seed new data...');

//     //Creating organization
//     console.log('Creating Organization...');
//     const org = await db.organization.create({
//       data: {
//         name: 'Default Organization',
//         slug: 'default-organization',
//         industry: 'Retail',
//         country: 'United States',
//         state: 'California',
//         address: '123, Izunwaonu St California',
//         currency: 'USD',
//         timeZone: 'America/Los_Angeles',
//         inventoryStartDate: new Date(),
//         fiscalYear: 'January-December',
//       },
//     });

//     console.log(`Created organization : ${org.name}`);

//     //Creating the Api Key

//     await db.apiKey.create({
//       data: {
//         name: 'Default Key',
//         key: generateApiKey(),
//         orgId: org.id,
//       },
//     }),
//       // Create admin role with all permissions
//       console.log('Creating admin role...');
//     const adminRole = await db.role.create({
//       data: {
//         displayName: 'Administrator',
//         roleName: 'admin',
//         description: 'Full system access',
//         permissions: adminPermissions,
//         orgId: org.id,
//       },
//     });
//     // Create Manager role with limited permissions
//     console.log('Creating Manager role...');
//     const managerRole = await db.role.create({
//       data: {
//         displayName: 'Manager',
//         roleName: 'manager',
//         description: 'Management access with limited administrative capability',
//         permissions: managerPermissions,
//         orgId: org.id,
//       },
//     });
//     // Create user role with limited permissions
//     console.log('Creating user role...');
//     const userRole = await db.role.create({
//       data: {
//         displayName: 'User',
//         roleName: 'user',
//         description: 'Basic user access',
//         permissions: userPermissions,
//         orgId: org.id,
//       },
//     });
//     console.log(
//       `Created roles: ${adminRole.displayName}, ${managerRole.displayName}, ${userRole.displayName},`,
//     );
//     //Create location
//     console.log('Creating Location...');
//     const locations = await Promise.all([
//       db.location.create({
//         data: {
//           name: 'Main Warehouse',
//           type: 'WAREHOUSE',
//           address: '123 Izunwaonu St London',
//           phone: '+2348138390681',
//           email: 'admin@izunwaonu.com.ng',
//           orgId: org.id,
//         },
//       }),
//       db.location.create({
//         data: {
//           name: 'Enugu Ezike Branch',
//           type: 'SHOP',
//           address: '123 Izunwaonu St London',
//           phone: '+2348138390681',
//           email: 'admin@izunwaonu.com.ng',
//           orgId: org.id,
//         },
//       }),
//       db.location.create({
//         data: {
//           name: 'Online Store',
//           type: 'VIRTUAL',
//           orgId: org.id,
//         },
//       }),
//     ]);

//     console.log(`Created ${locations.length} locations`);

//     // Create admin user
//     console.log('Creating users...');

//     const adminPassword = `Admin@${currentYear}`;
//     const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);
//     const managerPassword = `Manager@${currentYear}`;
//     const hashedManagerPassword = await bcrypt.hash(managerPassword, 10);
//     const userPassword = `User@${currentYear}`;
//     const hashedUserPassword = await bcrypt.hash(userPassword, 10);

//     const adminUser = await db.user.create({
//       data: {
//         email: 'admin@admin.com',
//         name: 'System Admin',
//         firstName: 'System',
//         lastName: 'Admin',
//         phone: '+2348120337154',
//         orgName: org.name,
//         isVerfied: true,
//         password: hashedAdminPassword,
//         orgId: org.id,
//         locationId: locations[0].name,
//         roles: {
//           connect: { id: adminRole.id },
//         },
//       },
//     });

//     const managerUser = await db.user.create({
//       data: {
//         email: 'manager@example.com',
//         name: 'Store Manager',
//         firstName: 'Store',
//         lastName: 'Manager',
//         phone: '+234812033715400',
//         orgName: org.name,
//         isVerfied: true,
//         password: hashedManagerPassword,
//         orgId: org.id,
//         locationId: locations[1].name,
//         locationName: locations[1].name,
//         roles: {
//           connect: { id: adminRole.id },
//         },
//       },
//     });

//     const regularUser = await db.user.create({
//       data: {
//         email: 'user@user.com',
//         name: 'Regular User',
//         firstName: 'Regular',
//         lastName: 'User',
//         phone: '+234812033715401',
//         orgName: org.name,
//         isVerfied: true,
//         password: hashedUserPassword,
//         orgId: org.id,
//         locationId: locations[2].name,
//         locationName: locations[2].name,
//         roles: {
//           connect: { id: adminRole.id },
//         },
//       },
//     });

//     // Create regular user
//     console.log('Creating regular user...');

//     console.log('Seed completed successfully!');
//     console.log('Admin credentials:', {
//       email: 'admin@admin.com',
//       password: adminPassword,
//     });
//     console.log('User credentials:', {
//       email: 'user@user.com',
//       password: userPassword,
//     });

//     //Create Brands

//     const brands = await Promise.all(
//       ['Apple', 'Samsung', 'Sonny', 'LG', 'Dell'].map((name) =>
//         db.brand.create({
//           data: {
//             name,
//             slug: name.toLowerCase().replace(/\s+/g, '-'),
//             orgId: org.id,
//           },
//         }),
//       ),
//     );
//     console.log(`Created ${brands.length}`);

//     //Create categories

//     const categories = await Promise.all(
//       [
//         {
//           title: 'Electronics',
//           slug: 'electronics',
//           description: 'Electronics devices and accessories',
//         },
//         {
//           title: 'Computers',
//           slug: 'computers',
//           description: 'Desktop and Laptop Computers',
//         },
//         {
//           title: 'Phones',
//           slug: 'phones',
//           description: 'Mobile Phones and accessories',
//         },
//         {
//           title: 'TVs',
//           slug: 'tvs',
//           description: 'Television sets',
//         },
//         {
//           title: 'Audio',
//           slug: 'audio',
//           description: 'Audio Equipment',
//         },
//       ].map((category) =>
//         db.category.create({
//           data: {
//             ...category,
//             orgId: org.id,
//             imageUrl:
//               'https://ji20b9tl3i.ufs.sh/f/pQAi6smwGNu2fU4GB5nQsFv5fgaATGhlEo9PmwOt0niVb2e4',
//           },
//         }),
//       ),
//     );
//     console.log(`Created ${categories.length} categories`);

//     //Create units

//     const units = await Promise.all(
//       [
//         { name: 'Piece', symbol: 'pc' },
//         { name: 'Kilogram', symbol: 'kg' },
//         { name: 'Meter', symbol: 'm' },
//         { name: 'Liter', symbol: 'l' },
//         { name: 'Box', symbol: 'box' },
//       ].map((unit) =>
//         db.unit.create({
//           data: {
//             ...unit,
//             orgId: org.id,
//           },
//         }),
//       ),
//     );
//     console.log(`Created ${units.length} units`);

//     //Create Tax Rates
//     const taxRates = await Promise.all(
//       [
//         { name: 'No Tax', rate: 0 },
//         { name: 'Reduced Rate', rate: 5 },
//         { name: 'Standard Rate', rate: 10 },
//         { name: 'Luxury Rate', rate: 15 },
//         { name: 'Import Tax', rate: 20 },
//       ].map((tax) =>
//         db.taxRate.create({
//           data: {
//             ...tax,
//             orgId: org.id,
//           },
//         }),
//       ),
//     );
//     console.log(`Created ${taxRates.length} tax rates`);
//     //Create supplier
//     const suppliers = await Promise.all(
//       [
//         {
//           name: 'Techno Wholesale Inc',
//           contactPerson: 'Justus Onuh',
//           email: '+2348138390681',
//           phone: 'izunwaonu2@gmail.com',
//           address: '123 Izu st London',
//           paymentTerms: 45,
//         },
//         {
//           name: 'Global Electronics',
//           contactPerson: 'Justus Onuh',
//           email: '+2348138390681',
//           phone: 'izunwaonu2@gmail.com',
//           address: '123 Izu st London',
//         },
//         {
//           name: 'Digital Supplier Co',
//           contactPerson: 'Justus Onuh',
//           email: '+2348138390681',
//           phone: 'izunwaonu2@gmail.com',
//           address: '123 Izu st London',
//           paymentTerms: 45,
//         },
//         {
//           name: 'Tech Import Limited',
//           contactPerson: 'Justus Onuh',
//           email: '+2348138390681',
//           phone: 'izunwaonu2@gmail.com',
//           address: '123 Izu st London',
//           paymentTerms: 45,
//         },
//       ].map((supplier) =>
//         db.supplier.create({
//           data: {
//             ...supplier,
//             orgId: org.id,
//           },
//         }),
//       ),
//     );
//     console.log(`Created ${suppliers.length} suppliers`);
//     //Create 10 Items
//     const items = [
//       {
//         name: 'MacBook Pro',
//         sku: 'MB-PRO-001',
//         barcode: '1234321',
//         description: 'Apple MacBook Pro with Mention Display',
//         dimensions: '30.40 x 21.45 x 1.45 cm',
//         weight: 1.4,
//         categoryId: categories.find((c) => c.title === 'Computers')?.id,
//         brandId: brands.find((b) => b.name === 'Apple')?.id,
//         unitId: units.find((u) => u.name === 'Piece')?.id,
//         taxRateId: taxRates.find((t) => t.name === 'Standard Rate')?.id,
//         tax: 10,
//         costPrice: 1200,
//         sellingPrice: 1500,
//         minStockLevel: 5,
//         maxStockLevel: 20,
//         isSerialTracked: true,
//       },
//       {
//         name: 'iPhone Pro',
//         sku: 'I-PRO-001',
//         barcode: '1234325661',
//         description: 'iPhone Pro with Retina Display',
//         dimensions: '14.7 x 7.1 x 0.7 cm',
//         weight: 0.2,
//         categoryId: categories.find((c) => c.title === 'Phones')?.id,
//         brandId: brands.find((b) => b.name === 'Apple')?.id,
//         unitId: units.find((u) => u.name === 'Piece')?.id,
//         taxRateId: taxRates.find((t) => t.name === 'Luxury Rate')?.id,
//         tax: 15,
//         costPrice: 999,
//         sellingPrice: 1299,
//         minStockLevel: 10,
//         maxStockLevel: 50,
//         isSerialTracked: true,
//       },
//       {
//         name: 'Samsung Galaxy S22',
//         sku: 'SA-GAL-001',
//         barcode: '1234334325661',
//         description: 'Samsung Galaxy S22 Ultra Smartphone',
//         dimensions: '15.9 x 7.5 x 0.8 cm',
//         weight: 0.23,
//         categoryId: categories.find((c) => c.title === 'Phones')?.id,
//         brandId: brands.find((b) => b.name === 'Samsung')?.id,
//         unitId: units.find((u) => u.name === 'Piece')?.id,
//         taxRateId: taxRates.find((t) => t.name === 'Standard Rate')?.id,
//         tax: 10,
//         costPrice: 850,
//         sellingPrice: 1100,
//         minStockLevel: 8,
//         maxStockLevel: 30,
//         isSerialTracked: true,
//       },
//       {
//         name: 'Dell Inspiration Laptop',
//         sku: 'DL-INSP-001',
//         barcode: '99887766',
//         description: 'Dell Inspiration 15 Laptop',
//         dimensions: '36.5 x 25.6 x 2.2 cm',
//         weight: 2.0,
//         categoryId: categories.find((c) => c.title === 'Computers')?.id,
//         brandId: brands.find((b) => b.name === 'Dell')?.id,
//         unitId: units.find((u) => u.name === 'Piece')?.id,
//         taxRateId: taxRates.find((t) => t.name === 'Standard Rate')?.id,
//         tax: 10,
//         costPrice: 700,
//         sellingPrice: 950,
//         minStockLevel: 4,
//         maxStockLevel: 15,
//         isSerialTracked: true,
//       },
//       {
//         name: 'LG Smart TV 55"',
//         sku: 'LG-TV-001',
//         barcode: '55443322',
//         description: 'LG 55-inch 4K Smart TV',
//         dimensions: '123.5 x 77.3 x 5.6 cm',
//         weight: 14,
//         categoryId: categories.find((c) => c.title === 'TVs')?.id,
//         brandId: brands.find((b) => b.name === 'LG')?.id,
//         unitId: units.find((u) => u.name === 'Piece')?.id,
//         taxRateId: taxRates.find((t) => t.name === 'Luxury Rate')?.id,
//         tax: 15,
//         costPrice: 600,
//         sellingPrice: 850,
//         minStockLevel: 2,
//         maxStockLevel: 10,
//         isSerialTracked: false,
//       },
//       {
//         name: 'Sonny Bluetooth Speaker',
//         sku: 'SON-SPK-001',
//         barcode: '789654123',
//         description: 'Sonny portable wireless speaker',
//         dimensions: '20 x 10 x 10 cm',
//         weight: 0.5,
//         categoryId: categories.find((c) => c.title === 'Audio')?.id,
//         brandId: brands.find((b) => b.name === 'Sonny')?.id,
//         unitId: units.find((u) => u.name === 'Piece')?.id,
//         taxRateId: taxRates.find((t) => t.name === 'Reduced Rate')?.id,
//         tax: 5,
//         costPrice: 60,
//         sellingPrice: 90,
//         minStockLevel: 10,
//         maxStockLevel: 40,
//         isSerialTracked: false,
//       },
//       {
//         name: 'Apple AirPods Pro',
//         sku: 'APP-APP-001',
//         barcode: '777888999',
//         description: 'Apple AirPods Pro with noise cancellation',
//         dimensions: '5.4 x 4.3 x 2.1 cm',
//         weight: 0.056,
//         categoryId: categories.find((c) => c.title === 'Audio')?.id,
//         brandId: brands.find((b) => b.name === 'Apple')?.id,
//         unitId: units.find((u) => u.name === 'Piece')?.id,
//         taxRateId: taxRates.find((t) => t.name === 'Luxury Rate')?.id,
//         tax: 15,
//         costPrice: 200,
//         sellingPrice: 270,
//         minStockLevel: 6,
//         maxStockLevel: 25,
//         isSerialTracked: false,
//       },
//       {
//         name: 'LG 32-inch LED TV',
//         sku: 'LG-TV-002',
//         barcode: '44332211',
//         description: 'LG 32-inch LED HD TV',
//         dimensions: '73.5 x 47.5 x 8.1 cm',
//         weight: 6.2,
//         categoryId: categories.find((c) => c.title === 'TVs')?.id,
//         brandId: brands.find((b) => b.name === 'LG')?.id,
//         unitId: units.find((u) => u.name === 'Piece')?.id,
//         taxRateId: taxRates.find((t) => t.name === 'Reduced Rate')?.id,
//         tax: 5,
//         costPrice: 150,
//         sellingPrice: 220,
//         minStockLevel: 5,
//         maxStockLevel: 18,
//         isSerialTracked: false,
//       },
//       {
//         name: 'Samsung Soundbar',
//         sku: 'SAM-SND-001',
//         barcode: '321456987',
//         description: 'Samsung 2.1 Channel Soundbar',
//         dimensions: '90 x 5 x 7 cm',
//         weight: 3.1,
//         categoryId: categories.find((c) => c.title === 'Audio')?.id,
//         brandId: brands.find((b) => b.name === 'Samsung')?.id,
//         unitId: units.find((u) => u.name === 'Box')?.id,
//         taxRateId: taxRates.find((t) => t.name === 'Standard Rate')?.id,
//         tax: 10,
//         costPrice: 180,
//         sellingPrice: 250,
//         minStockLevel: 3,
//         maxStockLevel: 12,
//         isSerialTracked: false,
//       },
//       {
//         name: 'Dell Wireless Mouse',
//         sku: 'DEL-MOU-001',
//         barcode: '963258741',
//         description: 'Dell Wireless Optical Mouse',
//         dimensions: '10 x 6 x 3.5 cm',
//         weight: 0.09,
//         categoryId: categories.find((c) => c.title === 'Computers')?.id,
//         brandId: brands.find((b) => b.name === 'Dell')?.id,
//         unitId: units.find((u) => u.name === 'Piece')?.id,
//         taxRateId: taxRates.find((t) => t.name === 'No Tax')?.id,
//         tax: 0,
//         costPrice: 10,
//         sellingPrice: 15,
//         minStockLevel: 20,
//         maxStockLevel: 100,
//         isSerialTracked: false,
//       },
//     ];
//     const createdItems = await Promise.all(
//       items.map((item) =>
//         db.item.create({
//           data: {
//             ...item,
//             slug: generateSlug(item.name),
//             orgId: org.id,
//           },
//         }),
//       ),
//     );
//     console.log(`Created ${createdItems.length} items`);
//     //LINK suppliers to items
//     console.log('Creating Item Supplier Relationship...');
//     for (const item of createdItems) {
//       //Link 1 - 2 suppliers to each item
//       const itemSuppliers = suppliers.slice(0, Math.floor(Math.random() * 2) + 1);
//       for (const supplier of itemSuppliers) {
//         await db.itemSupplier.create({
//           data: {
//             itemId: item.id,
//             supplierId: supplier.id,
//             isPreferred: itemSuppliers.indexOf(supplier) === 0,
//             supplierSku: `SKU-${item.sku}`,
//             leadTime: Math.floor(Math.random() * 10) + 3,
//             minOrderQty: Math.floor(Math.random() * 5) + 1,
//             unitCost: item.costPrice * 0.9,
//           },
//         });
//       }
//     }
//     //Create Inventory Records for each item at each Location
//     console.log('Creating inventory records');
//     const inventoryRecords = [];
//     for (const item of createdItems) {
//       for (const location of locations) {
//         //Main Warehouse has more stock than stores
//         const baseQuantity = location.type === 'WAREHOUSE' ? 50 : 10;
//         const quantity = Math.floor(Math.random() * baseQuantity) + 5; //5-55 for Warehouse
//         inventoryRecords.push(
//           db.inventory.create({
//             data: {
//               itemId: item.id,
//               locationId: location.id,
//               quantity: quantity,
//               reservedQuantity: 0,
//               orgId: org.id,
//             },
//           }),
//         );
//       }
//     }
//     await Promise.all(inventoryRecords);
//     //Create Serial Number for serialized items
//     console.log('Create Serial Number for serialized items...');
//     const serialNumberPromises = [];
//     for (const item of createdItems.filter((i) => i.isSerialTracked)) {
//       //Get Inventory records for this item

//       const itemInventory = await db.inventory.findMany({
//         where: { itemId: item.id },
//       });
//       //Create Serial number for each item in the inventory
//       for (const invRecord of itemInventory) {
//         for (let i = 0; i < invRecord.quantity; i++) {
//           const serialNumber = `${item.sku}=${invRecord.locationId.substring(
//             0,
//             4,
//           )}=${serialNumberPromises.push(
//             db.serialNumber.create({
//               data: {
//                 serialNumber,
//                 itemId: item.id,
//                 status: 'IN_STOCK',
//                 locationId: invRecord.locationId,
//                 notes: `Initial inventory setup for ${item.name}`,
//               },
//             }),
//           )}`;
//         }
//       }
//     }
//   } catch (error) {
//     console.error('Error during seeding:', error);
//     throw error;
//   }
// }
// async function main() {
//   console.log('Starting database seed process...');

//   try {
//     // First clean up existing data
//     await cleanDatabase();

//     // Then seed new data
//     await seedDatabase();

//     console.log('Database seeding completed successfully!');
//   } catch (error) {
//     console.error('Error in main seed process:', error);
//     throw error;
//   }
// }

// main()
//   .catch((e) => {
//     console.error('Failed to seed database:', e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await db.$disconnect();
//   });
