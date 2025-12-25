import React from "react";

export default function BookingStatusBadge({ status }: { status: string }) {
  const base = "px-3 py-1 text-xs font-semibold rounded-full shadow-sm";
  const normalizedStatus = status.toLowerCase().replace(/_/g, ' ');
  
  const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
    "pending payment": {
      bg: "bg-yellow-100",
      text: "text-yellow-800",
      label: "Pending Payment"
    },
    "awaiting verification": {
      bg: "bg-blue-100",
      text: "text-blue-800",
      label: "Awaiting Verification"
    },
    "awaiting_verification": {
      bg: "bg-blue-100",
      text: "text-blue-800",
      label: "Awaiting Verification"
    },
    "pending approval": {
      bg: "bg-blue-100",
      text: "text-blue-800",
      label: "Pending Approval"
    },
    "approved": {
      bg: "bg-green-100",
      text: "text-green-800",
      label: "Approved"
    },
    "room allocated": {
      bg: "bg-green-100",
      text: "text-green-800",
      label: "Room Allocated"
    },
    "room_allocated": {
      bg: "bg-green-100",
      text: "text-green-800",
      label: "Room Allocated"
    },
    "completed": {
      bg: "bg-gray-100",
      text: "text-gray-800",
      label: "Completed"
    },
    "cancelled": {
      bg: "bg-red-100",
      text: "text-red-800",
      label: "Cancelled"
    },
    "rejected": {
      bg: "bg-red-100",
      text: "text-red-800",
      label: "Rejected"
    },
    "expired": {
      bg: "bg-orange-100",
      text: "text-orange-800",
      label: "Expired"
    },
  };

  const config = statusConfig[normalizedStatus] || {
    bg: "bg-gray-100",
    text: "text-gray-700",
    label: status
  };

  return (
    <span className={`${base} ${config.bg} ${config.text} backdrop-blur-md`}>
      {config.label}
    </span>
  );
}
