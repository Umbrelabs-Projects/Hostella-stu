import React from "react";
import HostelHeroBanner from "./components/HostelHeroBanner";
import { images } from "@/lib/images";
import HostelsList from "./components/HostelsList";

export default function Hostels() {
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
