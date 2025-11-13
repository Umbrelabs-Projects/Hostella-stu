"use client";

import React, { useState } from "react";
import { bookings } from "./status/data/bookings";
import { hostelsData, roomsData } from "@/lib/constants";
import BookingDetails from "./status/components/BookingDetails";
import BookingList from "./status/components/BookingList";
import { Booking } from "@/types/bookingStatus";
import HostelHeroBanner from "../home/hostels/components/HostelHeroBanner";
import { images } from "@/lib/images";

export default function Bookings() {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Enrich booking data with hostel + room info
  const enrichedBookings: Booking[] = bookings.map((booking) => {
    const hostel = hostelsData.find((h) => h.id === booking.hostelId);
    const room = roomsData.find((r) => r.id === booking.roomId);

    return {
      ...booking,
      hostelName: hostel?.name || "Unknown Hostel",
      hostelImage: hostel?.image || "/default-hostel.jpg",
      roomTitle: room?.title || "Room",
      price: room?.price || "N/A",
    };
  });

  return (
    <div className="md:mx-[5%] space-y-12 mb-9">
      <HostelHeroBanner
        heading="My Booking Status"
        paragraph="From payment to getting your room"
        image={images.dashboardImg}
      />
      {!selectedBooking ? (
        <BookingList
          bookings={enrichedBookings}
          onViewDetails={(b) => setSelectedBooking(b)}
        />
      ) : (
        <BookingDetails
          booking={selectedBooking}
          onBack={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
}
