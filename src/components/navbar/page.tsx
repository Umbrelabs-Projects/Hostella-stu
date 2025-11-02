"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { images } from "@/lib/images";
import { navLinks } from "@/lib/constants";
import { AnimatePresence, motion } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed inset-x-0 top-12 z-30 pointer-events-auto">
      <div className="mx-2 md:mx-auto max-w-2xl relative">
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

          {/* CENTER: Desktop Nav */}
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
            <Link href="/signup">
              <Button className="h-11 cursor-pointer px-4 rounded-full bg-yellow-400 text-black hover:bg-yellow-500 hover:text-white shadow-md">
                Book Now
              </Button>
            </Link>
          </div>

          {/* MOBILE MENU (Foinda-style dropdown) */}
          <div className="sm:hidden relative pr-3" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 border rounded-md bg-white/80 backdrop-blur-md"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <MenuIcon className="w-6 h-6 text-gray-700" />
              )}
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="absolute right-0 mt-2 w-[24.5rem] bg-white shadow-lg rounded-lg border overflow-hidden z-50"
                >
                  <div className="flex flex-col">
                    {navLinks.map((navLink, index) => {
                      const isActive =
                        pathname === navLink.link ||
                        pathname.startsWith(navLink.link + "/");
                      return (
                        <Link
                          key={index}
                          href={navLink.link}
                          onClick={() => setIsOpen(false)}
                          className={`px-4 py-3 text-left text-sm transition-colors ${
                            isActive
                              ? "text-yellow-500 font-medium"
                              : "text-gray-700 hover:text-yellow-500"
                          }`}
                        >
                          {navLink.text}
                        </Link>
                      );
                    })}

                    <Button
                      onClick={() => {
                        setIsOpen(false);
                        const footer = document.getElementById("footer");
                        if (footer) {
                          footer.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                      className="mx-4 my-2 h-10 w-[9rem] text-white bg-yellow-500 hover:bg-yellow-600 border-none rounded-md"
                    >
                      Book Now
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </nav>
  );
}
