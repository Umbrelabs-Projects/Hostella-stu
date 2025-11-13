"use client";

import React from "react";

interface NotificationHeaderProps {
  markAllAsRead: () => void;
  deleteAll: () => void;
  allRead: boolean;
  allEmpty: boolean;
}

export const NotificationHeader: React.FC<NotificationHeaderProps> = ({
  markAllAsRead,
  deleteAll,
  allRead,
  allEmpty,
}) => (
  <header className="mb-6 flex flex-row justify-end ">
    
    <div className="mt-3 md:mt-0 flex space-x-3">
      <button
        onClick={markAllAsRead}
        disabled={allRead || allEmpty}
        className="bg-indigo-600 hover:bg-indigo-700 cursor-pointer text-white font-medium py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Mark All as Read
      </button>
      <button
        onClick={deleteAll}
        disabled={allEmpty}
        className="bg-red-600 hover:bg-red-700 cursor-pointer text-white font-medium py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Delete All
      </button>
    </div>
  </header>
);
