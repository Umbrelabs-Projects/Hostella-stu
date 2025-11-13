"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { typeConfig } from "./notificationConfig";
import { motion } from "framer-motion";
import { Notification } from "@/types/notifications";

interface NotificationItemProps {
  notification: Notification;
  markAsRead: (id: number) => void;
  deleteNotification: (id: number) => void;
}

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  markAsRead,
  deleteNotification,
}) => {
  const config = typeConfig[notification.type as keyof typeof typeConfig] || {};
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className={`p-4 rounded-2xl shadow-lg flex justify-between items-start border-l-4 transition ${
        notification.read
          ? "bg-gray-50 border-gray-200"
          : `bg-white ${config.color} border-opacity-60`
      }`}
    >
      {/* Icon & Info */}
      <div className="flex-1 min-w-0 flex items-start space-x-3">
        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-lg">
          {Icon && <Icon className="w-6 h-6 text-gray-700" />}
        </div>
        <div
          className="flex-1 cursor-pointer"
          onClick={() => markAsRead(notification.id)}
        >
          <div className="flex items-center space-x-2">
            <h3
              className={`font-semibold text-sm md:text-base ${
                notification.read ? "text-gray-600" : "text-gray-900"
              }`}
            >
              {notification.title}
            </h3>
            {!notification.read && (
              <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
            )}
          </div>
          <p
            className={`mt-1 text-sm md:text-sm ${
              notification.read ? "text-gray-500" : "text-gray-700"
            }`}
          >
            {notification.description}
          </p>
          <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col md:flex-row items-center md:space-x-2 mt-3 md:mt-0">
        {!notification.read && (
          <button
            onClick={() => markAsRead(notification.id)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs md:text-sm px-3 py-1.5 rounded-lg transition shadow-sm"
          >
            Mark as Read
          </button>
        )}
        <button
          onClick={() => deleteNotification(notification.id)}
          className="text-gray-400 hover:text-red-500 mt-2 md:mt-0 transition"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};
