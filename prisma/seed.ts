import crypto from 'crypto';

const adminPermissions = [
  // Dashboard
  'dashboard.create',
  'dashboard.read',
  'dashboard.update',
  'dashboard.delete',

  //User Management
  'users.create',
  'users.read',
  'users.update',
  'users.delete',
  'roles.create',
  'roles.read',
  'roles.update',
  'roles.delete',

  // Inventory and related
  'inventory.create',
  'inventory.read',
  'inventory.update',
  'inventory.delete',

  'items.create',
  'items.read',
  'items.update',
  'items.delete',

  'categories.create',
  'categories.read',
  'categories.update',
  'categories.delete',

  'brands.create',
  'brands.read',
  'brands.update',
  'brands.delete',

  'units.create',
  'units.read',
  'units.update',
  'units.delete',

  'tax.create',
  'tax.read',
  'tax.update',
  'tax.delete',

  'stock.create',
  'stock.read',
  'stock.update',
  'stock.delete',

  'serial.numbers.create',
  'serial.numbers.read',
  'serial.numbers.update',
  'serial.numbers.delete',

  // "serialNumbers.create", "serialNumbers.read", "serialNumbers.update", "serialNumbers.delete",
  'transfers.create',
  'transfers.read',
  'transfers.update',
  'transfers.delete',

  'adjustments.create',
  'adjustments.read',
  'adjustments.update',
  'adjustments.delete',

  // Purchases and related
  'purchase.orders.create',
  'purchase.orders.read',
  'purchase.orders.update',
  'purchase.orders.delete',

  'goods.receipts.create',
  'goods.receipts.read',
  'goods.receipts.update',
  'goods.receipts.delete',

  'suppliers.create',
  'suppliers.read',
  'suppliers.update',
  'suppliers.delete',

  // "purchaseOrders.create", "purchaseOrders.read", "purchaseOrders.update", "purchaseOrders.delete",
  // "goodsReceipt.create", "goodsReceipt.read", "goodsReceipt.update", "goodsReceipt.delete",
  // "suppliers.create", "suppliers.read", "suppliers.update", "suppliers.delete",

  // Sales and related
  'sales.create',
  'sales.read',
  'sales.update',
  'sales.delete',

  'sales.orders.create',
  'sales.orders.read',
  'sales.orders.update',
  'sales.orders.delete',

  'pos.create',
  'pos.read',
  'pos.update',
  'pos.delete',

  // "posSales.create", "posSales.read", "posSales.update", "posSales.delete",
  // "salesOrders.create", "salesOrders.read", "salesOrders.update", "salesOrders.delete",
  'returns.create',
  'returns.read',
  'returns.update',
  'returns.delete',

  'customers.create',
  'customers.read',
  'customers.update',
  'customers.delete',

  // Reports
  'reports.create',
  'reports.read',
  'reports.update',
  'reports.delete',

  'reports.inventory.create',
  'reports.inventory.read',
  'reports.inventory.update',
  'reports.inventory.delete',

  'reports.purchases.create',
  'reports.purchases.read',
  'reports.purchases.update',
  'reports.purchases.delete',

  'reports.sales.create',
  'reports.sales.read',
  'reports.sales.update',
  'reports.sales.delete',

  'reports.products.create',
  'reports.products.read',
  'reports.products.update',
  'reports.products.delete',

  // Integrations and related
  'integrations.create',
  'integrations.read',
  'integrations.update',
  'integrations.delete',

  'integrations.pos.create',
  'integrations.pos.read',
  'integrations.pos.update',
  'integrations.pos.delete',

  'integrations.accounting.create',
  'integrations.accounting.read',
  'integrations.accounting.update',
  'integrations.accounting.delete',

  'integrations.api.create',
  'integrations.api.read',
  'integrations.api.update',
  'integrations.api.delete',

  // "posIntegration.create", "posIntegration.read", "posIntegration.update", "posIntegration.delete",
  // "accountingIntegration.create", "accountingIntegration.read", "accountingIntegration.update", "accountingIntegration.delete",
  // "apiKeys.create", "apiKeys.read", "apiKeys.update", "apiKeys.delete",

  // Settings and related
  'settings.create',
  'settings.read',
  'settings.update',
  'settings.delete',
  'settings.access',

  'locations.create',
  'locations.read',
  'locations.update',
  'locations.delete',

  'company.settings.create',
  'company.settings.read',
  'company.settings.update',
  'company.settings.delete',

  'profile.create',
  'profile.read',
  'profile.update',
  'profile.delete',

  'password.create',
  'password.read',
  'password.update',
  'password.delete',

  // "users.create", "users.read", "users.update", "users.delete",
  // "roles.create", "roles.read", "roles.update", "roles.delete",
  // "tax.settings.create", "tax.settings.read", "tax.settings.update", "tax.settings.delete",
  // // "taxes.create", "taxes.read", "taxes.update", "taxes.delete",
  // "company.create", "company.read", "company.update", "company.delete",
  // "profile.create", "profile.read", "profile.update", "profile.delete",

  //Legacy permissions kept for backward compatibility

  'orders.create',
  'orders.read',
  'orders.update',
  'orders.delete',
];

