"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Booking } from "@/types/bookingStatus";
import { useBookingStore } from "@/store/useBookingStore";
import { printBookingDetails } from "../../../../../../utils/printBooking";
import { toast } from "sonner";

interface BookingActionsProps {
  booking: Booking;
  onBack: () => void;
  onProceedPayment?: () => void; // optional callback if needed
  onDownload?: () => void;
  onCancelSuccess?: () => void; // callback after successful cancellation
}

export default function BookingActions({
  booking,
  onBack,
  onProceedPayment,
  onCancelSuccess,
}: BookingActionsProps) {
  const router = useRouter();
  const { cancelBooking, loading } = useBookingStore();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  const handleCancel = async () => {
    if (!showCancelConfirm) {
      setShowCancelConfirm(true);
      return;
    }

    try {
      await cancelBooking(booking.id, cancelReason || undefined);
      toast.success("Booking cancelled successfully");
      if (onCancelSuccess) {
        onCancelSuccess();
      } else {
        onBack();
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to cancel booking");
    }
  };

  const handleProceedPayment = () => {
    if (onProceedPayment) {
      onProceedPayment();
    } else {
      // Navigate to the success page dynamically
      router.push(`/dashboard/booking/success/${booking.id}`);
    }
  };

  const normalizedStatus = booking.status.toLowerCase().replace(/_/g, ' ');

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
        {normalizedStatus === "pending payment" && (
          <>
            <button
              onClick={handleProceedPayment}
              className="bg-yellow-500 cursor-pointer hover:bg-yellow-600 text-white px-5 py-2 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:scale-105"
            >
              Proceed to Pay
            </button>

            {!showCancelConfirm ? (
              <button
                onClick={handleCancel}
                disabled={loading}
                className="bg-red-600 cursor-pointer hover:bg-red-700 text-white px-5 py-2 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:scale-105 disabled:opacity-50"
              >
                Cancel Booking
              </button>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Reason (optional)"
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="bg-red-600 cursor-pointer hover:bg-red-700 text-white px-5 py-2 rounded-lg transition-all duration-200 disabled:opacity-50"
                >
                  {loading ? "Cancelling..." : "Confirm"}
                </button>
                <button
                  onClick={() => {
                    setShowCancelConfirm(false);
                    setCancelReason("");
                  }}
                  className="bg-gray-500 cursor-pointer hover:bg-gray-600 text-white px-5 py-2 rounded-lg transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            )}
          </>
        )}

        {(normalizedStatus === "room allocated" || normalizedStatus === "room_allocated") && (
          <button
            onClick={() => printBookingDetails(booking)}
            className="bg-green-600 cursor-pointer hover:bg-green-700 text-white px-5 py-2 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:scale-105"
          >
            Download Room Details
          </button>
        )}

        {normalizedStatus === "pending approval" && (
          <button
            onClick={() => router.push(`/dashboard/booking/success/${booking.id}`)}
            className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:scale-105"
          >
            View Receipt
          </button>
        )}

        {normalizedStatus === "completed" && (
          <button
            onClick={() => printBookingDetails(booking)}
            className="bg-gray-600 cursor-pointer hover:bg-gray-700 text-white px-5 py-2 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:scale-105"
          >
            Download Receipt
          </button>
        )}
      </div>
    </div>
  );
}
