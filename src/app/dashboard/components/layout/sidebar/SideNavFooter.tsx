"use client";

import React from "react";
import { LogOut } from "lucide-react";

export default function SideNavFooter() {
  return (
    <button className="flex items-center mb-4 mx-4 gap-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md p-3 transition-all">
      <LogOut className="w-5 h-5" />
      Sign Out
    </button>
  );
}
