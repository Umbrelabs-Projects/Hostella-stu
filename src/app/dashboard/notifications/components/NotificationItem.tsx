"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { typeConfig } from "./notificationConfig";
import { motion } from "framer-motion";

export interface Notification {
  id: number;
  type: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

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
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={`p-4 rounded-xl shadow-md flex justify-between items-start border-l-4 transition ${
        notification.read ? "bg-gray-50 border-gray-200" : `bg-white ${config.color}`
      }`}
    >
      <div className="flex-1 min-w-0 flex items-start">
        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full mr-3 text-lg">
          {Icon && <Icon className="w-6 h-6" />}
        </div>
        <div
          className="flex-1 cursor-pointer"
          onClick={() => markAsRead(notification.id)}
        >
          <div className="flex items-center">
            <h3
              className={`font-semibold ${
                notification.read ? "text-gray-600" : "text-gray-900"
              }`}
            >
              {notification.title}
            </h3>
            {!notification.read && (
              <span className="w-2 h-2 bg-indigo-500 rounded-full ml-2 flex-shrink-0"></span>
            )}
          </div>
          <p
            className={`mt-1 text-sm ${
              notification.read ? "text-gray-500" : "text-gray-700"
            }`}
          >
            {notification.description}
          </p>
          <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
        </div>
      </div>

      <div className="flex space-x-2">
        {!notification.read && (
          <button
            onClick={() => markAsRead(notification.id)}
            className="bg-green-600 hover:bg-green-700 cursor-pointer text-white text-xs px-2 py-1 rounded-lg transition"
          >
            Mark as Read
          </button>
        )}
        <button
          onClick={() => deleteNotification(notification.id)}
          className="text-gray-400 hover:text-red-500 cursor-pointer transition"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
};
