"use client";

import React, { useEffect } from "react";
import HostelHeroBanner from "./components/HostelHeroBanner";
import { images } from "@/lib/images";
import HostelsList from "./components/HostelsList";
import { useHostelStore } from "@/store/useHostelStore";
import { ErrorState } from "@/components/ui/error";
import { SkeletonBanner, SkeletonCardGrid } from "@/components/ui/skeleton";

export default function Hostels() {
  const { loading, error, fetchHostels } = useHostelStore();

  useEffect(() => {
    fetchHostels();
  }, [fetchHostels]);

  if (loading) {
    return (
      <div>
        <SkeletonBanner />
        <div className="px-4">
          <SkeletonCardGrid count={6} />
        </div>
      </div>
    );
  }
  if (error) return <ErrorState message={error} onRetry={fetchHostels} />;

  return (
    <div>
      <HostelHeroBanner
        heading="Find Your Perfect Hostel"
        paragraph="Choose a room made with you in mind"
        image={images.dashboardImg}
      />
      <HostelsList />
    </div>
  );
}
