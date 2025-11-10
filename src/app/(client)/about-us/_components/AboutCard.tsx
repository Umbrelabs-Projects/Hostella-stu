"use client";

import { images } from "@/lib/images";
import Image from "next/image";
import { motion } from "framer-motion";

interface AboutCardProps {
  title: string;
  description: string;
}

export default function AboutCard({ title, description }: AboutCardProps) {
  return (
    <motion.div
      className="flex flex-row md:flex-row items-center gap-3 space-y-3 border-t-4 border-l-4 border-yellow-300 bg-white p-5 shadow-sm hover:shadow-md transition-shadow duration-300"
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 150 }}
    >
      <div className="bg-gray-200 w-fit p-2 rounded-md">
        <Image src={images.bankIcon} width={40} height={40} alt={title} />
      </div>
      <div className="w-full">
        <h2 className="text-xl text-yellow-300">{title}</h2>
        <p className="text-2xl font-semibold w-full text-gray-800">
          {description}
        </p>
      </div>
    </motion.div>
  );
}
