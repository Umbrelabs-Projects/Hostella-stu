"use client";

import React from "react";
import GalleryHeader from "./components/GalleryHeader";
import GalleryGrid from "./components/GalleryGrid";

const images = [
  // Bathrooms
  { src: "/images/gallery/bathroom1.jpg", alt: "Elegant modern bathroom" },
  { src: "/images/gallery/kitchen1.jpg", alt: "Luxury kitchen lighting" },
  { src: "/images/gallery/kitchen2.jpg", alt: "Bright kitchen with white cabinets" },
  { src: "/images/gallery/bathroom2.jpg", alt: "Stylish yellow bathroom" },

  // Dorms
  { src: "/images/gallery/room1.jpg", alt: "Three-bed student room" },
  { src: "/images/gallery/room2.jpg", alt: "Bunk-bed hostel room" },

  // Building exteriors
  { src: "/images/gallery/building1.jpg", alt: "Red hostel exterior" },
  { src: "/images/gallery/building2.jpg", alt: "Yellow hostel building" },
  { src: "/images/gallery/building3.jpg", alt: "Mixed color hostel facade" },

  // Common spaces
  { src: "/images/gallery/library.jpg", alt: "Library and reading lounge" },
  { src: "/images/gallery/classroom.jpg", alt: "Lecture room with chairs" },
];

export default function Gallery() {
  return (
    <div className="min-h-screen mt-8 bg-white text-gray-800 font-sans">
      <GalleryHeader />
      <GalleryGrid images={images} />
    </div>
  );
}
