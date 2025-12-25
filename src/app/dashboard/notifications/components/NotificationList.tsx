"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import NotificationCard from "./NotificationCard";
import { Notification } from "@/types/notifications";
import { Bell } from "lucide-react";

interface NotificationListProps {
  notifications: Notification[];
  markAsRead: (id: string) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  onNavigate?: (notification: Notification) => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  markAsRead,
  deleteNotification,
  onNavigate,
}) => {
  if (notifications.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700"
      >
        <Bell className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
        <p className="text-lg font-medium text-gray-600 dark:text-gray-400 mb-2">
          You&apos;re all caught up!
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          No notifications at the moment
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {notifications.map((n, index) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.95 }}
            transition={{ 
              duration: 0.3,
              delay: index * 0.05,
              ease: "easeOut"
            }}
            layout
          >
            <NotificationCard
              notification={n}
              markAsRead={markAsRead}
              deleteNotification={deleteNotification}
              onNavigate={onNavigate}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
