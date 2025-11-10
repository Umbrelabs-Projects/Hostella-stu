"use client";

import BookingDetailsCard from "../components/BookingDetailsCard";
import BookingSuccessCard from "../components/BookingSuccessCard";
import PaymentMethodSelector from "../components/PaymentMethodSelector";
import ProceedButton from "../components/ProceedButton";

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
      <div className="w-full max-w-3xl mt-12 flex flex-col items-center">
        <h2 className="text-lg font-semibold mb-6">Choose a Payment Method</h2>
        <PaymentMethodSelector />
        <div className="mt-8 w-full flex justify-center">
          <ProceedButton />
        </div>
      </div>
    </div>
  );
}
