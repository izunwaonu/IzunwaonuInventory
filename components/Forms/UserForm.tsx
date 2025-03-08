"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import FormHeader from "./FormHeader";
import { useRouter } from "next/navigation";
import Select from "react-tailwindcss-select";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { UserProps } from "@/types/types";

import toast from "react-hot-toast";
import {
  Options,
  SelectValue,
} from "react-tailwindcss-select/dist/components/type";
import { Role, User } from "@prisma/client";
import FormFooter from "./FormFooter";
import { createUser } from "@/actions/users";
import { Lock } from "lucide-react";
import PasswordInput from "../FormInputs/PasswordInput";
import TextInput from "../FormInputs/TextInput";
import FormSelectInput from "../FormInputs/FormSelectInput";
import ImageInput from "../FormInputs/ImageInput";
type UserFormProps = {
  editingId?: string | undefined;
  initialData?: User | undefined | null;
  roles: Role[];
};
export default function UserForm({
  editingId,
  initialData,
  roles,
}: UserFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserProps>({
    defaultValues: {
      firstName: initialData?.firstName,
      lastName: initialData?.lastName,
      phone: initialData?.phone,
      email: initialData?.email,
    },
  });
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const initialImage = initialData?.image || "/placeholder.svg";
  const [imageUrl, setImageUrl] = useState(initialImage);
  const initialStatus = {
    value: initialData?.status == true ? "true" : "false",
    label: initialData?.status == true ? "Active" : "Disabled",
  };
  const initialRoleId = initialData?.roleId;
  const initialRole = roles.find((item) => item.id === initialRoleId);
  const roleOptions = roles.map((role) => {
    return {
      label: role.displayName,
      value: role.id,
    };
  });
  const [role, setRole] = useState<any>({
    label: initialRole?.displayName,
    value: initialRole?.id,
  });
  const [status, setStatus] = useState<any>(initialStatus);
  const options: Options = [
    { value: "true", label: "Active" },
    { value: "false", label: "Disabled" },
  ];
  const handleChange = (item: SelectValue) => {
    console.log("value:", item);
    setStatus(item);
  };
  async function saveUser(data: UserProps) {
    try {
      setLoading(true);
      data.image = imageUrl;
      data.name = `${data.firstName} ${data.lastName}`;
      console.log(data);
      if (editingId) {
        // await updateUserById(editingId, data);
        setLoading(false);
        // Toast
        toast.success("Updated Successfully!");
        //reset
        reset();
        //route
        router.push("/dashboard/users");
      } else {
        await createUser(data);
        setLoading(false);
        // Toast
        toast.success("Successfully Created!");
        //reset
        reset();
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  return (
    <form className="" onSubmit={handleSubmit(saveUser)}>
      <FormHeader
        href="/users"
        title="User"
        editingId={editingId}
        loading={loading}
        parent=""
      />
      <div className="grid grid-cols-12 gap-6 py-8">
        <div className="lg:col-span-8 col-span-full space-y-6">
          <Card>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid pt-4 grid-cols-1 md:grid-cols-2 gap-3">
                  <TextInput
                    register={register}
                    errors={errors}
                    label="First Name"
                    name="firstName"
                  />
                  <TextInput
                    register={register}
                    errors={errors}
                    label="Last Name"
                    name="lastName"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <TextInput
                    register={register}
                    errors={errors}
                    label="Email Address"
                    name="email"
                  />
                  <TextInput
                    register={register}
                    errors={errors}
                    label="Phone Number"
                    name="phone"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
                {!editingId && (
                  <PasswordInput
                    register={register}
                    errors={errors}
                    label="Password"
                    name="password"
                    icon={Lock}
                    placeholder="password"
                  />
                )}
                <FormSelectInput
                  label="Roles"
                  options={roleOptions}
                  option={role}
                  setOption={setRole}
                  href="/dashboard/users/roles/new"
                  toolTipText="Create new Role"
                />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-4 col-span-full ">
          <div className="grid auto-rows-max items-start gap-4 ">
            <Card>
              <CardHeader>
                <CardTitle>User Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  <Select
                    isSearchable
                    primaryColor="blue"
                    value={status}
                    onChange={handleChange}
                    options={options}
                    placeholder="Status"
                  />
                </div>
              </CardContent>
            </Card>
            <ImageInput
              title="Profile Image"
              imageUrl={imageUrl}
              setImageUrl={setImageUrl}
              endpoint="warehouseLogo"
            />
          </div>
        </div>
      </div>
      <FormFooter
        href="/users"
        editingId={editingId}
        loading={loading}
        title="User"
        parent=""
      />
    </form>
  );
}
