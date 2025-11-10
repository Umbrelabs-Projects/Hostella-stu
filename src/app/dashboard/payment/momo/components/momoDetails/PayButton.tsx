"use client";

import React from "react";
import { motion } from "framer-motion";

interface PayButtonProps {
  theme: { primaryBg: string; hoverBg: string };
  loading?: boolean;
}

const PayButton: React.FC<PayButtonProps> = ({ theme, loading }) => {
  return (
    <motion.button
      type="submit"
      className={`w-full cursor-pointer py-3 rounded-xl text-lg font-bold text-white transition duration-200 ${theme.primaryBg} ${theme.hoverBg} shadow-md ${
        loading ? "opacity-70 cursor-not-allowed" : ""
      }`}
      whileHover={{ scale: loading ? 1 : 1.05 }}
      whileTap={{ scale: loading ? 1 : 0.95 }}
      disabled={loading}
    >
      {loading ? "Processing..." : "Pay"}
    </motion.button>
  );
};

export default PayButton;
