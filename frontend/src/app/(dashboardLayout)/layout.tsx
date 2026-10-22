import DashboardNavbarContent from "@/components/module/Dashboard/DashboardNavbarContent";
import DashboardSidebarContent from "@/components/module/Dashboard/DashboardSidebarContent";
import { getNavItemsByRole } from "@/lib/navItem.config";
import { getUserProfile } from "@/services/auth/auth.api";
import { getDefaultDashboardRoute } from "@/utils/auth-utils";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import React from "react";

const CommonDashboardLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <Suspense fallback={<div className="grid h-screen place-items-center text-sm text-muted-foreground">Loading dashboard...</div>}>
      <DashboardShell>{children}</DashboardShell>
    </Suspense>
  );
};

async function DashboardShell({ children }: { children: React.ReactNode }) {
  const userInfo = await getUserProfile();
  if (!userInfo) redirect("/login");

  const navItems = getNavItemsByRole(userInfo.role);
  const dashboardHome = getDefaultDashboardRoute(userInfo.role) as string;

  return (
    <div className="flex h-screen overflow-hidden">
      <DashboardSidebarContent
        userInfo={userInfo}
        navItems={navItems}
        dashboardHome={dashboardHome}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardNavbarContent
          userInfo={userInfo}
          navItems={navItems}
          dashboardHome={dashboardHome}
        />

        <main className="flex-1 overflow-y-auto bg-muted/10 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default CommonDashboardLayout;