"use client";

import { motion } from "framer-motion";

interface SubmitButtonProps {
  label?: string;
  loading?: boolean;
}

export default function SubmitButton({ 
  label = "Confirm Booking Details",
  loading = false 
}: SubmitButtonProps) {
  return (
    <motion.button
      type="submit"
      disabled={loading}
      whileHover={!loading ? { scale: 1.03 } : {}}
      whileTap={!loading ? { scale: 0.96 } : {}}
      transition={{ type: "spring", stiffness: 300 }}
      className={`w-full cursor-pointer font-semibold py-3 rounded-xl transition-colors mt-4 shadow-sm ${
        loading
          ? 'bg-gray-400 cursor-not-allowed text-gray-600'
          : 'bg-yellow-400 hover:bg-yellow-500 text-gray-900'
      }`}
    >
      {loading ? "Creating Booking..." : label}
    </motion.button>
  );
}
