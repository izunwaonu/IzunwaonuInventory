import DataTable from "@/components/DataTableComponents/DataTable";
import TableHeader from "@/components/dashboard/Tables/TableHeader";
import { columns } from "./columns";
import { getAllUsers } from "@/actions/users";
import ModalTableHeader from "@/components/dashboard/Tables/ModalTableHeader";
import { UserInvitationForm } from "@/components/Forms/users/UserInvitationForm.";
import { getAuthenticatedUser } from "@/config/useAuth";
import { getRoles } from "@/actions/roles";

export default async function page() {
  const users = (await getAllUsers()) || [];
  const user = await getAuthenticatedUser();
  const res = await getRoles();
  const rolesData = res.data || [];
  const roles = rolesData.map((role) => ({ 
    label: role.displayName, 
    value: role.id
  }))
  const orgId = user.orgId;
  const orgName = user?.orgName??"";
  return (
    <div className="p-8">
      <ModalTableHeader
        title="Users"
        linkTitle="Add User"
        href="/dashboard/users/new"
        data={users}
        model="user"
        modalForm={<UserInvitationForm roles={roles} orgId={orgId} orgName={orgName}/>}
      />
      {/* <CustomDataTable categories={categories} /> */}
      <DataTable columns={columns} data={users} />
    </div>
  );
}
