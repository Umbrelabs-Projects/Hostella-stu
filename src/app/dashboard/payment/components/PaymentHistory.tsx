"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { usePaymentStore } from "@/store/usePaymentStore";
import PaymentStatusBadge from "./PaymentStatusBadge";
import { Calendar, DollarSign, ExternalLink } from "lucide-react";
import { format } from "date-fns";

interface PaymentHistoryProps {
  bookingId: string | number;
}

export default function PaymentHistory({ bookingId }: PaymentHistoryProps) {
  const { payments, loading, fetchPaymentsByBookingId } = usePaymentStore();

  useEffect(() => {
    if (bookingId) {
      // Backend accepts both string and number IDs
      fetchPaymentsByBookingId(bookingId);
    }
  }, [bookingId, fetchPaymentsByBookingId]);

  // Ensure payments is always an array - do this FIRST before any other logic
  const paymentsArray = Array.isArray(payments) ? payments : [];

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-2 border border-gray-200">
        <p className="text-gray-500">Loading payment history...</p>
      </div>
    );
  }

  if (!paymentsArray || paymentsArray.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-3 border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Payment History</h3>
        <p className="text-gray-500 text-xs">No payment attempts found for this booking.</p>
      </div>
    );
  }

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h3>
      
      <div className="space-y-4">
        {paymentsArray.map((payment) => (
          <motion.div
            key={payment.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    {payment.provider === 'BANK_TRANSFER' || payment.method === 'bank' 
                      ? 'Bank Transfer' 
                      : 'Mobile Money (Paystack)'}
                  </span>
                  {/* Show correct status: If AWAITING_VERIFICATION but no receipt, show as INITIATED */}
                  <PaymentStatusBadge 
                    status={
                      payment.status === 'AWAITING_VERIFICATION' && !payment.receiptUrl
                        ? 'INITIATED'
                        : (payment.status || 'PENDING')
                    } 
                  />
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-semibold text-gray-900">
                      GHS {payment.amount.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {format(new Date(payment.createdAt), "MMM dd, yyyy 'at' HH:mm")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {payment.reference && (
              <div className="mt-2 pt-2 border-t border-gray-100">
                <p className="text-xs text-gray-600">
                  <strong>Reference:</strong> {payment.reference}
                </p>
              </div>
            )}

            {/* Show receipt status */}
            {payment.provider === 'BANK_TRANSFER' || payment.method === 'bank' ? (
              payment.receiptUrl ? (
                <div className="mt-2">
                  <a
                    href={payment.receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Receipt
                  </a>
                </div>
              ) : (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <p className="text-xs text-amber-600">
                    <strong>⚠️ Receipt not uploaded yet</strong>
                  </p>
                </div>
              )
            ) : null}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

