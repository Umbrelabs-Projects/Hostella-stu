"use client";

import React from "react";
import { Booking } from "@/types/bookingStatus";
import { printBookingDetails } from "../../../../../../utils/printBooking";

interface BookingActionsProps {
  booking: Booking;
  onBack: () => void;
  onProceedPayment?: () => void;
  onDownload?: () => void;
}

export default function BookingActions({
  booking,
  onBack,
  onProceedPayment,
  onDownload,
}: BookingActionsProps) {
  const handleCancel = () => {
    alert(`Cancel booking ${booking.id} (functionality coming soon)`);
  };

  return (
    <div className="mt-6 flex flex-col md:flex-row justify-between gap-3">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2 rounded-lg transition-all"
      >
        ← Back
      </button>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        {booking.status.toLowerCase() === "pending payment" && (
          <>
            <button
              onClick={() =>
                onProceedPayment
                  ? onProceedPayment()
                  : alert(`Proceeding to payment for booking ${booking.id}`)
              }
              className="bg-yellow-500 cursor-pointer hover:bg-yellow-600 text-white px-5 py-2 rounded-lg transition-all"
            >
              Proceed to Pay
            </button>

            <button
              onClick={handleCancel}
              className="bg-red-600 hover:bg-red-700 cursor-pointer text-white px-5 py-2 rounded-lg transition-all"
            >
              Cancel Booking
            </button>
          </>
        )}

        {booking.status.toLowerCase() === "room allocated" && (
          <button
            onClick={() => printBookingDetails(booking)}
            className="bg-green-600 hover:bg-green-700 cursor-pointer text-white px-5 py-2 rounded-lg transition-all"
          >
            Download Room Details
          </button>
        )}
      </div>
    </div>
  );
}
