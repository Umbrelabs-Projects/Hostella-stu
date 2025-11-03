import { LucideIcon } from "lucide-react";

export interface SidebarTab {
  title: string;
  url: string;
  icon: LucideIcon;
}

export interface socialIconLink {
  icon: LucideIcon;
  link: string;
}
export interface FooterLink {
  text: string;
  link: string;
}
export interface FooterSection {
  title: string;
  links?: FooterLink[];
  iconLink?: socialIconLink[];
}

export interface NavLink {
  link: string;
  text: string;
}
