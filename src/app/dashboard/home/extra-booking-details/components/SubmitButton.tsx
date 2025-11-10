"use client";

import { motion } from "framer-motion";

interface SubmitButtonProps {
  label?: string;
}

export default function SubmitButton({ label = "Proceed to Make Payment" }: SubmitButtonProps) {
  return (
    <motion.button
      type="submit"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="w-full cursor-pointer bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 rounded-xl transition-colors mt-4 shadow-sm"
    >
      {label}
    </motion.button>
  );
}
