import { getDashboardOverview } from '@/actions/analytics';
import DashboardMain from '@/components/dashboard/DashboardMain';
// import DashboardMain from "@/components/dashboard/DashboardMain";
import DefaultUserDashboard, { ISidebarLink } from '@/components/dashboard/DefaultUserDashboard';
import OverViewCard from '@/components/OverViewCard';
import { DashboardWelcome } from '@/components/WelcomeBanner';
import { sidebarLinks } from '@/config/sidebar';
import { getAuthenticatedUser } from '@/config/useAuth';
import { Layers } from 'lucide-react';
import { redirect } from 'next/navigation';
import { DashboardOverview } from './components/dashboard-overview';

export default async function Dashboard() {
  const analytics = (await getDashboardOverview()) || [];
  const user = await getAuthenticatedUser();
  const userPermissions = user.permissions;
  // const hasPermission = userPermissions.includes('dashboard.read');

  // Helper function to check if user has permission

  if (!userPermissions.includes('dashboard.read')) {
    return (
      <DefaultUserDashboard
        // navigationLinks={filteredLinks}
        user={user}
      />
    );
  }

  return (
    // <main>
    //   <div className="space-y-6">
    //     {/* <div className="space-y-1 mb-4">
    //       <h2 className="text-2xl font-semibold tracking-tight">
    //        Org Name: {user?.orgName??""}
    //       </h2>
    //       <p className="text-sm text-muted-foreground">
    //         Org ID: {user?.orgId??""}
    //       </p>
    //     </div> */}

    //     {/* <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
    //       {analytics.map((item, i) => (
    //         <OverViewCard item={item} key={i} />
    //       ))}
    //     </div> */}
    //   </div>
    //   <DashboardMain />
    // </main>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <DashboardOverview />
    </div>
  );
}
