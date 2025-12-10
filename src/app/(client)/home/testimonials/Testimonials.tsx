"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import TestimonialCard from "./components/TestimonialCard";
import { useTestimonialStore } from "@/store/useTestimonialStore";
import { ErrorState } from "@/components/ui/error";
import { EmptyState } from "@/components/ui/empty-state";
import { SkeletonTestimonial } from "@/components/ui/skeleton";

export function Testimonials() {
  const { testimonials, loading, error, fetchTestimonials } = useTestimonialStore();
  const autoplay = React.useMemo(
    () => Autoplay({ delay: 4000, stopOnInteraction: false }),
    []
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [autoplay]);
  const [prevEnabled, setPrevEnabled] = React.useState(false);
  const [nextEnabled, setNextEnabled] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  React.useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  const onSelect = React.useCallback(() => {
    if (!emblaApi) return;
    setPrevEnabled(emblaApi.canScrollPrev());
    setNextEnabled(emblaApi.canScrollNext());
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  React.useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  if (loading) {
    return (
      <section className="md:px-[5%] text-white">
        <h1 className="text-2xl md:text-5xl font-bold text-center text-black mb-10">Testimonials</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <SkeletonTestimonial key={i} />
          ))}
        </div>
      </section>
    );
  }
  if (error) return <ErrorState message={error} onRetry={fetchTestimonials} />;
  if (!testimonials || testimonials.length === 0) {
    return <EmptyState title="No testimonials yet" description="Check back soon for customer reviews" />;
  }

  return (
    <section className="md:px-[5%] text-white">
      <h1 className="text-2xl md:text-5xl font-bold text-center text-black">Testimonials</h1>
      <div className="relative w-full py-12 text-center space-y-6">
        {/* Carousel */}
        <div className="overflow-hidden w-[70%] mx-auto" ref={emblaRef}>
          <div className="flex gap-8 sm:gap-0">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="min-w-0 flex-[0_0_100%] sm:flex-[0_0_50%] md:flex-[0_0_35%] lg:flex-[0_0_33%] px-2"
              >
                <TestimonialCard testimonial={testimonial} />
              </div>
            ))}
          </div>
        </div>

        {/* Arrows */}
        <div className="absolute pb-12 inset-y-1/2 -translate-y-1/2 hidden md:flex justify-between w-full px-4 md:px-[4%] lg:px-[8%]">
          <Button
            className="rounded-full border border-[#FFB636] cursor-pointer hover:text-white"
            size="icon"
            variant="ghost"
            onClick={scrollPrev}
            disabled={!prevEnabled}
          >
            <ChevronLeft className="w-5 h-5 text-[#FFB636] hover:text-white" />
          </Button>
          <Button
            className="rounded-full border border-[#FFB636] cursor-pointer hover:text-white"
            size="icon"
            variant="ghost"
            onClick={scrollNext}
            disabled={!nextEnabled}
          >
            <ChevronRight className="w-5 h-5 text-[#FFB636] hover:bg-white" />
          </Button>
        </div>

        {/* Dots (Looping, only 3 visible) */}
        <div className="flex justify-center mt-6 md:mt-10 gap-2">
          {Array.from({ length: 3 }).map((_, i) => {
            // create a "looping" index so dots repeat smoothly
            const loopedIndex = selectedIndex % 3;

            return (
              <button
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i === loopedIndex
                    ? "bg-yellow-400 scale-110"
                    : "bg-yellow-200 opacity-60"
                }`}
                onClick={() => emblaApi?.scrollTo(i)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
