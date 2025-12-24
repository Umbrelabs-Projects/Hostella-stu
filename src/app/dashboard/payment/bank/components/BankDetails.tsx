"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import PdfUploadField from "@/app/(auth)/signup/step3/components/PdfUploadField";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { usePaymentStore } from "@/store/usePaymentStore";
import { useBookingStore } from "@/store/useBookingStore";

// Dynamically import icons to prevent hydration issues
const AlertTriangle = dynamic(() => import("lucide-react").then(mod => ({ default: mod.AlertTriangle })), { ssr: false });
const CreditCard = dynamic(() => import("lucide-react").then(mod => ({ default: mod.CreditCard })), { ssr: false });
const DollarSign = dynamic(() => import("lucide-react").then(mod => ({ default: mod.DollarSign })), { ssr: false });
const Loader2 = dynamic(() => import("lucide-react").then(mod => ({ default: mod.Loader2 })), { ssr: false });

// Define Zod Schema
const paymentSchema = z.object({
  receipt: z
    .any()
    .refine((files) => files && files.length > 0, "Receipt upload is required.")
    .refine(
      (files) => files?.[0]?.type === "application/pdf",
      "Only PDF files are allowed."
    ),
});

// Infer TypeScript type
type PaymentForm = z.infer<typeof paymentSchema>;

export default function BankDetails() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { extraBookingDetails, updateExtraBookingDetails, user } = useAuthStore();
  const { selectedBooking } = useBookingStore();
  const { uploadReceipt, currentPayment, initiatePayment, loading } = usePaymentStore();
  
  // Get booking ID from query params, selected booking, or extraBookingDetails
  const bookingIdFromQuery = searchParams?.get("bookingId");
  const bookingIdFromBooking = selectedBooking?.id;
  const bookingIdFromExtra = extraBookingDetails.bookingId;
  
  // Determine the booking ID to use
  const bookingIdString = bookingIdFromQuery || bookingIdFromBooking || bookingIdFromExtra || "";
  const bookingId = bookingIdString ? parseInt(bookingIdString) : 0;
  
  // Get price from selected booking or extraBookingDetails
  const priceFromBooking = selectedBooking?.price;
  const price = priceFromBooking || extraBookingDetails.price || "";

  // Update extraBookingDetails if we have booking ID from query params or selected booking
  useEffect(() => {
    if (bookingIdFromQuery || bookingIdFromBooking) {
      updateExtraBookingDetails({
        bookingId: bookingIdFromQuery || bookingIdFromBooking || "",
        price: priceFromBooking || extraBookingDetails.price,
      });
    }
  }, [bookingIdFromQuery, bookingIdFromBooking, priceFromBooking, extraBookingDetails.price, updateExtraBookingDetails]);

  // Initiate payment early to get the reference number
  useEffect(() => {
    if (bookingId && !currentPayment && !loading) {
      initiatePayment(bookingId, 'bank');
    }
  }, [bookingId, currentPayment, loading, initiatePayment]);

  // Get payment reference - student reference number is first priority
  // Get from user object (same as profile settings page)
  const studentRefNumber = user?.studentRefNumber || (user as { studentId?: string })?.studentId;
  const paymentReference = studentRefNumber || currentPayment?.reference || "N/A";
  
  const BankDetails = [
    { title: "Amount", value: price },
    { title: "Bank Name", value: "Cal Bank" },
    { title: "Account Name", value: "Hostella" },
    { title: "Account Number", value: "000000" },
    { title: "Payment Reference", value: paymentReference },
  ];

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PaymentForm>({
    resolver: zodResolver(paymentSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: PaymentForm) => {
    try {
      if (!bookingId) {
        alert("Booking ID not found. Please try again.");
        return;
      }

      // Initiate payment if not already initiated
      let paymentId = currentPayment?.id;
      
      if (!paymentId) {
        const payment = await initiatePayment(bookingId, 'bank');
        if (!payment || !payment.id) {
          alert("Failed to initiate payment. Please try again.");
          return;
        }
        paymentId = payment.id;
      }

      // Upload receipt to the payment store
      await uploadReceipt(paymentId, data.receipt[0]);
      router.push("/dashboard/payment/paymentCompleted");
    } catch (error: unknown) {
      console.error("Receipt upload failed:", error);
      alert(error instanceof Error ? error.message : "Failed to submit receipt. Please try again.");
    }
  };

  return (
    <motion.div
      className="flex flex-col gap-3 w-full"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Payment Note - Compact */}
      <motion.div
        className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg shadow-md p-3 border border-amber-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <div className="flex items-start gap-2">
          <div className="w-6 h-6 bg-amber-500 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
            <AlertTriangle className="w-4 h-4 text-white" />
          </div>
          <p className="text-xs text-amber-900 leading-relaxed">
            Please make payment to the account below. Hostella won&apos;t be responsible for any wrong transaction.
          </p>
        </div>
      </motion.div>

      {/* Bank Account Details - Compact */}
      <motion.div
        className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <motion.h3
          className="text-sm font-bold mb-3 text-gray-900 flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
            <CreditCard className="w-4 h-4 text-white" />
          </div>
          Bank Account Details
        </motion.h3>

        <div className="space-y-2">
          {BankDetails.map((detail, index) => (
            <motion.div
              className={`flex items-center justify-between p-2 rounded ${
                detail.title === "Amount" 
                  ? "bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200" 
                  : "bg-gray-50 border border-gray-100"
              }`}
              key={detail.title}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.05, duration: 0.3 }}
            >
              <div className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded flex items-center justify-center ${
                  detail.title === "Amount" 
                    ? "bg-yellow-500" 
                    : "bg-gray-200"
                }`}>
                  {detail.title === "Amount" ? (
                    <DollarSign className="w-3 h-3 text-white" />
                  ) : (
                    <CreditCard className="w-3 h-3 text-gray-600" />
                  )}
                </div>
                <span className={`text-xs font-medium ${detail.title === "Amount" ? "text-gray-700" : "text-gray-600"}`}>
                  {detail.title}
                </span>
              </div>
              <span className={`text-xs font-semibold ${
                detail.title === "Amount" 
                  ? "text-yellow-700" 
                  : "text-gray-900"
              }`}>
                {detail.value}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Upload Receipt - Main Focus */}
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl shadow-xl p-6 border border-gray-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <div className="mb-4">
          <PdfUploadField
            name="receipt"
            register={register}
            setValue={setValue}
            label="Upload Payment Receipt"
            error={errors.receipt}
          />
        </div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 200, damping: 10 }}
          className="mt-6"
        >
          <Button
            type="submit"
            className="w-full cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
            disabled={isSubmitting || loading}
          >
            {isSubmitting || loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin h-5 w-5" />
                Submitting...
              </span>
            ) : (
              "Submit Receipt"
            )}
          </Button>
        </motion.div>
      </motion.form>
    </motion.div>
  );
}
