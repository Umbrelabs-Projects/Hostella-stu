"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import PaymentIcons from "./momoDetails/PaymentIcons";
import PaymentAlert from "./momoDetails/PaymentAlert";
import NetworkSelect from "./momoDetails/NetworkSelect";
import MobileInput from "./momoDetails/MobileInput";
import PayButton from "./momoDetails/PayButton";

const MomoDetails: React.FC = () => {
  const [selectedNetwork, setSelectedNetwork] = useState<string>("MTN");
  const { extraBookingDetails } = useAuthStore();
  const amount = extraBookingDetails.price;

  const colorThemes = {
    MTN: {
      primaryBg: "bg-yellow-400",
      hoverBg: "hover:bg-yellow-500",
      alertBg: "bg-yellow-400",
    },
    TELECEL: {
      primaryBg: "bg-red-600",
      hoverBg: "hover:bg-red-700",
      alertBg: "bg-red-400",
    },
    AIRTELTIGO: {
      primaryBg: "bg-gradient-to-r from-blue-800 to-red-700", 
      hoverBg: "hover:opacity-90",
      alertBg: "bg-gradient-to-r from-blue-800 to-red-700",
    },
    DEFAULT: {
      primaryBg: "bg-gray-400",
      hoverBg: "hover:bg-gray-500",
      alertBg: "bg-gray-300",
    },
  };
  type NetworkKeys = keyof typeof colorThemes;
  const currentTheme =
    colorThemes[selectedNetwork as NetworkKeys] || colorThemes.DEFAULT;

  const alertTheme =
    selectedNetwork === "MTN" ? "bg-yellow-300" : currentTheme.alertBg;
  const alertTextColor =
    selectedNetwork === "MTN" ? "text-gray-800" : "text-white";

  return (
    <motion.div
      className="flex-1 w-full max-w-sm lg:max-w-md bg-white rounded-3xl shadow-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <PaymentAlert
        selectedNetwork={selectedNetwork}
        amount={typeof amount === "number" ? amount : 0}
        alertTheme={alertTheme}
        alertTextColor={alertTextColor}
      />

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        <NetworkSelect
          selectedNetwork={selectedNetwork}
          handleNetworkChange={setSelectedNetwork}
        />
        <MobileInput />
        <div className="bg-amber-100 text-amber-800 p-4 rounded-xl text-sm mb-6">
          If not prompted, check your approvals to see pending approvals.
        </div>
        <PayButton theme={currentTheme} />
      </form>

      <PaymentIcons />
    </motion.div>
  );
};

export default MomoDetails;
