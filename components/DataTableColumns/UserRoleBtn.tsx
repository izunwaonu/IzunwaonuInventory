"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import toast from "react-hot-toast";
import { Options } from "react-tailwindcss-select/dist/components/type";
import FormSelectInput from "../FormInputs/FormSelectInput";
import SubmitButton from "../FormInputs/SubmitButton";
import { UserWithRoles, RoleOption } from "@/types/types";
import { getRoles, updateUserRole } from "@/actions/roles";

interface UserRoleBtnProps {
  user: UserWithRoles;
}

export default function UserRoleBtn({ user }: UserRoleBtnProps) {
  const [roles, setRoles] = useState<Options>([]);
  const [loading, setLoading] = useState(false);

  // Get current role from user's roles array
  const currentRole = user.roles[0]; // Assuming user has at least one role

  const [selectedRole, setSelectedRole] = useState<RoleOption>({
    label: currentRole?.displayName || "No Role",
    value: currentRole?.id || "",
  });

  useEffect(() => {
    async function fetchRoles() {
      try {
        const { data: rolesData } = await getRoles();
        if (rolesData) {
          const dataOptions = rolesData.map((role) => ({
            label: role.displayName,
            value: role.id,
          }));
          setRoles(dataOptions);
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
        toast.error("Failed to load roles");
      }
    }
    fetchRoles();
  }, []);

  async function handleChangeStatus(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await updateUserRole(user.id, selectedRole.value);

      if (res.error) {
        throw new Error(res.error);
      }

      toast.success("Role Updated Successfully");
      // Optionally close dialog or refresh data
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update role"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="dark:text-slate-800 py-1.5 px-3 bg-green-200 rounded-full hover:bg-green-300 transition-colors">
          {selectedRole.label}
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <h2 className="scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
              Change User Role
            </h2>
          </DialogTitle>
          <DialogDescription>
            <form className="space-y-4" onSubmit={handleChangeStatus}>
              <FormSelectInput
                label="User Role"
                options={roles}
                option={selectedRole}
                setOption={setSelectedRole}
              />
              <DialogFooter>
                <SubmitButton
                  title="Update Role"
                  loadingTitle="Updating role..."
                  loading={loading}
                  buttonIcon={Pencil}
                />
              </DialogFooter>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
