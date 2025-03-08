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
} from "lucide-react";
import React from "react";
import Showcase from "@/components/frontend/showcase";
import PricingCard from "@/components/frontend/single-tier-pricing";
import FAQ from "@/components/frontend/FAQ";
import CustomizationCard from "@/components/frontend/customisation-card";
import Image from "next/image";
import { BorderBeam } from "@/components/magicui/border-beam";
import FeatureTabs from "@/components/frontend/SmoothTabs";

export default async function page() {
  const currentUsers = 300;
  return (
    <section>
      <ReUsableHero
        theme="light"
        announcement={{
          text: "Introducing Hubstack Advanced - Launch Your app in days",
        }}
        title={
          <>
            The Ultimate Next.js Agency
            <br />& Fullstack SaaS Starter Kit
          </>
        }
        mobileTitle="Ultimate Next.js Agency & SaaS Kit"
        subtitle="You will get a premium Next.js 15 starter kit with a complete agency website, user & admin dashboards, full authentication system, blog platform, documentation system, and project showcase features - everything you need to launch your digital agency or SaaS product in days instead of months."
        buttons={[
          {
            label: "Get the Kit Now",
            href: "https://gmukejohnbaptist.gumroad.com/l/hubstack-simple-auth",
            primary: true,
          },
          {
            label: "View Demo",
            href: "/#demo",
          },
        ]}
        icons={[
          { icon: Code2, position: "left" },
          { icon: Layout, position: "right" }, // Changed to Layout for dashboard representation
          { icon: Rocket, position: "center" }, // Changed to Rocket for launch/speed representation
        ]}
        backgroundStyle="neutral"
        className="min-h-[70vh]"
        userCount={currentUsers > 10 ? currentUsers : null}
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
            src="/images/dash-2.webp"
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
          url="https://www.youtube.com/embed/TcyKfjikcIA?si=naix1jg9I2r0CnSu"
          width="100%"
          className="h-[32rem] rounded-lg"
          display="block"
          position="relative"
        />
        <div className="pb-16">
          <Showcase />
        </div>
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
