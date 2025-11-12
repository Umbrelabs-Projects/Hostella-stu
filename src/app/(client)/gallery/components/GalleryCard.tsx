"use client";

import React from "react";
import { motion } from "framer-motion";
import Image, { StaticImageData } from "next/image";

interface ImageType {
  src: string | StaticImageData;
  alt: string;
}

interface GalleryCardProps {
  image: ImageType;
  index: number;
}

export default function GalleryCard({ image, index }: GalleryCardProps) {
  return (
    <motion.div
      className="relative mb-4 break-inside-avoid overflow-hidden rounded-lg shadow-md"
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
    >
      <Image
        src={image.src}
        alt={image.alt}
        width={800}
        height={600}
        className="object-cover w-full rounded-lg"
        loading="lazy"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
        <p className="text-white text-lg font-semibold">{image.alt}</p>
      </div>
    </motion.div>
  );
}
