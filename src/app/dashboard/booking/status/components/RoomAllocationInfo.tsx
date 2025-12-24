"use client";
import React from "react";
import { Calendar, CheckCircle } from "lucide-react";

interface RoomAllocationInfoProps {
  allocatedRoomNumber?: number | null;
  bookingDate?: string | null;
  showAllocationMessage?: boolean;
}

export default function RoomAllocationInfo({
  allocatedRoomNumber,
  bookingDate,
  showAllocationMessage = false,
}: RoomAllocationInfoProps) {
  return (
    <div className="flex flex-col gap-3 mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
      {allocatedRoomNumber && (
        <div className="flex items-center gap-2 text-green-800">
          <Calendar size={18} className="text-green-600" />
          <span className="font-semibold">Room Number:</span>
          <span className="text-lg font-bold">{allocatedRoomNumber}</span>
        </div>
      )}
      {bookingDate && (
        <div className="flex items-center gap-2 text-gray-700">
          <Calendar size={18} className="text-gray-500" />
          <span className="font-semibold">Booking Date:</span>
          <span>{new Date(bookingDate).toLocaleDateString()}</span>
        </div>
      )}
      {showAllocationMessage && (
        <p className="text-sm text-green-700 mt-2 flex items-center gap-2">
          <CheckCircle size={16} className="text-green-600" />
          Your room has been allocated! Check the move-in instructions below.
        </p>
      )}
    </div>
  );
}

