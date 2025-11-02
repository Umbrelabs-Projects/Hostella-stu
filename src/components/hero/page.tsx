"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { HeroCarousel } from "./HeroCarousel";

export default function HeroSection() {
  return (
    <section className="relative w-full h-[85vh] flex flex-col justify-center items-center text-center font-poppins">
      {/* Background carousel */}
      <HeroCarousel />

      {/* Overlay content */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
        <Button className="bg-yellow-500 hover:bg-yellow-600 text-black text-lg font-semibold px-10 py-6 rounded-none shadow-lg">
          BOOK NOW
        </Button>

        {/* Dots indicator (manual visual feedback only) */}
        <div className="flex space-x-2 mt-6">
          {[0, 1, 2].map((dot) => (
            <div
              key={dot}
              className="w-3 h-3 rounded-full bg-white/70 hover:bg-yellow-500 cursor-pointer transition-all"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
