"use client";

import Image, { StaticImageData } from "next/image";
import React from "react";

interface HostelHeroBannerProps {
  heading: string;
  paragraph: string;
  image: StaticImageData;
}

export default function HostelHeroBanner({
  heading,
  paragraph,
  image,
}: HostelHeroBannerProps) {
  return (
    <div className="overflow-hidden">
      <section className="relative mt-[4.5rem] md:mt-[3rem] w-full flex flex-col md:flex-row bg-yellow-400 rounded-2xl px-[5%] md:px-12 py-10 ">
        {/* Left Text Section */}
        <div className="w-full flex flex-col items-start space-y-4 ">
          <h1 className="text-sm sm:text-xl md:text-3xl w-[70%] font-semibold text-gray-900">
            {heading}
          </h1>
          <p className="text-gray-700 w-[50%] text-xs md:text-lg">{paragraph}</p>
        </div>

        {/* Right Image Section (absolute to overlap nicely) */}
        <div className="absolute -bottom-3 right-0">
          <Image src={image} alt="Banner image" className="w-40" priority />
        </div>
      </section>
    </div>
  );
}
