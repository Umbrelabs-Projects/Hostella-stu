"use client";

import { images } from "@/lib/images";
import Image, { StaticImageData } from "next/image";
import React from "react";
import { motion } from "framer-motion";

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
    <motion.section
      className="relative overflow-hidden w-full flex flex-col md:flex-row bg-[#2D2D2D] rounded-2xl px-[5%] md:px-12 py-10"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Yellow side bar */}
      <motion.div
        className="absolute left-0 top-0 h-full w-3 bg-yellow-500 rounded-l-3xl"
        initial={{ height: 0 }}
        animate={{ height: "100%" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      />

      {/* Left Text Section */}
      <motion.div
        className="w-full pl-2 relative flex flex-col items-start space-y-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.2 } },
        }}
      >
        {/* Background Image */}
        <motion.div
          className="absolute inset-0 left-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <Image
            src={images.roomBannerBg}
            alt="Background"
            fill
            className="object-cover object-left"
            priority
          />
        </motion.div>

        {/* Heading */}
        <motion.h1
          className="text-sm sm:text-xl md:text-3xl w-[60%] font-semibold text-yellow-500"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {heading}
        </motion.h1>

        {/* Paragraph */}
        <motion.p
          className="text-white w-[50%] text-xs md:text-lg"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {paragraph}
        </motion.p>
      </motion.div>

      {/* Right Image */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 -right-20 z-10"
        initial={{ opacity: 0, x: 50, rotate: 10 }}
        animate={{ opacity: 1, x: 0, rotate: 0 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 90 }}
      >
        <Image
          src={image}
          alt="Banner image"
          className="w-60 md:w-60 lg:w-80 object-contain"
          priority
        />
      </motion.div>
    </motion.section>
  );
}
