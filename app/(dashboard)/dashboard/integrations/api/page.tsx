import { getOrgApiKeys } from "@/actions/apiKey";
import { ApiKeyManagement } from "@/components/dashboard/api-key-management";
import { getAuthenticatedUser } from "@/config/useAuth";


export default async function Home() {
  const user = await getAuthenticatedUser();
  const apiKeys = await getOrgApiKeys(user.orgId)
  return (
    <main className="container mx-auto py-10 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">API Key Management</h1>
      <ApiKeyManagement orgKeys={apiKeys}/>
    </main>
  )
}
