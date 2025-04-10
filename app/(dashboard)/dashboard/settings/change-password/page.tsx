import { getUserById } from "@/actions/users";
import ChangePasswordForm from "@/components/Forms/ChangePasswordForm";
import { getAuthenticatedUser } from "@/config/useAuth";

export default async function ChangePass() {
  const user = await getAuthenticatedUser();
  const userDetails = await getUserById(user?.id ?? "");
  return (
    <div className="p-8">
      <ChangePasswordForm initialData={userDetails} editingId={user?.id} />
    </div>
  );
}
