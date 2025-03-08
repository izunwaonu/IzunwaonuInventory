"use client";
import React from "react";
import { Button } from "@/components/ui/moving-border";
import Link from "next/link";
type CustomLinkButton = {
  href: string;
  title: string;
};
export function CustomLinkButton({ href, title }: CustomLinkButton) {
  return (
    <div>
      <Button
        borderRadius="1.75rem"
        className="bg-white dark:bg-slate-900 text-black dark:text-white border-neutral-200 dark:border-slate-800 px-6"
      >
        <Link href={href}>{title}</Link>
      </Button>
    </div>
  );
}
