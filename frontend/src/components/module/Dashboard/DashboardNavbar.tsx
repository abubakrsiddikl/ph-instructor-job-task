

import { getUserProfile } from "@/services/auth/auth.api";
import DashboardNavbarContent from "./DashboardNavbarContent";
import { getDefaultDashboardRoute } from "@/utils/auth-utils";
import { getNavItemsByRole } from "@/lib//navItem.config";
import { redirect } from "next/navigation";


const DashboardNavbar = async () => {
  const userInfo = await getUserProfile();
  if (!userInfo) redirect("/login");
  const navItems = getNavItemsByRole(userInfo.role);
  const dashboardHome = getDefaultDashboardRoute(userInfo.role);

  return (
    <DashboardNavbarContent
      userInfo={userInfo}
      navItems={navItems}
      dashboardHome={dashboardHome}
    />
  );
};

export default DashboardNavbar;
