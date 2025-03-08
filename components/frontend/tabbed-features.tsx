"use client";

import {
  BarChart,
  BarChart2,
  CloudUpload,
  Database,
  DollarSign,
  Edit3,
  FileText,
  GraduationCap,
  Layout,
  Lock,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SectionHeader from "./section-header";

const features = [
  {
    icon: Users,
    tab: "Authentication",
    title: "Advanced Authentication",
    description:
      "Secure and flexible authentication system with role-based access control and multi-provider support.",
    href: "/features/authentication",
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
    image: "/images/auth.webp",
  },
  {
    icon: Layout,
    tab: "Dashboard",
    title: "Dynamic Dashboard",
    description:
      "Beautifully designed, responsive dashboard with data visualization and management tools.",
    href: "/features/dashboard",
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
    image: "/images/dash.webp",
  },
  {
    icon: FileText,
    tab: "Forms",
    title: "Reusable Form Components",
    description:
      "Streamline your workflows with reusable and customizable form components.",
    href: "/features/forms",
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
    image: "/images/dash-2.webp",
  },
  {
    icon: BarChart2,
    tab: "Data Tables",
    title: "Advanced Data Tables",
    description:
      "Manage and display data effortlessly with customizable and powerful data tables.",
    href: "/features/data-tables",
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
    image: "/images/dash-2.webp",
  },
  {
    icon: CloudUpload,
    tab: "Image Upload",
    title: "Image Upload",
    description:
      "Effortless image uploads powered by UploadThing, supporting both single and multiple file uploads.",
    href: "/features/image-upload",
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
    image: "/images/dash-2.webp",
  },
  {
    icon: Edit3,
    tab: "Rich Text",
    title: "Rich Text Editor",
    description:
      "Seamlessly create and edit rich content using an integrated Quill editor.",
    href: "/features/rich-text-editor",
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
    image: "/images/dash-2.webp",
  },
  {
    icon: Lock,
    tab: "Security",
    title: "Secure Authentication",
    description:
      "Role-based authentication system with customizable access control.",
    href: "/features/secure-authentication",
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
    image: "/images/auth.webp",
  },
  {
    icon: Database,
    tab: "Database",
    title: "Prisma ORM",
    description:
      "Leverage Prisma ORM for robust and scalable database management in TypeScript.",
    href: "/features/prisma-orm",
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
    image: "/images/auth.webp",
  },
  {
    icon: BarChart,
    tab: "Analytics",
    title: "Analytics Integration",
    description:
      "Track performance with integrated analytics from PostHog and Vercel for actionable insights.",
    href: "/features/analytics",
    subFeatures: [
      "Real-time user behavior tracking",
      "Event-based analytics for user actions",
      "Custom dashboards for key metrics",
      "Support for funnel analysis and segmentation",
      "Error and performance tracking",
      "Integration with other analytics platforms",
      "Role-specific analytics access",
      "Data export for further analysis",
    ],
    image: "/images/analytics.webp",
  },
];

export default function TabbedFeatures() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="py-8">
        <SectionHeader
          title="Core Features"
          heading="Your Complete Fullstack Starter Kit"
          description="Everything you need to kickstart your next fullstack project with modern tools and best practices."
        />
      </div>
      <Tabs defaultValue={features[0].tab.toLowerCase()} className="space-y-8">
        <TabsList className="inline-flex h-auto w-full justify-start gap-4 rounded-none border-b bg-transparent p-0 flex-wrap">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <TabsTrigger
                key={feature.tab}
                value={feature.tab.toLowerCase()}
                className="inline-flex items-center gap-2 border-b-2 border-transparent px-4 pb-4 pt-2 data-[state=active]:border-primary"
              >
                <Icon className="h-5 w-5" />
                {feature.tab}
              </TabsTrigger>
            );
          })}
        </TabsList>
        {features.map((feature) => (
          <TabsContent
            key={feature.tab}
            value={feature.tab.toLowerCase()}
            className="space-y-8"
          >
            <div className="grid gap-8 lg:grid-cols-2">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight">
                  {feature.title}
                </h2>
                <p className="text-lg text-muted-foreground">
                  {feature.description}
                </p>
                <Card>
                  <CardContent className="grid gap-4 p-6">
                    {feature.subFeatures.map((subFeature, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          {index + 1}
                        </div>
                        <span>{subFeature}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Button asChild>
                  <Link href={feature.href}>
                    Learn more about {feature.title}
                  </Link>
                </Button>
              </div>
              <div className="relative aspect-video overflow-hidden rounded-xl bg-muted lg:aspect-square">
                <Image
                  src={feature.image}
                  alt={`${feature.title} illustration`}
                  className="object-contain"
                  fill
                  priority
                />
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
