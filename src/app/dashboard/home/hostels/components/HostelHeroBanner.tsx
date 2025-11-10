"use client";

import Image, { StaticImageData } from "next/image";
import { motion } from "framer-motion";
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
    <motion.div
      className="overflow-hidden"
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.section
        className="relative mt-[4.5rem] md:mt-[3rem] w-full flex flex-col md:flex-row bg-yellow-400 rounded-2xl px-[5%] md:px-12 py-10"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Left Text Section */}
        <motion.div
          className="w-full flex flex-col items-start space-y-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
        >
          <motion.h1
            className="text-sm sm:text-xl md:text-3xl w-[70%] font-semibold text-gray-900"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {heading}
          </motion.h1>

          <motion.p
            className="text-gray-700 w-[50%] text-xs md:text-lg"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {paragraph}
          </motion.p>
        </motion.div>

        {/* Right Image Section */}
        <motion.div
          className="absolute -bottom-3 right-0"
          initial={{ opacity: 0, x: 50, rotate: 10 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 80 }}
        >
          <Image src={image} alt="Banner image" className="w-40" priority />
        </motion.div>
      </motion.section>
    </motion.div>
  );
}
