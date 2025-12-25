"use client";

import React, { useEffect, useState } from "react";
import { NotificationHeader } from "./components/NotificationHeader";
import { NotificationList } from "./components/NotificationList";
import { useNotificationsStore } from "@/store/useNotificationsStore";
import { Skeleton } from "@/components/ui/skeleton";
import { Notification } from "@/types/notifications";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const NotificationsPage: React.FC = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    deleteNotification,
    markAllAsRead,
    fetchNotifications,
    setFilters,
    filters,
    loading,
    error,
    pagination,
  } = useNotificationsStore();

  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [isMarkingAll, setIsMarkingAll] = useState(false);

  // Initial load
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        await fetchNotifications({ 
          page: 1, 
          pageSize: 50, 
          unreadOnly: filter === "unread" 
        });
      } catch {
        // error is already captured in store
      } finally {
        setIsInitialized(true);
      }
    };
    loadNotifications();
  }, [fetchNotifications, filter]);

  // Real-time polling: Fetch notifications every 30 seconds
  useEffect(() => {
    const POLL_INTERVAL = 30000; // 30 seconds
    let intervalId: NodeJS.Timeout | null = null;

    const pollNotifications = async () => {
      try {
        await fetchNotifications({ 
          page: 1, 
          pageSize: 50, 
          unreadOnly: filter === "unread" 
        });
      } catch {
        // Silently fail - error is already captured in store
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

    // Start polling initially
    startPolling();

    // Pause polling when tab is not visible (Page Visibility API)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopPolling();
      } else {
        // Resume polling when tab becomes visible
        pollNotifications(); // Fetch immediately when tab becomes visible
        startPolling();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup on unmount
    return () => {
      stopPolling();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchNotifications, filter]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
      toast.success("Notification marked as read");
    } catch {
      toast.error("Failed to mark notification as read");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
      toast.success("Notification deleted");
    } catch {
      toast.error("Failed to delete notification");
    }
  };

  const handleMarkAll = async () => {
    setIsMarkingAll(true);
    try {
      await markAllAsRead();
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to mark all notifications as read");
    } finally {
      setIsMarkingAll(false);
    }
  };

  const handleFilterChange = (newFilter: "all" | "unread") => {
    setFilter(newFilter);
    setFilters({ unreadOnly: newFilter === "unread" });
    fetchNotifications({ 
      page: 1, 
      pageSize: 50, 
      unreadOnly: newFilter === "unread" 
    }).catch(() => {});
  };

  const handleNotificationNavigation = (notification: Notification) => {
    if (!notification.relatedId) {
      router.push('/dashboard/notifications');
      return;
    }

    const routes: Record<string, (id: string) => void> = {
      "payment-received": () => router.push(`/dashboard/payment`),
      "new-booking": (id) => router.push(`/dashboard/booking/status?bookingId=${id}`),
      "booking-approved": (id) => router.push(`/dashboard/booking/status?bookingId=${id}`),
      "booking-rejected": (id) => router.push(`/dashboard/booking/status?bookingId=${id}`),
      "booking-cancelled": (id) => router.push(`/dashboard/booking/status?bookingId=${id}`),
      "room-allocated": (id) => router.push(`/dashboard/booking/status?bookingId=${id}`),
      "broadcast": () => router.push(`/dashboard/notifications`),
    };

    const handler = routes[notification.type];
    if (handler) {
      handler(notification.relatedId);
    } else {
      router.push('/dashboard/notifications');
    }
  };

  const filteredNotifications = filter === "unread"
    ? notifications.filter((n) => !n.isRead)
    : notifications;

  const allRead = notifications.every((n) => n.isRead);
  const allEmpty = notifications.length === 0;
  const totalCount = pagination?.total ?? notifications.length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Header with Filters and Actions */}
        <NotificationHeader
          markAllAsRead={handleMarkAll}
          allRead={allRead}
          allEmpty={allEmpty}
          filter={filter}
          onFilterChange={handleFilterChange}
          totalCount={totalCount}
          unreadCount={unreadCount}
        />

        {/* Loading State */}
        {(loading && !isInitialized) && notifications.length === 0 ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Notifications List */
          <NotificationList
            notifications={filteredNotifications}
            markAsRead={handleMarkAsRead}
            deleteNotification={handleDelete}
            onNavigate={handleNotificationNavigation}
          />
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
