import React from "react";
import { getUserById } from "@/actions/users";
import { getRoles } from "@/actions/roles";
import UserForm from "@/components/Forms/UserForm";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const user = await getUserById(id);
  const roles = (await getRoles()) || [];
  return (
    <UserForm roles={roles.data ?? []} editingId={id} initialData={user} />
  );
}
