"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "../../components/SearchBar";
import RoomCard from "./RoomCard";
import { roomsData } from "@/lib/constants";
import { useRouter } from "next/navigation";

export default function RoomList() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const filteredRooms = roomsData.filter((room) =>
    room.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <motion.section
      className="min-h-screen py-12 px-4 md:px-8 flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Search */}
      <motion.div
        className="w-full max-w-3xl mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <SearchBar value={query} onChange={setQuery} />
      </motion.div>

      {/* Rooms Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-6xl"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1 } },
        }}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {filteredRooms.length > 0 ? (
            filteredRooms.map((room) => (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                whileHover={{ scale: 1.03 }}
              >
                <RoomCard
                  image={room.image}
                  title={room.title}
                  price={room.price}
                  description={room.description}
                  available={room.available}
                  onBook={() =>
                    router.push(
                      `/dashboard/home/extra-booking-details/${room.id}`
                    )
                  }
                />
              </motion.div>
            ))
          ) : (
            <motion.p
              className="text-gray-500 text-center col-span-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              No rooms found matching “{query}”
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.section>
  );
}
