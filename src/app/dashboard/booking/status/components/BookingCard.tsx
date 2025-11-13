"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Booking } from "@/types/bookingStatus";
import BookingStatusBadge from "./BookingStatusBadge";
import { Calendar, Building2, DoorOpen } from "lucide-react";

interface BookingCardProps {
  booking: Booking;
  onViewDetails: (booking: Booking) => void;
}

export default function BookingCard({
  booking,
  onViewDetails,
}: BookingCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 group"
    >
      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={booking.hostelImage || "/placeholder.jpg"}
          alt={booking.hostelName || "Hostel"}
          width={400}
          height={200}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <BookingStatusBadge status={booking.status} />
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-2">
        <h2 className="font-semibold text-xl text-gray-900 flex items-center gap-2">
          <Building2 size={18} className="text-blue-600" />
          {booking.hostelName}
        </h2>

        <div className="flex items-center text-sm text-gray-600 gap-2">
          <DoorOpen size={16} className="text-gray-500" />
          {booking.roomTitle}
        </div>

        {booking.status != "room allocated" ? (
          <p className="mt-2 font-bold text-yellow-600 text-lg">
            {booking.price}
          </p>
        ) : (
          <p className="mt-2 font-bold text-blue-700 text-lg"></p>
        )}

        {/* Extra Info (if room allocated) */}
        {booking.status === "room allocated" && (
          <div className="text-sm text-gray-700 flex items-center gap-2 mt-1">
            <Calendar size={16} className="text-green-600" />
            Arrival: <span className="font-medium">{booking.arrivalDate}</span>
          </div>
        )}

        {/* Button */}
        <div className="pt-4">
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onViewDetails(booking)}
            className="w-full cursor-pointer bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-600 hover:to-yellow-600 text-white py-2.5 rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
          >
            View Details
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
