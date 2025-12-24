"use client";
import React, { useEffect } from "react";
import { images } from "@/lib/images";
import RoomBanner from "../components/RoomBanner";
import { useParams } from "next/navigation";
import { useHostelStore } from "@/store/useHostelStore";
import RoomList from "../components/RoomList";
import { SkeletonBanner } from "@/components/ui/skeleton";

export default function Room() {
  const { id } = useParams();
  const hostelId = id as string;
  const { selectedHostel, loading, error, fetchHostelById } = useHostelStore();

  useEffect(() => {
    if (hostelId) {
      fetchHostelById(hostelId);
    }
  }, [hostelId, fetchHostelById]);

  // Silently retry on error
  useEffect(() => {
    if (hostelId && error && !loading) {
      const retryTimer = setTimeout(() => {
        fetchHostelById(hostelId);
      }, 2000); // Retry after 2 seconds
      return () => clearTimeout(retryTimer);
    }
  }, [hostelId, error, loading, fetchHostelById]);

  // Show loading skeleton while loading or if no data yet
  if (loading || !selectedHostel) {
    return (
      <div className="md:mx-[5%]">
        <SkeletonBanner />
        <RoomList />
      </div>
    );
  }

  // If there's an error, show loading skeleton (will retry automatically)
  if (error) {
    return (
      <div className="md:mx-[5%]">
        <SkeletonBanner />
        <RoomList />
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
