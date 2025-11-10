"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "../../components/SearchBar";
import HostelCard from "../HostelCard";
import { hostelsData } from "@/lib/constants";

export default function HostelsList() {
  const [query, setQuery] = useState("");

  const filteredHostels = hostelsData.filter((h) =>
    h.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <motion.div
      className="min-h-screen py-12 px-4 md:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Search Bar fade in */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <SearchBar value={query} onChange={setQuery} />
      </motion.div>

      {/* Hostel Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mt-8"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1 } },
        }}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {filteredHostels.length > 0 ? (
            filteredHostels.map((hostel) => (
              <motion.div
                key={hostel.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                whileHover={{ scale: 1.02 }}
              >
                <HostelCard hostel={hostel} />
              </motion.div>
            ))
          ) : (
            <motion.p
              className="text-center text-gray-500 col-span-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              No hostels found.
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
