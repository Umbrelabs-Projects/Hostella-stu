// /store/useNotificationsStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Notification {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  read: boolean;
}

interface NotificationsState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      notifications: [],

      addNotification: (notification) => {
        const newNotification: Notification = {
          id: Date.now().toString(), // simple unique id
          ...notification,
        };
        set({ notifications: [newNotification, ...get().notifications] });
      },

      markAsRead: (id) => {
        set({
          notifications: get().notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        });
      },

      markAllAsRead: () => {
        set({
          notifications: get().notifications.map((n) => ({ ...n, read: true })),
        });
      },

      clearNotifications: () => {
        set({ notifications: [] });
      },
    }),
    {
      name: "notifications-storage",
      partialize: (state) => ({ notifications: state.notifications }),
    }
  )
);
