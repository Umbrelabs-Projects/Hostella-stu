"use client";

import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

const dropdownItems = [
  { name: "Account Settings", link: "/dashboard/settings" },
  { name: "Sign Out", link: null, isLogout: true },
];

export default function UserDropdown() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut, user } = useAuthStore();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      // Still redirect even if logout API call fails
      router.push("/login");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full cursor-pointer border border-gray-200 overflow-hidden p-0 w-10 h-10"
          aria-label="User menu"
        >
          {user?.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatar}
              alt={`${user.firstName || 'User'} ${user.lastName || ''}`}
              className="w-full h-full object-cover rounded-full"
              onError={(e) => {
                console.error("UserDropdown: Avatar failed to load", user.avatar);
                // The error will be caught and we can handle it if needed
              }}
              onLoad={() => {
                console.log("UserDropdown: Avatar loaded successfully", user.avatar);
              }}
            />
          ) : (
            <User className="h-5 w-5 text-gray-700" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        {dropdownItems.map((item) => {
          const isLogout = item.isLogout || false;
          const isActive = pathname === item.link;

          if (isLogout) {
            return (
              <DropdownMenuItem
                key={item.name}
                onClick={handleSignOut}
                className={`px-3 py-2 text-sm cursor-pointer
                  text-red-600 hover:!text-red-600 hover:!bg-red-50 focus:!bg-red-50 active:!bg-red-100
                `}
              >
                {item.name}
              </DropdownMenuItem>
            );
          }

          return (
            <DropdownMenuItem key={item.name} asChild className="p-0">
              <Link
                href={item.link!}
                className={`block w-full px-3 py-2 text-sm cursor-pointer
                  text-gray-700 hover:bg-gray-50 focus:bg-gray-100 active:bg-gray-100
                  ${
                    isActive
                      ? "bg-gray-200 text-black font-medium"
                      : ""
                  }
                `}
              >
                {item.name}
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
