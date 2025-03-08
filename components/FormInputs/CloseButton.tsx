import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

export default function CloseButton({
  href,
  parent = "inventory",
}: {
  href: string;
  parent?: string;
}) {
  return (
    <Button type="button" variant="outline" asChild>
      <Link
        href={
          parent === "" ? `/dashboard${href}` : `/dashboard/${parent}${href}`
        }
      >
        Close
      </Link>
    </Button>
  );
}
