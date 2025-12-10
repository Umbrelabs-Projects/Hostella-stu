"use client";

import React, { useEffect } from "react";
import HostelHeroBanner from "./components/HostelHeroBanner";
import { images } from "@/lib/images";
import HostelsList from "./components/HostelsList";
import { useHostelStore } from "@/store/useHostelStore";
import { PageLoader } from "@/components/ui/loading";
import { ErrorState } from "@/components/ui/error";

export default function Hostels() {
  const { loading, error, fetchHostels } = useHostelStore();

  useEffect(() => {
    fetchHostels();
  }, [fetchHostels]);

  if (loading) return <PageLoader />;
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
