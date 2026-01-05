"use client";

import React, { useEffect, useRef, useState } from "react";
import { useNotificationsStore, typeConfig } from "@/store/useNotificationsStore";
import { Notification } from "@/types/notifications";
import { Bell, X as XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface NotificationDropdownProps {
  onClose: () => void;
}

export default function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    fetchNotifications,
  } = useNotificationsStore();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  // Fetch notifications when dropdown opens
  useEffect(() => {
    fetchNotifications({ page: 1, pageSize: 10, unreadOnly: false }).catch(() => {
      // Error already captured in store
    });
  }, [fetchNotifications]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id).catch(() => {});
    }
    handleNotificationNavigation(notification);
    onClose();
  };

  const handleNotificationNavigation = (notification: Notification) => {
    if (!notification.relatedId) {
      // If no relatedId, just navigate to notifications page
      router.push('/dashboard/notifications');
      return;
    }

    const routes: Record<string, (id: string) => void> = {
      "payment-received": () => router.push(`/dashboard/payment`),
      "complaint-received": (id) => router.push(`/dashboard/complaints/${id}`),
      "new-booking": (id) => router.push(`/dashboard/booking/status?bookingId=${id}`),
      "broadcast": () => router.push(`/dashboard/notifications`),
      "booking-approved": (id) => router.push(`/dashboard/booking/status?bookingId=${id}`),
      "booking-rejected": (id) => router.push(`/dashboard/booking/status?bookingId=${id}`),
      "booking-cancelled": (id) => router.push(`/dashboard/booking/status?bookingId=${id}`),
      "room-allocated": (id) => router.push(`/dashboard/booking/status?bookingId=${id}`),
      "complaint-resolved": (id) => router.push(`/dashboard/complaints/${id}`),
    };

    const handler = routes[notification.type];
    if (handler) {
      handler(notification.relatedId);
    } else {
      router.push('/dashboard/notifications');
    }
  };

  const handleMarkAllAsRead = async () => {
    setIsMarkingAll(true);
    try {
      await markAllAsRead();
    } catch {
      // Error handled in store
    } finally {
      setIsMarkingAll(false);
    }
  };

  if (loading && notifications.length === 0) {
    return (
      <div
        ref={dropdownRef}
        className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-125 overflow-hidden"
      >
        <div className="p-4 text-center text-gray-500 dark:text-gray-400">
          <div className="animate-pulse">Loading notifications...</div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      ref={dropdownRef}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-125 overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-800 z-10">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">Notifications</h3>
        {notifications.length > 0 && unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={isMarkingAll}
            className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 disabled:opacity-50"
          >
            {isMarkingAll ? "Marking..." : "Mark all read"}
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="overflow-y-auto flex-1">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <Bell className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
            <p className="text-sm">No notifications</p>
            <p className="text-xs mt-1 text-gray-400 dark:text-gray-500">You&apos;re all caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            <AnimatePresence>
              {notifications.slice(0, 10).map((notification) => {
                const config = typeConfig[notification.type as keyof typeof typeConfig] ?? typeConfig['system-alert'];
                const Icon = config.icon ?? Bell;

                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors ${
                      !notification.isRead ? "bg-blue-50/50 dark:bg-blue-900/10" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-full ${config.color} shrink-0`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p
                            className={`text-sm font-medium ${
                              !notification.isRead
                                ? "text-gray-900 dark:text-gray-100"
                                : "text-gray-600 dark:text-gray-400"
                            }`}
                          >
                            {notification.title}
                          </p>
                          {!notification.isRead && (
                            <span className="ml-2 h-2 w-2 bg-blue-600 rounded-full shrink-0"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                          {notification.description}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {notification.time ?? "Just now"}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id).catch(() => {});
                        }}
                        className="ml-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 shrink-0 transition-colors"
                        aria-label="Delete notification"
                      >
                        <XIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 10 && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-center sticky bottom-0 bg-white dark:bg-gray-800">
          <Link
            href="/dashboard/notifications"
            onClick={onClose}
            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 font-medium transition-colors"
          >
            View all notifications
          </Link>
        </div>
      )}
    </motion.div>
  );
}

