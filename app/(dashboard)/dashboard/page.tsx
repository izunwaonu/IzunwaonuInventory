import { getDashboardOverview } from "@/actions/analytics";
import { getAllSavings } from "@/actions/savings";
import DashboardMain from "@/components/dashboard/DashboardMain";
import OverViewCard from "@/components/OverViewCard";
import { DashboardWelcome } from "@/components/WelcomeBanner";
import { getAuthenticatedUser } from "@/config/useAuth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const analytics = (await getDashboardOverview()) || [];
  const user = await getAuthenticatedUser();
  return (
    <main>
      <div className="space-y-6">
        <div className="space-y-1 mb-4">
          <h2 className="text-2xl font-semibold tracking-tight">
           Org Name: {user?.orgName??""}
          </h2>
          <p className="text-sm text-muted-foreground">
            Org ID: {user?.orgId??""}
          </p>
        </div>

        {/* <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          {analytics.map((item, i) => (
            <OverViewCard item={item} key={i} />
          ))}
        </div> */}
      </div>
      <DashboardMain />
    </main>
  );
}
