import React from "react";
import PaymentMessage from "../reusablecomponent/PaymentMessage";
import BankDetails from "./components/BankDetails";

export default function BankPayment() {
  return (
    <div className="min-h-screen bg-[#FFF8EC] flex flex-col items-center px-4 py-8">
      <div className="flex flex-col md:flex-row items-start justify-center gap-8 w-full max-w-5xl">
        <PaymentMessage />
        <BankDetails />
      </div>
    </div>
  );
}
