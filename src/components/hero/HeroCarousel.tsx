"use client";

import * as React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const slides = [
  "/assets/images/room1.jpg",
  "/assets/images/room2.jpg",
  "/assets/images/room3.jpg",
];

export function HeroCarousel() {
  const plugin = React.useMemo(
    () =>
      Autoplay({
        delay: 5000,
        stopOnInteraction: false,
      }),
    []
  );

  return (
    <Carousel
      plugins={[plugin]}
      onMouseEnter={plugin.stop}
      onMouseLeave={plugin.reset}
      className="absolute inset-0 w-full h-full -z-10 overflow-hidden"
    >
      <CarouselContent>
        {slides.map((img, index) => (
          <CarouselItem
            key={index}
            className="relative min-w-full h-[85vh] overflow-hidden"
          >
            <Image
              src={img}
              alt={`Hostella room ${index + 1}`}
              fill
              className="object-cover brightness-75 transition-all duration-700"
              priority
            />
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Navigation arrows (optional but elegant) */}
      <CarouselPrevious className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-yellow-100 rounded-full shadow-md" />
      <CarouselNext className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-yellow-100 rounded-full shadow-md" />
    </Carousel>
  );
}
