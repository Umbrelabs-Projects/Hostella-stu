"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PaymentAlertProps {
  selectedNetwork: string;
  amount: number;
  alertTheme: string;
  alertTextColor: string;
}

const PaymentAlert: React.FC<PaymentAlertProps> = ({
  selectedNetwork,
  amount,
  alertTheme,
  alertTextColor,
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={selectedNetwork}
        className={`${alertTheme} ${alertTextColor} p-4 rounded-xl text-sm font-semibold mb-6`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.4 }}
      >
        Hostella will deduct <span className="font-extrabold text-lg">{amount}</span> from your account.
      </motion.div>
    </AnimatePresence>
  );
};

export default PaymentAlert;
