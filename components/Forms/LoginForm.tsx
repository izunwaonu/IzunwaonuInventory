"use client";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
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
export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<LoginProps>();
  const params = useSearchParams();
  const returnUrl = params.get("returnUrl") || "/dashboard";
  const [passErr, setPassErr] = useState("");
  const router = useRouter();
  async function onSubmit(data: LoginProps) {
    try {
      setLoading(true);
      setPassErr("");
      console.log("Attempting to sign in with credentials:", data);
      const loginData = await signIn("credentials", {
        ...data,
        redirect: false,
      });
      console.log("SignIn response:", loginData);
      if (loginData?.error) {
        setLoading(false);
        toast.error("Sign-in error: Check your credentials");
        setPassErr("Wrong Credentials, Check again");
        // setShowNotification(true);
      } else {
        // Sign-in was successful
        // setShowNotification(false);
        reset();
        setLoading(false);
        toast.success("Login Successful");
        setPassErr("");
        router.push(returnUrl);
      }
    } catch (error) {
      setLoading(false);
      console.error("Network Error:", error);
      // toast.error("Its seems something is wrong with your Network");
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
            <h1 className="text-3xl font-bold">Login to your Account</h1>
            <p className="text-muted-foreground text-sm">
              Welcome Back to <span className="text-blue-600">Next Admin</span>
            </p>
          </div>
          <div className="">
            <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
              <TextInput
                register={register}
                errors={errors}
                label="Email Address"
                name="email"
                icon={Mail}
                placeholder="email"
              />
              <PasswordInput
                register={register}
                errors={errors}
                label="Password"
                name="password"
                icon={Lock}
                placeholder="password"
                forgotPasswordLink="/forgot-password"
              />
              {passErr && <p className="text-red-500 text-xs">{passErr}</p>}
              <div>
                <SubmitButton
                  title="Sign In"
                  loadingTitle="Loading Please wait.."
                  loading={loading}
                  className="w-full"
                  loaderIcon={Loader2}
                  showIcon={false}
                />
              </div>
            </form>
            <div className="flex items-center py-4 justify-center space-x-1 text-slate-900">
              <div className="h-[1px] w-full bg-slate-200"></div>
              <div className="uppercase">Or</div>
              <div className="h-[1px] w-full bg-slate-200"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Button
                onClick={() => signIn("google")}
                variant={"outline"}
                className="w-full"
              >
                <FaGoogle className="mr-2 w-6 h-6 text-red-500" />
                Login with Google
              </Button>
              <Button
                onClick={() => signIn("github")}
                variant={"outline"}
                className="w-full"
              >
                <FaGithub className="mr-2 w-6 h-6 text-slate-900 dark:text-white" />
                Login with Github
              </Button>
            </div>
            <p className="mt-6  text-sm text-gray-500">
              Not a Registered ?{" "}
              <Link
                href="/register"
                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >
                Create Account
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
