"use client";

import React from "react";
import GalleryHeader from "./components/GalleryHeader";
import GalleryGrid from "./components/GalleryGrid";
import { gallery } from "@/lib/images";

const images = [
  { src: gallery.gallery1, alt: "Lecture room with chairs" },
  { src: gallery.gallery2, alt: "Library and reading lounge" },
  { src: gallery.gallery3, alt: "Mixed color hostel facade" },
  { src: gallery.gallery4, alt: "Yellow hostel building" },
  { src: gallery.gallery5, alt: "Red hostel exterior" },
  { src: gallery.gallery6, alt: "Three-bed student room" },
  { src: gallery.gallery7, alt: "Bunk-bed hostel room" },
  { src: gallery.gallery8, alt: "Stylish yellow bathroom" },
  { src: gallery.gallery9, alt: "Bright kitchen with white cabinets" },
  { src: gallery.gallery10, alt: "Luxury kitchen lighting" },
  { src: gallery.gallery11, alt: "Elegant modern bathroom" },
];

export default function Gallery() {
  return (
    <div className="min-h-screen mt-8 bg-white text-gray-800 font-sans">
      <GalleryHeader />
      <GalleryGrid images={images} />
    </div>
  );
}
