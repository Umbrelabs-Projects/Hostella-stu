"use client";

import React, { Suspense } from "react";
import PaymentMessage from "../reusablecomponent/PaymentMessage";
import BankDetails from "./components/BankDetails";
import { SkeletonCard } from "@/components/ui/skeleton";

export default function BankPayment() {
  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8">
      <div className="flex flex-col md:flex-row items-start justify-center gap-8 w-full max-w-5xl">
        <PaymentMessage />
        <div className="w-full md:w-1/2">
          <Suspense fallback={<SkeletonCard />}>
            <BankDetails />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
