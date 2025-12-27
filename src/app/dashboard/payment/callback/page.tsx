"use client";

import React, { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { usePaymentStore } from "@/store/usePaymentStore";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react";
import { images } from "@/lib/images";
import Image from "next/image";

function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { fetchPaymentsByBookingId, currentPayment } = usePaymentStore();
  const [status, setStatus] = useState<'checking' | 'confirmed' | 'pending' | 'failed' | 'error'>('checking');
  const [error, setError] = useState<string | null>(null);
  const [payment, setPayment] = useState<any>(null);
  const statusRef = useRef(status);

  // Get bookingId from URL params (set in callback_url)
  const bookingId = searchParams.get('bookingId');

  // Update ref when status changes
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  // Watch for payment status changes in store
  useEffect(() => {
    if (!bookingId || !currentPayment) return;
    
    // Only process if payment matches this booking
    if (currentPayment.bookingId === bookingId || currentPayment.bookingId?.toString() === bookingId) {
      setPayment(currentPayment);

      switch (currentPayment.status) {
        case 'CONFIRMED':
          setStatus('confirmed');
          // Redirect to bookings after 3 seconds
          setTimeout(() => {
            router.push('/dashboard/booking');
          }, 3000);
          break;
        case 'FAILED':
          setStatus('failed');
          setError('Payment failed');
          break;
        case 'INITIATED':
          setStatus('pending');
          break;
        default:
          setStatus('pending');
      }
    }
  }, [currentPayment, bookingId, router]);

  useEffect(() => {
    if (!bookingId) {
      setError('Booking ID not found');
      setStatus('error');
      return;
    }

    // Check payment status immediately
    checkPaymentStatus(bookingId);
    
    // Poll every 10 seconds (per guide)
    const interval = setInterval(() => {
      // Only poll if status is still checking or pending
      if (statusRef.current === 'checking' || statusRef.current === 'pending') {
        checkPaymentStatus(bookingId);
      }
    }, 10000); // 10 seconds per guide

    return () => clearInterval(interval);
  }, [bookingId]);

  const checkPaymentStatus = async (bookingId: string) => {
    try {
      setError(null);
      
      // Use GET /api/v1/payments/booking/{bookingId} - NOT verify endpoint
      // Students should NOT verify payments, only check status
      await fetchPaymentsByBookingId(bookingId, true); // true = silent mode
      
      // Payment status will be updated via the useEffect watching currentPayment
    } catch (err) {
      console.error('Payment status check error:', err);
      setError('Failed to check payment status');
      if (status !== 'error' && status !== 'pending') {
        setStatus('error');
      }
    }
  };

  // Render based on status
  if (status === 'checking') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6">
        <motion.div
          className="w-full max-w-sm md:max-w-md bg-white rounded-3xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="flex flex-col items-center p-8 sm:p-10 text-center">
            <Loader2 className="w-20 h-20 text-blue-600 animate-spin mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-2">
              Checking Payment Status...
            </h2>
            <p className="text-sm sm:text-base text-gray-500">
              Please wait while we verify your payment.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6">
        <motion.div
          className="w-full max-w-sm md:max-w-md bg-white rounded-3xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="flex flex-col items-center p-8 sm:p-10 text-center">
            <XCircle className="w-20 h-20 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-2">
              Error
            </h2>
            <p className="text-sm sm:text-base text-gray-500 mb-6">
              {error || 'An error occurred'}
            </p>
            <button
              onClick={() => router.push('/dashboard/booking')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Go to Bookings
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6">
        <motion.div
          className="w-full max-w-sm md:max-w-md bg-white rounded-3xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="flex flex-col items-center p-8 sm:p-10 text-center">
            <XCircle className="w-20 h-20 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-2">
              Payment Failed
            </h2>
            <p className="text-sm sm:text-base text-gray-500 mb-4">
              Your payment could not be processed. Please try again.
            </p>
            {payment?.reference && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4 w-full text-left">
                <p className="text-xs text-gray-600">
                  <strong>Reference:</strong> {payment.reference}
                </p>
              </div>
            )}
            <button
              onClick={() => router.push(`/dashboard/payment/select/${bookingId}`)}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Retry Payment
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (status === 'confirmed') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6">
        <motion.div
          className="w-full max-w-sm md:max-w-md bg-white rounded-3xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="flex flex-col items-center p-8 sm:p-10 text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 8 }}
            >
              <Image src={images.checkMark} alt="check-mark" className="w-20 mx-auto mb-4" />
            </motion.div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-2">
              ✅ Payment Confirmed!
            </h2>
            <p className="text-sm sm:text-base text-gray-500 mb-4">
              Your payment has been successfully verified.
            </p>
            {payment && (
              <div className="bg-gray-50 rounded-lg p-4 mb-4 w-full text-left">
                <p className="text-xs text-gray-600 mb-1">
                  <strong>Reference:</strong> {payment.reference}
                </p>
                <p className="text-xs text-gray-600">
                  <strong>Amount:</strong> GHS {payment.amount?.toLocaleString() || '0.00'}
                </p>
              </div>
            )}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 w-full">
              <p className="text-xs text-blue-800">
                Your payment is now awaiting admin approval. You will receive a notification once your booking is approved and a room is assigned.
              </p>
            </div>
            <button
              onClick={() => router.push('/dashboard/booking')}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Go to Bookings
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // status === 'pending'
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6">
      <motion.div
        className="w-full max-w-sm md:max-w-md bg-white rounded-3xl shadow-xl overflow-hidden"
        initial={{ opacity: 0, scale: 0.8, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex flex-col items-center p-8 sm:p-10 text-center">
          <AlertCircle className="w-20 h-20 text-amber-600 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-2">
            Payment Pending
          </h2>
          <p className="text-sm sm:text-base text-gray-500 mb-4">
            Your payment is being processed. You will receive a notification once it's confirmed.
          </p>
          
          {payment && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4 w-full text-left">
              <p className="text-xs text-gray-600 mb-1">
                <strong>Reference:</strong> {payment.reference}
              </p>
              <p className="text-xs text-gray-600 mb-1">
                <strong>Amount:</strong> GHS {payment.amount?.toLocaleString() || '0.00'}
              </p>
              <p className="text-xs text-gray-600">
                <strong>Status:</strong> {payment.status}
              </p>
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4 w-full text-left">
            <p className="text-xs text-amber-800 mb-2">
              <strong>Note:</strong> Payment verification may take a few minutes. This page will automatically update when your payment is confirmed.
            </p>
            <p className="text-xs text-amber-800">
              If verification takes longer than 5 minutes, please contact support with your reference number.
            </p>
          </div>

          <button
            onClick={() => router.push('/dashboard/booking')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go to Bookings
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function PaymentCallback() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-screen">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      }
    >
      <PaymentCallbackContent />
    </Suspense>
  );
}
