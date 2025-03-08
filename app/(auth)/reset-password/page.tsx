import ResetPasswordForm from "@/components/Forms/ResetPasswordForm";
import { GridBackground } from "@/components/reusable-ui/grid-background";
import React from "react";

export default async function page() {
  return (
    <GridBackground>
      <div className="px-4">
        <ResetPasswordForm />
      </div>
    </GridBackground>
  );
}
