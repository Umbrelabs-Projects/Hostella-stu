"use client";

import React from "react";
import { motion } from "framer-motion";

interface PayButtonProps {
  theme: { primaryBg: string; hoverBg: string };
}

const PayButton: React.FC<PayButtonProps> = ({ theme }) => {
  return (
    <motion.button
      type="submit"
      className={`w-full cursor-pointer py-3 rounded-xl text-lg font-bold text-white transition duration-200 ${theme.primaryBg} ${theme.hoverBg} shadow-md`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      Pay
    </motion.button>
  );
};

export default PayButton;
