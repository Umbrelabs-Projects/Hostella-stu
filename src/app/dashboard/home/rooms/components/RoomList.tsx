"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { useHostelStore } from "@/store/useHostelStore";
import RoomTypeCard from "./RoomTypeCard";
import { ErrorState } from "@/components/ui/error";
import { SkeletonCardGrid } from "@/components/ui/skeleton";

export default function RoomList() {
  const params = useParams();
  const router = useRouter();
  const hostelId = params?.id as string;
  const { selectedHostel, loading, error } = useHostelStore();

  const handleBook = (roomType: 'SINGLE' | 'DOUBLE') => {
    router.push(`/dashboard/home/extra-booking-details/${hostelId}?type=${roomType}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4 md:px-8">
        <SkeletonCardGrid count={2} />
      </div>
    );
  }

  if (error || !selectedHostel) {
    return (
      <div className="min-h-screen py-12 px-4 md:px-8">
        <ErrorState message={error || "Hostel not found"} onRetry={() => hostelId && window.location.reload()} />
      </div>
    );
  }

  // Get room types from hostel data
  const roomTypes = selectedHostel.roomTypes || [];
  
  // Find One-in-one and Two-in-one room types
  const oneInOne = roomTypes.find(rt => rt.type === 'One-in-one' || rt.title === 'One-in-one');
  const twoInOne = roomTypes.find(rt => rt.type === 'Two-in-one' || rt.title === 'Two-in-one');

  return (
    <motion.section
      className="min-h-screen py-12 px-4 md:px-8 flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
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
          {!oneInOne && !twoInOne && (
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
