"use client";

import { motion } from "framer-motion";
import { images } from "@/lib/images";
import Image from "next/image";

export default function PaymentMessage() {
  return (
    <motion.div
      className="w-full md:w-1/2 bg-white rounded-xl overflow-hidden shadow-sm"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="relative h-72 md:h-[30rem]">
        <Image
          src={images.bookingSuccessful}
          alt="Booking success"
          fill
          className="object-cover"
        />

        {/* Overlay Content */}
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center px-6">
          <motion.h1
            className="text-2xl md:text-3xl font-bold text-yellow-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Make Payment,
          </motion.h1>

          <motion.h1
            className="text-2xl md:text-3xl font-bold text-yellow-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
          >
            Secure your Room!
          </motion.h1>

          <motion.p
            className="text-white mt-3 md:mt-6 text-sm md:text-base max-w-md leading-relaxed"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
          >
            Thank you for choosing Hostella! Your reservation is confirmed.
            Make payment within 24 hours to secure your room.
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}
