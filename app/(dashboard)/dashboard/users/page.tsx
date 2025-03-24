import DataTable from "@/components/DataTableComponents/DataTable";
import TableHeader from "@/components/dashboard/Tables/TableHeader";
import { columns } from "./columns";
import { getAllUsers, getOrgInvites, getOrgUsers } from "@/actions/users";
import ModalTableHeader from "@/components/dashboard/Tables/ModalTableHeader";
import { UserInvitationForm } from "@/components/Forms/users/UserInvitationForm.";
import { getAuthenticatedUser } from "@/config/useAuth";
import { getRoles } from "@/actions/roles";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InviteTable from "@/components/dashboard/Tables/InvitesTables";

export default async function page() {
  
  const user = await getAuthenticatedUser();
  const res = await getRoles();
  const rolesData = res.data || [];
  const roles = rolesData.map((role) => ({ 
    label: role.displayName, 
    value: role.id
  }))
  const orgId = user.orgId;
  const orgName = user?.orgName??"";
  const users = (await getOrgUsers(orgId)) || [];
  const invites = (await getOrgInvites(orgId)) || [];
  return (
   
    <div className="p-8">
          <Tabs defaultValue="users" className="space-y-8">
            <TabsList className="inline-flex h-auto w-full justify-start gap-4 rounded-none border-b bg-transparent p-0 flex-wrap">
              {["users", "invites"].map((feature) => {
                return (
                  <TabsTrigger
                    key={feature}
                    value={feature}
                    className="inline-flex items-center gap-2 border-b-2 border-transparent px-8 pb-3 pt-2 data-[state=active]:border-primary capitalize"
                  >
                    {feature.split("-").join(" ")}
                  </TabsTrigger>
                );
              })}
            </TabsList>
            <TabsContent value="users" className="space-y-8">
            <ModalTableHeader
                title="Users"
                linkTitle="Add User"
                href="/dashboard/users/new"
                data={users}
                model="user"
                modalForm={<UserInvitationForm roles={roles} orgId={orgId} orgName={orgName}/>}
              />
              <DataTable columns={columns} data={users} />
            </TabsContent>
            <TabsContent value="invites" className="space-y-8">
              <div className="max-w-2xl py-6">
                <InviteTable data={invites}/>
              </div>
            </TabsContent>
          </Tabs>
        </div>
    
  );
}
