"use client";

import React from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { images } from "@/lib/images";
import Link from "next/link";

interface SideNavHeaderProps {
  closeMenu: () => void;
}

export default function SideNavHeader({ closeMenu }: SideNavHeaderProps) {
  return (
    <div>
      <Link href="/dashboard">
        <div className="bg-black h-[3.75rem] flex justify-around items-center pb-3">
          <Image src={images.hostellaLogo} alt="logo" />
        </div>
      </Link>
      <div className="flex items-center justify-between mb-6 md:hidden">
        <h2 className="text-lg font-bold text-gray-800">Dashboard</h2>
        <button
          onClick={closeMenu}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>
      </div>
    </div>
  );
}
