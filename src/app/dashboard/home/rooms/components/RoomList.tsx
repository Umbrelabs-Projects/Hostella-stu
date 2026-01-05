"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useHostelStore } from "@/store/useHostelStore";
import RoomTypeCard from "./RoomTypeCard";
import { SkeletonRoomTypeGrid } from "@/components/ui/skeleton";

export default function RoomList() {
  const params = useParams();
  const router = useRouter();
  const hostelId = params?.id as string;
  const { selectedHostel, loading, error } = useHostelStore();

  const handleBook = (roomType: 'SINGLE' | 'DOUBLE' | 'TRIPLE' | 'TP') => {
    router.push(`/dashboard/home/extra-booking-details/${hostelId}?type=${roomType}`);
  };

  // Show loading skeleton while loading or if no data yet
  if (loading || !selectedHostel || error) {
    return (
      <section className="min-h-screen py-12 px-4 md:px-8 flex flex-col items-center">
        <SkeletonRoomTypeGrid count={3} />
      </section>
    );
  }

  // Get room types from hostel data
  const roomTypes = selectedHostel.roomTypes || [];

  // Find One-in-one, Two-in-one, and Three-in-one room types
  const oneInOne = roomTypes.find(rt => rt.type === 'One-in-one' || rt.title === 'One-in-one' || rt.value === 'SINGLE');
  const twoInOne = roomTypes.find(rt => rt.type === 'Two-in-one' || rt.title === 'Two-in-one' || rt.value === 'DOUBLE');
  const threeInOne = roomTypes.find(rt => rt.type === 'Three-in-one' || rt.title === 'Three-in-one' || rt.value === 'TRIPLE' || rt.value === 'TP');

  return (
    <motion.section
      className="min-h-screen py-12 px-4 md:px-8 flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Rooms Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-6xl"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1 } },
        }}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {oneInOne && (
            <RoomTypeCard
              key="one-in-one"
              roomType="SINGLE"
              roomTypeData={oneInOne}
              onBook={handleBook}
            />
          )}
          {twoInOne && (
            <RoomTypeCard
              key="two-in-one"
              roomType="DOUBLE"
              roomTypeData={twoInOne}
              onBook={handleBook}
            />
          )}
          {threeInOne && (
            <RoomTypeCard
              key="three-in-one"
              roomType="TRIPLE"
              roomTypeData={threeInOne}
              onBook={handleBook}
            />
          )}
          {!oneInOne && !twoInOne && !threeInOne && (
            <motion.div
              key="no-rooms"
              className="text-center col-span-full py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <p className="text-gray-500 text-lg mb-2">No rooms available</p>
              <p className="text-gray-400 text-sm">This hostel doesn&apos;t have any rooms listed yet.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.section>
  );
}
