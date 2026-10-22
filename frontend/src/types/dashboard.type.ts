import { TRole } from "./auth.type";


export interface NavItem {
  title: string;
  href: string;
  icon: string; 
  badge?: string | number;
  description?: string;
  roles: TRole[];
}

export interface NavSection {
  title?: string;
  items: NavItem[];
}