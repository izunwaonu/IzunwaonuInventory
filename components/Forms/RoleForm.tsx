"use client";

import { Card, CardContent } from "@/components/ui/card";
import FormHeader from "./FormHeader";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { RoleFormData } from "@/types/types";
import toast from "react-hot-toast";
import { Role } from "@prisma/client";
import { permissions } from "@/config/permissions";
import FormFooter from "./FormFooter";
import TextInput from "../FormInputs/TextInput";
import { CustomCheckbox } from "../FormInputs/CustomCheckbox";
import { createRole, updateRole } from "@/actions/roles";

type RoleFormProps = {
  editingId?: string;
  initialData?: Role | null;
};

export default function RoleForm({ editingId, initialData }: RoleFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<RoleFormData>({
    defaultValues: {
      displayName: initialData?.displayName || "",
      description: initialData?.description || "",
      permissions: initialData?.permissions || [],
    },
  });

  async function saveRole(data: RoleFormData) {
    try {
      setLoading(true);
      const result = editingId
        ? await updateRole(editingId, data)
        : await createRole(data);

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success(
        editingId ? "Role updated successfully!" : "Role created successfully!"
      );
      router.push("/dashboard/users/roles");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  const handleModulePermissionChange = (
    moduleName: string,
    checked: boolean
  ) => {
    const currentPermissions = new Set(watch("permissions") || []);
    const modulePermissions = permissions.find(
      (p) => p.name === moduleName
    )?.permissions;
    if (!modulePermissions) return;
    Object.values(modulePermissions).forEach((permission) => {
      if (checked) {
        currentPermissions.add(permission);
      } else {
        currentPermissions.delete(permission);
      }
    });

    setValue("permissions", Array.from(currentPermissions));
  };

  return (
    <form onSubmit={handleSubmit(saveRole)} className="h-full">
      <FormHeader
        href="/roles"
        title="Role"
        parent="users"
        editingId={editingId}
        loading={loading}
      />

      <div className="max-w-4xl mx-auto space-y-6 py-8">
        {/* Basic Role Information */}
        <Card>
          <CardContent>
            <div className="grid gap-6">
              <div className="grid gap-3 pt-4 grid-cols-1 md:grid-cols-2">
                <TextInput
                  register={register}
                  errors={errors}
                  label="Role Name"
                  name="displayName"
                />
                <TextInput
                  register={register}
                  errors={errors}
                  label="Role Description"
                  name="description"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Permissions Section */}
        <Card>
          <CardContent>
            <h2 className="text-xl font-medium mt-6 mb-6">
              Select Permissions the User will have access
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {permissions.map((module) => (
                <div
                  key={module.name}
                  className="border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between ">
                      <span className="text-base font-medium">
                        {module.display}
                      </span>
                      <CustomCheckbox
                        onChange={(e) =>
                          handleModulePermissionChange(
                            module.name,
                            e.target.checked
                          )
                        }
                      />
                    </div>
                    <div className="ml-2">
                      {Object.entries(module.permissions).map(
                        ([action, permission]) => (
                          <div key={permission} className="flex items-center">
                            <CustomCheckbox
                              id={permission}
                              {...register(`permissions`)}
                              value={permission}
                              label={action}
                              defaultChecked={initialData?.permissions?.includes(
                                permission
                              )}
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <FormFooter
        href="/roles"
        editingId={editingId}
        loading={loading}
        title="Role"
        parent="users"
      />
    </form>
  );
}
