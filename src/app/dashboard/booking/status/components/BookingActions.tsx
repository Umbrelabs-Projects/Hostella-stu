"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Booking } from "@/types/bookingStatus";
import { printBookingDetails } from "../../../../../../utils/printBooking";

interface BookingActionsProps {
  booking: Booking;
  onBack: () => void;
  onProceedPayment?: () => void; // optional callback if needed
  onDownload?: () => void;
}

export default function BookingActions({
  booking,
  onBack,
  onProceedPayment,
}: BookingActionsProps) {
  const router = useRouter();

  const handleCancel = () => {
    alert(`Cancel booking ${booking.id} (functionality coming soon)`);
  };

  const handleProceedPayment = () => {
    if (onProceedPayment) {
      onProceedPayment();
    } else {
      // Navigate to the success page dynamically
      router.push(`/dashboard/booking/success/${booking.id}`);
    }
  };

  return (
    <div className="mt-6 flex flex-col md:flex-row justify-between gap-3">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="bg-gray-100 cursor-pointer hover:bg-gray-200 text-gray-800 px-5 py-2 rounded-lg transition-all duration-200"
      >
        ← Back
      </button>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        {booking.status.toLowerCase() === "pending payment" && (
          <>
            <button
              onClick={handleProceedPayment}
              className="bg-yellow-500 cursor-pointer hover:bg-yellow-600 text-white px-5 py-2 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:scale-105"
            >
              Proceed to Pay
            </button>

            <button
              onClick={handleCancel}
              className="bg-red-600 cursor-pointer hover:bg-red-700 text-white px-5 py-2 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:scale-105"
            >
              Cancel Booking
            </button>
          </>
        )}

        {booking.status.toLowerCase() === "room allocated" && (
          <button
            onClick={() => printBookingDetails(booking)}
            className="bg-green-600 cursor-pointer hover:bg-green-700 text-white px-5 py-2 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:scale-105"
          >
            Download Room Details
          </button>
        )}
      </div>
    </div>
  );
}
