"use client";

import React from "react";
import MetricCard from "../_components/MetricCard";
import { motion } from "framer-motion";

const metrics = [
  { value: "17+", label: "Years of Hospitality" },
  { value: "580+", label: "Luxurious Rooms" },
  { value: "40+", label: "Dedicated Staff" },
];

const KeyMetrics: React.FC = () => {
  return (
    <div className="w-full bg-white py-12 md:py-16 font-sans">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12">
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <MetricCard value={metric.value} label={metric.label} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KeyMetrics;
