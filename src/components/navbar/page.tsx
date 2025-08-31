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
  const isHomePage = pathname === "/";

  return (
    <nav
      className={`w-full z-10 lg:py-4 font-poppins transition-colors duration-200 ${
        isHomePage ? "bg-black" : "text-black shadow-sm"
      }`}
    >
      <div className="max-width-wrapper flex justify-between items-center">
        <Link href={"/"}>
          <Image
            src="/assets/svgs/logo.svg"
            width={100}
            height={80}
            alt="Hostella"
          />
        </Link>

        {/* nav links */}
        <div className="hidden items-center gap-4 text-sm md:flex">
          {navLinks.map((navLink, index) => {
            const isActive =
              pathname === navLink.link ||
              pathname.startsWith(navLink.link + "/");

            return (
              <Link
                key={index}
                href={navLink.link}
                className={`link transition-colors ${
                  isActive
                    ? "text-yellow-500 underline underline-offset-4"
                    : isHomePage
                    ? "text-white hover:text-yellow-500"
                    : "text-black hover:text-yellow-500"
                }`}
              >
                {navLink.text}
              </Link>
            );
          })}
        </div>

        {/* nav buttons */}
        <div className="hidden items-center gap-2 sm:flex">
          <Link href={"/signup"}>
            <Button
              variant={"outline"}
              className={`rounded-full h-12 w-44 cursor-pointer hover:text-white 
                  bg-[#003E23] border-none text-white hover:bg-[#2e4b3e]
              `}
            >
              Contact Us
            </Button>
          </Link>
        </div>

        {/* mobile menu */}
        <Sheet>
          <SheetTrigger className="sm:hidden border p-2 rounded-md">
            <MenuIcon className={`w-6 h-6 `} />
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

              <div className="flex flex-col items-start gap-4 pt-16">
                {navLinks.map((navLink, index) => {
                  const isActive =
                    pathname === navLink.link ||
                    pathname.startsWith(navLink.link + "/");

                  return (
                    <SheetClose asChild key={index}>
                      <Link
                        className={`text-2xl w-full text-left font-poppins font-medium tracking-tighter transition-colors ${
                          isActive
                            ? "text-yellow-500 underline"
                            : "hover:text-primary"
                        }`}
                        href={navLink.link}
                      >
                        {navLink.text}
                      </Link>
                    </SheetClose>
                  );
                })}

                <Link href={"/signup"}>
                  <Button
                    variant={"outline"}
                    className={`rounded-full mt-50 h-12 w-44 cursor-pointer hover:text-white 
                  bg-[#003E23] border-none text-white hover:bg-[#2e4b3e]
              `}
                  >
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
