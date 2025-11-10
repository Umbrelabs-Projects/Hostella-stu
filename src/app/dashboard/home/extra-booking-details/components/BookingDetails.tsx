"use client";

import React from "react";

interface BookingDetailsProps {
  hostelName: string;
  roomTitle: string;
  price: string;
  bookingId?: string;
}

export default function BookingDetails({
  hostelName,
  roomTitle,
  price,
  bookingId,
}: BookingDetailsProps) {
  return (
    <div className="mb-6 space-y-2">
      {/* Hostel and Room Info */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">{hostelName}</h2>
          <p className="text-sm text-gray-500 mt-1">{roomTitle}</p>
        </div>
        <div className="bg-yellow-100 text-yellow-800 font-semibold px-4 py-2 rounded-full text-sm shadow-sm">
          GHC {price || "N/A"}
        </div>
      </div>

      {/* Booking ID (optional) */}
      {bookingId && (
        <p className="text-xs text-gray-500 mt-1">
          Booking ID:{" "}
          <span className="font-medium text-gray-700">{bookingId}</span>
        </p>
      )}
    </div>
  );
}
