import DataTable from "@/components/DataTableComponents/DataTable";
import TableHeader from "@/components/dashboard/Tables/TableHeader";
import React from "react";
import { columns } from "./columns";
import { getRoles } from "@/actions/roles";

export default async function page() {
  const res = await getRoles();
  const roles = res.data || [];
  return (
    <div>
      <TableHeader
        title="Roles"
        model="role"
        linkTitle="Add Role"
        href="/dashboard/users/roles/new"
        data={roles}
        showImport={false}
      />
      {/* <CustomDataTable categories={categories} /> */}
      <DataTable columns={columns} data={roles} />
    </div>
  );
}
