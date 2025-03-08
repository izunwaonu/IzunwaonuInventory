import { Eye, Key, Lock, Mail, Shield } from "lucide-react";
import React from "react";
import FeatureSection from "../reusable-ui/feature-section";

export default function PlainFeatures() {
  return (
    <div>
      <FeatureSection
        icon={<Eye className="w-6 h-6" />}
        title="Launch with"
        titleHighlight="Confidence"
        description="JetShip laravel starter kit equips you with a powerful toolkit, empowering you to bring your vision to life quickly and professionally."
        imageSrc="/images/auth.webp"
        imageAlt="Dashboard Preview"
        imagePosition="left"
        features={[
          {
            icon: Shield,
            title: "Solid Tech-Stack",
            description:
              "Utilizes Laravel, TailwindCSS, Livewire, AlpineJS, and FilamentPHP for a powerful, scalable & developer-friendly experience.",
          },
          {
            icon: Lock,
            title: "Ready for Production",
            description:
              "No need to waste time on configurations; everything is set for deployment.",
          },
          {
            icon: Key,
            title: "Clean Code",
            description:
              "A simple, clean, well-commented codebase that is fully customizable and easy to extend.",
          },
          {
            icon: Shield,
            title: "Easy Laravel Forge Deployment",
            description:
              "Deploy your SaaS swiftly with Laravel Forge, streamlining your process in just a few clicks.",
          },
        ]}
      />
      <FeatureSection
        icon={<Lock className="w-6 h-6" />}
        title="Seamless"
        titleHighlight="Authentication"
        description="Elevate your app with cutting-edge auth options, from one-click social logins: Google, GitHub, Twitter to passwordless magic links."
        imageSrc="/images/auth.webp"
        imageAlt="Authentication Preview"
        imagePosition="right"
        features={[
          {
            icon: Shield,
            title: "Social Sign-in",
            description:
              "Supports social sign-ins via Socialite with Google, GitHub, Twitter, LinkedIn, Facebook, GitLab, Bitbucket, and Slack.",
          },
          {
            icon: Mail,
            title: "Magic Links",
            description:
              "Enables easy user sign-ins with email link authentication.",
          },
          {
            icon: Lock,
            title: "Email Authentication",
            description:
              "Allows email and password sign-ins, ensuring email verification.",
          },
          {
            icon: Key,
            title: "Password Reset",
            description:
              "Provides a self-service password recovery feature for users.",
          },
        ]}
      />
    </div>
  );
}
