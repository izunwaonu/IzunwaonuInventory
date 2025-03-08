"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { User as PrismaUser } from "@prisma/client";

import TextInput from "../FormInputs/TextInput";
import FormFooter from "./FormFooter";
import { updateUserPassword } from "@/actions/users";
import PasswordInput from "../FormInputs/PasswordInput";
import { Lock, LockOpen } from "lucide-react";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";

export type PasswordProps = {
  oldPassword: string;
  newPassword: string;
};
export type SelectOptionProps = {
  label: string;
  value: string;
};
type ClientFormProps = {
  editingId?: string | undefined;
  initialData?: PrismaUser | undefined | null;
};
export default function ChangePasswordForm({
  editingId,
  initialData,
}: ClientFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordProps>({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });
  const router = useRouter();
  const [passErr, setPassErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(data: PasswordProps) {
    setLoading(true);
    try {
      if (editingId) {
        const res = await updateUserPassword(editingId, data);
        if (res?.status === 403) {
          setPassErr(res?.error as string);
          setLoading(false);
          return;
        }
        if (res?.status === 200) {
          setLoading(false);
          toast.success("Password Updated Successfully!");
          reset();
          await signOut();
          router.push("/login");
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("Network Error:", error);
      toast.error("Its seems something is wrong, try again");
    }
  }

  return (
    <form className="" onSubmit={handleSubmit(onSubmit)}>
      <h2 className="">Change Password</h2>
      <div className="grid grid-cols-12 gap-6 py-8">
        <div className="lg:col-span-8 col-span-full space-y-3">
          <Card>
            <CardContent>
              <div className="grid gap-6 pt-6">
                <div className="space-y-4">
                  <TextInput
                    register={register}
                    errors={errors}
                    label="Old Password"
                    name="oldPassword"
                    icon={LockOpen}
                    placeholder="Old Password"
                  />
                  <PasswordInput
                    register={register}
                    errors={errors}
                    label="Password"
                    name="newPassword"
                    icon={Lock}
                    placeholder="password"
                  />
                  {passErr && <p className="text-red-500 text-xs">{passErr}</p>}
                </div>
              </div>
              <FormFooter
                href="/change-password"
                editingId={editingId}
                loading={loading}
                title="Password"
                parent=""
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
