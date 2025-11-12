"use client";

import React from "react";
import GalleryCard from "./GalleryCard";
import { StaticImageData } from "next/image";

interface ImageType {
  src: string | StaticImageData;
  alt: string;
}

interface GalleryGridProps {
  images: ImageType[];
}

export default function GalleryGrid({ images }: GalleryGridProps) {
  return (
    <main className="container mx-auto px-4 pb-16">
      <div
        className="
          columns-2 sm:columns-3 lg:columns-4
          gap-4
          space-y-4
        "
      >
        {images.map((image, index) => (
          <GalleryCard key={index} image={image} index={index} />
        ))}
      </div>
    </main>
  );
}
