"use client";

import { create } from "zustand";
import { Notification } from "@/types/notifications";
import { CheckCircle, CreditCard, Key, ToolCase, Megaphone, ClipboardList, Wrench, Bell, X, AlertCircle } from "lucide-react";
import { notificationApi } from "@/lib/api";

// Format relative time helper
const formatRelativeTime = (timestamp?: string) => {
  if (!timestamp) return "Just now";

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "Just now";

  const diffMs = Date.now() - date.getTime();
  const diffSeconds = Math.round(diffMs / 1000);
  const diffMinutes = Math.round(diffMs / 60000);
  const diffHours = Math.round(diffMs / 3600000);
  const diffDays = Math.round(diffMs / 86400000);

  if (diffSeconds < 60) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
  }).format(date);
};

interface NotificationsState {
  notifications: Notification[];
  broadcastNotifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  } | null;
  filters: {
    page: number;
    pageSize: number;
    unreadOnly: boolean;
  };

  fetchNotifications: (params?: { page?: number; pageSize?: number; unreadOnly?: boolean }) => Promise<void>;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  setFilters: (filters: { page?: number; pageSize?: number; unreadOnly?: boolean }) => void;
  clearError: () => void;
}

export const typeConfig = {
  'new-booking': {
    icon: ClipboardList,
    color: "bg-blue-100 text-blue-600 border-blue-500",
  },
  'payment-received': {
    icon: CreditCard,
    color: "bg-green-100 text-green-600 border-green-500",
  },
  'room-allocated': {
    icon: Key,
    color: "bg-blue-100 text-blue-600 border-blue-500",
  },
  'booking-approved': {
    icon: CheckCircle,
    color: "bg-green-100 text-green-600 border-green-500",
  },
  'booking-rejected': {
    icon: X,
    color: "bg-red-100 text-red-600 border-red-500",
  },
  'booking-cancelled': {
    icon: X,
    color: "bg-red-100 text-red-600 border-red-500",
  },
  'maintenance-alert': {
    icon: Wrench,
    color: "bg-orange-100 text-orange-600 border-orange-500",
  },
  'broadcast': {
    icon: Bell,
    color: "bg-purple-100 text-purple-600 border-purple-500",
  },
  'complaint-received': {
    icon: AlertCircle,
    color: "bg-yellow-100 text-yellow-600 border-yellow-500",
  },
  'complaint-resolved': {
    icon: CheckCircle,
    color: "bg-green-100 text-green-600 border-green-500",
  },
  // Fallback for unknown types
  'system-alert': {
    icon: Bell,
    color: "bg-gray-100 text-gray-600 border-gray-500",
  },
};

export const useNotificationsStore = create<NotificationsState>((set) => ({
  notifications: [],
  broadcastNotifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  pagination: null,
  filters: {
    page: 1,
    pageSize: 50,
    unreadOnly: false,
  },

  fetchNotifications: async (params) => {
    set({ loading: true, error: null });
    try {
      const response = await notificationApi.getAll({
        page: params?.page || 1,
        pageSize: params?.pageSize || 50,
        unreadOnly: params?.unreadOnly || false,
      });
      
      // Add relative time to notifications
      const notifications = (response.notifications as Notification[]).map(n => ({
        ...n,
        time: formatRelativeTime(n.createdAt),
      }));
      
      const broadcastNotifications = notifications.filter(
        (n) => n.type === 'broadcast'
      );
      
      set({
        notifications,
        broadcastNotifications,
        unreadCount: response.unreadCount || 0,
        pagination: {
          page: response.page,
          pageSize: response.pageSize,
          total: response.total,
          totalPages: response.totalPages,
        },
        loading: false,
      });
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch notifications',
        loading: false,
      });
    }
  },

  addNotification: (notification) =>
    set((state) => {
      const notificationWithTime = {
        ...notification,
        time: formatRelativeTime(notification.createdAt),
      };
      const updated = [notificationWithTime, ...state.notifications];
      const broadcastNotifications = updated.filter((n) => n.type === 'broadcast');
      return {
        notifications: updated,
        broadcastNotifications,
        unreadCount: notification.isRead ? state.unreadCount : state.unreadCount + 1,
      };
    }),

  markAsRead: async (id) => {
    try {
      await notificationApi.markAsRead(id);
      set((state) => {
        const updated = state.notifications.map((n) =>
          n.id === id ? { ...n, isRead: true } : n
        );
        const broadcastNotifications = updated.filter((n) => n.type === 'broadcast');
        const wasUnread = state.notifications.find((n) => n.id === id)?.isRead === false;
        return {
          notifications: updated,
          broadcastNotifications,
          unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
        };
      });
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : 'Failed to mark notification as read',
      });
    }
  },

  markAllAsRead: async () => {
    try {
      await notificationApi.markAllAsRead();
      set((state) => {
        const updated = state.notifications.map((n) => ({ ...n, isRead: true }));
        const broadcastNotifications = updated.filter((n) => n.type === 'broadcast');
        return {
          notifications: updated,
          broadcastNotifications,
          unreadCount: 0,
        };
      });
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : 'Failed to mark all notifications as read',
      });
    }
  },

  deleteNotification: async (id) => {
    try {
      await notificationApi.delete(id);
      set((state) => {
        const deletedNotif = state.notifications.find((n) => n.id === id);
        const updated = state.notifications.filter((n) => n.id !== id);
        const broadcastNotifications = updated.filter((n) => n.type === 'broadcast');
        const wasUnread = deletedNotif?.isRead === false;
        return {
          notifications: updated,
          broadcastNotifications,
          unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
        };
      });
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete notification',
      });
    }
  },

  setFilters: (newFilters) =>
    set((state) => ({
      filters: {
        ...state.filters,
        ...newFilters,
      },
    })),

  clearError: () => set({ error: null }),
}));

