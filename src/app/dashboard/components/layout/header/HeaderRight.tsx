"use client";

import { MessageCircle, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import UserDropdown from "./UserDropdown";
import { useNotificationsStore } from "@/store/useNotificationsStore";
import { useBookingStore } from "@/store/useBookingStore";
import { useEffect } from "react";

export default function HeaderRight() {
  const unreadCount = useNotificationsStore((state) => state.unreadCount);
  const bookings = useBookingStore((state) => state.bookings);
  const fetchUserBookings = useBookingStore((state) => state.fetchUserBookings);

  // Check if there are any unread notifications
  const hasUnread = unreadCount > 0;

  // Check if user is a member (has a room_allocated booking)
  const isMember = bookings.some((booking) => {
    const normalizedStatus = booking.status.toLowerCase().replace(/_/g, ' ');
    return normalizedStatus === 'room allocated' || normalizedStatus === 'room_allocated' || normalizedStatus === 'completed';
  });

  // Fetch bookings on mount to check membership status
  useEffect(() => {
    if (bookings.length === 0) {
      fetchUserBookings();
    }
  }, [bookings.length, fetchUserBookings]);

  return (
    <div className="flex items-center gap-4">
      {/* Chats - Only show if user is a member */}
      {isMember && (
        <Link href="/dashboard/chats" aria-label="Chats">
          <Button variant="ghost" size="icon" className="cursor-pointer">
            <MessageCircle className="h-5 w-5 text-gray-600" />
          </Button>
        </Link>
      )}

      {/* Notifications */}
      <Link href="/dashboard/notifications" aria-label="Notifications">
        <Button variant="ghost" size="icon" className="cursor-pointer relative">
          <Bell className="h-5 w-5 text-gray-600" />

          {/* Badge for unread notifications */}
          {hasUnread && (
            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center px-1 rounded-full bg-red-500 text-white text-[10px] font-semibold animate-pulse">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Button>
      </Link>

      <UserDropdown />
    </div>
  );
}
