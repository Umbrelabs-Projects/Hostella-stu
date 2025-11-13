"use client";
import React from "react";
import { motion } from "framer-motion";
import BookingCard from "./BookingCard";
import { Booking } from "@/types/bookingStatus";

interface BookingListProps {
  bookings: Booking[];
  onViewDetails: (booking: Booking) => void;
}

export default function BookingList({
  bookings,
  onViewDetails,
}: BookingListProps) {
  return (
    <div>
      {bookings.length === 0 ? (
        <p className="text-gray-600 text-center py-10">No bookings yet.</p>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.1 },
            },
          }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {bookings.map((booking) => (
            <motion.div
              key={booking.id}
              variants={{
                hidden: { opacity: 0, y: 10 },
                show: { opacity: 1, y: 0 },
              }}
            >
              <BookingCard booking={booking} onViewDetails={onViewDetails} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
