"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCheck } from "lucide-react";

interface NotificationHeaderProps {
  markAllAsRead: () => Promise<void>;
  allRead: boolean;
  allEmpty: boolean;
  filter: "all" | "unread";
  onFilterChange: (filter: "all" | "unread") => void;
  totalCount: number;
  unreadCount: number;
}

export const NotificationHeader: React.FC<NotificationHeaderProps> = ({
  markAllAsRead,
  allRead,
  allEmpty,
  filter,
  onFilterChange,
  totalCount,
  unreadCount,
}) => (
  <header className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
    {/* Filter Buttons */}
    <div className="flex items-center gap-2">
      <Button
        variant={filter === "all" ? "default" : "outline"}
        onClick={() => onFilterChange("all")}
        className="px-4 py-2 text-sm"
      >
        All ({totalCount})
      </Button>
      <Button
        variant={filter === "unread" ? "default" : "outline"}
        onClick={() => onFilterChange("unread")}
        className="px-4 py-2 text-sm"
      >
        Unread ({unreadCount})
      </Button>
    </div>

    {/* Action Buttons */}
    <div className="flex items-center gap-2">
      <Button
        onClick={markAllAsRead}
        disabled={allRead || allEmpty}
        variant="outline"
        className="bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-600 font-medium py-2 px-4 rounded-lg shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center gap-2"
      >
        <CheckCheck className="w-4 h-4" />
        Mark All as Read
      </Button>
    </div>
  </header>
);
