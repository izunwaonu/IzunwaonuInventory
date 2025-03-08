"use client";
import { CheckCircle2, Loader2, Mail } from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";

import { ForgotPasswordProps, LoginProps } from "@/types/types";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import TextInput from "../FormInputs/TextInput";
import SubmitButton from "../FormInputs/SubmitButton";
import Logo from "../global/Logo";
import CustomCarousel from "../frontend/custom-carousel";
import { sendResetLink } from "@/actions/users";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
export default function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordProps>();
  const [passErr, setPassErr] = useState("");
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const handleResend = async () => {
    setIsResending(true);

    // Simulate API call
    await sendResetLink(email);

    // Start cooldown timer (60 seconds)
    setResendTimer(60);
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsResending(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  async function onSubmit(data: ForgotPasswordProps) {
    try {
      setLoading(true);
      console.log("Data:", data);
      const res = await sendResetLink(data.email);
      if (res.status === 404) {
        setLoading(false);
        setPassErr(res?.error ?? "");
        return;
      }
      toast.success("Reset Instructions sent, Check your email");
      setLoading(false);
      setEmail(data.email);
      setSuccess(true);
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
          {success ? (
            <Card className="w-full max-w-md mx-auto">
              <CardHeader className="space-y-3">
                <div className="flex justify-center">
                  <CheckCircle2 className="h-12 w-12 text-green-500" />
                </div>
                <CardTitle className="text-center text-2xl">
                  Check your email
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="text-center text-gray-600">
                  We've sent password reset instructions to:
                  <div className="mt-2 font-medium text-gray-900">{email}</div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Mail className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p>
                        The email might take a few minutes to arrive. Don't
                        forget to check your spam folder!
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-3">
                <div className="text-sm text-center text-gray-600">
                  Didn't receive the email?
                </div>
                <Button
                  variant="outline"
                  onClick={handleResend}
                  disabled={isResending}
                  className="w-full"
                >
                  {resendTimer > 0
                    ? `Resend available in ${resendTimer}s`
                    : "Resend email"}
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="">
              <div className="grid gap-2 mt-10 md:mt-0">
                <h1 className="text-3xl font-bold">Forgot Password?</h1>
                <p className="text-muted-foreground text-sm">
                  No worries, we'll send you reset instructions
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
                  {passErr && <p className="text-red-500 text-xs">{passErr}</p>}
                  <div>
                    <SubmitButton
                      title="Send Reset Link"
                      loadingTitle="Loading Please wait.."
                      loading={loading}
                      className="w-full"
                      loaderIcon={Loader2}
                      showIcon={false}
                    />
                  </div>
                </form>

                <p className="mt-6 text-sm text-gray-500">
                  Remember password ?{" "}
                  <Link
                    href="/login"
                    className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                  >
                    Login
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="hidden bg-muted lg:block relative">
        <CustomCarousel />
      </div>
    </div>
  );
}
