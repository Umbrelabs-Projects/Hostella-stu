"use client";

import React from "react";
import { Notification, NotificationItem } from "./NotificationItem";
import { motion, AnimatePresence } from "framer-motion";

interface NotificationListProps {
  notifications: Notification[];
  markAsRead: (id: number) => void;
  deleteNotification: (id: number) => void;
}

export const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  markAsRead,
  deleteNotification,
}) => {
  if (notifications.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-lg border border-gray-100">
        <p className="text-gray-500">You&apos;re all caught up!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <NotificationItem
              notification={n}
              markAsRead={markAsRead}
              deleteNotification={deleteNotification}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
