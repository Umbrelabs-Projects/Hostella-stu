"use client";

import React, { Suspense } from "react";
import PaymentMessage from "../reusablecomponent/PaymentMessage";
import MomoDetails from "./components/MomoDetails";
import { SkeletonCard } from "@/components/ui/skeleton";

export default function MomoPayment() {
  return (
    <div className="flex flex-col items-center px-4 py-8">
      {/* Top Section (Responsive) */}
      <div className="flex flex-col md:flex-row items-start justify-center gap-8 w-full max-w-5xl">
        {/* Left: Success Message */}
        <PaymentMessage />

        {/* Right: Momo Details */}
        <Suspense fallback={<SkeletonCard />}>
          <MomoDetails />
        </Suspense>
      </div>
    </div>
  );
}
