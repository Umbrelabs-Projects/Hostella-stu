"use client";

import React from "react";
import Image, { StaticImageData } from "next/image";
import { motion } from "framer-motion";
import HostelInfoCard from "./HostelInfoCard";

interface HostelCardProps {
  image: string | StaticImageData;
  title: string;
  description: string;
  infoPosition?: "left" | "right";
}

export default function HostelCard({
  image,
  title,
  description,
  infoPosition = "left",
}: HostelCardProps) {
  const isLeft = infoPosition === "left";

  // Shared animation props
  const fadeIn = {
    initial: { opacity: 0, x: isLeft ? -50 : 50 },
    whileInView: { opacity: 1, x: 0 },
    transition: { duration: 0.6 },
  };

  // Reusable info card
  const InfoCard = (
    <motion.div {...fadeIn}>
      <HostelInfoCard
        title={title}
        description={description}
      />
    </motion.div>
  );

  return (
    <div className="relative w-full my-10">
      {/* ===== Desktop View ===== */}
      <div className="hidden md:block relative w-full h-[30rem] overflow-hidden ">
        {/* Background Image */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 h-full mx-[4rem] w-auto"
        >
          <Image
            src={image}
            alt={title}
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </motion.div>

        {/* Overlay Info Card */}
        <div
          className={`absolute top-1/2 transform -translate-y-1/2 ${
            isLeft ? "left-50" : "right-50"
          }`}
        >
          {InfoCard}
        </div>
      </div>

      {/* ===== Mobile View ===== */}
      <div className="flex flex-col md:hidden items-center gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <Image
            src={image}
            alt={title}
            width={600}
            height={400}
            className=" object-cover w-full h-[300px]"
          />
        </motion.div>

        <div className="w-full flex justify-center">{InfoCard}</div>
      </div>
    </div>
  );
}
