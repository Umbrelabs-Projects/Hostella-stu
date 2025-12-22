"use client";

import React from "react";

interface NotificationHeaderProps {
  markAllAsRead: () => void;
  allRead: boolean;
  allEmpty: boolean;
}

export const NotificationHeader: React.FC<NotificationHeaderProps> = ({
  markAllAsRead,
  allRead,
  allEmpty,
}) => (
  <header className="mb-6 flex justify-end gap-3">
    <button
      onClick={markAllAsRead}
      disabled={allRead || allEmpty}
      className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
    >
      Mark All as Read
    </button>
  </header>
);
