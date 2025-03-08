"use client";
import { Headset, Loader2, Lock, Mail, User } from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { UserProps } from "@/types/types";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import TextInput from "../FormInputs/TextInput";
import PasswordInput from "../FormInputs/PasswordInput";
import SubmitButton from "../FormInputs/SubmitButton";
import { createUser } from "@/actions/users";
import CustomCarousel from "../frontend/custom-carousel";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import Logo from "../global/Logo";
export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [emailErr, setEmailErr] = useState<string | null>(null);
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<UserProps>();
  const router = useRouter();
  async function onSubmit(data: UserProps) {
    setLoading(true);
    data.name = `${data.firstName} ${data.lastName}`;
    data.image =
      "https://utfs.io/f/59b606d1-9148-4f50-ae1c-e9d02322e834-2558r.png";
    try {
      const res = await createUser(data);
      if (res.status === 409) {
        setLoading(false);
        setEmailErr(res.error);
      } else if (res.status === 200) {
        setLoading(false);
        toast.success("Account Created successfully");
        router.push("/");
      } else {
        setLoading(false);
        toast.error("Something went wrong");
      }
    } catch (error) {
      setLoading(false);
      console.error("Network Error:", error);
      toast.error("Its seems something is wrong, try again");
    }
  }
  return (
    <div className="w-full lg:grid h-screen lg:min-h-[600px] lg:grid-cols-2 relative ">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid  gap-6 mt-10 md:mt-0">
          <div className="absolute left-1/3 top-14 md:top-5 md:left-5">
            <Logo />
          </div>
          <div className="grid gap-2 text-center mt-10 md:mt-0">
            <h1 className="text-3xl font-bold">Create an account</h1>
            <p className="text-muted-foreground text-sm">
              Create your <span className="text-blue-600">Next Admin</span>{" "}
              Account today to get started
            </p>
          </div>
          <div className="">
            <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput
                  register={register}
                  errors={errors}
                  label="First Name"
                  name="firstName"
                  icon={User}
                  placeholder="first Name"
                />
                <TextInput
                  register={register}
                  errors={errors}
                  label="Last Name"
                  name="lastName"
                  icon={User}
                  placeholder="last Name"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput
                  register={register}
                  errors={errors}
                  label="Phone"
                  name="phone"
                  icon={Headset}
                  placeholder="phone"
                />
                <div className="">
                  <TextInput
                    type="email"
                    register={register}
                    errors={errors}
                    label="Email Address"
                    name="email"
                    icon={Mail}
                    placeholder="email"
                    isRequired={false}
                  />
                </div>
              </div>

              <PasswordInput
                register={register}
                errors={errors}
                label="Password"
                name="password"
                icon={Lock}
                placeholder="password"
                type="password"
              />
              <div className="">
                {emailErr && (
                  <p className="text-red-500 text-xs mt-2">{emailErr}</p>
                )}
              </div>
              <div>
                <SubmitButton
                  title="Sign Up"
                  loadingTitle="Creating Please wait.."
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
            <p className="mt-6 text-sm text-gray-500">
              Already Registered ?{" "}
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
