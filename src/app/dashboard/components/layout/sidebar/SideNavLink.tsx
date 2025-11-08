"use client";

import React from "react";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface SideNavLinkProps {
  title: string;
  icon: LucideIcon;
  url: string;
  isActive: boolean;
}

export default function SideNavLink({
  title,
  icon: Icon,
  url,
  isActive,
}: SideNavLinkProps) {
  return (
    <Link
      href={url}
      className={`flex items-center gap-3 mx-4 rounded-md p-3 text-sm font-medium transition-all ${
        isActive
          ? "bg-yellow-50 text-yellow-500"
          : "text-gray-600 hover:bg-gray-50"
      }`}
    >
      <Icon className="w-5 h-5" />
      {title}
    </Link>
  );
}
