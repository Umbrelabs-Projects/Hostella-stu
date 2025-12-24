"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PaymentAlertProps {
  selectedNetwork: string;
  amount: number;
  alertTheme: string;
  alertTextColor: string;
  paymentReference?: string;
}

const PaymentAlert: React.FC<PaymentAlertProps> = ({
  selectedNetwork,
  amount,
  alertTheme,
  alertTextColor,
  paymentReference,
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
        <span className="mb-2">
          Hostella will deduct{" "}
          <span className="font-extrabold text-lg">
            GHC{" "}
            {typeof amount === "number"
              ? amount.toLocaleString()
              : Number(amount).toLocaleString()}
          </span>{" "}
          from your account. Make the Reference:
        </span>
        {paymentReference && paymentReference !== "N/A" && (
          <span className="font-bold text-lg"> {paymentReference}</span>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default PaymentAlert;
