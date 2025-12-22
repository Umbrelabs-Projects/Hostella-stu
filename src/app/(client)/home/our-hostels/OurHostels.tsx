"use client";

import React, { useEffect } from "react";
import HostelCard from "./components/HostelCard";
import { useHostelStore } from "@/store/useHostelStore";
import { SkeletonPageContent } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error";
import { EmptyState } from "@/components/ui/empty-state";
import { images } from "@/lib/images";

export default function OurHostels() {
  const { featuredHostels, loading, error, fetchFeaturedHostels } = useHostelStore();

  useEffect(() => {
    fetchFeaturedHostels();
  }, [fetchFeaturedHostels]);

  if (loading) return <SkeletonPageContent />;
  if (error) return <ErrorState message={error} onRetry={fetchFeaturedHostels} />;
  if (!featuredHostels || featuredHostels.length === 0) {
    return <EmptyState title="No hostels available" description="Check back soon" />;
  }

  // Show only the first 2 hostels
  const displayedHostels = featuredHostels.slice(0, 2);

  // Debug: Log the number of hostels
  console.log('Total featured hostels:', featuredHostels.length);
  console.log('Displayed hostels:', displayedHostels.length);

  return (
    <div className="flex flex-col my-12 justify-center items-center">
      <h1 className="text-2xl md:text-5xl font-bold mb-10">Our Hostels</h1>
      {displayedHostels.map((hostel, index) => {
        const position: "left" | "right" = index % 2 === 0 ? "right" : "left";
        // Use first image from images array if image is null, or fallback to default hostel image
        const displayImage = hostel.image || hostel.images?.[0] || images.hostel0;
        const displayDescription = hostel.description || "No description available";
        return (
          <HostelCard
            key={hostel.id}
            image={displayImage}
            title={hostel.name}
            description={displayDescription}
            infoPosition={position}
          />
        );
      })}
    </div>
  );
}
