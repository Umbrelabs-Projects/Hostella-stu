"use client";

import * as React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { images } from "@/lib/images";

const slides = [images.room1, images.room2, images.room3];

export function HeroCarousel() {
  const autoplay = React.useMemo(
    () => Autoplay({ delay: 4000, stopOnInteraction: false }),
    []
  );

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [autoplay]);
  const [prevEnabled, setPrevEnabled] = React.useState(false);
  const [nextEnabled, setNextEnabled] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

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

  return (
    <section className="relative w-full h-[85vh] overflow-hidden group">
      {/* Carousel */}
      <div className="w-full h-full overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((img, index) => (
            <div
              key={index}
              className="min-w-0 flex-[0_0_100%] relative h-[85vh]"
            >
              <Image
                src={img}
                alt={`Hostella room ${index + 1}`}
                fill
                priority
                className="object-cover brightness-75 transition-all duration-700"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      <div className="absolute hidden inset-y-1/2 -translate-y-1/2 md:flex justify-between w-full px-4 sm:px-8 md:px-12 lg:px-[8%]">
        <Button
          className="rounded-full  cursor-pointer border border-gray-400 bg-white/40 hover:bg-gray-100  shadow-md backdrop-blur-md"
          size="icon"
          variant="ghost"
          onClick={scrollPrev}
          disabled={!prevEnabled}
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <Button
          className="rounded-full cursor-pointer border border-gray-400 bg-white/40 hover:bg-gray-100 shadow-md backdrop-blur-md"
          size="icon"
          variant="ghost"
          onClick={scrollNext}
          disabled={!nextEnabled}
        >
          <ChevronRight className="w-6 h-6 " />
        </Button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-10 w-full flex justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`w-3 h-3 rounded-full transition-all ${
              i === selectedIndex ? "bg-yellow-500 scale-110" : "bg-white/40"
            }`}
            onClick={() => emblaApi?.scrollTo(i)}
          />
        ))}
      </div>
    </section>
  );
}
