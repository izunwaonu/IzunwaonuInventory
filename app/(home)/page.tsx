import Iframe from "react-iframe";
import PlainFeatures from "@/components/frontend/features";
import TabbedFeatures from "@/components/frontend/tabbed-features";
import TechStackGrid from "@/components/frontend/Techstack";
import { GridBackground } from "@/components/reusable-ui/grid-background";
import ProjectComparison from "@/components/reusable-ui/project-comparison";
import RadialFeature from "@/components/reusable-ui/radial-features";
import ReUsableHero from "@/components/reusable-ui/reusable-hero";
import {
  Award,
  Github,
  Code,
  Code2,
  History,
  Sprout,
  Folder,
  Layout,
  Rocket,
  Layers,
  Package,
  BarChart2,
} from "lucide-react";
import React from "react";
import Showcase from "@/components/frontend/showcase";
import PricingCard from "@/components/frontend/single-tier-pricing";
import FAQ from "@/components/frontend/FAQ";
import CustomizationCard from "@/components/frontend/customisation-card";
import Image from "next/image";
import { BorderBeam } from "@/components/magicui/border-beam";
import FeatureTabs from "@/components/frontend/SmoothTabs";
import { getCurrentUsersCount } from "@/actions/users";

export default async function page() {
  const currentUsers = await getCurrentUsersCount();
  
  return (
    <section>
      <ReUsableHero 
  theme="dark"
  announcement={{
    text: "Introducing IzuInventory - Streamline Your Inventory Management",
  }}
  title={
    <>
      Modern Inventory Management
      <br />Simplified for Your Business
    </>
  }
  mobileTitle="Modern Inventory Management Simplified"
  subtitle="IzuInventory provides a comprehensive solution for businesses to track products, manage stock across multiple locations, process sales orders, and generate essential reports. Designed for both small businesses and growing enterprises, our system helps you minimize stockouts, reduce excess inventory, and make data-driven decisions."
  buttons={[
    {
      label: "Get Started Free",
      href: "/register",
      primary: true,
    },
    {
      label: "Book a Demo",
      href: "/#demo",
    },
  ]}
  icons={[
    { icon: Package, position: "left" },    // Package icon for inventory
    { icon: BarChart2, position: "right" }, // Charts for analytics/reporting
    { icon: Layers, position: "center" },   // Layers for multi-location support
  ]}
  backgroundStyle="red"
  className="min-h-[70vh]"
  userCount={currentUsers > 1 ? 1998 + currentUsers : null}
/>
      <GridBackground>
        <div className="px-8 py-16 ">
          <TechStackGrid />
        </div>
      </GridBackground>
      <div className="py-16 max-w-6xl mx-auto px-8">
        <div className="relative rounded-lg overflow-hidden">
          <BorderBeam />
          <Image
            src="/images/dash-3.png"
            alt="This is the dashbaord Image"
            width={1775}
            height={1109}
            className="w-full h-full rounded-lg object-cover  border shadow-2xl"
          />
        </div>
      </div>
      <ProjectComparison />
      <GridBackground className="">
        <FeatureTabs />
      </GridBackground>

      <div id="demo" className="py-16 max-w-6xl mx-auto relative">
        <Iframe
          url="https://www.youtube.com/embed/HSXXGl4QCbA?si=-Dz_mOPmAjM4aqJt"
          width="100%"
          className="h-[32rem] rounded-lg"
          display="block"
          position="relative"
        />
        {/* <div className="pb-16">
          <Showcase />
        </div> */}
        <div className="py-8">
          <PricingCard />
        </div>
        <div className="py">
          <CustomizationCard theme="light" />
        </div>
      </div>
      <FAQ />
    </section>
  );
}

