"use client";

import React, { useState } from "react";
import { NotificationHeader } from "./components/NotificationHeader";
import { Notification, NotificationItem } from "./components/NotificationItem";

const dummyNotifications: Notification[] = [
  {
    id: 1,
    type: "booking_approved",
    title: "Booking Approved",
    description: "Your request for Room B-204 has been confirmed.",
    time: "1 min ago",
    read: false,
  },
  {
    id: 2,
    type: "payment_received",
    title: "Payment Received",
    description: "The payment of $800 for hostel fees was successful.",
    time: "15 min ago",
    read: false,
  },
  {
    id: 3,
    type: "room_allocated",
    title: "Room Allocated",
    description: "You have been assigned to Room A-312.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: 4,
    type: "maintenance_alert",
    title: "Maintenance Alert",
    description: "Water will be shut off for 2 hours tomorrow.",
    time: "1 day ago",
    read: true,
  },
];


export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(dummyNotifications);

  const markAsRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteAll = () => {
    setNotifications([]);
  };

  const allRead = notifications.every((n) => n.read);
  const allEmpty = notifications.length === 0;

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-12 rounded-3xl">
      <NotificationHeader
        markAllAsRead={markAllAsRead}
        deleteAll={deleteAll}
        allRead={allRead}
        allEmpty={allEmpty}
      />

      <div className="space-y-4">
        {allEmpty ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg border border-gray-100">
            <p className="text-gray-500">You&apos;re all caught up!</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              markAsRead={markAsRead}
              deleteNotification={deleteNotification}
            />
          ))
        )}
      </div>
    </div>
  );
}