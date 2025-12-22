"use client";

import { create } from "zustand";
import { Notification } from "@/types/notifications";
import { CheckCircle, CreditCard, Key, ToolCase, Megaphone } from "lucide-react";
import { notificationApi } from "@/lib/api";

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

  fetchNotifications: (params?: { page?: number; pageSize?: number; unreadOnly?: boolean }) => Promise<void>;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  clearError: () => void;
}

export const typeConfig = {
  broadcast: {
    icon: Megaphone,
    color: "bg-purple-100 text-purple-600 border-purple-500",
  },
  'booking-approved': {
    icon: CheckCircle,
    color: "bg-green-100 text-green-600 border-green-500",
  },
  'payment-received': {
    icon: CreditCard,
    color: "bg-indigo-100 text-indigo-600 border-indigo-500",
  },
  'room-allocated': {
    icon: Key,
    color: "bg-blue-100 text-blue-600 border-blue-500",
  },
  'maintenance-alert': {
    icon: ToolCase,
    color: "bg-red-100 text-red-600 border-red-500",
  },
  'new-booking': {
    icon: CreditCard,
    color: "bg-yellow-100 text-yellow-600 border-yellow-500",
  },
  'booking-rejected': {
    icon: ToolCase,
    color: "bg-red-100 text-red-600 border-red-500",
  },
  'booking-cancelled': {
    icon: ToolCase,
    color: "bg-gray-100 text-gray-600 border-gray-500",
  },
  'complaint-received': {
    icon: CreditCard,
    color: "bg-orange-100 text-orange-600 border-orange-500",
  },
  'complaint-resolved': {
    icon: CheckCircle,
    color: "bg-green-100 text-green-600 border-green-500",
  },
};

export const useNotificationsStore = create<NotificationsState>((set) => ({
  notifications: [],
  broadcastNotifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  pagination: null,

  fetchNotifications: async (params) => {
    set({ loading: true, error: null });
    try {
      const response = await notificationApi.getAll({
        page: params?.page || 1,
        pageSize: params?.pageSize || 50,
        unreadOnly: params?.unreadOnly || false,
      });
      
      const notifications = response.notifications as Notification[];
      const broadcastNotifications = notifications.filter(
        (n) => n.type === 'broadcast'
      );
      
      set({
        notifications,
        broadcastNotifications,
        unreadCount: response.unreadCount,
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
      const updated = [notification, ...state.notifications];
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

  clearError: () => set({ error: null }),
}));

