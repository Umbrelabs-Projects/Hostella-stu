"use client";

import React from "react";
import OurTeamHeader from "../_components/OurTeamHeader";
import TeamCard from "../_components/TeamCard";
import { images } from "@/lib/images";
import { motion } from "framer-motion";

export default function OurTeam() {
  const teams = [
    { id: 1, name: "John Doe", image: images.johnDoe, text: "CEO" },
    { id: 2, name: "Esther Adams", image: images.esther, text: "Desk Manager" },
    { id: 3, name: "Paul Smith", image: images.paul, text: "Project Manager" },
  ];

  return (
    <div className="w-full py-12 md:py-16 font-sans bg-white">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <OurTeamHeader />
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 mx-4 md:mx-20 mt-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          visible: { transition: { staggerChildren: 0.2 } },
          hidden: {},
        }}
      >
        {teams.map((team) => (
          <motion.div
            key={team.id}
            variants={{
              hidden: { opacity: 0, y: 20, scale: 0.95 },
              visible: { opacity: 1, y: 0, scale: 1 },
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <TeamCard team={team} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
