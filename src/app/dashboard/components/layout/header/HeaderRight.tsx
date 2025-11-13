"use client";

import { MessageCircle, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import UserDropdown from "./UserDropdown";

export default function HeaderRight() {
  return (
    <div className="flex items-center gap-4">
      {/* Chats */}
      <Link href="/dashboard/chats" aria-label="Chats">
        <Button variant="ghost" size="icon" className="cursor-pointer">
          <MessageCircle className="h-5 w-5 text-gray-600" />
        </Button>
      </Link>

      {/* Notifications */}
      <Link href="/dashboard/notifications" aria-label="Notifications">
        <Button variant="ghost" size="icon" className="cursor-pointer relative">
          <Bell className="h-5 w-5 text-gray-600" />
        </Button>
      </Link>

      <UserDropdown />
    </div>
  );
}
