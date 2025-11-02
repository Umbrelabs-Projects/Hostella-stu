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
import { images } from "@/lib/images";
import { navLinks } from "@/lib/constants";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 top-12 z-30 pointer-events-auto">
      <div className="mx-auto max-w-2xl relative">
        <div
          className="w-full bg-white/85 backdrop-blur-md border border-gray-100 rounded-r-3xl
                     shadow-sm flex items-center justify-between"
        >
          {/* LEFT: Logo */}
          <div className="flex pb-3 items-center gap-3 bg-black px-4 h-11">
            <Link href="/">
              <Image src={images.hostellaLogo} alt="hostellaLogo" />
            </Link>
          </div>

          {/* CENTER: Nav links (desktop only) */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            {navLinks.map((navLink, i) => {
              const isActive =
                pathname === navLink.link ||
                pathname.startsWith(navLink.link + "/");

              return (
                <Link
                  key={i}
                  href={navLink.link}
                  className={`transition-colors px-3 py-2 rounded-sm hover:text-white ease-in duration-200 ${
                    isActive
                      ? "bg-yellow-500 font-semibold text-white"
                      : "text-slate-700 hover:bg-yellow-500"
                  }`}
                >
                  {navLink.text}
                </Link>
              );
            })}
          </div>

          {/* RIGHT: Book Now (desktop only) */}
          <div className="hidden sm:flex items-center gap-3">
            <Link href="/book">
              <Button className="h-11 cursor-pointer px-4 rounded-full bg-yellow-400 text-black hover:bg-yellow-500 hover:text-white shadow-md">
                Book Now
              </Button>
            </Link>
          </div>

          {/* MOBILE MENU (bottom drawer) */}
          <div className="md:hidden flex items-center pr-3">
            <Sheet>
              <SheetTrigger className="p-2 rounded-md border border-gray-200 hover:bg-gray-100 transition">
                <MenuIcon className="w-5 h-5 text-gray-700" />
              </SheetTrigger>

              <SheetContent
                side="bottom"
                className="bg-white/95 backdrop-blur-md border-t border-gray-200 rounded-t-3xl shadow-2xl pt-6 pb-10 transition-all duration-300"
              >
                <SheetHeader>
                  <SheetTitle>
                    <div className="flex justify-center mb-3">
                      <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
                    </div>
                    <div className="flex justify-center">
                      <Link href="/" className="flex items-center">
                        <Image
                          src={images.hostellaLogo}
                          alt="hostellaLogo"
                          className="h-auto w-32"
                        />
                      </Link>
                    </div>
                  </SheetTitle>
                </SheetHeader>

                <div className="flex flex-col items-center gap-6 pt-8">
                  {navLinks.map((navLink, index) => {
                    const isActive =
                      pathname === navLink.link ||
                      pathname.startsWith(navLink.link + "/");

                    return (
                      <SheetClose asChild key={index}>
                        <Link
                          href={navLink.link}
                          className={`text-lg font-medium transition-colors ${
                            isActive
                              ? "text-yellow-500 underline"
                              : "text-gray-700 hover:text-yellow-500"
                          }`}
                        >
                          {navLink.text}
                        </Link>
                      </SheetClose>
                    );
                  })}

                  <SheetClose asChild>
                    <Link href="/book" className="w-full px-6">
                      <Button className="w-full rounded-full h-11 bg-yellow-400 text-black hover:bg-yellow-500 hover:text-white shadow-sm">
                        Book Now
                      </Button>
                    </Link>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
