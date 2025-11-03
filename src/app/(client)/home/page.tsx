import React from "react";
import HeroSection from "@/components/hero/page";
import WhyChooseUs from "./whychooseus/WhyChooseUs";
import OurHostels from "./our-hostels/OurHostels";

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <WhyChooseUs />
      <OurHostels />
    </div>
  );
}
