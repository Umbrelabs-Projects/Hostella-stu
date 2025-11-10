"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface ImageType {
  src: string;
  alt: string;
}

interface GalleryCardProps {
  image: ImageType;
  index: number;
}

export default function GalleryCard({ image, index }: GalleryCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rowSpan, setRowSpan] = useState(1);

  useEffect(() => {
    if (containerRef.current) {
      const height = containerRef.current.scrollHeight;
      const rowHeight = 10; // must match gridAutoRows in GalleryGrid
      setRowSpan(Math.ceil(height / rowHeight) + 1); // extra row for spacing
    }
  }, []);

  return (
    <motion.div
      ref={containerRef}
      className="relative overflow-hidden rounded-lg shadow-md"
      style={{ gridRowEnd: `span ${rowSpan}` }}
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="relative w-full aspect-[4/3]"> 
        <Image
          src={image.src}
          alt={image.alt}
          fill
          className="object-cover"
          loading="lazy"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
        <p className="text-white text-lg font-semibold">{image.alt}</p>
      </div>
    </motion.div>
  );
}
