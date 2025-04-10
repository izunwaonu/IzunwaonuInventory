import { getRoles } from "@/actions/roles";
import UserForm from "@/components/Forms/UserForm";
// import UserForm from "@/components/dashboard/Forms/UserForm";

export default async function page() {
  const res = await getRoles();
  const roles = res.data || [];

  return <UserForm roles={roles} />;
}
