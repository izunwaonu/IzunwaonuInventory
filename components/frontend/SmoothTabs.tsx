"use client";
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Package,
  Truck,
  ShoppingCart,
  BarChart2,
  CreditCard,
  FileText,
  Settings,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

const FeatureTabs = () => {
  const features = [
    {
      id: "inventory",
      icon: Package,
      tab: "Inventory",
      title: "Smart Inventory Management",
      description:
        "Track, manage, and optimize your inventory with real-time updates and powerful automation tools.",
      subFeatures: [
        "Real-time stock tracking across multiple warehouses",
        "Automated reorder points and low stock alerts",
        "Batch tracking and serial number management",
        "Barcode scanning for quick inventory updates",
        "Item categorization and custom attributes",
        "Inventory valuation reports (FIFO, LIFO, Average)",
        "Stock adjustment and inventory counts",
        "Expiration date tracking and management",
      ],
    },
    {
      id: "purchasing",
      icon: Truck,
      tab: "Purchasing",
      title: "Streamlined Purchasing",
      description:
        "Automate your purchasing workflow from purchase orders to receiving inventory.",
      subFeatures: [
        "Create and manage purchase orders effortlessly",
        "Track vendor performance and order history",
        "Automated purchase order approval workflows",
        "Multi-currency support for international purchases",
        "Partial receiving and backorder management",
        "Vendor catalog integration and price tracking",
        "Purchase planning based on sales forecasts",
        "Custom email templates for vendor communication",
      ],
    },
    {
      id: "sales",
      icon: ShoppingCart,
      tab: "Sales Orders",
      title: "Efficient Sales Management",
      description:
        "Manage your entire sales process from quotation to fulfillment and invoicing.",
      subFeatures: [
        "Streamlined quote-to-cash workflow",
        "Customizable sales order templates",
        "Inventory reservation for pending orders",
        "Real-time availability checking during order entry",
        "Partial shipments and backorder handling",
        "Customer price lists and discount management",
        "Order status tracking and notifications",
        "Integration with shipping carriers for label printing",
      ],
    },
    {
      id: "reports",
      icon: BarChart2,
      tab: "Analytics",
      title: "Advanced Analytics & Reports",
      description:
        "Gain insights into your inventory performance with customizable reports and dashboards.",
      subFeatures: [
        "Inventory turnover and aging reports",
        "Sales performance by product and category",
        "Demand forecasting and trend analysis",
        "Customizable dashboards for KPI tracking",
        "Dead stock identification and management",
        "COGS and profit margin calculations",
        "Export reports to Excel, PDF, or CSV formats",
        "Scheduled report delivery via email",
      ],
    },
    {
      id: "billing",
      icon: CreditCard,
      tab: "Billing",
      title: "Seamless Billing & Invoicing",
      description:
        "Generate professional invoices, track payments, and manage your accounts receivable.",
      subFeatures: [
        "Automated invoice generation from sales orders",
        "Multiple payment gateway integrations",
        "Recurring billing for subscription products",
        "Credit memo and refund processing",
        "Payment reminder workflows and aging reports",
        "Tax calculation and management",
        "Customer statements and payment history",
        "Multi-currency support for international sales",
      ],
    },
    {
      id: "documents",
      icon: FileText,
      tab: "Documents",
      title: "Document Management",
      description:
        "Create, customize, and manage all your inventory-related documents in one place.",
      subFeatures: [
        "Customizable templates for all business documents",
        "Batch printing for picking lists and packing slips",
        "Electronic signature capture for deliveries",
        "Document versioning and history tracking",
        "Automatic PDF generation and storage",
        "Email integration for document sharing",
        "Barcode and QR code generation for documents",
        "Custom branding options for all documents",
      ],
    },
    {
      id: "integrations",
      icon: Settings,
      tab: "Integrations",
      title: "Powerful Integrations",
      description:
        "Connect IzuInventory with your favorite tools and platforms for a seamless workflow.",
      subFeatures: [
        "E-commerce integration (Shopify, WooCommerce, Amazon)",
        "Accounting software connection (QuickBooks, Xero)",
        "CRM integration for customer data synchronization",
        "Shipping carrier APIs (UPS, FedEx, DHL)",
        "Payment processor connections",
        "POS system integration for retail operations",
        "EDI support for B2B transactions",
        "API access for custom integrations",
      ],
    },
    {
      id: "access",
      icon: Users,
      tab: "User Access",
      title: "Role-Based Access Control",
      description:
        "Manage user permissions and ensure data security with granular access controls.",
      subFeatures: [
        "Role-based permission management",
        "User activity logs and audit trails",
        "Warehouse-specific access restrictions",
        "Custom approval workflows by user role",
        "Two-factor authentication support",
        "Single sign-on (SSO) integration",
        "Mobile app access with same permissions",
        "Time-based access restrictions for temporary users",
      ],
    },
  ];

  return (
    <section className="w-full py-20 bg-slate-50/50">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto px-6 mb-16 text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6">
          Powerful Features for
          <br /> Modern{" "}
          <span className="inline-block bg-gradient-to-r from-blue-200 via-teal-200 to-teal-300 px-4 rounded-lg">
            Inventory Management
          </span>
        </h2>
        <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto">
          From stock tracking to analytics,
          <br /> IzuInventory helps you manage your inventory with ease.
        </p>
      </div>

      {/* Tabs Component */}
      <div className="w-full max-w-6xl mx-auto px-6">
        <Tabs defaultValue="inventory" className="w-full">
          {/* Tab Buttons */}
          <TabsList className="flex items-center w-full gap-2 bg-white/50 backdrop-blur-sm p-2 rounded-full shadow-sm mb-8 flex-wrap justify-center">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <TabsTrigger
                  key={feature.id}
                  value={feature.id}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full data-[state=active]:bg-teal-100 data-[state=active]:text-teal-900 transition-all duration-300 text-slate-600"
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden md:inline font-medium">
                    {feature.tab}
                  </span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Content Panels */}
          {features.map((feature) => (
            <TabsContent
              key={feature.id}
              value={feature.id}
              className="focus-visible:outline-none focus-visible:ring-0"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100"
              >
                <div className="flex items-start gap-6">
                  {/* Feature Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-100 to-teal-50 flex items-center justify-center shadow-sm">
                    <feature.icon className="w-8 h-8 text-teal-600" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-slate-600 text-lg">
                        {feature.description}
                      </p>
                    </div>
                    <ul className="space-y-4">
                      {feature.subFeatures.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0 mt-1">
                            <svg
                              className="w-3 h-3 text-teal-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                          <span className="text-slate-700 text-lg">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default FeatureTabs;