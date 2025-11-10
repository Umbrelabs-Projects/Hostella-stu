"use client";

import { images } from "@/lib/images";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

const OurPeople = () => {
  return (
    <div className="container mx-auto px-4 py-12 md:py-20 font-sans">
      <motion.div
        className="flex flex-col lg:flex-row items-center justify-between gap-8 max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Left Column: Text Content (was right before) */}
        <div className="w-full lg:w-1/2 lg:pr-12 space-y-4">
          <motion.p
            className="text-md font-semibold uppercase tracking-widest text-amber-400 mb-2"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Our Story
          </motion.p>

          <motion.h2
            className="text-3xl md:text-[2rem] font-extrabold text-gray-900 leading-snug mb-6"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            We embody the essence of hospitality.
          </motion.h2>

          <motion.p
            className="text-base md:text-md text-gray-600 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            At Hostella, we take pride in providing an unparalleled experience
            for our tenants. Our commitment to excellence is evident in every
            detail, from the stylish decor in our rooms to the spacious bedroom
            sizes.
          </motion.p>
        </div>

        {/* Right Column: Image (was left before) */}
        <div className="w-full lg:w-1/2 overflow-hidden rounded-xl shadow-2xl">
          <motion.div
            initial={{ scale: 0.95 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <Image
              src={images.ourPeopleImg}
              alt="Elegantly designed hotel room with open bathroom view"
              className="w-full h-auto object-cover transform transition-transform duration-500 hover:scale-105"
              loading="lazy"
              style={{ aspectRatio: "3/2" }}
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default OurPeople;
