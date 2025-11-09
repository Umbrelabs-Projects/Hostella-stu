"use client";

import { images } from "@/lib/images";
import Image, { StaticImageData } from "next/image";
import React from "react";

interface RoomBannerProps {
  heading: string;
  paragraph: string;
  image: StaticImageData;
}

export default function RoomBanner({
  heading,
  paragraph,
  image,
}: RoomBannerProps) {
  return (
    <section className="relative overflow-hidden w-full flex flex-col md:flex-row bg-[#2D2D2D] rounded-2xl px-[5%] md:px-12 py-10 ">
      <div className="absolute left-0 top-0 h-full w-3 bg-yellow-500 rounded-l-3xl" />
      {/* Left Text Section */}
      <div className="w-full pl-2 relative flex flex-col items-start space-y-4 ">
        <div className="absolute inset-0 left-0">
          <Image
            src={images.roomBannerBg}
            alt="Background"
            fill
            className="object-cover object-left"
            priority
          />
        </div>

        <h1 className="text-sm sm:text-xl md:text-3xl w-[60%] font-semibold text-yellow-500">
          {heading}
        </h1>
        <p className="text-white w-[50%] text-xs md:text-lg">{paragraph}</p>
      </div>

      <div className="absolute top-1/2 -translate-y-1/2 -right-20 z-10">
        <Image
          src={image}
          alt="Banner image"
          className="w-60 md:w-60 lg:w-80 object-contain"
          priority
        />
      </div>
    </section>
  );
}
