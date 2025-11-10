import React from "react";
import PaymentMessage from "../reusablecomponent/PaymentMessage";

export default function BankPayment() {
  return (
    <div className="min-h-screen bg-[#FFF8EC] flex flex-col items-center px-4 py-8">
      {/* Top Section (Responsive) */}
      <div className="flex flex-col md:flex-row items-start justify-center gap-8 w-full max-w-5xl">
        {/* Left: Success Message */}
        <PaymentMessage />

        {/* Right: Booking Details */}
        {/* <BookingDetailsCard /> */}
      </div>
    </div>
  );
}
