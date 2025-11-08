"use client";

import Link from "next/link";
import { Home, Settings, LogOut, X } from "lucide-react";
import React from "react";
import { usePathname } from "next/navigation";

interface SideNavProps {
  closeMenu: () => void;
}

export default function SideNav({ closeMenu }: SideNavProps) {
  const pathname = usePathname();

  const navItems = [
    { title: "Home", icon: Home, url: "/dashboard/home" },
    { title: "Settings", icon: Settings, url: "/dashboard/settings" },
  ];

  return (
    <div className="flex h-full flex-col px-4 py-3 bg-white">
      {/* Mobile header with close button */}
      <div className="flex items-center justify-between mb-6 md:hidden">
        <h2 className="text-lg font-bold text-gray-800">Dashboard</h2>
        <button onClick={closeMenu} className="p-2 rounded-md hover:bg-gray-100">
          <X className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col flex-grow gap-1">
        {navItems.map(({ title, icon: Icon, url }) => {
          const isActive = pathname === url;
          return (
            <Link
              key={title}
              href={url}
              className={`flex items-center gap-3 rounded-md p-3 text-sm font-medium transition-all ${
                isActive
                  ? "bg-gray-100 text-emerald-700"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-5 h-5" />
              {title}
            </Link>
          );
        })}
      </div>

      {/* Sign Out */}
      <button className="flex items-center gap-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md p-3 transition-all">
        <LogOut className="w-5 h-5" />
        Sign Out
      </button>
    </div>
  );
}
