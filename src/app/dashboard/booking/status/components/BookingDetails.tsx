"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Booking } from "@/types/bookingStatus";
import BookingActions from "./BookingActions";
import BookingStatusBadge from "./BookingStatusBadge";
import {
  Building2,
  DoorOpen,
  CheckCircle,
  Clock,
  CreditCard,
  XCircle,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { useHostelStore } from "@/store/useHostelStore";
import { usePaymentStore } from "@/store/usePaymentStore";
import { useBookingStore } from "@/store/useBookingStore";
import StatusMessageBox from "./StatusMessageBox";
import RoomAllocationInfo from "./RoomAllocationInfo";
import PaymentHistory from "@/app/dashboard/payment/components/PaymentHistory";

interface BookingDetailsProps {
  booking: Booking;
  onBack: () => void;
  onBookingUpdate?: (updatedBooking: Booking) => void;
}

export default function BookingDetails({
  booking,
  onBack,
  onBookingUpdate,
}: BookingDetailsProps) {
  const [hostelImage, setHostelImage] = useState<string | null>(null);
  const { hostels, fetchHostels, fetchHostelById, selectedHostel } =
    useHostelStore();
  const { currentPayment, fetchPaymentsByBookingId } = usePaymentStore();
  const { fetchBookingById, selectedBooking } = useBookingStore();
  
  // Fetch payment for this booking (only once on mount or when booking.id changes)
  useEffect(() => {
    if (booking.id) {
      fetchPaymentsByBookingId(booking.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking.id]); // Only depend on booking.id to avoid re-fetching on function changes

  // Poll payment status every 30 seconds when payment is AWAITING_VERIFICATION
  // According to guide: Poll GET /payments/booking/:bookingId every 30 seconds when payment is AWAITING_VERIFICATION
  useEffect(() => {
    if (!booking.id || !currentPayment) return;
    
    const isAwaitingVerification = 
      currentPayment.status === 'AWAITING_VERIFICATION';
    
    if (!isAwaitingVerification) return;

    // Poll every 30 seconds (silent mode - don't show loading)
    const interval = setInterval(() => {
      fetchPaymentsByBookingId(booking.id, true); // true = silent mode
    }, 30000); // 30 seconds

    // Cleanup interval on unmount or when payment status changes
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking.id, currentPayment?.status]); // Remove function dependency

  // Track if we've already refreshed for this payment confirmation
  const [hasRefreshedForConfirmed, setHasRefreshedForConfirmed] = useState(false);

  // Refresh booking when payment status changes to CONFIRMED
  // According to guide: When payment status becomes CONFIRMED, booking status automatically changes to "pending approval"
  // We need to refresh the booking to see the updated status
  useEffect(() => {
    if (!booking.id || !currentPayment) {
      setHasRefreshedForConfirmed(false);
      return;
    }
    
    const isConfirmed = 
      currentPayment.status === 'CONFIRMED' || 
      currentPayment.status === 'completed';
    
    // Reset refresh flag if payment is no longer confirmed
    if (!isConfirmed) {
      setHasRefreshedForConfirmed(false);
      return;
    }

    // Only refresh once when payment becomes confirmed
    if (hasRefreshedForConfirmed) return;

    // Only refresh if booking status is still "pending payment"
    // If it's already "pending approval", the backend has already updated it
    const normalizedStatus = booking.status.toLowerCase().replace(/_/g, ' ');
    if (normalizedStatus === 'pending approval') {
      // Already updated, no need to refresh
      setHasRefreshedForConfirmed(true);
      return;
    }

    // Refresh booking to get updated status (should be "pending approval" now)
    const refreshBooking = async () => {
      try {
        await fetchBookingById(booking.id);
        setHasRefreshedForConfirmed(true);
        // If onBookingUpdate callback is provided, update the parent component
        // Use a small delay to ensure selectedBooking is updated
        setTimeout(() => {
          if (onBookingUpdate) {
            const updatedBooking = useBookingStore.getState().selectedBooking;
            if (updatedBooking) {
              onBookingUpdate(updatedBooking);
            }
          }
        }, 100);
      } catch (error) {
        // Silently handle errors - don't spam console
        // The error is already logged by apiFetch, but we'll mark as refreshed to prevent loops
        setHasRefreshedForConfirmed(true); // Mark as refreshed to prevent retry loops
      }
    };

    // Add a small delay to avoid race conditions
    const timeoutId = setTimeout(() => {
      refreshBooking();
    }, 500);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking.id, booking.status, currentPayment?.status, hasRefreshedForConfirmed]); // Remove function dependencies

  // Poll booking status every 30 seconds when payment is CONFIRMED
  // This detects when booking status automatically changes to "pending approval"
  useEffect(() => {
    if (!booking.id || !currentPayment) return;
    
    const isConfirmed = 
      currentPayment.status === 'CONFIRMED' || 
      currentPayment.status === 'completed';
    
    if (!isConfirmed) return;

    // Poll every 30 seconds to check for booking status update (silent mode - don't show loading)
    const interval = setInterval(async () => {
      try {
        await fetchBookingById(booking.id, true); // true = silent mode
        // Update parent component if callback provided
        // Use a small delay to ensure selectedBooking is updated
        setTimeout(() => {
          if (onBookingUpdate) {
            const updatedBooking = useBookingStore.getState().selectedBooking;
            if (updatedBooking) {
              onBookingUpdate(updatedBooking);
            }
          }
        }, 100);
      } catch (error) {
        // Silently handle errors - don't spam console
        // The error is already logged by apiFetch
      }
    }, 30000); // 30 seconds

    // Cleanup interval on unmount or when payment status changes
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking.id, currentPayment?.status]); // Remove function dependencies to prevent re-renders
  
  // Check if booking is cancelled - show delete option instead of full details
  const isCancelled = booking.status.toLowerCase() === 'cancelled';
  
  // Hide "Payment Required" message if:
  // 1. Bank payment receipt has been uploaded (AWAITING_VERIFICATION or CONFIRMED with receiptUrl)
  // 2. Paystack payment has been made (CONFIRMED status)
  // 3. Any payment exists that is not just INITIATED without receipt
  const shouldHidePaymentRequired = currentPayment && 
    (currentPayment.status === 'CONFIRMED' || 
     currentPayment.status === 'AWAITING_VERIFICATION' ||
     currentPayment.receiptUrl || // Receipt uploaded (bank transfer)
     (currentPayment.provider === 'PAYSTACK' && currentPayment.status !== 'INITIATED')); // Paystack payment made

  // Fetch hostel image
  useEffect(() => {
    const getHostelImage = async () => {
      // Priority 1: Use hostelImage if available
      if (booking.hostelImage) {
        setHostelImage(booking.hostelImage);
        return;
      }

      // Priority 2: Fetch by hostelId if available
      if (booking.hostelId) {
        try {
          await fetchHostelById(booking.hostelId);
          return; // Will be handled by the second useEffect
        } catch (error) {
          console.error("Error fetching hostel by ID:", error);
        }
      }

      // Priority 3: Find in existing hostels list by name
      if (booking.hostelName && hostels.length > 0) {
        const hostel = hostels.find(
          (h) => h.name.toLowerCase() === booking.hostelName?.toLowerCase()
        );
        if (hostel?.image) {
          setHostelImage(hostel.image);
          return;
        }
      }

      // Priority 4: Fetch all hostels and search by name (only if not found)
      if (booking.hostelName && hostels.length === 0) {
        try {
          await fetchHostels();
          // Will be handled by the second useEffect after hostels are loaded
        } catch (error) {
          console.error("Error fetching hostels:", error);
        }
      }
    };

    getHostelImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    booking.hostelName,
    booking.hostelId,
    booking.hostelImage,
    fetchHostels,
    fetchHostelById,
    hostels.length,
  ]);

  // Update image when selectedHostel or hostels list changes
  useEffect(() => {
    if (
      booking.hostelId &&
      selectedHostel?.id === booking.hostelId &&
      selectedHostel.image
    ) {
      setHostelImage(selectedHostel.image);
    } else if (booking.hostelName && hostels.length > 0 && !hostelImage) {
      const hostel = hostels.find(
        (h) => h.name.toLowerCase() === booking.hostelName?.toLowerCase()
      );
      if (hostel?.image) {
        setHostelImage(hostel.image);
      }
    }
  }, [
    selectedHostel,
    hostels,
    booking.hostelId,
    booking.hostelName,
    hostelImage,
  ]);

  const imageSrc = hostelImage || "/placeholder.jpg";

  // For cancelled bookings, show simplified view with delete option
  if (isCancelled) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8"
      >
        <div className="flex flex-col items-center justify-center space-y-6 max-w-lg mx-auto">
          {/* Icon and Title */}
          <div className="flex flex-col items-center space-y-3">
            <div className="bg-red-100 rounded-full p-4">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Booking Cancelled</h2>
          </div>

          {/* Info Message */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 w-full">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-amber-800 font-medium mb-1">
                  Contact Support for Refund Status
                </p>
                <p className="text-xs text-amber-700">
                  If you've made a payment, please contact support to check your refund status.
                </p>
              </div>
            </div>
          </div>

          {/* Delete Action */}
          <div className="w-full">
            <BookingActions booking={booking} onBack={onBack} showDeleteOnly={true} />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 space-y-6"
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* Hostel Image */}
        <div className="relative w-full md:w-1/3 h-60 md:h-auto rounded-xl overflow-hidden shadow-sm bg-gray-200">
          <Image
            src={imageSrc}
            alt={booking.hostelName || "Hostel"}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            onError={() => setHostelImage("/placeholder.jpg")}
          />
        </div>

        {/* Details Section */}
        <div className="flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                <Building2 size={22} className="text-blue-600" />
                {booking.hostelName}
              </h2>
              {/* Status Badge - Show "Awaiting Verification" if payment is AWAITING_VERIFICATION */}
              <BookingStatusBadge 
                status={
                  currentPayment?.status === 'AWAITING_VERIFICATION'
                    ? 'AWAITING_VERIFICATION'
                    : booking.status
                } 
              />
            </div>

            {/* Room Type and Price on one line */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center text-gray-600 gap-2">
                <DoorOpen size={18} className="text-gray-500" />
                <span className="font-medium">
                  {booking.roomTitle || "Room Type"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Price:</span>
                <span className="font-bold text-yellow-600 text-md">
                  GHC{" "}
                  {booking.price
                    ? parseFloat(booking.price).toLocaleString()
                    : "N/A"}
                </span>
              </div>
            </div>

            {/* Status-specific information */}
            {(() => {
              const normalizedStatus = booking.status
                .toLowerCase()
                .replace(/_/g, " ");

              if (
                normalizedStatus === "room_allocated" ||
                normalizedStatus === "room allocated" ||
                normalizedStatus === "completed"
              ) {
                return (
                  <RoomAllocationInfo
                    allocatedRoomNumber={booking.allocatedRoomNumber}
                    bookingDate={booking.date}
                    showAllocationMessage={
                      normalizedStatus === "room_allocated" ||
                      normalizedStatus === "room allocated"
                    }
                  />
                );
              }

              if (normalizedStatus === "approved") {
                return (
                  <StatusMessageBox
                    icon={CheckCircle}
                    iconColor="text-blue-600"
                    bgColor="bg-blue-50"
                    borderColor="border-blue-200"
                    textColor="text-blue-800"
                    title="Payment Approved!"
                    message="Your booking has been confirmed. You will be notified when your room is assigned."
                  />
                );
              }

              if (normalizedStatus === "pending approval") {
                return (
                  <StatusMessageBox
                    icon={Clock}
                    iconColor="text-yellow-600"
                    bgColor="bg-yellow-50"
                    borderColor="border-yellow-200"
                    textColor="text-yellow-800"
                    title="Payment Under Review"
                    message="Your payment is being verified by the admin. You will be notified once it's approved."
                  />
                );
              }

              if (normalizedStatus === "pending payment") {
                // Don't show "Payment Required" if payment is confirmed or receipt has been uploaded
                // Payment status is already shown in Payment History section
                if (shouldHidePaymentRequired) {
                  return null;
                }
                
                return (
                  <StatusMessageBox
                    icon={CreditCard}
                    iconColor="text-orange-600"
                    bgColor="bg-orange-50"
                    borderColor="border-orange-200"
                    textColor="text-orange-800"
                    title="Payment Required"
                    message="Please proceed to payment to confirm your booking."
                    padding="p-3"
                  />
                );
              }

              return null;
            })()}
          </div>

          {/* Payment History - Hide if:
              1. Payment is AWAITING_VERIFICATION (shown in dialog instead)
              2. Booking status is "pending approval" (payment already confirmed, no need to show history)
              3. Booking status is "approved" (payment already confirmed, no need to show history)
          */}
          {booking.id && 
           (!currentPayment || 
            currentPayment.status !== 'AWAITING_VERIFICATION') &&
           (() => {
             const normalizedStatus = booking.status.toLowerCase().replace(/_/g, ' ');
             return normalizedStatus !== 'pending approval' && normalizedStatus !== 'approved';
           })() && 
           <PaymentHistory bookingId={booking.id} />}
          {/* Actions */}
          <BookingActions booking={booking} onBack={onBack} />
        </div>
      </div>
    </motion.div>
  );
}
