"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useBookingStore } from "@/store/useBookingStore";
import BookingDetails from "./components/BookingDetails";
import { SkeletonCard } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";

export default function BookingStatusPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get("bookingId");
  const { selectedBooking, loading, error, fetchBookingById } = useBookingStore();
  const [hasFetched, setHasFetched] = useState(false);
  const hasFetchedRef = useRef(false);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    if (bookingId && !hasFetchedRef.current && !isFetchingRef.current) {
      isFetchingRef.current = true;
      fetchBookingById(bookingId, true).then(() => {
        hasFetchedRef.current = true;
        setHasFetched(true);
        isFetchingRef.current = false;
      }).catch(() => {
        hasFetchedRef.current = true;
        setHasFetched(true);
        isFetchingRef.current = false;
      });
    } else if (!bookingId) {
      hasFetchedRef.current = true;
      setHasFetched(true);
    }
  }, [bookingId, fetchBookingById]);

  const handleBack = () => {
    router.push("/dashboard/booking");
  };

  // Show loading skeleton only on initial load
  if (!hasFetched && bookingId) {
    return (
      <div className="md:mx-[5%] space-y-12 mb-9">
        <div className="flex items-center justify-center min-h-[400px]">
          <SkeletonCard />
        </div>
      </div>
    );
  }

  // Show error state if booking not found or no bookingId
  if (!bookingId || (hasFetched && !selectedBooking && !isFetchingRef.current)) {
    return (
      <div className="md:mx-[5%] space-y-12 mb-9">
        <EmptyState
          title="Booking Not Found"
          description={bookingId ? "The booking you're looking for doesn't exist or you don't have access to it." : "No booking ID provided."}
        />
        <div className="flex justify-center">
          <button
            onClick={handleBack}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2 rounded-lg transition-all duration-200"
          >
            ← Back to Bookings
          </button>
        </div>
      </div>
    );
  }

  // Show booking details if booking is found
  if (selectedBooking) {
    return (
      <div className="md:mx-[5%] space-y-12 mb-9">
        <BookingDetails
          booking={selectedBooking}
          onBack={handleBack}
          onBookingUpdate={(updatedBooking) => {
            // Update is handled by the store, but we can refresh if needed
            if (updatedBooking.id === bookingId) {
              fetchBookingById(bookingId);
            }
          }}
        />
      </div>
    );
  }

  // Fallback loading state
  return (
    <div className="md:mx-[5%] space-y-12 mb-9">
      <div className="flex items-center justify-center min-h-[400px]">
        <SkeletonCard />
      </div>
    </div>
  );
}

