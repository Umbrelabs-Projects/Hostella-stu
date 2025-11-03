"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface HostelInfoCardProps {
  title: string;
  description: string;
  buttonText?: string;
}

export default function HostelInfoCard({
  title,
  description,
  buttonText = "BOOK NOW",
}: HostelInfoCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="w-[24rem] md:w-[18rem] bg-white rounded-md shadow-md p-6 flex flex-col items-center text-center space-y-5 border-t-4 border-yellow-400"
    >
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
      <Link
        href="/signup"
        className="bg-yellow-400 hover:bg-yellow-500 transition-colors duration-200 text-white font-semibold py-3 px-8 rounded-md shadow-md"
      >
        {buttonText}
      </Link>
    </motion.div>
  );
}
