"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Loader2 } from "lucide-react";
import { Booking } from "@/types/api";

interface MoveInInstructionsProps {
  booking: Booking;
  navigatingTo?: string | null;
}

export default function MoveInInstructions({ booking, navigatingTo }: MoveInInstructionsProps) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  if (booking.status !== 'room_allocated') {
    return null;
  }

  const handleClick = () => {
    setIsNavigating(true);
    router.push(`/dashboard/booking/move-in-instructions/${booking.id}`);
  };

  return (
    <button
      onClick={handleClick}
      disabled={isNavigating || navigatingTo === 'move-in-instructions'}
      className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
    >
      {(isNavigating || navigatingTo === 'move-in-instructions') ? (
        <>
          <Loader2 size={18} className="animate-spin" />
          Loading...
        </>
      ) : (
        <>
          <FileText size={18} />
          View Move-in Instructions
        </>
      )}
    </button>
  );
}

