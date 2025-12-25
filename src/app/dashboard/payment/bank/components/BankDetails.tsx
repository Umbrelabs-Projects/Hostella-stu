"use client";

import React, { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import ImageUploadField from "./ImageUploadField";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { usePaymentStore } from "@/store/usePaymentStore";
import { useBookingStore } from "@/store/useBookingStore";
import { AlertTriangle, CreditCard, DollarSign, Loader2, CheckCircle, Eye, Info, Clock } from "lucide-react";
import PaymentStatusBadge from "../../components/PaymentStatusBadge";
import { toast } from "sonner";

// Define Zod Schema
const paymentSchema = z.object({
  receipt: z
    .any()
    .refine((files) => files && files.length > 0, "Receipt upload is required.")
    .refine(
      (files) => {
        if (!files?.[0]) return false;
        const allowedTypes = [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/gif",
          "image/webp",
        ];
        return allowedTypes.includes(files[0].type);
      },
      "Only image files are allowed (JPEG, PNG, GIF, or WEBP)."
    )
    .refine(
      (files) => {
        if (!files?.[0]) return false;
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        return files[0].size <= maxSize;
      },
      "File size must be less than 5MB."
    ),
});

// Infer TypeScript type
type PaymentForm = z.infer<typeof paymentSchema>;

interface BankDetailsProps {
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  branch?: string;
}

export default function BankDetails({
  bankName: bankNameProp,
  accountName: accountNameProp,
  accountNumber: accountNumberProp,
  branch: branchProp,
}: BankDetailsProps = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { extraBookingDetails, updateExtraBookingDetails, user } = useAuthStore();
  const { selectedBooking, fetchBookingById, setSelectedBooking } = useBookingStore();
  const { uploadReceipt, currentPayment, initiatePayment, loading, fetchPaymentsByBookingId } = usePaymentStore();
  
  // Get booking ID from query params, selected booking, or extraBookingDetails
  const bookingIdFromQuery = searchParams?.get("bookingId");
  const bookingIdFromBooking = selectedBooking?.id;
  const bookingIdFromExtra = extraBookingDetails.bookingId;
  
  // If we have booking ID from query but no selected booking, try to fetch it
  useEffect(() => {
    if (bookingIdFromQuery && !selectedBooking && bookingIdFromQuery !== bookingIdFromBooking) {
      console.log("Fetching booking by ID from query params:", bookingIdFromQuery);
      fetchBookingById(bookingIdFromQuery).catch((error) => {
        console.error("Failed to fetch booking:", error);
      });
    }
  }, [bookingIdFromQuery, selectedBooking, bookingIdFromBooking, fetchBookingById]);
  
  // Determine the booking ID to use (prioritize query params, then selected booking, then extra details)
  // The backend accepts string IDs (Prisma CUIDs), so we can use the string directly
  const bookingId = bookingIdFromQuery || bookingIdFromBooking || bookingIdFromExtra || "";
  
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

  // Fetch existing payment if bookingId exists (don't auto-initiate)
  // Payment should only be initiated when user clicks "Proceed to Payment" or uploads receipt
  // According to guide: Payment should only be created when user explicitly initiates it
  useEffect(() => {
    if (bookingId && bookingId !== "") {
      // Fetch existing payment, but don't create new one automatically
      // This will show bank details if payment already exists
      fetchPaymentsByBookingId(bookingId);
    }
  }, [bookingId, fetchPaymentsByBookingId]);

  // Get payment reference - student reference number is first priority
  // Get from user object (same as profile settings page)
  const studentRefNumber = user?.studentRefNumber || (user as { studentId?: string })?.studentId;
  const paymentReference = studentRefNumber || currentPayment?.reference || "N/A";
  
  // Get bank details from props (passed from server component) with fallback values
  // Environment variables can include quotes and special characters
  // Example: BANK_ACCOUNT_NAME="G.N.C.L. BANKER TO BANKER LOTTO"
  const bankName = bankNameProp || "Cal Bank";
  const accountName = accountNameProp || "Hostella";
  const accountNumber = accountNumberProp || "000000";
  const branch = branchProp || "";
  
  const BankDetails = [
    { title: "Amount", value: price },
    { title: "Bank Name", value: bankName },
    { title: "Account Name", value: accountName },
    { title: "Account Number", value: accountNumber },
    ...(branch ? [{ title: "Branch", value: branch }] : []),
    { title: "Payment Reference", value: paymentReference },
  ];

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset: resetForm,
  } = useForm<PaymentForm>({
    resolver: zodResolver(paymentSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: PaymentForm) => {
    try {
      // Step 1: Get bookingId (used to initiate payment)
      // bookingId can be in format: BK-XXXX or full UUID (e.g., cmjjbxxik0000z4bi5lrn3i49)
      const finalBookingId = searchParams?.get("bookingId") || selectedBooking?.id || extraBookingDetails.bookingId || "";
      
      if (!finalBookingId || finalBookingId === "") {
        console.error("Booking ID not found. Sources:", {
          query: searchParams?.get("bookingId"),
          selectedBooking: selectedBooking?.id,
          extraDetails: extraBookingDetails.bookingId,
        });
        toast.error("Booking ID not found. Please navigate back and try again, or refresh the page.");
        return;
      }

      // Step 2: Initiate payment using bookingId
      // Endpoint: POST /api/v1/payments/booking/:bookingId
      // Body: { provider: "BANK_TRANSFER" }
      // Response includes payment.id (this is the paymentId we need for step 3)
      let paymentId = currentPayment?.id;
      
      if (!paymentId) {
        console.log("Initiating payment with booking ID:", finalBookingId);
        // Response structure: { payment, bankDetails?, isNewPayment }
        const result = await initiatePayment(finalBookingId, 'BANK_TRANSFER');
        if (!result || !result.payment || !result.payment.id) {
          toast.error("Failed to initiate payment. Please try again.");
          return;
        }
        // Save paymentId from response - this is what we'll use to upload receipt
        paymentId = result.payment.id;
        
        // If bankDetails are provided, they're already in the response
        // The payment store should have updated currentPayment with the new payment
      }

      // Step 3: Upload receipt using paymentId (NOT bookingId!)
      // Endpoint: POST /api/v1/payments/:paymentId/upload-receipt-file
      // Important: Use payment.id from step 2, NOT bookingId or studentRefNumber
      console.log("Uploading receipt for payment ID:", paymentId);
      await uploadReceipt(paymentId, data.receipt[0]);
      
      // Reset form after successful upload
      resetForm();
      
      // Navigate to completion page
      router.push("/dashboard/payment/paymentCompleted");
    } catch (error: unknown) {
      console.error("Receipt upload failed:", error);
      toast.error(error instanceof Error ? error.message : "Failed to submit receipt. Please try again.");
      // Form will automatically reset isSubmitting state when error is thrown
    }
  };

  return (
    <motion.div
      className="flex flex-col gap-3 w-full"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Payment Note and Bank Account Details - Hide when upload form is showing */}
      {/* Show only when payment doesn't exist or payment is not in INITIATED status without receipt */}
      {!currentPayment || 
       !(currentPayment.status === 'INITIATED' || 
         currentPayment.status === 'initiated' ||
         currentPayment.status === 'PENDING' || 
         currentPayment.status === 'pending' ||
         !currentPayment.receiptUrl) ? (
        <>
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
        </>
      ) : null}

      {/* Payment Status Badge */}
      {currentPayment && (
        <motion.div
          className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
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
          {/* Only show "Receipt Uploaded" if status is AWAITING_VERIFICATION AND receiptUrl exists */}
          {currentPayment.status === 'AWAITING_VERIFICATION' && currentPayment.receiptUrl && (
            <motion.div
              className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Eye className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <strong className="text-blue-900 block mb-1">Receipt Uploaded</strong>
                <p className="text-sm text-blue-800">
                  Your receipt has been uploaded. The admin has been notified and will review it shortly. 
                  You'll be notified once your payment is verified.
                </p>
              </div>
            </motion.div>
          )}

          {/* Show "Payment Pending" for INITIATED, PENDING status, or AWAITING_VERIFICATION without receiptUrl */}
          {/* Show upload button when: status === "INITIATED" OR receiptUrl === null */}
          {((currentPayment.status === 'INITIATED' || 
             currentPayment.status === 'initiated' ||
             currentPayment.status === 'PENDING' || 
             currentPayment.status === 'pending' || 
             (currentPayment.status === 'AWAITING_VERIFICATION' && !currentPayment.receiptUrl)) ||
            !currentPayment.receiptUrl) && (
            <motion.div
              className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <strong className="text-amber-900 block mb-1">Payment Pending</strong>
                <p className="text-sm text-amber-800">
                  Please make the bank transfer using the details above and upload your receipt to complete the payment.
                </p>
              </div>
            </motion.div>
          )}

          {currentPayment.status === 'CONFIRMED' && (
            <motion.div
              className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <strong className="text-green-900 block mb-1">Payment Confirmed</strong>
                <p className="text-sm text-green-800">
                  Your payment has been verified and confirmed. Your booking is now being processed.
                </p>
              </div>
            </motion.div>
          )}
        </>
      )}

      {/* Debug Info - Only show if booking ID is missing */}
      {(!bookingId || bookingId === "") && (
        <motion.div
          className="bg-red-50 border border-red-200 rounded-lg p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-sm text-red-800 font-medium mb-2">⚠️ Booking ID Missing</p>
          <div className="text-xs text-red-700 space-y-1">
            <p>Query Params: {bookingIdFromQuery || "Not found"}</p>
            <p>Selected Booking: {bookingIdFromBooking || "Not found"}</p>
            <p>Extra Details: {bookingIdFromExtra || "Not found"}</p>
            <p className="mt-2">Please navigate back and try again, or refresh the page.</p>
          </div>
        </motion.div>
      )}

      {/* Show initiate payment button if payment not initiated yet */}
      {bookingId && bookingId !== "" && !currentPayment && !loading && (
        <motion.div
          className="bg-white rounded-xl shadow-xl p-6 border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="text-center space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-left">
                  <strong className="text-amber-900 block mb-1">Initiate Payment</strong>
                  <p className="text-sm text-amber-800">
                    Click the button below to initiate your bank transfer payment. After initiation, you'll be able to upload your receipt.
                  </p>
                </div>
              </div>
            </div>
            
            <button
              onClick={async () => {
                if (!bookingId) return;
                try {
                  const result = await initiatePayment(bookingId, 'BANK_TRANSFER');
                  if (result?.payment) {
                    // Payment initiated successfully, upload form will appear
                    // The component will re-render and show the upload form
                  }
                } catch (error) {
                  console.error('Failed to initiate payment:', error);
                  toast.error('Failed to initiate payment. Please try again.');
                }
              }}
              disabled={loading}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-md hover:shadow-lg font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 h-5 animate-spin" />
                  Initiating Payment...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Initiate Bank Transfer Payment
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}

      {/* Upload Receipt - Main Focus */}
      {/* Show upload form when: payment exists AND (status === "INITIATED" OR receiptUrl === null) */}
      {/* According to guide: Upload form only shows after payment is initiated */}
      {bookingId && bookingId !== "" && currentPayment && 
       (currentPayment.status === 'INITIATED' || 
        currentPayment.status === 'initiated' ||
        currentPayment.status === 'PENDING' || 
        currentPayment.status === 'pending' ||
        !currentPayment.receiptUrl) && (
        <motion.form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(onSubmit)(e);
          }}
          className="bg-white rounded-xl shadow-xl p-6 border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <div className="mb-4">
            <ImageUploadField
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
              className="w-full cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
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
      )}
    </motion.div>
  );
}
