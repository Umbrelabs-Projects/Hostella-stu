"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { HeroCarousel } from "./HeroCarousel";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen flex flex-col justify-center items-center text-center font-poppins overflow-hidden">
      {/* Background Carousel */}
      <HeroCarousel />

      {/* Overlay content */}
      <div className="absolute z-10 flex flex-col items-center justify-center space-y-6 px-6">
        <h1 className="text-4xl md:text-5xl font-semibold text-white drop-shadow-lg">
          Experience Comfort. Stay with Style.
        </h1>
        <p className="text-white/90 max-w-xl text-sm md:text-base leading-relaxed">
          Enjoy an unforgettable stay at Hostella with our premium rooms,
          top-tier service, and cozy atmosphere for your perfect getaway.
        </p>
        <Link href="/signup">
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-white cursor-pointer text-lg font-semibold px-10 py-6 rounded-full shadow-lg">
            BOOK NOW
          </Button>
        </Link>
      </div>
    </section>
  );
}
