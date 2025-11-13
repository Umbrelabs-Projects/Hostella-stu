"use client"

import React, { useState } from "react";
import { CheckCircle, CreditCard, Key, ToolCase, Trash2 } from "lucide-react";

const dummyNotifications = [
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

const typeConfig = {
  booking_approved: { icon: CheckCircle, color: "bg-green-100 text-green-600 border-green-500" },
  payment_received: { icon: CreditCard, color: "bg-indigo-100 text-indigo-600 border-indigo-500" },
  room_allocated: { icon: Key, color: "bg-blue-100 text-blue-600 border-blue-500" },
  maintenance_alert: { icon: ToolCase, color: "bg-red-100 text-red-600 border-red-500" },
};

export default function Notifications() {
  const [notifications, setNotifications] = useState(dummyNotifications);

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-12 rounded-3xl">
      <header className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight">
          
        </h1>
        <button
          onClick={markAllAsRead}
          disabled={notifications.every((n) => n.read)}
          className="mt-3 md:mt-0 bg-indigo-600 hover:bg-indigo-700 cursor-pointer text-white font-medium py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Mark All as Read
        </button>
      </header>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg border border-gray-100">
            <p className="text-gray-500">You&apos;re all caught up!</p>
          </div>
        ) : (
          notifications.map((notification) => {
            // Type assertion to safely index typeConfig with notification.type
            const config = typeConfig[notification.type as keyof typeof typeConfig] || {};
            const Icon = config.icon || CheckCircle;

            return (
              <div
                key={notification.id}
                className={`p-4 rounded-xl shadow-md flex justify-between items-start border-l-4 transition ${
                  notification.read
                    ? "bg-gray-50 border-gray-200"
                    : `bg-white ${config.color}`
                }`}
              >
                <div className="flex-1 min-w-0 flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full mr-3 text-lg">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 cursor-pointer" onClick={() => markAsRead(notification.id)}>
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

                <div className="flex  space-x-2">
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
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
