import type { Metadata } from "next";
import { Rethink_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Providers from "@/components/Providers";
import Head from "next/head";
import PWAServiceWorker from "@/components/PWAServiceWorker"; // Import the client component

const inter = Rethink_Sans({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "IzuInventory",
  description: "Simplify Stock, Amplify Business",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        {/* ✅ PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />

        {/* ✅ Apple Touch Icon (for iOS devices) */}
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />

        {/* ✅ Favicon (for browsers) */}
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
      </Head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
        <Toaster />
        <PWAServiceWorker /> {/* ✅ Register SW from a client component */}
      </body>
    </html>
  );
}
