import { images } from "@/lib/images";
import Image from "next/image";
import React from "react";

export default function AboutUsHero() {
  return (
    <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden">
      {/* Background Image */}
      <Image
        src={images.room1}
        alt="room"
        fill
        className="object-cover"
        priority
      />

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-black opacity-40"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white p-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold leading-tight mb-4">
          Where Comfort Meets Hospitality
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl font-light">
          Your Home Away From Home
        </p>
      </div>
    </div>
  );
}
