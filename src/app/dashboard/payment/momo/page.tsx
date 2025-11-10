import React from "react";
import PaymentMessage from "../reusablecomponent/PaymentMessage";
import MomoDetails from "./components/MomoDetails";

export default function BankPayment() {
  return (
    <div className=" bg-[#FFF8EC] flex flex-col items-center px-4 py-">
      {/* Top Section (Responsive) */}
      <div className="flex flex-col md:flex-row items-start justify-center gap-8 w-full max-w-5xl">
        {/* Left: Success Message */}
        <PaymentMessage />

        {/* Right: Momo Details */}
        <MomoDetails />
      </div>
    </div>
  );
}
