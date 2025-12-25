"use client";

import React, { useMemo } from "react";
import { Notification } from "@/types/notifications";
import { typeConfig } from "@/store/useNotificationsStore";
import { CheckCheck, TrashIcon, Bell } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface NotificationCardProps {
  notification: Notification;
  markAsRead: (id: string) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  onNavigate?: (notification: Notification) => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  markAsRead,
  deleteNotification,
  onNavigate,
}) => {
  const router = useRouter();
  const config = typeConfig[notification.type as keyof typeof typeConfig] ?? typeConfig['system-alert'];

  const containerClass = useMemo(
    () =>
      `p-5 rounded-xl border transition-all duration-200 ${
        notification.isRead
          ? "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 hover:shadow-md"
          : `border-blue-200 bg-blue-50/50 dark:border-blue-700 dark:bg-blue-900/20 hover:shadow-lg`
      } ${onNavigate ? "cursor-pointer" : ""}`,
    [notification.isRead, onNavigate]
  );

  const Icon = config.icon ?? Bell;

  const handleClick = async () => {
    if (!onNavigate) return;
    
    if (!notification.isRead) {
      await markAsRead(notification.id).catch(() => {});
    }
    onNavigate(notification);
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

  return (
    <motion.div
      className={containerClass}
      onClick={handleClick}
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className={`p-2.5 rounded-full ${config.color} flex-shrink-0`}>
          <Icon size={20} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className={`text-base font-semibold ${
                  notification.isRead 
                    ? "text-gray-900 dark:text-gray-100" 
                    : "text-blue-900 dark:text-blue-300"
                }`}>
                  {notification.title}
                </h3>
                {!notification.isRead && (
                  <span className="h-2 w-2 bg-blue-600 rounded-full flex-shrink-0"></span>
                )}
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1.5 leading-relaxed">
                {notification.description}
              </p>
              <div className="mt-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {notification.time ?? "Just now"}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              {!notification.isRead && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    markAsRead(notification.id).catch(() => {});
                  }}
                  className="p-1.5 text-blue-600 rounded-md bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                  aria-label="Mark as read"
                  title="Mark as read"
                >
                  <CheckCheck className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNotification(notification.id).catch(() => {});
                }}
                className="p-1.5 text-red-600 rounded-md bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
                aria-label="Delete notification"
                title="Delete"
              >
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationCard;
