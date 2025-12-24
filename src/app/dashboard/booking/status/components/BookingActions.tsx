"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Booking } from "@/types/bookingStatus";
import { useBookingStore } from "@/store/useBookingStore";
import { printBookingDetails } from "../../../../../../utils/printBooking";
import { toast } from "sonner";
import { FileText, Download, MessageCircle, Home, AlertCircle, RefreshCw, CheckCircle } from "lucide-react";

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
      // Navigate to payment page
      router.push(`/dashboard/booking/success/${booking.id}`);
    }
  };

  const normalizedStatus = booking.status.toLowerCase().replace(/_/g, ' ');

  // Status-specific action buttons
  const renderActions = () => {
    switch (normalizedStatus) {
      case "pending payment":
        return (
          <>
            <button
              onClick={handleProceedPayment}
              className="bg-yellow-500 cursor-pointer hover:bg-yellow-600 text-white px-5 py-2 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:scale-105 flex items-center gap-2"
            >
              <FileText size={18} />
              Proceed to Payment
            </button>

            {!showCancelConfirm ? (
              <button
                onClick={handleCancel}
                disabled={loading}
                className="bg-red-600 cursor-pointer hover:bg-red-700 text-white px-5 py-2 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:scale-105 disabled:opacity-50 flex items-center gap-2"
              >
                <AlertCircle size={18} />
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
        );

      case "pending approval":
        return (
          <>
            <button
              onClick={() => router.push(`/dashboard/booking/success/${booking.id}`)}
              className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:scale-105 flex items-center gap-2"
            >
              <FileText size={18} />
              View Receipt
            </button>
            <span className="text-sm text-gray-500 italic">Payment under review - cannot cancel</span>
          </>
        );

      case "approved":
        return (
          <div className="flex flex-col gap-2">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800 flex items-center gap-2">
              <CheckCircle size={18} className="text-green-600" />
              <span>
                <strong>Booking Approved!</strong> Your payment has been verified. Waiting for room assignment.
              </span>
            </div>
          </div>
        );

      case "room_allocated":
      case "room allocated":
        return (
          <>
            <button
              onClick={() => printBookingDetails(booking)}
              className="bg-green-600 cursor-pointer hover:bg-green-700 text-white px-5 py-2 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:scale-105 flex items-center gap-2"
            >
              <Download size={18} />
              Download Room Details
            </button>
            <button
              onClick={() => printBookingDetails(booking)}
              className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:scale-105 flex items-center gap-2"
            >
              <Home size={18} />
              View Move-in Instructions
            </button>
          </>
        );

      case "completed":
        return (
          <>
            <button
              onClick={() => printBookingDetails(booking)}
              className="bg-gray-600 cursor-pointer hover:bg-gray-700 text-white px-5 py-2 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:scale-105 flex items-center gap-2"
            >
              <Download size={18} />
              Download Receipt
            </button>
            <button
              onClick={() => {
                toast.info("Review feature coming soon!");
              }}
              className="bg-purple-600 cursor-pointer hover:bg-purple-700 text-white px-5 py-2 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:scale-105 flex items-center gap-2"
            >
              <MessageCircle size={18} />
              Leave Review
            </button>
          </>
        );

      case "cancelled":
        return (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
            <strong>Booking Cancelled</strong>
            {cancelReason && <p className="mt-1">Reason: {cancelReason}</p>}
            <p className="mt-1">Contact support for refund status.</p>
          </div>
        );

      case "rejected":
        return (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
            <strong>Booking Rejected</strong>
            <p className="mt-1">Your booking was rejected. Please contact support for more information.</p>
            <button
              onClick={() => router.push('/dashboard/home')}
              className="mt-2 bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-all"
            >
              Contact Support
            </button>
          </div>
        );

      case "expired":
        return (
          <div className="flex flex-col gap-2">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm text-orange-800">
              <strong>Payment Deadline Passed</strong>
              <p className="mt-1">This booking has expired. Please create a new booking.</p>
            </div>
            <button
              onClick={() => router.push('/dashboard/home')}
              className="bg-yellow-500 cursor-pointer hover:bg-yellow-600 text-white px-5 py-2 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:scale-105 flex items-center gap-2"
            >
              <RefreshCw size={18} />
              Create New Booking
            </button>
          </div>
        );

      default:
        return null;
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
      <div className="flex flex-wrap gap-3 items-center">
        {renderActions()}
      </div>
    </div>
  );
}
