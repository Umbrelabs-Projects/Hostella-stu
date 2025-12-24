"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/useAuthStore";
import { usePaymentStore } from "@/store/usePaymentStore";
import { useBookingStore } from "@/store/useBookingStore";
import PaymentIcons from "./momoDetails/PaymentIcons";
import PaymentAlert from "./momoDetails/PaymentAlert";
import NetworkSelect from "./momoDetails/NetworkSelect";
import MobileInput from "./momoDetails/MobileInput";
import PayButton from "./momoDetails/PayButton";
import { validateMobileNumber } from "./validation/validateMobileNumber";
import { useRouter, useSearchParams } from "next/navigation";

const MomoDetails: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedNetwork, setSelectedNetwork] = useState<string>("MTN");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [error, setError] = useState<string>("");

  const { extraBookingDetails, updateExtraBookingDetails, user } = useAuthStore();
  const { selectedBooking } = useBookingStore();
  const { initiatePayment, loading, currentPayment } = usePaymentStore();
  
  // Get booking ID from query params, selected booking, or extraBookingDetails
  const bookingIdFromQuery = searchParams?.get("bookingId");
  const bookingIdFromBooking = selectedBooking?.id;
  const bookingIdFromExtra = extraBookingDetails.bookingId;
  
  // Determine the booking ID to use
  const bookingIdString = bookingIdFromQuery || bookingIdFromBooking || bookingIdFromExtra || "";
  const bookingId = bookingIdString ? parseInt(bookingIdString) : 0;
  
  // Get price from selected booking or extraBookingDetails
  const priceFromBooking = selectedBooking?.price;
  const rawPrice = priceFromBooking || extraBookingDetails.price || "0";
  const amount: number = parseFloat(rawPrice.replace(/[^0-9.]/g, "")) || 0;

  // Get payment reference - student reference number is first priority
  const studentRefNumber = user?.studentRefNumber || (user as { studentId?: string })?.studentId;
  const paymentReference = studentRefNumber || currentPayment?.reference || "N/A";

  // Update extraBookingDetails if we have booking ID from query params or selected booking
  useEffect(() => {
    if (bookingIdFromQuery || bookingIdFromBooking) {
      updateExtraBookingDetails({
        bookingId: bookingIdFromQuery || bookingIdFromBooking || "",
        price: priceFromBooking || extraBookingDetails.price,
      });
    }
  }, [bookingIdFromQuery, bookingIdFromBooking, priceFromBooking, updateExtraBookingDetails]);

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

  const handlePay = async () => {
    if (!validateMobileNumber(selectedNetwork, mobileNumber)) {
      setError(`Please enter a valid ${selectedNetwork} number`);
      return;
    }

    setError("");
    
    try {
      // Call the payment store to initiate payment
      await initiatePayment(bookingId, 'momo', mobileNumber);
      router.push("/dashboard/payment/paymentCompleted");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to initiate payment");
    }
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
        paymentReference={paymentReference}
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

        <PayButton theme={currentTheme} loading={loading} />
      </form>

      <PaymentIcons />
    </motion.div>
  );
};

export default MomoDetails;
