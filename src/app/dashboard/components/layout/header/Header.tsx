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

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();

  // Dynamically generate a readable title from pathname (e.g., /dashboard/settings → "Settings")
  const title =
    pathname.split("/").pop()?.replace(/^\w/, (c) => c.toUpperCase()) ||
    "Dashboard";

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
        <Button variant="ghost" size="icon" aria-label="Chat">
          <MessageCircle className="h-5 w-5 text-gray-600" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full border border-gray-200"
              aria-label="User menu"
            >
              <User className="h-5 w-5 text-gray-700" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem>View Profile</DropdownMenuItem>
            <DropdownMenuItem>Account Settings</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
