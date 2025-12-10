"use client";

import React, { useEffect } from "react";
import HostelCard from "./components/HostelCard";
import { useHostelStore } from "@/store/useHostelStore";
import { SkeletonPageContent } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error";
import { EmptyState } from "@/components/ui/empty-state";

export default function OurHostels() {
  const { hostels, loading, error, fetchFeaturedHostels } = useHostelStore();

  useEffect(() => {
    fetchFeaturedHostels();
  }, [fetchFeaturedHostels]);

  if (loading) return <SkeletonPageContent />;
  if (error) return <ErrorState message={error} onRetry={fetchFeaturedHostels} />;
  if (!hostels || hostels.length === 0) {
    return <EmptyState title="No hostels available" description="Check back soon" />;
  }

  return (
    <div className="flex flex-col my-12 justify-center items-center">
      <h1 className="text-2xl md:text-5xl font-bold mb-10">Our Hostels</h1>
      {hostels.map((hostel, index) => {
        const position: "left" | "right" = index % 2 === 0 ? "right" : "left";
        return (
          <HostelCard
            key={hostel.id}
            image={hostel.image}
            title={hostel.name}
            description={hostel.description}
            infoPosition={position}
          />
        );
      })}
    </div>
  );
}
