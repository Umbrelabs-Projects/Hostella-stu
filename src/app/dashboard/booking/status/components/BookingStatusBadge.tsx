import React from "react";

interface BookingStatusBadgeProps {
  status: string;
}

export default function BookingStatusBadge({ status }: { status: string }) {
  const base = "px-3 py-1 text-xs font-semibold rounded-full shadow-sm";
  const color =
    {
      "pending payment": "bg-yellow-100 text-yellow-800",
      "pending approval": "bg-orange-100 text-orange-800",
      "room allocated": "bg-green-100 text-green-800",
    }[status.toLowerCase()] || "bg-gray-100 text-gray-700";

  return (
    <span className={`${base} ${color} backdrop-blur-md`}>
      {status.toUpperCase()}
    </span>
  );
}
