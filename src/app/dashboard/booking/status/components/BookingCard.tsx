"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Booking } from "@/types/bookingStatus";
import BookingStatusBadge from "./BookingStatusBadge";
import { Calendar, Building2, DoorOpen } from "lucide-react";
import { useHostelStore } from "@/store/useHostelStore";

interface BookingCardProps {
  booking: Booking;
  onViewDetails: (booking: Booking) => void;
}

export default function BookingCard({
  booking,
  onViewDetails,
}: BookingCardProps) {
  const [hostelImage, setHostelImage] = useState<string | null>(null);
  const { hostels, fetchHostels, fetchHostelById, selectedHostel } = useHostelStore();

  // Debug: Log booking data to see what we're receiving
  React.useEffect(() => {
    console.log('BookingCard - Booking data:', {
      id: booking.id,
      bookingId: booking.bookingId,
      hostelName: booking.hostelName,
      roomTitle: booking.roomTitle,
      price: booking.price,
      status: booking.status,
      hasRoomTitle: 'roomTitle' in booking,
      hasPrice: 'price' in booking,
      roomTitleType: typeof booking.roomTitle,
      priceType: typeof booking.price,
      fullBooking: booking,
    });
  }, [booking]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 group"
    >
      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-200">
        <Image
          src={imageSrc}
          alt={booking.hostelName || "Hostel"}
          width={400}
          height={200}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={() => setHostelImage("/placeholder.jpg")}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <BookingStatusBadge status={booking.status} />
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-2">
        {/* Hostel Name */}
        <h2 className="font-semibold text-xl text-gray-900 flex items-center gap-2">
          <Building2 size={18} className="text-blue-600" />
          {booking.hostelName || "Hostel Name"}
        </h2>

        {/* Room Type */}
        <div className="flex items-center text-sm text-gray-700 gap-2">
          <DoorOpen size={16} className="text-gray-500" />
          <span className="font-medium">
            {(() => {
              // Prefer explicit room type if available
              if (booking.room && (booking.room.type === 'TRIPLE' || booking.room.type === 'TP')) {
                return `Triple Room${booking.room.capacity ? ` (Capacity: ${booking.room.capacity})` : ''}`;
              }
              if (
                booking.roomTitle &&
                (booking.roomTitle.toLowerCase().includes('triple') || booking.roomTitle.toLowerCase().includes('tp'))
              ) {
                return `Triple Room`;
              }
              return booking.roomTitle && booking.roomTitle.trim() !== ''
                ? booking.roomTitle
                : "Room Type";
            })()}
          </span>
        </div>

        {/* Price - Always show */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-sm text-gray-600">Price:</span>
          <p className="font-bold text-yellow-600 text-lg">
            {booking.price && booking.price.trim() !== '' 
              ? `GHC ${parseFloat(booking.price).toLocaleString()}` 
              : "N/A"}
          </p>
        </div>

        {/* Extra Info (if room allocated or completed) */}
        {(() => {
          const normalizedStatus = booking.status.toLowerCase().replace(/_/g, ' ');
          if ((normalizedStatus === "room allocated" || normalizedStatus === "room_allocated" || normalizedStatus === "completed") && booking.allocatedRoomNumber) {
            return (
              <div className="text-sm text-gray-700 flex items-center gap-2 mt-1 bg-green-50 px-3 py-2 rounded-lg">
                <Calendar size={16} className="text-green-600" />
                <span>Room Number: <span className="font-semibold">{booking.allocatedRoomNumber}</span></span>
              </div>
            );
          }
          return null;
        })()}

        {/* Button */}
        <div className="pt-4">
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onViewDetails(booking)}
            className="w-full cursor-pointer bg-linear-to-r from-yellow-400 to-yellow-500 hover:from-yellow-600 hover:to-yellow-600 text-white py-2.5 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
          >
            View Details
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
