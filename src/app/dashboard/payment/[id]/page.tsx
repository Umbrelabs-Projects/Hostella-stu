"use client";
import { hostelsData, roomsData } from "@/lib/constants";
import { useParams } from "next/navigation";
import React from "react";

export default function Payment() {
  const { id } = useParams();
  const room = roomsData.find((r) => r.id === Number(id));
  const hostel = hostelsData.find((h) => h.id === room?.id);
  if (!room || !hostel) {
    return (
      <p className="text-center text-gray-500 mt-10">
        Room or Hostel not found
      </p>
    );
  }
  return (
    <div>
      <p>{hostel.name}</p>
      <p>{room.title}</p>
    </div>
  );
}
