"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { HeroCarousel } from "./HeroCarousel";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen flex flex-col justify-center items-center text-center font-poppins overflow-hidden">
      {/* Background Carousel */}
      <HeroCarousel />

      {/* Overlay content */}
      <motion.div
        className="absolute z-10 flex flex-col items-center justify-center space-y-6 px-6"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <motion.h1
          className="text-4xl md:text-5xl font-semibold text-white drop-shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Book easy, book smart
        </motion.h1>
        <motion.p
          className="text-white/90 max-w-xl text-sm md:text-base leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          Enjoy an unforgettable stay at Hostella with our premium rooms,
          top-tier service, and cozy atmosphere for your perfect getaway.
        </motion.p>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <Link href="/signup">
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-white cursor-pointer text-lg font-semibold px-10 py-6 rounded-full shadow-lg">
              BOOK NOW
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
