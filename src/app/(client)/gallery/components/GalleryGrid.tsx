"use client";

import React from "react";
import GalleryCard from "./GalleryCard";

interface ImageType {
  src: string;
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
          grid 
          grid-cols-2 sm:grid-cols-3 
          gap-4 
          auto-rows-[10px]
        "
      >
        {images.map((image, index) => (
          <GalleryCard key={index} image={image} index={index} />
        ))}
      </div>
    </main>
  );
}
