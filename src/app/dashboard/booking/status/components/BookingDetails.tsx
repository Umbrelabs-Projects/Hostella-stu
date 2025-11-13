"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Booking } from "@/types/bookingStatus";
import BookingActions from "./BookingActions";
import BookingStatusBadge from "./BookingStatusBadge";
import { Calendar, Building2, DoorOpen, DollarSign } from "lucide-react";

interface BookingDetailsProps {
  booking: Booking;
  onBack: () => void;
}

export default function BookingDetails({
  booking,
  onBack,
}: BookingDetailsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-8 space-y-6"
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* Hostel Image */}
        <div className="relative w-full md:w-1/3 h-60 md:h-auto rounded-xl overflow-hidden shadow-sm">
          <Image
            src={booking.hostelImage || "/placeholder.jpg"}
            alt={booking.hostelName || "Hostel"}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
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

            {booking.status === "room allocated" && (
              <div className="flex flex-col md:flex-row md:items-center gap-4 mt-2 text-gray-700">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Room Number:</span>{" "}
                  {booking.roomNumber}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-green-600" />
                  <span className="font-semibold">Arrival Date:</span>{" "}
                  {booking.arrivalDate}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <BookingActions booking={booking} onBack={onBack} />
        </div>
      </div>
    </motion.div>
  );
}
