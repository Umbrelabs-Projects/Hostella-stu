"use client";

import React from "react";
import { motion } from "framer-motion";

interface BookingDetailsProps {
  hostelName: string;
  roomTitle: string;
  price: string;
  bookingId?: string;
}

export default function BookingDetails({
  hostelName,
  roomTitle,
  price,
  bookingId,
}: BookingDetailsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mb-6 space-y-2"
    >
      {/* Hostel and Room Info */}
      <div className="flex justify-between items-center">
        <div>
          <motion.h2
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-semibold text-gray-900"
          >
            {hostelName}
          </motion.h2>
          <motion.p
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-gray-500 mt-1"
          >
            {roomTitle}
          </motion.p>
        </div>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-yellow-100 text-yellow-800 font-semibold px-4 py-2 rounded-full text-sm shadow-sm"
        >
          GHC {price || "N/A"}
        </motion.div>
      </div>

      {/* Booking ID */}
      {bookingId && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-xs text-gray-500 mt-1"
        >
          Booking ID:{" "}
          <span className="font-medium text-gray-700">{bookingId}</span>
        </motion.p>
      )}
    </motion.div>
  );
}
