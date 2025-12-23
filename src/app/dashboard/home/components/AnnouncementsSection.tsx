"use client";

import React from "react";
import { useNotificationsStore } from "@/store/useNotificationsStore";
import { Megaphone, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function AnnouncementsSection() {
  const { broadcastNotifications, markAsRead } = useNotificationsStore();

  // Show only unread broadcast notifications (limit to 3 most recent)
  const unreadBroadcasts = broadcastNotifications
    .filter((n) => !n.isRead)
    .slice(0, 3);

  if (unreadBroadcasts.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 space-y-3">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <Megaphone className="w-5 h-5 text-purple-600" />
        Announcements
      </h2>
      <AnimatePresence>
        {unreadBroadcasts.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700 rounded-lg p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <h3 className="font-semibold text-purple-900 dark:text-purple-200 mb-1">
                  {notification.title}
                </h3>
                <p className="text-sm text-purple-700 dark:text-purple-300 mb-2 line-clamp-2">
                  {notification.description}
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-purple-600 dark:text-purple-400">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </span>
                  <Link
                    href="/dashboard/notifications"
                    className="text-xs text-purple-600 dark:text-purple-400 hover:underline font-medium"
                  >
                    View all notifications →
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => markAsRead(notification.id)}
                  className="p-1 text-purple-600 hover:bg-purple-100 dark:hover:bg-purple-800 rounded transition"
                  aria-label="Mark as read"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

