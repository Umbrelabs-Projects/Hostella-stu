"use client";

import React from "react";
import { motion } from "framer-motion";

interface MetricCardProps {
  value: string | number;
  label: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ value, label }) => {
  return (
    <motion.div
      className="flex flex-col cursor-default items-center text-center p-4"
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 150 }}
    >
      <h3 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-gray-900 mb-2 leading-none">
        {value}
      </h3>
      <p className="text-sm sm:text-base font-medium uppercase tracking-wider text-yellow-400">
        {label}
      </p>
    </motion.div>
  );
};

export default MetricCard;
