"use client";
import Navbar from "@/components/navbar/page";
import { images } from "@/lib/images";
import { usePathname } from "next/navigation";
import React from "react";
import { useUIStore } from "@/store/useUIStore";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { showNavbar, hydrated } = useUIStore();

  const isAuthPage = pathname.startsWith("/signup") || pathname === "/login";

  // Wait until store rehydrates before rendering anything
  if (!hydrated) return null; // prevents flicker ⚡

  return (
    <>
      {showNavbar && isAuthPage && <Navbar />}
      <div className="flex flex-col md:flex-row md:h-screen">
        <div
          className="md:w-1/2 bg-cover bg-center h-[20rem] md:h-screen"
          style={{ backgroundImage: `url(${images.room2.src})` }}
        ></div>

        <div className="absolute md:relative rounded-t-2xl md:rounded-none w-full mt-[12rem] md:my-8 md:w-1/2 flex items-center justify-center bg-white">
          {children}
        </div>
      </div>
    </>
  );
}
