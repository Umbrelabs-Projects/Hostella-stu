"use client";

import React, { useState, useEffect } from "react";
import { useBookingStore } from "@/store/useBookingStore";
import BookingDetails from "./status/components/BookingDetails";
import BookingList from "./status/components/BookingList";
import { Booking } from "@/types/bookingStatus";
import HostelHeroBanner from "../home/hostels/components/HostelHeroBanner";
import { images } from "@/lib/images";
import { ErrorState } from "@/components/ui/error";
import { EmptyState } from "@/components/ui/empty-state";
import { SkeletonBanner, SkeletonList } from "@/components/ui/skeleton";

export default function Bookings() {
  const { bookings, loading, error, fetchUserBookings } = useBookingStore();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    fetchUserBookings();
  }, [fetchUserBookings]);

  if (loading) {
    return (
      <div className="md:mx-[5%] space-y-12 mb-9">
        <SkeletonBanner />
        <SkeletonList count={3} />
      </div>
    );
  }
  if (error) return <ErrorState message={error} onRetry={fetchUserBookings} />;

  return (
    <div className="md:mx-[5%] space-y-12 mb-9">
      <HostelHeroBanner
        heading="My Booking Status"
        paragraph="From payment to getting your room"
        image={images.dashboardImg}
      />
      {!selectedBooking ? (
        bookings.length === 0 ? (
          <EmptyState title="No bookings yet" description="Start booking a hostel room" />
        ) : (
          <BookingList
            bookings={bookings}
            onViewDetails={(b) => setSelectedBooking(b)}
          />
        )
      ) : (
        <BookingDetails
          booking={selectedBooking}
          onBack={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
}
