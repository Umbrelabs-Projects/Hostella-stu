"use client";

import Image, { StaticImageData } from "next/image";
import { motion, Variants } from "framer-motion";

interface FeatureCardProps {
  icon: string | StaticImageData;
  title: string;
  description: string;
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.42, 0, 0.58, 1] }, // use cubic bezier array for ease
  },
};

export default function FeatureCard({
  icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <motion.div
      className="w-[19rem] space-y-3 border-t-4 border-l-4 border-yellow-400 bg-white p-5 shadow-sm hover:shadow-md transition-shadow duration-300"
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      whileHover={{ scale: 1.05 }}
    >
      <div className="bg-yellow-400 w-fit p-2 rounded-md">
        <Image src={icon} width={40} height={40} alt={title} />
      </div>
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-sm text-gray-600">{description}</p>
    </motion.div>
  );
}
