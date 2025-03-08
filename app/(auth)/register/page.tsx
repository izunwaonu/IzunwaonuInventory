"use client";

import RegisterForm from "@/components/Forms/RegisterForm";
import { GridBackground } from "@/components/reusable-ui/grid-background";
import React from "react";

export default function Page() {
  return (
    <GridBackground>
      <div className="px-4">
        <RegisterForm />
      </div>
    </GridBackground>
  );
}
