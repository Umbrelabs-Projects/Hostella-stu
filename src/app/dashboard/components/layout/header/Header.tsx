"use client";

import { Menu, MessageCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();

  const title =
    pathname
      .split("/")
      .pop()
      ?.replace(/^\w/, (c) => c.toUpperCase()) || "Dashboard";

  const dropdown = [
    { name: "View Profile", link: "/dashboard/profile" },
    { name: "Account Settings", link: "/dashboard/settings" },
    { name: "Logout", link: "/" },
  ];

  return (
    <div className="flex items-center justify-between border-b bg-white px-4 py-3 shadow-sm">
      {/* Left: Menu + Title */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      </div>

      {/* Right: Chat + Profile */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/chats" aria-label="Chats">
          <Button variant="ghost" size="icon" className="cursor-pointer">
            <MessageCircle className="h-5 w-5 text-gray-600" />
          </Button>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full cursor-pointer border border-gray-200"
              aria-label="User menu"
            >
              <User className="h-5 w-5 text-gray-700" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40">
            {dropdown.map((item) => {
              const isLogout = item.name === "Logout";

              // For Logout we force red text and a light red hover background.
              // Using `asChild` makes the Link the rendered element so hover styles apply reliably.
              return (
                <DropdownMenuItem
                  key={item.name}
                  asChild
                  className={isLogout ? "p-0" : "p-0"}
                >
                  {/* the Link is now the real interactive element; add classes here */}
                  <Link
                    href={item.link}
                    className={`block w-full px-3 py-2 text-sm cursor-pointer ${
                      isLogout
                        ? // keep text red and ensure bg changes on hover/focus/active
                          "text-sm text-red-600 hover:!text-red-600 hover:!bg-red-50 focus:!bg-red-50 active:!bg-red-100"
                        : // default item styling
                          "text-gray-700 hover:bg-gray-50 focus:bg-gray-100 active:bg-gray-100"
                    }`}
                  >
                    {item.name}
                  </Link>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
