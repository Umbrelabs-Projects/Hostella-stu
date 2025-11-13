"use client";

import { useNotificationsStore } from "@/store/useNotificationsStore";
import React from "react";
import { NotificationHeader } from "./components/NotificationHeader";
import { NotificationList } from "./components/NotificationList";

export default function NotificationsPage() {
  const notifications = useNotificationsStore((state) => state.notifications);
  const markAsRead = useNotificationsStore((state) => state.markAsRead);
  const deleteNotification = useNotificationsStore((state) => state.deleteNotification);
  const markAllAsRead = useNotificationsStore((state) => state.markAllAsRead);
  const deleteAll = useNotificationsStore((state) => state.deleteAll);

  const allRead = notifications.every((n) => n.read);
  const allEmpty = notifications.length === 0;

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-12 rounded-3xl">
      <NotificationHeader
        markAllAsRead={markAllAsRead}
        deleteAll={deleteAll}
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
}
