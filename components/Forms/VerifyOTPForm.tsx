"use client";
import { CheckCircle2, Loader2, PhoneCall, SmartphoneIcon } from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import SubmitButton from "../FormInputs/SubmitButton";
import Logo from "../global/Logo";
import CustomCarousel from "../frontend/custom-carousel";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { verifyOTP } from "@/actions/users";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Define the form schema with Zod
const verifyOTPSchema = z.object({
  otp: z.string().length(6, { message: "OTP must be exactly 6 digits" }),
});

type VerifyOTPFormValues = z.infer<typeof verifyOTPSchema>;

interface VerifyOTPResponse {
  status: number;
  error?: string;
}

// Function that would handle OTP verification (mock)
// const verifyOTP = async (
//   phone: string,
//   otp: string
// ): Promise<VerifyOTPResponse> => {
//   // This would be replaced with your actual API call
//   return { status: 200 };
// };

// Function that would handle resending OTP (mock)
const resendOTP = async (phone: string): Promise<VerifyOTPResponse> => {
  // This would be replaced with your actual API call
  return { status: 200 };
};

export default function VerifyOTPForm({
  userId,
  email,
}: {
  userId: string;
  email: string;
}): React.ReactElement {
  const [loading, setLoading] = useState<boolean>(false);
  const [otpError, setOtpError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [otpValue, setOtpValue] = useState<string>("");

  const {
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<VerifyOTPFormValues>({
    resolver: zodResolver(verifyOTPSchema),
    defaultValues: {
      otp: "",
    },
  });

  // const handleResend = async (): Promise<void> => {
  //   setIsResending(true);

  //   try {
  //     const res = await resendOTP(phone);

  //     if (res.status === 200) {
  //       toast.success("A new verification code has been sent to your phone");

  //       // Start cooldown timer (60 seconds)
  //       setResendTimer(60);
  //       const timer = setInterval(() => {
  //         setResendTimer((prev) => {
  //           if (prev <= 1) {
  //             clearInterval(timer);
  //             setIsResending(false);
  //             return 0;
  //           }
  //           return prev - 1;
  //         });
  //       }, 1000);
  //     } else {
  //       throw new Error(res.error || "Failed to resend code");
  //     }
  //   } catch (error) {
  //     toast.error(
  //       error instanceof Error
  //         ? error.message
  //         : "Failed to resend verification code"
  //     );
  //     setIsResending(false);
  //   }
  // };
  const router = useRouter()
  const onSubmit = async (): Promise<void> => {
    try {
      if (otpValue.length !== 6) {
        setOtpError("Please enter all 6 digits");
        return;
      }

      setLoading(true);
      console.log("OTP submitted:", otpValue);

      const data: VerifyOTPFormValues = {
        otp: otpValue,
      };

      // Call verification API
      const res = await verifyOTP(userId, data.otp);

      if (res.status !== 200) {
        setLoading(false);
        setOtpError("Invalid verification code. Please try again.");
        return;
      }

      toast.success("Account verified successfully!", {description: "Your account has been successfully verified",});
      setLoading(false);
      setSuccess(true);
      router.push('/login')
    } catch (error) {
      setLoading(false);
      console.error("Network Error:", error);
      toast.error("Something went wrong", {description: "There was an error verifying your code. Please try again"});
    }
  };

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
                  Verification Successful
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="text-center text-gray-600">
                  Your account has been successfully verified.
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-green-800">
                      <p>
                        Your account is now active. You can start using our
                        services.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-3">
                <Button
                  className="w-full"
                  onClick={() => (window.location.href = "/login")}
                >
                  Continue to Login
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <div className="">
              <div className="grid gap-2 mt-10 md:mt-0">
                <h1 className="text-3xl font-bold">Verify Your Account</h1>
                <p className="text-muted-foreground text-sm">
                  We've sent a 6-digit verification code to {email}
                </p>
              </div>
              <div className="">
                <form
                  className="space-y-6 mt-8"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={otpValue}
                      onChange={(value) => {
                        setOtpValue(value);
                        setValue("otp", value);
                        setOtpError("");
                      }}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  {otpError && (
                    <p className="text-red-500 text-xs text-center">
                      {otpError}
                    </p>
                  )}
                  {errors.otp && (
                    <p className="text-red-500 text-xs text-center">
                      {errors.otp.message}
                    </p>
                  )}

                  <div>
                    <SubmitButton
                      title="Verify Code"
                      loadingTitle="Verifying..."
                      loading={loading}
                      className="w-full"
                      loaderIcon={Loader2}
                      showIcon={false}
                    />
                  </div>
                </form>

                {/* <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500 mb-2">
                    Didn't receive the code?
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleResend}
                    disabled={isResending || resendTimer > 0}
                    className="text-sm"
                  >
                    {resendTimer > 0
                      ? `Resend available in ${resendTimer}s`
                      : "Resend code"}
                  </Button>
                </div> */}

                <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <PhoneCall className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p>
                        If you didn't receive a verification code, please call
                        <strong> +2348138390681</strong> for assistance with
                        onboarding.
                      </p>
                    </div>
                  </div>
                </div>

                {/* <p className="mt-6 text-sm text-center text-gray-500">
                  <Link
                    href="/login"
                    className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                  >
                    Back to Login
                  </Link>
                </p> */}
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
