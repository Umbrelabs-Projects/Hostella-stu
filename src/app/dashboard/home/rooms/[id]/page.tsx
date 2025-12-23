"use client";
import React, { useEffect } from "react";
import { images } from "@/lib/images";
import RoomBanner from "../components/RoomBanner";
import { useParams } from "next/navigation";
import { useHostelStore } from "@/store/useHostelStore";
import RoomList from "../components/RoomList";
import { SkeletonBanner } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error";

export default function Room() {
  const { id } = useParams();
  const hostelId = id as string;
  const { selectedHostel, loading, error, fetchHostelById } = useHostelStore();

  useEffect(() => {
    if (hostelId) {
      fetchHostelById(hostelId);
    }
  }, [hostelId, fetchHostelById]);

  if (loading) {
    return (
      <div className="md:mx-[5%]">
        <SkeletonBanner />
        <RoomList />
      </div>
    );
  }

  if (error || !selectedHostel) {
    return (
      <div className="md:mx-[5%]">
        <ErrorState
          message={error || "Hostel not found"}
          onRetry={() => hostelId && fetchHostelById(hostelId)}
        />
      </div>
    );
  }

  return (
    <div className="md:mx-[5%]">
      <RoomBanner
        heading={`Explore rooms of ${selectedHostel.name}`}
        paragraph="Choose a room type"
        image={images.roomBanner}
      />
      <RoomList />
    </div>
  );
}
