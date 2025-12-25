"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { FileText } from "lucide-react";
import { Booking } from "@/types/api";

interface MoveInInstructionsProps {
  booking: Booking;
}

export default function MoveInInstructions({ booking }: MoveInInstructionsProps) {
  const router = useRouter();

  if (booking.status !== 'room_allocated') {
    return null;
  }

  return (
    <button
      onClick={() => router.push(`/dashboard/booking/move-in-instructions/${booking.id}`)}
      className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:scale-105 flex items-center gap-2"
    >
      <FileText size={18} />
      View Move-in Instructions
    </button>
  );
}

