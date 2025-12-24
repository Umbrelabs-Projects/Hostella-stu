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
import PaymentStatusBadge from "../../components/PaymentStatusBadge";
import { CheckCircle, Info } from "lucide-react";

const MomoDetails: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedNetwork, setSelectedNetwork] = useState<string>("MTN");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [error, setError] = useState<string>("");

  const { extraBookingDetails, updateExtraBookingDetails, user } = useAuthStore();
  const { selectedBooking } = useBookingStore();
  const { initiatePayment, loading, currentPayment, verifyPaymentByReference } = usePaymentStore();
  
  // Get booking ID from query params, selected booking, or extraBookingDetails
  const bookingIdFromQuery = searchParams?.get("bookingId");
  const bookingIdFromBooking = selectedBooking?.id;
  const bookingIdFromExtra = extraBookingDetails.bookingId;
  
  // Determine the booking ID to use (backend accepts string IDs)
  const bookingId = bookingIdFromQuery || bookingIdFromBooking || bookingIdFromExtra || "";
  
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
  }, [bookingIdFromQuery, bookingIdFromBooking, priceFromBooking, extraBookingDetails.price, updateExtraBookingDetails]);

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
      // Call the payment store to initiate payment with PAYSTACK provider
      // Response structure: { payment, bankDetails?, isNewPayment }
      const result = await initiatePayment(bookingId, 'PAYSTACK', mobileNumber);
      
      if (!result || !result.payment) {
        setError("Failed to initiate payment");
        return;
      }
      
      const payment = result.payment;
      
      // Check if Paystack authorization URL is provided
      if (payment?.authorizationUrl) {
        // Redirect to Paystack payment page
        window.location.href = payment.authorizationUrl;
      } else {
        // If no redirect URL, proceed to completion page
        router.push("/dashboard/payment/paymentCompleted");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to initiate payment");
    }
  };

  // Handle Paystack callback - verify payment when returning from Paystack
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const reference = urlParams.get('reference');
    
    if (reference) {
      // Verify payment using the reference from Paystack callback
      // Endpoint: GET /api/v1/payments/verify/:reference
      verifyPaymentByReference(reference).then((payment) => {
        if (payment) {
          console.log('Payment verified successfully:', payment);
          // Payment status will be updated in the store
        }
      }).catch((error) => {
        console.error('Payment verification failed:', error);
      });
    }
  }, [verifyPaymentByReference]);

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

      {/* Payment Status Badge */}
      {currentPayment && (
        <motion.div
          className="bg-white rounded-lg shadow-md p-4 border border-gray-200 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Payment Status:</span>
            <PaymentStatusBadge status={currentPayment.status || 'PENDING'} />
          </div>
        </motion.div>
      )}

      {/* Status Messages */}
      {currentPayment && (
        <>
          {currentPayment.status === 'CONFIRMED' && (
            <motion.div
              className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3 mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
            >
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <strong className="text-green-900 block mb-1">Payment Successful</strong>
                <p className="text-sm text-green-800">
                  Your payment has been received. The admin has been notified and will process your booking shortly.
                </p>
                {currentPayment.reference && (
                  <p className="text-xs text-green-700 mt-2">
                    <strong>Reference:</strong> {currentPayment.reference}
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {currentPayment.status === 'AWAITING_VERIFICATION' && (
            <motion.div
              className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3 mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
            >
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <strong className="text-blue-900 block mb-1">Payment Processing</strong>
                <p className="text-sm text-blue-800">
                  Your payment is being processed. Please wait for confirmation.
                </p>
              </div>
            </motion.div>
          )}
        </>
      )}

      <PaymentIcons />
    </motion.div>
  );
};

export default MomoDetails;
