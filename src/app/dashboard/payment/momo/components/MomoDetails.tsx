"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import PaymentIcons from "./momoDetails/PaymentIcons";
import PaymentAlert from "./momoDetails/PaymentAlert";
import NetworkSelect from "./momoDetails/NetworkSelect";
import MobileInput from "./momoDetails/MobileInput";
import PayButton from "./momoDetails/PayButton";
import { validateMobileNumber } from "./validation/validateMobileNumber";
import { useRouter } from "next/navigation";

const MomoDetails: React.FC = () => {
  const router = useRouter();
  const [selectedNetwork, setSelectedNetwork] = useState<string>("MTN");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [error, setError] = useState<string>("");

  const { extraBookingDetails } = useAuthStore();
  const rawPrice = extraBookingDetails.price || "0";
  const amount: number = parseFloat(rawPrice.replace(/[^0-9.]/g, "")) || 0;

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
  } as const;

  type NetworkKeys = keyof typeof colorThemes;
  const currentTheme =
    colorThemes[selectedNetwork as NetworkKeys] || colorThemes.DEFAULT;

  const alertTheme =
    selectedNetwork === "MTN" ? "bg-yellow-300" : currentTheme.alertBg;
  const alertTextColor =
    selectedNetwork === "MTN" ? "text-gray-800" : "text-white";

  const handlePay = () => {
    if (!validateMobileNumber(selectedNetwork, mobileNumber)) {
      setError(`Please enter a valid ${selectedNetwork} number`);
      return;
    }

    setError("");
    // Payment logic here
    console.log("Processing payment", {
      network: selectedNetwork,
      mobileNumber,
      amount,
    });
    alert(`Payment of GHC ${amount} on ${selectedNetwork} initiated!`);
    router.push("/dashboard/payment/paymentCompleted");
  };

  return (
    <motion.div
      className="flex-1 w-full max-w-sm lg:max-w-md bg-white rounded-3xl shadow-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <PaymentAlert
        selectedNetwork={selectedNetwork}
        amount={amount}
        alertTheme={alertTheme}
        alertTextColor={alertTextColor}
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handlePay();
        }}
        className="space-y-6"
      >
        <NetworkSelect
          selectedNetwork={selectedNetwork}
          handleNetworkChange={setSelectedNetwork}
        />
        <MobileInput
          mobileNumber={mobileNumber}
          setMobileNumber={setMobileNumber}
          error={error}
        />

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
