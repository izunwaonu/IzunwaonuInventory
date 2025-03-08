"use client";
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Users,
  Layout,
  FileText,
  BarChart2,
  CloudUpload,
  Edit3,
  Lock,
  Database,
  BarChart,
} from "lucide-react";
import { motion } from "framer-motion";

const FeatureTabs = () => {
  const features = [
    {
      id: "authentication",
      icon: Users,
      tab: "Authentication",
      title: "Advanced Authentication",
      description:
        "Secure and flexible authentication system with role-based access control and multi-provider support.",
      subFeatures: [
        "NextAuth integration with GitHub, Google, and credentials",
        "Role-based access control for managing user permissions",
        "Session management with JWT and secure cookies",
        "Customizable login and registration flows",
        "Support for multiple roles and hierarchical permissions",
        "Secure password handling with encryption",
        "Social login for quick and easy access",
        "Token expiration and refresh mechanisms",
      ],
    },
    {
      id: "dashboard",
      icon: Layout,
      tab: "Dashboard",
      title: "Dynamic Dashboard",
      description:
        "Beautifully designed, responsive dashboard with data visualization and management tools.",
      subFeatures: [
        "Fully responsive and mobile-friendly interface",
        "Customizable widgets for key metrics",
        "Real-time data updates with server-side rendering",
        "User-friendly navigation and layout",
        "Integrated charts and data visualization tools",
        "Dark and light mode support",
        "Role-specific dashboard views",
        "Seamless integration with backend APIs",
      ],
    },
    {
      id: "forms",
      icon: FileText,
      tab: "Forms",
      title: "Reusable Form Components",
      description:
        "Streamline your workflows with reusable and customizable form components.",
      subFeatures: [
        "Prebuilt form inputs with validation",
        "Support for text, numbers, dates, and dropdowns",
        "Integration with React Hook Form for effortless validation",
        "Customizable error handling and feedback",
        "Tooltips and inline helper text support",
        "Reusable form sections for consistent design",
        "Dynamic forms with conditional fields",
        "Optimized performance for large forms",
      ],
    },
    {
      id: "tables",
      icon: BarChart2,
      tab: "Data Tables",
      title: "Advanced Data Tables",
      description:
        "Manage and display data effortlessly with customizable and powerful data tables.",
      subFeatures: [
        "Pagination, sorting, and filtering out-of-the-box",
        "Custom column rendering with advanced formatting",
        "Export data to CSV, Excel, or PDF formats",
        "Integrated search functionality",
        "Server-side data fetching and caching",
        "Dynamic row actions for CRUD operations",
        "Role-based data access and visibility",
        "Seamless integration with Prisma and backend APIs",
      ],
    },
    {
      id: "upload",
      icon: CloudUpload,
      tab: "Image Upload",
      title: "Image Upload",
      description:
        "Effortless image uploads powered by UploadThing, supporting both single and multiple file uploads.",
      subFeatures: [
        "Single image upload for profile or cover images",
        "Multiple image uploads for galleries or portfolios",
        "Drag-and-drop upload interface",
        "Validation for file types and sizes",
        "Previews of uploaded images",
        "Seamless integration with backend storage solutions",
        "Error handling for upload failures",
        "Optimized for fast performance and secure uploads",
      ],
    },
    {
      id: "editor",
      icon: Edit3,
      tab: "Rich Text",
      title: "Rich Text Editor",
      description:
        "Seamlessly create and edit rich content using an integrated Quill editor.",
      subFeatures: [
        "Support for text formatting (bold, italic, underline)",
        "Image and media embedding",
        "Customizable toolbar options",
        "Support for markdown and HTML content",
        "Error handling for invalid input",
        "Dynamic content rendering with previews",
        "Integration with backend for content storage",
        "Support for multiple languages",
      ],
    },
    {
      id: "security",
      icon: Lock,
      tab: "Security",
      title: "Secure Authentication",
      description:
        "Role-based authentication system with customizable access control.",
      subFeatures: [
        "Password encryption using secure algorithms",
        "Token-based authentication with expiry settings",
        "Multi-factor authentication support",
        "Granular role-based access permissions",
        "Session management for active users",
        "Audit trails and logging for sensitive actions",
        "IP-based access restrictions",
        "Secure API token generation for developers",
      ],
    },
    {
      id: "database",
      icon: Database,
      tab: "Database",
      title: "Prisma ORM",
      description:
        "Leverage Prisma ORM for robust and scalable database management in TypeScript.",
      subFeatures: [
        "Schema-driven database design",
        "Support for relational and non-relational databases",
        "Migrations and seeding out-of-the-box",
        "Type-safe database queries",
        "GraphQL and REST API integration",
        "Support for nested queries and relations",
        "Performance optimization tools",
        "Developer-friendly syntax and tooling",
      ],
    },
  ];

  return (
    <section className="w-full py-20 bg-slate-50/50">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto px-6 mb-16 text-center">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6">
          All the Essential Features
          <br /> for a{" "}
          <span className="inline-block bg-gradient-to-r from-orange-200 via-purple-200 to-purple-300 px-4 rounded-lg">
            Successful SaaS
          </span>
        </h2>
        <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto">
          From payments to an admin dashboard,
          <br /> this starter kit covers everything you need.
        </p>
      </div>

      {/* Tabs Component */}
      <div className="w-full max-w-6xl mx-auto px-6">
        <Tabs defaultValue="authentication" className="w-full">
          {/* Tab Buttons */}
          <TabsList className="flex items-center w-full gap-2 bg-white/50 backdrop-blur-sm p-2 rounded-full shadow-sm mb-8 flex-wrap justify-center">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <TabsTrigger
                  key={feature.id}
                  value={feature.id}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-full data-[state=active]:bg-purple-100 data-[state=active]:text-purple-900 transition-all duration-300 text-slate-600"
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
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center shadow-sm">
                    <feature.icon className="w-8 h-8 text-purple-600" />
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
                          <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-1">
                            <svg
                              className="w-3 h-3 text-purple-600"
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
