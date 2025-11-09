"use client";
import React from "react";
import { images } from "@/lib/images";
import RoomBanner from "../components/RoomBanner";
import { useParams } from "next/navigation";
import { hostelsData } from "@/lib/constants";
import RoomList from "../components/RoomList";

export default function Room() {
  const { id } = useParams();
  const hostel = hostelsData.find((h) => h.id === Number(id));

  if (!hostel) {
    return <p className="text-center text-gray-500 mt-10">Hostel not found</p>;
  }

  return (
    <div className="md:mx-[5%]">
      <RoomBanner
        heading={`Explore rooms of ${hostel.name}`}
        paragraph="Choose a room type"
        image={images.roomBanner}
      />
      <RoomList />
    </div>
  );
}
