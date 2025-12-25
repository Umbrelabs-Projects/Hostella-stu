"use client";

import { MessageCircle, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import UserDropdown from "./UserDropdown";
import { useNotificationsStore } from "@/store/useNotificationsStore";
import { useBookingStore } from "@/store/useBookingStore";
import { useEffect, useState, useRef } from "react";
import NotificationDropdown from "@/app/dashboard/notifications/components/NotificationDropdown";

export default function HeaderRight() {
  const unreadCount = useNotificationsStore((state) => state.unreadCount);
  const fetchNotifications = useNotificationsStore((state) => state.fetchNotifications);
  const bookings = useBookingStore((state) => state.bookings);
  const fetchUserBookings = useBookingStore((state) => state.fetchUserBookings);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const notificationButtonRef = useRef<HTMLButtonElement>(null);

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

  // Real-time polling: Fetch notifications every 30 seconds to update badge
  useEffect(() => {
    const POLL_INTERVAL = 30000; // 30 seconds
    let intervalId: NodeJS.Timeout | null = null;

    const pollNotifications = async () => {
      try {
        await fetchNotifications({ page: 1, pageSize: 10, unreadOnly: false });
      } catch {
        // Error already captured in store
      }
    };

    const startPolling = () => {
      if (intervalId) clearInterval(intervalId);
      intervalId = setInterval(pollNotifications, POLL_INTERVAL);
    };

    const stopPolling = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    // Initial fetch
    pollNotifications();

    // Start polling
    startPolling();

    // Pause polling when tab is not visible
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopPolling();
      } else {
        pollNotifications(); // Fetch immediately when tab becomes visible
        startPolling();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stopPolling();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchNotifications]);

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

      {/* Notifications with Dropdown */}
      <div className="relative">
        <button
          ref={notificationButtonRef}
          type="button"
          onClick={() => setIsNotificationDropdownOpen(!isNotificationDropdownOpen)}
          className="relative p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          {hasUnread && (
            <>
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-600 ring-2 ring-white dark:ring-gray-900" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </>
          )}
        </button>

        {isNotificationDropdownOpen && (
          <NotificationDropdown onClose={() => setIsNotificationDropdownOpen(false)} />
        )}
      </div>

      <UserDropdown />
    </div>
  );
}
