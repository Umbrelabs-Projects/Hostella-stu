"use client";

import React from "react";

interface BookingDetailsProps {
  hostelName: string;
  roomTitle: string;
  price: string;
}

export default function BookingDetails({ hostelName, roomTitle, price }: BookingDetailsProps) {
  return (
    <div className="flex mb-6 justify-between items-center md:text-left">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">{hostelName}</h2>
        <p className="text-sm text-gray-500 mt-1">{roomTitle}</p>
      </div>
      <div className="bg-yellow-100 text-yellow-800 font-semibold px-4 py-2 rounded-full text-sm md:text-base shadow-sm">
        Price: {price || "N/A"}
      </div>
    </div>
  );
}
