"use client";

import { images } from "@/lib/images";
import React from "react";
import FeatureCard from "./_components/FeatureCard";
import { motion, Variants } from "framer-motion";

export default function WhyChooseUs() {
  const features = [
    {
      icon: images.secureBooking,
      title: "Secure Booking",
      description:
        "Safe and secure payment processing with multiple payment options including mobile money",
    },
    {
      icon: images.support,
      title: "24/7 Support",
      description:
        "Round-the-clock customer support via live chat and WhatsApp for all your queries",
    },
    {
      icon: images.student,
      title: "Student Focused",
      description:
        "Designed specifically for university students with affordable pricing and flexible options",
    },
  ];

  // Parent container variants for staggered children
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  // Heading animation variants
  const headingVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.42, 0, 0.58, 1] }, // cubic-bezier for TS compatibility
    },
  };

  return (
    <motion.div
      className="flex flex-col my-12 justify-center items-center"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <motion.h1
        className="text-2xl md:text-5xl font-bold"
        variants={headingVariants}
      >
        Why Choose Us?
      </motion.h1>

      <motion.div
        className="flex flex-wrap gap-6 my-12 justify-center"
        variants={containerVariants} // staggered animation for cards
      >
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </motion.div>
    </motion.div>
  );
}