const userPermissions = [
  'dashboard.read',
  'profile.read',
  'profile.update',
  'password.change',

  //Inventory view access

  'items.read',
  'categories.read',
  'brands.read',
  'tax.read',
  'stock.read',
  'units.read',

  //Basic Sales capability

  'sales.orders.read',
  'sales.orders.create',
  'pos.access',
  'customers.read',

  // Legacy permissions for backward compatibility

  'product.read',
  'orders.read',
  'orders.create',

  // "salesOrders.read",
  // "salesOrders.create",
  // "customers.read",
  // "tax.settings.read",
];
const managerPermissions = [
  //All user permission
  ...userPermissions,
  'items.create',
  'items.update',
  'categories.read',
  'brands.read',
  'transfer.create',
  'transfer.read',
  'transfer.update',
  'purchase.orders.create',
  'purchase.orders.read',
  'purchase.orders.update',
  'goods.receipts.create',
  'goods.receipts.read',
  'suppliers.read',
  'sales.read',
  'sales.update',
  'sales.orders.update',
  'customers.create',
  'customers.update',
  'reports.read',
  'adjustments.create',
  'adjustments.read',
];

const generateApiKey = (): string => {
  const rand = crypto.randomBytes(32).toString('hex');
  return `sk_live_${rand}`;
};

function generateSlug(title: string): string {
  // Convert title to lowercase and replace spaces with dashes
  const slug = title.toLowerCase().replace(/\s+/g, '-');

  // Remove special characters except for dashes
  const cleanedSlug = slug.replace(/[^\w\-]/g, '');

  return cleanedSlug;
}

import { db } from './db';
import bcrypt from 'bcrypt';

// Get current year for password generation
const currentYear = new Date().getFullYear();

async function cleanDatabase() {
  console.log('Cleaning up existing data...');
  try {
    // Use a transaction with increased timeout and break it into smaller chunks
    await db.$transaction(
      async (tx) => {
        // Get all users and disconnect roles first
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
      },
      {
        timeout: 30000, // 30 seconds timeout
      },
    );

    // Delete transaction data in separate transactions to avoid timeout
    console.log('Deleting transaction data...');
    await db.$transaction(
      async (tx) => {
        await tx.adjustmentLine.deleteMany({});
        await tx.adjustment.deleteMany({});
        await tx.transferLine.deleteMany({});
        await tx.transfer.deleteMany({});
      },
      {
        timeout: 20000,
      },
    );

    await db.$transaction(
      async (tx) => {
        await tx.salesOrderLine.deleteMany({});
        await tx.salesOrder.deleteMany({});
        await tx.customer.deleteMany({});
      },
      {
        timeout: 20000,
      },
    );

    await db.$transaction(
      async (tx) => {
        await tx.goodsReceiptLine.deleteMany({});
        await tx.goodsReceipt.deleteMany({});
        await tx.purchaseOrderLine.deleteMany({});
        await tx.purchaseOrder.deleteMany({});
      },
      {
        timeout: 20000,
      },
    );

    // Delete inventory data
    console.log('Deleting inventory data...');
    await db.$transaction(
      async (tx) => {
        await tx.serialNumber.deleteMany({});
        await tx.inventory.deleteMany({});
      },
      {
        timeout: 20000,
      },
    );

    // Delete master data
    console.log('Deleting master data...');
    await db.$transaction(
      async (tx) => {
        await tx.itemSupplier.deleteMany({});
        await tx.item.deleteMany({});
        await tx.supplier.deleteMany({});
        await tx.taxRate.deleteMany({});
        await tx.unit.deleteMany({});
        await tx.brand.deleteMany({});
        await tx.category.deleteMany({});
      },
      {
        timeout: 20000,
      },
    );

    // Delete remaining data
    console.log('Deleting remaining data...');
    await db.$transaction(
      async (tx) => {
        await tx.location.deleteMany({});
        await tx.apiKey.deleteMany({});
        await tx.session.deleteMany({});
        await tx.account.deleteMany({});

        // Delete users and roles
        const deleteUsers = await tx.user.deleteMany({});
        console.log('Deleted users: ', deleteUsers.count);

        const deleteRoles = await tx.role.deleteMany({});
        console.log('Deleted roles: ', deleteRoles.count);

        // Delete organization last
        await tx.organization.deleteMany({});
      },
      {
        timeout: 20000,
      },
    );

    console.log('Database cleanup completed.');
  } catch (error) {
    console.error('Error during cleanup:', error);
    throw error;
  }
}

