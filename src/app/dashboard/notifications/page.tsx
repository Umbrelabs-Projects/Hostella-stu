"use client";

import React, { useEffect } from "react";
import { NotificationHeader } from "./components/NotificationHeader";
import { NotificationList } from "./components/NotificationList";
import { useNotificationsStore } from "@/store/useNotificationsStore";

const NotificationsPage: React.FC = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    deleteNotification,
    markAllAsRead,
    fetchNotifications,
  } = useNotificationsStore();

  useEffect(() => {
    fetchNotifications().catch(() => {
      /* errors handled in store */
    });
  }, [fetchNotifications]);

  const allRead = notifications.every((n) => n.isRead);
  const allEmpty = notifications.length === 0;

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-12 rounded-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Notifications
        </h1>
        {unreadCount > 0 && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
        )}
      </div>
      
      <NotificationHeader
        markAllAsRead={markAllAsRead}
        allRead={allRead}
        allEmpty={allEmpty}
      />

      <NotificationList
        notifications={notifications}
        markAsRead={markAsRead}
        deleteNotification={deleteNotification}
      />
    </div>
  );
};

export default NotificationsPage;
