import { images } from "@/lib/images";
import React from "react";
import HostelHeroBanner from "./components/reusable/HostelHeroBanner";

export default function page() {
  return (
    <div>
      <HostelHeroBanner
        heading="Find Your Perfect Hostel"
        paragraph="Choose a room made with you in mind"
        image={images.dashboardImg}
      />
    </div>
  );
}
