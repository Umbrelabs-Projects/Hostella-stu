"use client";

import AboutCard from "../_components/AboutCard";
import { motion } from "framer-motion";

export default function AboutMission() {
  const features = [
    {
      title: "OUR VISION",
      description: "Elevating hospitality, creating experiences.",
    },
    {
      title: "OUR MISSION",
      description: "Exceed expectations, cherish every moment.",
    },
  ];

  return (
    <div className="flex w-full flex-wrap gap-10 px-4 md:px-22 mb-10 justify-center">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          className="flex-1"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: index * 0.2 }}
        >
          <AboutCard {...feature} />
        </motion.div>
      ))}
    </div>
  );
}
