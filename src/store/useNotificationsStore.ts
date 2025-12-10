"use client";

import { create } from "zustand";
import { Notification } from "@/types/notifications";
import { CheckCircle, CreditCard, Key, ToolCase } from "lucide-react";
import { notificationApi } from "@/lib/api";

interface NotificationsState {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;

  fetchNotifications: (params?: { page?: number; limit?: number; unreadOnly?: boolean }) => Promise<void>;
  addNotification: (notification: Notification) => void;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: number) => Promise<void>;
  deleteAll: () => Promise<void>;
  clearError: () => void;
}

export const typeConfig = {
  booking_approved: {
    icon: CheckCircle,
    color: "bg-green-100 text-green-600 border-green-500",
  },
  payment_received: {
    icon: CreditCard,
    color: "bg-indigo-100 text-indigo-600 border-indigo-500",
  },
  room_allocated: {
    icon: Key,
    color: "bg-blue-100 text-blue-600 border-blue-500",
  },
  maintenance_alert: {
    icon: ToolCase,
    color: "bg-red-100 text-red-600 border-red-500",
  },
};

export const useNotificationsStore = create<NotificationsState>((set) => ({
  notifications: [],
  loading: false,
  error: null,
  pagination: null,

  fetchNotifications: async (params) => {
    set({ loading: true, error: null });
    try {
      const response = await notificationApi.getAll(params);
      set({
        notifications: response.data,
        pagination: response.pagination,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch notifications',
        loading: false,
      });
    }
  },

  addNotification: (notification) =>
    set((state) => ({ 
      notifications: [notification, ...state.notifications] 
    })),

  markAsRead: async (id) => {
    try {
      await notificationApi.markAsRead(id);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Failed to mark notification as read',
      });
    }
  },

  markAllAsRead: async () => {
    try {
      await notificationApi.markAllAsRead();
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Failed to mark all notifications as read',
      });
    }
  },

  deleteNotification: async (id) => {
    try {
      await notificationApi.delete(id);
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Failed to delete notification',
      });
    }
  },

  deleteAll: async () => {
    try {
      await notificationApi.deleteAll();
      set(() => ({
        notifications: [],
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Failed to delete all notifications',
      });
    }
  },

  clearError: () => set({ error: null }),
}));

