"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useBookingStore } from "@/store/useBookingStore";
import BookingDetailsCard from "../components/BookingDetailsCard";
import BookingSuccessCard from "../components/BookingSuccessCard";
import PaymentMethodSelector from "../components/PaymentMethodSelector";
import { ErrorState } from "@/components/ui/error";
import { SkeletonCard } from "@/components/ui/skeleton";

export default function BookingConfirmation() {
  const params = useParams();
  const bookingId = params?.id as string;
  const { loading, error, fetchBookingById } = useBookingStore();

  useEffect(() => {
    if (bookingId) {
      fetchBookingById(bookingId);
    }
  }, [bookingId, fetchBookingById]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center px-4 py-8">
        <div className="flex flex-col md:flex-row items-start justify-center gap-8 w-full max-w-5xl">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }
  if (error) return <ErrorState message={error} onRetry={() => fetchBookingById(bookingId)} />;

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8">
      {/* Top Section (Responsive) */}
      <div className="flex flex-col md:flex-row items-start justify-center gap-8 w-full max-w-5xl">
        {/* Left: Success Message */}
        <BookingSuccessCard />

        {/* Right: Booking Details */}
        <BookingDetailsCard />
      </div>

      {/* Payment Section */}
      <PaymentMethodSelector />
    </div>
  );
}
