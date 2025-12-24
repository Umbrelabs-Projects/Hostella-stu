"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Booking } from "@/types/bookingStatus";
import BookingActions from "./BookingActions";
import BookingStatusBadge from "./BookingStatusBadge";
import { Calendar, Building2, DoorOpen } from "lucide-react";
import { useHostelStore } from "@/store/useHostelStore";

interface BookingDetailsProps {
  booking: Booking;
  onBack: () => void;
}

export default function BookingDetails({
  booking,
  onBack,
}: BookingDetailsProps) {
  const [hostelImage, setHostelImage] = useState<string | null>(null);
  const { hostels, fetchHostels, fetchHostelById, selectedHostel } = useHostelStore();

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
        const hostel = hostels.find(h => 
          h.name.toLowerCase() === booking.hostelName?.toLowerCase()
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
  }, [booking.hostelName, booking.hostelId, booking.hostelImage, fetchHostels, fetchHostelById, hostels.length]);

  // Update image when selectedHostel or hostels list changes
  useEffect(() => {
    if (booking.hostelId && selectedHostel?.id === booking.hostelId && selectedHostel.image) {
      setHostelImage(selectedHostel.image);
    } else if (booking.hostelName && hostels.length > 0 && !hostelImage) {
      const hostel = hostels.find(h => 
        h.name.toLowerCase() === booking.hostelName?.toLowerCase()
      );
      if (hostel?.image) {
        setHostelImage(hostel.image);
      }
    }
  }, [selectedHostel, hostels, booking.hostelId, booking.hostelName, hostelImage]);

  const imageSrc = hostelImage || "/placeholder.jpg";

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
              {/* Status Badge */}
              <BookingStatusBadge status={booking.status} />
            </div>

            <div className="flex items-center text-gray-600 gap-3">
              <DoorOpen size={18} className="text-gray-500" />
              <span className="font-medium">{booking.roomTitle}</span>
            </div>

            <div className="flex items-center gap-3 text-gray-700">
              <span className="font-semibold">{booking.price}</span>
            </div>

            {/* Price Display */}
            <div className="mt-2 border-t border-gray-100 pt-3">
              <p className="text-sm text-gray-600">Price:</p>
              <p className="font-bold text-yellow-600 text-xl">
                GHC {booking.price ? parseFloat(booking.price).toLocaleString() : "N/A"}
              </p>
            </div>

            {/* Status-specific information */}
            {(() => {
              const normalizedStatus = booking.status.toLowerCase().replace(/_/g, ' ');
              
              if (normalizedStatus === "room_allocated" || normalizedStatus === "room allocated" || normalizedStatus === "completed") {
                return (
                  <div className="flex flex-col gap-3 mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    {booking.allocatedRoomNumber && (
                      <div className="flex items-center gap-2 text-green-800">
                        <Calendar size={18} className="text-green-600" />
                        <span className="font-semibold">Room Number:</span>
                        <span className="text-lg font-bold">{booking.allocatedRoomNumber}</span>
                      </div>
                    )}
                    {booking.date && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar size={18} className="text-gray-500" />
                        <span className="font-semibold">Booking Date:</span>
                        <span>{new Date(booking.date).toLocaleDateString()}</span>
                      </div>
                    )}
                    {normalizedStatus === "room_allocated" || normalizedStatus === "room allocated" ? (
                      <p className="text-sm text-green-700 mt-2">
                        ✓ Your room has been allocated! Check the move-in instructions below.
                      </p>
                    ) : null}
                  </div>
                );
              }

              if (normalizedStatus === "approved") {
                return (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>✓ Payment Approved!</strong> Your booking has been confirmed. 
                      You will be notified when your room is assigned.
                    </p>
                  </div>
                );
              }

              if (normalizedStatus === "pending approval") {
                return (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      <strong>⏳ Payment Under Review</strong> Your payment is being verified by the admin. 
                      You will be notified once it's approved.
                    </p>
                  </div>
                );
              }

              if (normalizedStatus === "pending payment") {
                return (
                  <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-sm text-orange-800">
                      <strong>💳 Payment Required</strong> Please proceed to payment to confirm your booking.
                    </p>
                  </div>
                );
              }

              return null;
            })()}
          </div>

          {/* Actions */}
          <BookingActions booking={booking} onBack={onBack} />
        </div>
      </div>
    </motion.div>
  );
}
