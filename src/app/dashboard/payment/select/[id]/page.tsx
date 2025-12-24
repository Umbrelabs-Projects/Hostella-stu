"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useBookingStore } from "@/store/useBookingStore";
import BookingSuccessCard from "@/app/dashboard/booking/success/components/BookingSuccessCard";
import PaymentMethodSelector from "@/app/dashboard/booking/success/components/PaymentMethodSelector";
import { SkeletonCard } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function PaymentSelectionPage() {
  const params = useParams();
  const bookingId = params?.id as string;
  const { 
    selectedBooking, 
    bookings, 
    loading: bookingLoading, 
    error: bookingError, 
    fetchBookingById,
    setSelectedBooking,
    fetchUserBookings
  } = useBookingStore();
  const [retryCount, setRetryCount] = useState(0);

  // First, try to find booking in the list
  useEffect(() => {
    if (bookingId && bookings.length > 0) {
      const bookingFromList = bookings.find(b => b.id === bookingId);
      if (bookingFromList) {
        console.log('Found booking in list, using it directly');
        setSelectedBooking(bookingFromList);
        return;
      }
    }
  }, [bookingId, bookings, setSelectedBooking]);

  // If not in list, fetch user bookings first, then try to find it
  useEffect(() => {
    if (bookingId && bookings.length === 0) {
      console.log('No bookings in list, fetching user bookings first');
      fetchUserBookings();
    }
  }, [bookingId, bookings.length, fetchUserBookings]);

  // After fetching user bookings, try to find the booking
  useEffect(() => {
    if (bookingId && bookings.length > 0 && !selectedBooking) {
      const bookingFromList = bookings.find(b => b.id === bookingId);
      if (bookingFromList) {
        console.log('Found booking after fetching list');
        setSelectedBooking(bookingFromList);
      } else {
        // If still not found, try fetching by ID as fallback
        console.log('Booking not in list, trying to fetch by ID');
        fetchBookingById(bookingId);
      }
    }
  }, [bookingId, bookings, selectedBooking, setSelectedBooking, fetchBookingById]);

  // Log errors for debugging
  useEffect(() => {
    if (bookingError) {
      console.error('Payment Selection Page - Booking Error:', {
        bookingId,
        error: bookingError,
        retryCount,
        hasBookingInList: bookings.some(b => b.id === bookingId),
        bookingsCount: bookings.length,
      });
    }
  }, [bookingId, bookingError, retryCount, bookings]);

  // Show loading skeleton while loading or if booking is not available
  // This must be checked BEFORE any access to selectedBooking properties
  if (!selectedBooking) {
    // Only show error if we've exhausted retries
    if (bookingError && retryCount >= 3) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-semibold mb-4">Unable to Load Booking</h2>
            <p className="text-gray-600 mb-2">
              {bookingError || "We couldn't load the booking details. This could be due to:"}
            </p>
            <ul className="text-sm text-gray-500 text-left mb-6 space-y-1 list-disc list-inside">
              <li>The booking doesn't exist</li>
              <li>You don't have permission to view this booking</li>
              <li>The booking ID is invalid</li>
              <li>Network or server error</li>
            </ul>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.href = '/dashboard/booking'}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg transition"
              >
                Go to Bookings
              </button>
              <button
                onClick={() => {
                  setRetryCount(0);
                  if (bookingId) {
                    fetchBookingById(bookingId);
                  }
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    // Show loading while booking is being fetched
    return (
      <div className="min-h-screen flex flex-col items-center px-4 py-8">
        <div className="flex flex-col md:flex-row items-start justify-center gap-8 w-full max-w-5xl">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  // Get booking details - safe to access now since we've checked selectedBooking is not null
  // Using optional chaining as an extra safety measure
  const hostelName = (selectedBooking && selectedBooking.hostelName) || 'Unknown Hostel';
  const roomTitle = (selectedBooking && selectedBooking.roomTitle) || 'Unknown Room Type';
  const price = (selectedBooking && selectedBooking.price) || '0';
  const formattedPrice = parseFloat(price.replace(/[^0-9.]/g, '') || '0').toLocaleString();

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8">
      {/* Top Section (Responsive) */}
      <div className="flex flex-col md:flex-row items-start justify-center gap-8 w-full max-w-5xl">
        {/* Left: Success Message */}
        <BookingSuccessCard />

        {/* Right: Booking Details and Payment Method Selector */}
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          {/* Booking Details Card - Enhanced Design */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200 relative overflow-hidden"
          >
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-50 rounded-full -ml-12 -mb-12 opacity-50"></div>
            
            <div className="relative z-10 flex flex-col gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                  {hostelName}
                </h1>
                <div className="h-1 w-12 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full"></div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Room Type</span>
                    <span className="text-sm font-semibold text-gray-900">{roomTitle}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-600 block">Total Amount</span>
                    <span className="text-lg md:text-xl font-bold text-yellow-700">GHC {formattedPrice}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Payment Method Selector */}
          <PaymentMethodSelector />
        </div>
      </div>
    </div>
  );
}

