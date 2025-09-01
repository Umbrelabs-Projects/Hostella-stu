"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navLinks } from "@/lib/constants";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="w-full z-10 bg-white/80 backdrop-blur-md border-b border-lime-100 font-poppins">
      <div className="max-width-wrapper  flex justify-between items-center py-4">
        <Link href={"/"}>
          <Image
            src="/assets/svgs/logo.svg"
            width={100}
            height={80}
            alt="Hostella"
          />
        </Link>

        {/* nav links */}
        <div className="hidden items-center gap-6 text-sm md:flex">
          {navLinks.map((navLink, index) => {
            const isActive =
              pathname === navLink.link ||
              pathname.startsWith(navLink.link + "/");

            return (
              <Link
                key={index}
                href={navLink.link}
                className={`transition-colors ${
                  isActive
                    ? "text-lime-600 font-semibold underline underline-offset-4"
                    : "text-slate-700 hover:text-lime-600"
                }`}
              >
                {navLink.text}
              </Link>
            );
          })}
        </div>

        {/* nav button */}
        <div className="hidden items-center gap-2 sm:flex mr-6">
          <Link href={"/signup"}>
            <Button className="rounded-full cursor-pointer h-11 px-6 bg-lime-500 text-white hover:bg-lime-600 shadow-md hover:shadow-lg">
              Get Started
            </Button>
          </Link>
        </div>

        {/* mobile menu */}
        <Sheet>
          <SheetTrigger className="sm:hidden border p-2 rounded-md border-lime-200">
            <MenuIcon className="w-6 h-6 text-lime-600" />
          </SheetTrigger>
          <SheetContent side="left" className="pl-7">
            <SheetHeader>
              <SheetTitle className="font-poppins text-sm text-left">
                <Image
                  src="/assets/svgs/logo.svg"
                  width={80}
                  height={70}
                  alt="Hostella"
                />
              </SheetTitle>

              <div className="flex flex-col items-start gap-6 pt-12">
                {navLinks.map((navLink, index) => {
                  const isActive =
                    pathname === navLink.link ||
                    pathname.startsWith(navLink.link + "/");

                  return (
                    <SheetClose asChild key={index}>
                      <Link
                        className={`text-xl w-full text-left font-medium tracking-tight transition-colors ${
                          isActive
                            ? "text-lime-600 underline"
                            : "text-slate-700 hover:text-lime-600"
                        }`}
                        href={navLink.link}
                      >
                        {navLink.text}
                      </Link>
                    </SheetClose>
                  );
                })}

                <Link href={"/signup"}>
                  <Button className="rounded-full cursor-pointer h-11 px-6 bg-lime-500 text-white hover:bg-lime-600 shadow-md hover:shadow-lg">
                    Get Started
                  </Button>
                </Link>
              </div>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
