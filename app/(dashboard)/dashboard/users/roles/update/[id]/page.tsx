import React from "react";
// import { getRoleById } from "@/actions/roles";
import RoleForm from "@/components/Forms/RoleForm";
import { getRoleById } from "@/actions/roles";
import NotFound from "@/app/not-found";

export default async function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  const { data } = await getRoleById(id);
  if (!id || !data) {
    return NotFound();
  }
  return <RoleForm editingId={id} initialData={data} />;
}
