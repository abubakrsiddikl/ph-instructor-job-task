"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { User, LogOut, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { IUser } from "@/types/auth.type";
import { logoutUser } from "@/services/auth/auth.api";
import { getDefaultDashboardRoute } from "@/utils/auth-utils";

interface UserDropdownProps {
  userInfo: IUser;
}

const UserDropdown = ({ userInfo }: UserDropdownProps) => {
  const handleLogout = async () => {
    await logoutUser();
  };

  const dashboardRoute = getDefaultDashboardRoute(userInfo.role);

  return (
    <div className="flex items-center gap-1">
      {/* User avatar dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            aria-label={`Open ${userInfo.name}'s account menu`}
            className="h-9 w-9 rounded-full border-2 border-primary/20 transition-colors hover:border-primary/50"
          >
            <span className="text-sm font-semibold text-primary">
              {userInfo.name.charAt(0).toUpperCase()}
            </span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          {/* User info */}
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {userInfo.name}
              </p>
              <p className="text-xs text-muted-foreground leading-none mt-1">
                {userInfo.email}
              </p>
              <span className="inline-flex w-fit mt-1.5 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary capitalize">
                {userInfo.role.toLowerCase()}
              </span>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {/* Dashboard */}
          <DropdownMenuItem asChild>
            <Link href={dashboardRoute as string} className="cursor-pointer">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </DropdownMenuItem>

          {/* Profile */}
          <DropdownMenuItem asChild>
            <Link href="/my-profile" className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              My Profile
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Logout */}
          <DropdownMenuItem
            onClick={handleLogout}
            className="cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-950/20"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default UserDropdown;
