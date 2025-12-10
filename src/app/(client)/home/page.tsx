import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import HeroSection from "@/components/hero/page";
import { SkeletonPageContent, SkeletonTestimonial } from "@/components/ui/skeleton";

// Lazy load heavy sections
const WhyChooseUs = dynamic(() => import("./whychooseus/WhyChooseUs"), {
  loading: () => <SkeletonPageContent />,
  ssr: true,
});

const OurHostels = dynamic(() => import("./our-hostels/OurHostels"), {
  loading: () => <SkeletonPageContent />,
  ssr: true,
});

const Testimonials = dynamic(() => import("./testimonials/Testimonials").then(m => ({ default: m.Testimonials })), {
  loading: () => <div className="space-y-4"><SkeletonTestimonial /></div>,
  ssr: true,
});

export default function HomePage() {
  return (
    <div>
      <HeroSection />
      <Suspense fallback={<SkeletonPageContent />}>
        <WhyChooseUs />
      </Suspense>
      <Suspense fallback={<SkeletonPageContent />}>
        <OurHostels />
      </Suspense>
      <Suspense fallback={<div className="space-y-4"><SkeletonTestimonial /></div>}>
        <Testimonials />
      </Suspense>
    </div>
  );
}
