import DataTable from '@/components/DataTableComponents/DataTable';
import TableHeader from '@/components/dashboard/Tables/TableHeader';
import React from 'react';
import { columns } from './columns';
import { getOrgRoles, getRoles } from '@/actions/roles';
import { getAuthenticatedUser } from '@/config/useAuth';

export default async function page() {
  const user = await getAuthenticatedUser();
  const res = await getOrgRoles(user.orgId);
  const roles = res.data || [];
  return (
    <div>
      <TableHeader
        title="Roles"
        model="role"
        linkTitle="Add Role"
        href="/dashboard/settings/roles/new"
        data={roles}
        showImport={false}
      />
      {/* <CustomDataTable categories={categories} /> */}
      <DataTable columns={columns} data={roles} />
    </div>
  );
}
