import { getOrgRoles } from "@/actions/roles";
import RoleForm from "@/components/Forms/RoleForm";
import { getAuthenticatedUser } from "@/config/useAuth";

export default async function page() {
  const user = await getAuthenticatedUser()
  const orgId = user.orgId;
  return <RoleForm orgId={orgId} />;
}
