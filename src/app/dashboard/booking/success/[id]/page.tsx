"use client";

import BookingDetailsCard from "../components/BookingDetailsCard";
import BookingSuccessCard from "../components/BookingSuccessCard";
import PaymentMethodSelector from "../components/PaymentMethodSelector";

export default function BookingConfirmation() {
  return (
    <div className="min-h-screen bg-[#FFF8EC] flex flex-col items-center px-4 py-8">
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
