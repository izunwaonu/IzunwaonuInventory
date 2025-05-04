"use client";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { SessionProvider } from "next-auth/react";
import React, { ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { Toaster as ShadToaster } from "@/components/ui/sonner";
import { extractRouterConfig } from "uploadthing/server";
import QueryProvider from "@/lib/query-provider";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <QueryProvider>
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <Toaster position="top-center" reverseOrder={false} />
        <ShadToaster richColors />
        {children}
      </QueryProvider>
    </SessionProvider>
  );
}
