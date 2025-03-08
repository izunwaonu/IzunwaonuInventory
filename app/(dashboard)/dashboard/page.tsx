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
      {/* <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">
            Financial Overview {new Date().getFullYear()}
          </h2>
          <p className="text-sm text-muted-foreground">
            Track your savings and transactions
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          {analytics.map((item, i) => (
            <OverViewCard item={item} key={i} />
          ))}
        </div>
      </div> */}
      <DashboardMain />
    </main>
  );
}
