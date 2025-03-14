import React from "react";
import {
  Package,
  AlertTriangle,
  ShoppingCart,
  Truck,
  Users,
  BarChart2,
  Map,
  FileText,
  Database,
  Clock,
  Rocket,
  X,
  ArrowRight,
  CheckCircle,
  Layers,
  Bell,
  DollarSign,
} from "lucide-react";

interface TimelineStep {
  title: string;
  highlight: string;
  duration: number;
  icon: React.ReactNode;
  painPoint: string;
  benefit: string;
}

const InventoryComparison = ({ theme = "light" }) => {
  const steps: TimelineStep[] = [
    {
      title: "Managing",
      highlight: "Product Catalog",
      duration: 8,
      icon: <Package className="w-4 h-4" />,
      painPoint:
        "Struggling with spreadsheets, duplicate entries, and manual SKU tracking",
      benefit:
        "Centralized product catalog with automated SKU generation and complete product history",
    },
    {
      title: "Tracking",
      highlight: "Inventory Levels",
      duration: 12,
      icon: <Layers className="w-4 h-4" />,
      painPoint:
        "Constant stockouts or overstocking due to inaccurate inventory counts",
      benefit:
        "Real-time inventory tracking with automated low-stock alerts and precise quantity management",
    },
    {
      title: "Managing",
      highlight: "Multiple Locations",
      duration: 10,
      icon: <Map className="w-4 h-4" />,
      painPoint:
        "Confusion about stock availability across different warehouses or stores",
      benefit:
        "Unified view of inventory across all locations with easy stock transfer functionality",
    },
    {
      title: "Processing",
      highlight: "Stock Adjustments",
      duration: 6,
      icon: <AlertTriangle className="w-4 h-4" />,
      painPoint: "No clear record of inventory losses, damages, or adjustments",
      benefit:
        "Detailed adjustment tracking with reason codes and complete audit history",
    },
    {
      title: "Handling",
      highlight: "Sales Orders",
      duration: 15,
      icon: <ShoppingCart className="w-4 h-4" />,
      painPoint:
        "Order fulfillment delays and missed shipments due to poor visibility",
      benefit:
        "Streamlined order processing with real-time inventory checks and automated invoicing",
    },
    {
      title: "Managing",
      highlight: "Customer Information",
      duration: 7,
      icon: <Users className="w-4 h-4" />,
      painPoint:
        "Scattered customer data making personalized service difficult",
      benefit:
        "Comprehensive customer profiles with purchase history and preference tracking",
    },
    {
      title: "Creating",
      highlight: "Purchase Orders",
      duration: 8,
      icon: <Truck className="w-4 h-4" />,
      painPoint:
        "Late reordering leading to stockouts and missed sales opportunities",
      benefit:
        "Automated purchase order suggestions based on historical data and current stock levels",
    },
    {
      title: "Analyzing",
      highlight: "Inventory Reports",
      duration: 14,
      icon: <BarChart2 className="w-4 h-4" />,
      painPoint: "Time-consuming manual report creation with outdated information",
      benefit:
        "Real-time analytics and customizable reports for inventory valuation and performance metrics",
    },
    {
      title: "Receiving",
      highlight: "Stock Notifications",
      duration: 5,
      icon: <Bell className="w-4 h-4" />,
      painPoint:
        "Missing critical inventory events leading to business disruptions",
      benefit:
        "Automated alerts for low stock, incoming shipments, and inventory discrepancies",
    },
    {
      title: "Calculating",
      highlight: "Inventory Costs",
      duration: 10,
      icon: <DollarSign className="w-4 h-4" />,
      painPoint:
        "Inaccurate cost calculations leading to pricing mistakes and profit loss",
      benefit:
        "Precise cost tracking with FIFO/LIFO methods and automatic margin calculations",
    },
  ];

  const totalHours = steps.reduce((acc, step) => acc + step.duration, 0);

  return (
    <section className="w-full bg-blue-50/20">
      {/* Updated Header Section */}
      <div className="w-full max-w-6xl mx-auto py-20 px-6 text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-8">
          Why Struggle with Manual
          <br />
          Inventory
          <span className="inline-block bg-gradient-to-r from-blue-100 via-teal-100 to-teal-200 px-4 rounded-lg">
            Management?
          </span>
        </h2>

        <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          See how IzuInventory transforms your business operations by eliminating time-consuming manual processes 
          and replacing them with streamlined, automated solutions.
          <br />
          Save up to {totalHours} hours per month on inventory management
        </p>
      </div>

      {/* Comparison Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Without IzuInventory */}
          <div className="relative">
            <div className="sticky top-8 bg-white rounded-3xl border border-rose-100 overflow-hidden">
              <div className="p-6 border-b border-rose-100 bg-gradient-to-b from-rose-50/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                    <X className="w-5 h-5 text-rose-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    Without IzuInventory
                  </h3>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-rose-500">
                    {totalHours} Hours
                  </span>
                  <span className="text-slate-600">wasted each month</span>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-6">
                  {steps.map((step, index) => (
                    <li key={index} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                        {step.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-slate-900">
                            {step.title}{" "}
                            <span className="font-bold">{step.highlight}</span>
                          </h4>
                          <span className="text-rose-500 text-sm">
                            ~ {step.duration}hrs
                          </span>
                        </div>
                        <p className="text-slate-600 text-sm">
                          {step.painPoint}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* With IzuInventory */}
          <div className="relative">
            <div className="sticky top-8 bg-white rounded-3xl border border-teal-100 overflow-hidden">
              <div className="p-6 border-b border-teal-100 bg-gradient-to-b from-teal-50/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
                    <Rocket className="w-5 h-5 text-teal-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    With IzuInventory
                  </h3>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-teal-500">
                    Automated System
                  </span>
                  <span className="text-slate-600">saves time & reduces errors</span>
                </div>
              </div>
              <div className="p-6">
                <ul className="space-y-6">
                  {steps.map((step, index) => (
                    <li key={index} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-teal-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-slate-900">
                            {step.title}{" "}
                            <span className="font-bold">{step.highlight}</span>
                          </h4>
                          <ArrowRight className="w-4 h-4 text-teal-500" />
                          <span className="text-teal-500 text-sm">
                            Automated
                          </span>
                        </div>
                        <p className="text-slate-600 text-sm">{step.benefit}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InventoryComparison;