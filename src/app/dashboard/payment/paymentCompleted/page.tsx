"use client";

import { motion } from "framer-motion";
import { images } from "@/lib/images";
import Image from "next/image";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const PaymentCompleted = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard/booking");
    }, 3000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-6">
      {/* Card Animation */}
      <motion.div
        className="w-full max-w-sm md:max-w-md bg-white rounded-3xl shadow-xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.8, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          className="flex flex-col items-center p-8 sm:p-10 text-center"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
        >
          {/* Checkmark */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 8 }}
          >
            <Image src={images.checkMark} alt="check-mark" className="w-20" />
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-4 mt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Payment Completed
          </motion.h1>

          {/* Description */}
          <motion.p
            className="text-sm sm:text-base text-gray-500 max-w-xs leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Keep an eye on your notification and email. Management will review
            your details, approve payment and assign you a room.
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Redirect message */}
      <p className="mt-6 text-green-400 animate-pulse text-sm">
        Redirecting to booking...
      </p>
    </div>
  );
};

export default PaymentCompleted;
