"use client";
import Image from "next/image";
import Link from "next/link";
import ThemeButton from "./theme-button";
import { useRouter } from "next/navigation";
import { getContactInfo } from "@/config/meta";
import Logo from "../global/Logo";

export default function Footer() {
  const navItems = [
    { label: "Home", href: "/" },
    { label: "Features", href: "/#features" },
    { label: "Pricing", href: "/#pricing" },
    { label: "Documentation", href: "/docs" },
    { label: "Integrations", href: "/integrations" },
    { label: "Support", href: "/support" },
  ];

  const serviceItems = [
    { label: "Inventory Management", href: "/features/inventory" },
    { label: "Order Processing", href: "/features/orders" },
    { label: "Barcode Scanning", href: "/features/barcode" },
    { label: "Reports & Analytics", href: "/features/reports" },
    { label: "Multi-location Support", href: "/features/multi-location" },
    { label: "Mobile App Access", href: "/features/mobile" },
  ];
  
  const router = useRouter();
  const { email, fullAddress, mainPhone } = getContactInfo();
  
  return (
    <footer className="bg-gray-900 text-white py-16 px-4 md:px-8 lg:px-16 rounded-t-[2.5rem] relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-green-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]"></div>

      <div className="relative">
        {/* Top Section */}
        <div className="max-w-7xl mx-auto mb-16 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="mb-8 md:mb-0">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
              Streamline your inventory with IzuInventory
            </h2>
            <p className="text-gray-400 max-w-xl text-base">
              Manage your stock effortlessly with our comprehensive inventory solution. 
              Track items, process orders, and generate reports with ease.
            </p>
          </div>
          <div className="flex gap-4 md:flex-row flex-col">
            <button
              onClick={() => router.push("/demo")}
              className="px-6 md:!py-1 py-3 border border-gray-700 hover:border-emerald-500 rounded-full text-gray-300 hover:text-emerald-400 transition-all duration-300 block"
            >
              Request Demo
            </button>
            <ThemeButton
              href="/signup"
              title="Start Free Trial"
            />
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
            {/* Logo and Social Media Section */}
            <div className="lg:col-span-4">
              <Logo variant="dark" />
              <div className="flex flex-col mt-6">
                <h3 className="text-base font-semibold mb-4 text-gray-200">
                  Connect With Us
                </h3>
                <div className="flex gap-4">
                  {[
                    "https://cdn-icons-png.flaticon.com/128/5968/5968764.png",
                    "https://cdn-icons-png.flaticon.com/128/3670/3670151.png",
                    "https://cdn-icons-png.flaticon.com/128/145/145807.png",
                    "https://cdn-icons-png.flaticon.com/128/3670/3670176.png",
                  ].map((social) => (
                    <Link
                      key={social}
                      href="#"
                      className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-full hover:bg-emerald-500/20 transition-all duration-300"
                    >
                      <Image
                        src={social}
                        alt={`${social} icon`}
                        width={20}
                        height={20}
                        className="opacity-75 hover:opacity-100 transition-opacity"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-2">
              <h3 className="text-base font-semibold mb-4 text-gray-200">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {navItems.map((item, i) => (
                  <li key={i}>
                    <Link
                      href={item.href}
                      className="text-gray-400 hover:text-emerald-400 transition-colors text-sm flex items-center gap-2"
                    >
                      <span className="w-1 h-1 bg-emerald-500 rounded-full opacity-0 transition-opacity group-hover:opacity-100"></span>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Features */}
            <div className="lg:col-span-3">
              <h3 className="text-base font-semibold mb-4 text-gray-200">
                Features
              </h3>
              <ul className="space-y-3">
                {serviceItems.slice(0, 6).map((service, i) => (
                  <li key={i}>
                    <Link
                      href={service.href}
                      className="text-gray-400 hover:text-emerald-400 transition-colors text-sm flex items-center gap-2"
                    >
                      <span className="w-1 h-1 bg-emerald-500 rounded-full opacity-0 transition-opacity group-hover:opacity-100"></span>
                      {service.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Information */}
            <div className="lg:col-span-3">
              <h3 className="text-base font-semibold mb-4 text-gray-200">
                Contact Information
              </h3>
              <ul className="space-y-4">
                <li className="text-gray-400 text-sm flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center mt-0.5">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                  </span>
                  Phone: {mainPhone}
                </li>
                <li className="text-gray-400 text-sm flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center mt-0.5">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                  </span>
                  Email: {email}
                </li>
                <li className="text-gray-400 text-sm flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center mt-0.5">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                  </span>
                  Address:
                  <br />
                  {fullAddress}
                </li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()}{" "}
              <Link
                href="/"
                className="hover:text-emerald-400 transition-colors"
              >
                IzuInventory
              </Link>{" "}
              |
              <Link
                href="/privacy"
                className="hover:text-emerald-400 transition-colors ml-2"
              >
                Privacy Policy
              </Link>{" "}
              |
              <Link
                href="/terms"
                className="hover:text-emerald-400 transition-colors ml-2"
              >
                Terms of Service
              </Link>{" "}
              |
              <Link
                href="/accessibility"
                className="hover:text-emerald-400 transition-colors ml-2"
              >
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}