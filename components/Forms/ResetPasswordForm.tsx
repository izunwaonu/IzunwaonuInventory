"use client";
import { Eye, EyeOff, Key, Loader2, Lock, Mail } from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { LoginProps } from "@/types/types";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "../ui/button";
import { FaGithub, FaGoogle } from "react-icons/fa";
import TextInput from "../FormInputs/TextInput";
import PasswordInput from "../FormInputs/PasswordInput";
import SubmitButton from "../FormInputs/SubmitButton";
import Logo from "../global/Logo";
import CustomCarousel from "../frontend/custom-carousel";
import { resetUserPassword } from "@/actions/users";
export type ResetProps = {
  cPassword: string;
  password: string;
};
export default function ResetPasswordForm() {
  const [loading, setLoading] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<ResetProps>();
  const params = useSearchParams();
  const email = params.get("email") || "";
  const token = params.get("token") || "";
  const [passErr, setPassErr] = useState("");
  const router = useRouter();
  async function onSubmit(data: ResetProps) {
    setLoading(true);
    if (data.cPassword !== data.password) {
      setPassErr("Password do not Match");
      setLoading(false);
      return;
    }
    console.log(email, token, data.password);
    try {
      const res = await resetUserPassword(email, token, data.password);
      if (res?.status === 404) {
        setPassErr(res?.error ?? "");
        setLoading(false);
        return;
      }
      setLoading(false);
      toast.success("Password reset successfully");
      router.push("/login");
    } catch (error) {
      setLoading(false);
      console.error("Network Error:", error);
      toast.error("Its seems something is wrong, try again");
    }
  }
  return (
    <div className="w-full lg:grid h-screen lg:min-h-[600px] lg:grid-cols-2 relative ">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[400px] gap-6 mt-10 md:mt-0">
          <div className="absolute left-1/3 top-14 md:top-5 md:left-5">
            <Logo />
          </div>
          <div className="grid gap-2  mt-10 md:mt-0">
            <h1 className="text-3xl font-bold">Reset your Password</h1>
            <p className="text-muted-foreground text-sm">
              Password must be at least 6 characters
            </p>
          </div>
          <div className="">
            <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
              <PasswordInput
                register={register}
                errors={errors}
                label="Password"
                name="password"
                icon={Lock}
                placeholder="password"
              />
              <PasswordInput
                register={register}
                errors={errors}
                label="Confirm Password"
                name="cPassword"
                icon={Key}
                placeholder="password"
              />
              {passErr && <p className="text-red-500 text-xs">{passErr}</p>}
              <div>
                <SubmitButton
                  title="Reset Password"
                  loadingTitle="Resetting Please wait.."
                  loading={loading}
                  className="w-full"
                  loaderIcon={Loader2}
                  showIcon={false}
                />
              </div>
            </form>

            <p className="mt-6  text-sm text-gray-500">
              Already Registered? {""}
              <Link
                href="/login"
                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block relative">
        <CustomCarousel />
      </div>
    </div>
  );
}
