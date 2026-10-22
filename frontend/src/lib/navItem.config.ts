import { TRole } from "@/types/auth.type";
import { NavSection } from "@/types/dashboard.type";
import { getDefaultDashboardRoute } from "@/utils/auth-utils";

// ─── Common nav (all roles) ──────────────────────────────────
export const getCommonNavItems = (role: TRole): NavSection[] => {
  const defaultDashboard = getDefaultDashboardRoute(role);

  return [
    {
      title: "General",
      items: [
        {
          title: "Dashboard",
          href: defaultDashboard as string,
          icon: "LayoutDashboard",
          roles: ["MENTOR", "STUDENT"],
        },
        {
          title: "My Profile",
          href: "/my-profile",
          icon: "UserCircle",
          roles: ["MENTOR", "STUDENT"],
        },
        {
          title: "Home",
          href: "/",
          icon: "Home",
          roles: ["MENTOR", "STUDENT"],
        },
      ],
    },
  ];
};

// ─── Student nav ────────────────────────────────────────────────
export const studentNavItems: NavSection[] = [
  // {
  //   items: [
  //     {
  //       title: "Add Project",
  //       href: "/student/dashboard/add-project",
  //       icon: "PlusCircle",
  //       roles: ["STUDENT"],
  //     },
  //   ],
  // },
];

// ─── Mentor nav ───────────────────────────────────────────────
export const mentorNavItems: NavSection[] = [
  // {
  //   title: "Management",
  //   items: [
  //     {
  //       title: "All Projects",
  //       href: "/mentor/dashboard/projects",
  //       icon: "Users",
  //       roles: ["MENTOR"],
  //     },
  //   ],
  // },
];

// ─── Role-based nav resolver ─────────────────────────────────
export const getNavItemsByRole = (role: TRole): NavSection[] => {
  const commonNavItems = getCommonNavItems(role);

  switch (role) {
    case "MENTOR":
      return [...commonNavItems, ...mentorNavItems];
    case "STUDENT":
      return [...commonNavItems, ...studentNavItems];
    default:
      return [];
  }
};