async function seedDatabase() {
  try {
    console.log('Starting to seed new data...');

    // Creating organization
    console.log('Creating Organization...');
    const org = await db.organization.create({
      data: {
        name: 'Default Organization',
        slug: 'default-organization',
        industry: 'Retail',
        country: 'United States',
        state: 'California',
        address: '123, Izunwaonu St California',
        currency: 'USD',
        timeZone: 'America/Los_Angeles',
        inventoryStartDate: new Date(),
        fiscalYear: 'January-December',
      },
    });

    console.log(`Created organization: ${org.name}`);

    // Creating the Api Key
    await db.apiKey.create({
      data: {
        name: 'Default Key',
        key: generateApiKey(),
        orgId: org.id,
      },
    });

    // Create roles
    console.log('Creating roles...');
    const adminRole = await db.role.create({
      data: {
        displayName: 'Administrator',
        roleName: 'admin',
        description: 'Full system access',
        permissions: adminPermissions,
        orgId: org.id,
      },
    });

    const managerRole = await db.role.create({
      data: {
        displayName: 'Manager',
        roleName: 'manager',
        description: 'Management access with limited administrative capability',
        permissions: managerPermissions,
        orgId: org.id,
      },
    });

    const userRole = await db.role.create({
      data: {
        displayName: 'User',
        roleName: 'user',
        description: 'Basic user access',
        permissions: userPermissions,
        orgId: org.id,
      },
    });

    console.log(
      `Created roles: ${adminRole.displayName}, ${managerRole.displayName}, ${userRole.displayName}`,
    );

    // Create locations
    console.log('Creating locations...');
    const locations = await Promise.all([
      db.location.create({
        data: {
          name: 'Main Warehouse',
          type: 'WAREHOUSE',
          address: '123 Izunwaonu St London',
          phone: '+2348138390681',
          email: 'admin@izunwaonu.com.ng',
          orgId: org.id,
        },
      }),
      db.location.create({
        data: {
          name: 'Enugu Ezike Branch',
          type: 'SHOP',
          address: '123 Izunwaonu St London',
          phone: '+2348138390681',
          email: 'admin@izunwaonu.com.ng',
          orgId: org.id,
        },
      }),
      db.location.create({
        data: {
          name: 'Online Store',
          type: 'VIRTUAL',
          orgId: org.id,
        },
      }),
    ]);

    console.log(`Created ${locations.length} locations`);

    // Create users
    console.log('Creating users...');
    const adminPassword = `Admin@${currentYear}`;
    const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);
    const managerPassword = `Manager@${currentYear}`;
    const hashedManagerPassword = await bcrypt.hash(managerPassword, 10);
    const userPassword = `User@${currentYear}`;
    const hashedUserPassword = await bcrypt.hash(userPassword, 10);

    const adminUser = await db.user.create({
      data: {
        email: 'admin@admin.com',
        name: 'System Admin',
        firstName: 'System',
        lastName: 'Admin',
        phone: '+2348120337154',
        orgName: org.name,
        isVerfied: true,
        password: hashedAdminPassword,
        orgId: org.id,
        locationId: locations[0].id,
        locationName: locations[0].name,
        roles: {
          connect: { id: adminRole.id },
        },
      },
    });

    const managerUser = await db.user.create({
      data: {
        email: 'manager@example.com',
        name: 'Store Manager',
        firstName: 'Store',
        lastName: 'Manager',
        phone: '+234812033715400',
        orgName: org.name,
        isVerfied: true,
        password: hashedManagerPassword,
        orgId: org.id,
        locationId: locations[1].id,
        locationName: locations[1].name,
        roles: {
          connect: { id: managerRole.id },
        },
      },
    });

    const regularUser = await db.user.create({
      data: {
        email: 'user@user.com',
        name: 'Regular User',
        firstName: 'Regular',
        lastName: 'User',
        phone: '+234812033715401',
        orgName: org.name,
        isVerfied: true,
        password: hashedUserPassword,
        orgId: org.id,
        locationId: locations[2].id,
        locationName: locations[2].name,
        roles: {
          connect: { id: userRole.id },
        },
      },
    });

    console.log('Created users successfully!');
    console.log('Login credentials:');
    console.log(`Admin: admin@admin.com / ${adminPassword}`);
    console.log(`Manager: manager@example.com / ${managerPassword}`);
    console.log(`User: user@user.com / ${userPassword}`);

    // Create master data in batches to avoid timeout
    console.log('Creating master data...');

    // Create Brands
    const brands = await Promise.all(
      ['Apple', 'Samsung', 'Sony', 'LG', 'Dell'].map((name) =>
        db.brand.create({
          data: {
            name,
            slug: name.toLowerCase().replace(/\s+/g, '-'),
            orgId: org.id,
          },
        }),
      ),
    );
    console.log(`Created ${brands.length} brands`);

    // Create categories
    const categories = await Promise.all(
      [
        {
          title: 'Electronics',
          slug: 'electronics',
          description: 'Electronics devices and accessories',
        },
        {
          title: 'Computers',
          slug: 'computers',
          description: 'Desktop and Laptop Computers',
        },
        {
          title: 'Phones',
          slug: 'phones',
          description: 'Mobile Phones and accessories',
        },
        {
          title: 'TVs',
          slug: 'tvs',
          description: 'Television sets',
        },
        {
          title: 'Audio',
          slug: 'audio',
          description: 'Audio Equipment',
        },
      ].map((category) =>
        db.category.create({
          data: {
            ...category,
            orgId: org.id,
            imageUrl:
              'https://ji20b9tl3i.ufs.sh/f/pQAi6smwGNu2fU4GB5nQsFv5fgaATGhlEo9PmwOt0niVb2e4',
          },
        }),
      ),
    );
    console.log(`Created ${categories.length} categories`);

    // Create units
    const units = await Promise.all(
      [
        { name: 'Piece', symbol: 'pc' },
        { name: 'Kilogram', symbol: 'kg' },
        { name: 'Meter', symbol: 'm' },
        { name: 'Liter', symbol: 'l' },
        { name: 'Box', symbol: 'box' },
      ].map((unit) =>
        db.unit.create({
          data: {
            ...unit,
            orgId: org.id,
          },
        }),
      ),
    );
    console.log(`Created ${units.length} units`);

    // Create Tax Rates
    const taxRates = await Promise.all(
      [
        { name: 'No Tax', rate: 0 },
        { name: 'Reduced Rate', rate: 5 },
        { name: 'Standard Rate', rate: 10 },
        { name: 'Luxury Rate', rate: 15 },
        { name: 'Import Tax', rate: 20 },
      ].map((tax) =>
        db.taxRate.create({
          data: {
            ...tax,
            orgId: org.id,
          },
        }),
      ),
    );
    console.log(`Created ${taxRates.length} tax rates`);

    // Create suppliers
    const suppliers = await Promise.all(
      [
        {
          name: 'Techno Wholesale Inc',
          contactPerson: 'Justus Onuh',
          email: 'izunwaonu2@gmail.com',
          phone: '+2348138390681',
          address: '123 Izu st London',
          paymentTerms: 45,
        },
        {
          name: 'Global Electronics',
          contactPerson: 'Justus Onuh',
          email: 'izunwaonu2@gmail.com',
          phone: '+2348138390681',
          address: '123 Izu st London',
          paymentTerms: 30,
        },
        {
          name: 'Digital Supplier Co',
          contactPerson: 'Justus Onuh',
          email: 'izunwaonu2@gmail.com',
          phone: '+2348138390681',
          address: '123 Izu st London',
          paymentTerms: 45,
        },
      ].map((supplier) =>
        db.supplier.create({
          data: {
            ...supplier,
            orgId: org.id,
          },
        }),
      ),
    );
    console.log(`Created ${suppliers.length} suppliers`);

    // Create items
    console.log('Creating items...');
    const items = [
      {
        name: 'MacBook Pro',
        sku: 'MB-PRO-001',
        barcode: '1234321',
        description: 'Apple MacBook Pro with Retina Display',
        dimensions: '30.40 x 21.45 x 1.45 cm',
        weight: 1.4,
        categoryId: categories.find((c) => c.title === 'Computers')?.id,
        brandId: brands.find((b) => b.name === 'Apple')?.id,
        unitId: units.find((u) => u.name === 'Piece')?.id,
        taxRateId: taxRates.find((t) => t.name === 'Standard Rate')?.id,
        tax: 10,
        costPrice: 1200,
        sellingPrice: 1500,
        minStockLevel: 5,
        maxStockLevel: 20,
        isSerialTracked: true,
      },
      {
        name: 'iPhone Pro',
        sku: 'I-PRO-001',
        barcode: '1234325661',
        description: 'iPhone Pro with Retina Display',
        dimensions: '14.7 x 7.1 x 0.7 cm',
        weight: 0.2,
        categoryId: categories.find((c) => c.title === 'Phones')?.id,
        brandId: brands.find((b) => b.name === 'Apple')?.id,
        unitId: units.find((u) => u.name === 'Piece')?.id,
        taxRateId: taxRates.find((t) => t.name === 'Luxury Rate')?.id,
        tax: 15,
        costPrice: 999,
        sellingPrice: 1299,
        minStockLevel: 10,
        maxStockLevel: 50,
        isSerialTracked: true,
      },
      {
        name: 'Samsung Galaxy S22',
        sku: 'SA-GAL-001',
        barcode: '1234334325661',
        description: 'Samsung Galaxy S22 Ultra Smartphone',
        dimensions: '15.9 x 7.5 x 0.8 cm',
        weight: 0.23,
        categoryId: categories.find((c) => c.title === 'Phones')?.id,
        brandId: brands.find((b) => b.name === 'Samsung')?.id,
        unitId: units.find((u) => u.name === 'Piece')?.id,
        taxRateId: taxRates.find((t) => t.name === 'Standard Rate')?.id,
        tax: 10,
        costPrice: 850,
        sellingPrice: 1100,
        minStockLevel: 8,
        maxStockLevel: 30,
        isSerialTracked: true,
      },
      {
        name: 'Dell Inspiron Laptop',
        sku: 'DL-INSP-001',
        barcode: '99887766',
        description: 'Dell Inspiron 15 Laptop',
        dimensions: '36.5 x 25.6 x 2.2 cm',
        weight: 2.0,
        categoryId: categories.find((c) => c.title === 'Computers')?.id,
        brandId: brands.find((b) => b.name === 'Dell')?.id,
        unitId: units.find((u) => u.name === 'Piece')?.id,
        taxRateId: taxRates.find((t) => t.name === 'Standard Rate')?.id,
        tax: 10,
        costPrice: 700,
        sellingPrice: 950,
        minStockLevel: 4,
        maxStockLevel: 15,
        isSerialTracked: true,
      },
      {
        name: 'LG Smart TV 55"',
        sku: 'LG-TV-001',
        barcode: '55443322',
        description: 'LG 55-inch 4K Smart TV',
        dimensions: '123.5 x 77.3 x 5.6 cm',
        weight: 14,
        categoryId: categories.find((c) => c.title === 'TVs')?.id,
        brandId: brands.find((b) => b.name === 'LG')?.id,
        unitId: units.find((u) => u.name === 'Piece')?.id,
        taxRateId: taxRates.find((t) => t.name === 'Luxury Rate')?.id,
        tax: 15,
        costPrice: 600,
        sellingPrice: 850,
        minStockLevel: 2,
        maxStockLevel: 10,
        isSerialTracked: false,
      },
      {
        name: 'Sony Bluetooth Speaker',
        sku: 'SON-SPK-001',
        barcode: '789654123',
        description: 'Sony portable wireless speaker',
        dimensions: '20 x 10 x 10 cm',
        weight: 0.5,
        categoryId: categories.find((c) => c.title === 'Audio')?.id,
        brandId: brands.find((b) => b.name === 'Sony')?.id,
        unitId: units.find((u) => u.name === 'Piece')?.id,
        taxRateId: taxRates.find((t) => t.name === 'Reduced Rate')?.id,
        tax: 5,
        costPrice: 60,
        sellingPrice: 90,
        minStockLevel: 10,
        maxStockLevel: 40,
        isSerialTracked: false,
      },
    ];

    const createdItems = await Promise.all(
      items.map((item) =>
        db.item.create({
          data: {
            ...item,
            slug: generateSlug(item.name),
            orgId: org.id,
          },
        }),
      ),
    );
    console.log(`Created ${createdItems.length} items`);

    // Link suppliers to items
    console.log('Creating Item Supplier Relationships...');
    for (const item of createdItems) {
      const numSuppliers = Math.floor(Math.random() * 2) + 1;
      const itemSuppliers = suppliers.slice(0, numSuppliers);
      for (let i = 0; i < itemSuppliers.length; i++) {
        const supplier = itemSuppliers[i];
        await db.itemSupplier.create({
          data: {
            itemId: item.id,
            supplierId: supplier.id,
            isPreferred: i === 0,
            supplierSku: `SUP-${item.sku}`,
            leadTime: Math.floor(Math.random() * 10) + 3,
            minOrderQty: Math.floor(Math.random() * 5) + 1,
            unitCost: item.costPrice * 0.9,
          },
        });
      }
    }

    // Create Inventory Records
    console.log('Creating inventory records...');
    const inventoryPromises = [];
    for (const item of createdItems) {
      for (const location of locations) {
        const baseQuantity = location.type === 'WAREHOUSE' ? 50 : 10;
        const quantity = Math.floor(Math.random() * baseQuantity) + 5;
        inventoryPromises.push(
          db.inventory.create({
            data: {
              itemId: item.id,
              locationId: location.id,
              quantity: quantity,
              reservedQuantity: 0,
              orgId: org.id,
            },
          }),
        );
      }
    }
    await Promise.all(inventoryPromises);

    // Create Serial Numbers for tracked items
    console.log('Creating Serial Numbers...');
    const serialTrackedItems = createdItems.filter((i) => i.isSerialTracked);

    for (const item of serialTrackedItems) {
      const itemInventory = await db.inventory.findMany({
        where: { itemId: item.id },
      });

      for (const invRecord of itemInventory) {
        const serialPromises = [];
        // Limit serial numbers to avoid timeout
        const maxSerials = Math.min(invRecord.quantity, 10); // Limit to 10 per location
        for (let i = 0; i < maxSerials; i++) {
          const serialNumber = `${item.sku}-${invRecord.locationId.substring(
            0,
            4,
          )}-${Date.now()}-${String(i + 1).padStart(3, '0')}`;
          serialPromises.push(
            db.serialNumber.create({
              data: {
                serialNumber,
                itemId: item.id,
                status: 'IN_STOCK',
                locationId: invRecord.locationId,
                notes: `Initial inventory setup for ${item.name}`,
              },
            }),
          );
        }
        await Promise.all(serialPromises);
      }
    }

    // Create Customers
    console.log('Creating customers...');
    const customers = await Promise.all(
      [
        {
          name: 'Acme Corporation',
          email: 'orders@acme.com',
          phone: '+1234567890',
          address: '123 Business St, City, State',
          taxId: 'TAX123456',
          notes: 'Large corporate client',
        },
        {
          name: 'Tech Solutions Ltd',
          email: 'purchasing@techsolutions.com',
          phone: '+1234567891',
          address: '456 Tech Ave, City, State',
          notes: 'Regular customer for IT equipment',
        },
        {
          name: 'John Doe',
          email: 'john.doe@email.com',
          phone: '+1234567892',
          address: '789 Home St, City, State',
          notes: 'Individual customer',
        },
      ].map((customer) =>
        db.customer.create({
          data: { ...customer, orgId: org.id },
        }),
      ),
    );
    console.log(`Created ${customers.length} customers`);

    console.log('✅ Seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Organization: ${org.name}`);
    console.log(`- Locations: ${locations.length}`);
    console.log(`- Users: 3 (Admin, Manager, User)`);
    console.log(`- Brands: ${brands.length}`);
    console.log(`- Categories: ${categories.length}`);
    console.log(`- Items: ${createdItems.length}`);
    console.log(`- Customers: ${customers.length}`);
    console.log(`- Inventory records created for all items`);
    console.log(`- Serial numbers created for tracked items`);
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  }
}

async function main() {
  console.log('Starting database seed process...');

  try {
    await cleanDatabase();
    await seedDatabase();
    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error in main seed process:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('Failed to seed database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
