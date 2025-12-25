"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Booking } from "@/types/bookingStatus";
import { useBookingStore } from "@/store/useBookingStore";
import { usePaymentStore } from "@/store/usePaymentStore";
import MoveInInstructions from "./MoveInInstructions";
import { toast } from "sonner";
import { FileText, Download, MessageCircle, Home, AlertCircle, RefreshCw, CheckCircle, Trash2, DollarSign, Calendar, ExternalLink, Loader2 } from "lucide-react";
import { format } from "date-fns";
import PaymentStatusBadge from "@/app/dashboard/payment/components/PaymentStatusBadge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface BookingActionsProps {
  booking: Booking;
  onBack: () => void;
  onProceedPayment?: () => void; // optional callback if needed
  onDownload?: () => void;
  onCancelSuccess?: () => void; // callback after successful cancellation
  showDeleteOnly?: boolean; // For cancelled bookings - only show delete button
}

export default function BookingActions({
  booking,
  onBack,
  onProceedPayment,
  onCancelSuccess,
  showDeleteOnly = false,
}: BookingActionsProps) {
  const router = useRouter();
  const { cancelBooking, deleteBooking, loading } = useBookingStore();
  const { currentPayment, fetchPaymentsByBookingId } = usePaymentStore();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);
  const [isDownloadingReceipt, setIsDownloadingReceipt] = useState(false);

  // Note: Payment is already fetched by BookingDetails component
  // We just use the currentPayment from the store to avoid duplicate API calls

  const handleCancelConfirm = async () => {
    try {
      await cancelBooking(booking.id, cancelReason || undefined);
      toast.success("Booking cancelled successfully");
      setShowCancelConfirm(false);
      setCancelReason("");
      if (onCancelSuccess) {
        onCancelSuccess();
      } else {
        onBack();
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to cancel booking");
    }
  };

  const handleProceedPayment = () => {
    if (onProceedPayment) {
      onProceedPayment();
    } else {
      // Navigate to payment selection page
      setNavigatingTo('payment');
      router.push(`/dashboard/payment/select/${booking.id}`);
    }
  };

  const handleNavigate = (path: string, key: string) => {
    setNavigatingTo(key);
    router.push(path);
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await deleteBooking(booking.id);
      toast.success("Booking deleted successfully");
      setShowDeleteDialog(false);
      if (onBack) {
        onBack();
      } else {
        router.push('/dashboard/booking');
      }
    } catch (error: unknown) {
      toast.error(error instanceof Error ? error.message : "Failed to delete booking");
      setIsDeleting(false);
    }
  };

  const normalizedStatus = booking.status.toLowerCase().replace(/_/g, ' ');

  // Status-specific action buttons
  const renderActions = () => {
    switch (normalizedStatus) {
      case "pending payment":
        // According to guide: Show "Proceed to Payment" only if booking.status === "PENDING_PAYMENT" AND payment === null
        // If payment exists (even if INITIATED), don't show this button - user should go to payment page instead
        if (currentPayment) {
          // If payment is confirmed, don't show duplicate message
          // Payment status and receipt are already shown in Payment History section
          if (currentPayment.status === 'CONFIRMED') {
            // Payment is confirmed - no action needed, status shown in Payment History
            return null;
          }
          
          // If payment is AWAITING_VERIFICATION, show dialog with payment details
          if (currentPayment.status === 'AWAITING_VERIFICATION') {
            return (
              <>
                <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
                  <DialogTrigger asChild>
                    <button
                      className="bg-yellow-500 cursor-pointer hover:bg-yellow-600 text-white px-5 py-2 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:scale-105 flex items-center gap-2"
                    >
                      <FileText size={18} />
                      View Payment
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Payment History</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-medium text-gray-700">
                                {currentPayment.provider === 'BANK_TRANSFER' || currentPayment.method === 'bank' 
                                  ? 'Bank Transfer' 
                                  : 'Mobile Money (Paystack)'}
                              </span>
                              <PaymentStatusBadge 
                                status={
                                  (currentPayment.status === 'AWAITING_VERIFICATION' || currentPayment.status === 'awaiting_verification') && !currentPayment.receiptUrl
                                    ? 'INITIATED'
                                    : (currentPayment.status || 'PENDING')
                                } 
                              />
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                <span className="font-semibold text-gray-900">
                                  GHS {currentPayment.amount.toLocaleString()}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {format(new Date(currentPayment.createdAt), "MMM dd, yyyy 'at' HH:mm")}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {currentPayment.reference && (
                          <div className="mt-2 pt-2 border-t border-gray-100">
                            <p className="text-xs text-gray-600">
                              <strong>Reference:</strong> {currentPayment.reference}
                            </p>
                          </div>
                        )}

                        {/* Show receipt link if available */}
                        {currentPayment.receiptUrl && (
                          <div className="mt-2">
                            <a
                              href={currentPayment.receiptUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition"
                            >
                              <ExternalLink className="w-4 h-4" />
                              View Receipt
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            );
          }
          
          // Payment exists but not confirmed and not AWAITING_VERIFICATION - show "View Payment" button
          return (
            <button
              onClick={handleProceedPayment}
              disabled={navigatingTo === 'payment'}
              className="bg-yellow-500 cursor-pointer hover:bg-yellow-600 text-white px-5 py-2 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {navigatingTo === 'payment' ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <FileText size={18} />
                  View Payment
                </>
              )}
            </button>
          );
        }
        
        // No payment exists - show "Proceed to Payment"
        return (
          <>
            <button
              onClick={handleProceedPayment}
              disabled={navigatingTo === 'payment'}
              className="bg-yellow-500 cursor-pointer hover:bg-yellow-600 text-white px-5 py-2 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {navigatingTo === 'payment' ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <FileText size={18} />
                  Proceed to Payment
                </>
              )}
            </button>

            <Dialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
              <DialogTrigger asChild>
                <button
                  disabled={loading}
                  className="bg-red-600 cursor-pointer hover:bg-red-700 text-white px-5 py-2 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:scale-105 disabled:opacity-50 flex items-center gap-2"
                >
                  <AlertCircle size={18} />
                  Cancel Booking
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Cancel Booking</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to cancel this booking? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                  <label htmlFor="cancel-reason" className="block text-sm font-medium text-gray-700 mb-2">
                    Reason (optional)
                  </label>
                  <input
                    id="cancel-reason"
                    type="text"
                    placeholder="Enter cancellation reason (optional)"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
                <DialogFooter className="mt-6">
                  <button
                    onClick={() => {
                      setShowCancelConfirm(false);
                      setCancelReason("");
                    }}
                    className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCancelConfirm}
                    disabled={loading}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Cancelling..." : "Confirm"}
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        );

      case "pending approval":
        return (
          <>
            <button
              onClick={() => handleNavigate(`/dashboard/booking/receipt/${booking.id}`, 'receipt')}
              disabled={navigatingTo === 'receipt'}
              className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {navigatingTo === 'receipt' ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <FileText size={18} />
                  View Receipt
                </>
              )}
            </button>
            <span className="text-sm text-gray-500 italic">Payment under review - cannot cancel</span>
          </>
        );

      case "approved":
        return (
          <button
            onClick={() => handleNavigate(`/dashboard/booking/receipt/${booking.id}`, 'receipt')}
            disabled={navigatingTo === 'receipt'}
            className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {navigatingTo === 'receipt' ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <FileText size={18} />
                View Receipt
              </>
            )}
          </button>
        );

      case "room_allocated":
      case "room allocated":
        return (
          <>
            <button
              onClick={() => handleNavigate(`/dashboard/booking/room-details/${booking.id}`, 'room-details')}
              disabled={navigatingTo === 'room-details'}
              className="bg-green-600 cursor-pointer hover:bg-green-700 text-white px-5 py-2 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {navigatingTo === 'room-details' ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <FileText size={18} />
                  View Room Details
                </>
              )}
            </button>
            <MoveInInstructions booking={booking} navigatingTo={navigatingTo} />
          </>
        );

      case "completed":
        return (
          <>
            <button
              onClick={async () => {
                setIsDownloadingReceipt(true);
                try {
                  // Import and call printBookingDetails
                  const { printBookingDetails } = await import('../../../../../utils/printBooking');
                  printBookingDetails(booking);
                  // Reset after a short delay to allow download to start
                  setTimeout(() => setIsDownloadingReceipt(false), 500);
                } catch (error) {
                  console.error('Failed to download receipt:', error);
                  setIsDownloadingReceipt(false);
                  toast.error('Failed to download receipt');
                }
              }}
              disabled={isDownloadingReceipt}
              className="bg-gray-600 cursor-pointer hover:bg-gray-700 text-white px-5 py-2 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isDownloadingReceipt ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download size={18} />
                  Download Receipt
                </>
              )}
            </button>
            <button
              onClick={() => {
                toast.info("Review feature coming soon!");
              }}
              className="bg-purple-600 cursor-pointer hover:bg-purple-700 text-white px-5 py-2 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:scale-105 flex items-center gap-2"
            >
              <MessageCircle size={18} />
              Leave Review
            </button>
          </>
        );

      case "cancelled":
        // If showDeleteOnly is true, we're in the simplified cancelled view
        if (showDeleteOnly) {
          return (
            <>
              <div className="space-y-4 w-full">
                <button
                  onClick={handleDeleteClick}
                  disabled={isDeleting || loading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-md hover:shadow-lg font-medium"
                >
                  <Trash2 size={20} />
                  Delete This Booking
                </button>
              </div>

              <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you sure you want to delete this booking?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <button
                      onClick={() => setShowDeleteDialog(false)}
                      disabled={isDeleting}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteConfirm}
                      disabled={isDeleting || loading}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 size={16} />
                      {isDeleting ? "Deleting..." : "Yes, Delete"}
                    </button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          );
        }
        
        // Original view for cancelled bookings (when not in simplified view)
        return (
          <>
            <div className="space-y-3">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
                <strong>Booking Cancelled</strong>
                {cancelReason && <p className="mt-1">Reason: {cancelReason}</p>}
                <p className="mt-1">Contact support for refund status.</p>
              </div>
              <button
                onClick={handleDeleteClick}
                disabled={isDeleting || loading}
                className="w-full bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 size={18} />
                Delete Booking
              </button>
            </div>

            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure you want to delete this booking?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <button
                    onClick={() => setShowDeleteDialog(false)}
                    disabled={isDeleting}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    disabled={isDeleting || loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={16} />
                    {isDeleting ? "Deleting..." : "Yes, Delete"}
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        );

      case "rejected":
        return (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
            <strong>Booking Rejected</strong>
            <p className="mt-1">Your booking was rejected. Please contact support for more information.</p>
            <button
              onClick={() => handleNavigate('/dashboard/home', 'home')}
              disabled={navigatingTo === 'home'}
              className="mt-2 bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {navigatingTo === 'home' ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Loading...
                </>
              ) : (
                'Contact Support'
              )}
            </button>
          </div>
        );

      case "expired":
        return (
          <div className="flex flex-col gap-2">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm text-orange-800">
              <strong>Payment Deadline Passed</strong>
              <p className="mt-1">This booking has expired. Please create a new booking.</p>
            </div>
            <button
              onClick={() => handleNavigate('/dashboard/home', 'home')}
              disabled={navigatingTo === 'home'}
              className="bg-yellow-500 cursor-pointer hover:bg-yellow-600 text-white px-5 py-2 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {navigatingTo === 'home' ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <RefreshCw size={18} />
                  Create New Booking
                </>
              )}
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="mt-6 flex flex-wrap gap-3 items-center">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="bg-gray-100 cursor-pointer hover:bg-gray-200 text-gray-800 px-5 py-2 rounded-lg transition-all duration-200"
      >
        ← Back
      </button>

      {/* Action Buttons */}
      {renderActions()}
    </div>
  );
}
