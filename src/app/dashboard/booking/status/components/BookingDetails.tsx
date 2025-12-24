"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Booking } from "@/types/bookingStatus";
import BookingActions from "./BookingActions";
import BookingStatusBadge from "./BookingStatusBadge";
import { Building2, DoorOpen, CheckCircle, Clock, CreditCard } from "lucide-react";
import { useHostelStore } from "@/store/useHostelStore";
import StatusMessageBox from "./StatusMessageBox";
import RoomAllocationInfo from "./RoomAllocationInfo";

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

            {/* Room Type and Price on one line */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center text-gray-600 gap-2">
                <DoorOpen size={18} className="text-gray-500" />
                <span className="font-medium">{booking.roomTitle || "Room Type"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Price:</span>
                <span className="font-bold text-yellow-600 text-md">
                  GHC {booking.price ? parseFloat(booking.price).toLocaleString() : "N/A"}
                </span>
              </div>
            </div>

            {/* Status-specific information */}
            {(() => {
              const normalizedStatus = booking.status.toLowerCase().replace(/_/g, ' ');
              
              if (normalizedStatus === "room_allocated" || normalizedStatus === "room allocated" || normalizedStatus === "completed") {
                return (
                  <RoomAllocationInfo
                    allocatedRoomNumber={booking.allocatedRoomNumber}
                    bookingDate={booking.date}
                    showAllocationMessage={normalizedStatus === "room_allocated" || normalizedStatus === "room allocated"}
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

          {/* Actions */}
          <BookingActions booking={booking} onBack={onBack} />
        </div>
      </div>
    </motion.div>
  );
}
