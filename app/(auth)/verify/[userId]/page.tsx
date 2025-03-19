"use client";

import RegisterForm from "@/components/Forms/RegisterForm";
import VerifyOTPForm from "@/components/Forms/VerifyOTPForm";
import { GridBackground } from "@/components/reusable-ui/grid-background";
import React from "react";

export default async function Page(
  {
    params,
    searchParams,
  }: {
    params: Promise<{ userId: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  }
) {
  const{ userId} = await params;
  const email = (await searchParams).email as string;
  return (
    <GridBackground>
      <div className="px-4">
        <VerifyOTPForm userId={userId} email={email}/>
      </div>
    </GridBackground>
  );
}
