
export default function RoomTypeCard({ roomType, roomTypeData, onBook }: RoomTypeCardProps) {
  // Get availability from roomTypeData
  const totalAvailable = roomTypeData.available || 0;
  const totalRooms = roomTypeData.total || 0;

  // Get price - handle both number and object formats
  const price = typeof roomTypeData.price === 'number'
    ? roomTypeData.price
    : roomTypeData.price?.min || 0;

  // Use the title from roomTypeData or default labels
  let typeLabel = roomTypeData.title;
  if (!typeLabel) {
    if (roomType === 'SINGLE') typeLabel = 'One-in-one';
    else if (roomType === 'DOUBLE') typeLabel = 'Two-in-one';
    else if (roomType === 'TRIPLE' || roomType === 'TP') typeLabel = 'Three-in-one';
    else typeLabel = 'Room';
  }
  let capacity = 1;
  if (roomType === 'DOUBLE') capacity = 2;
  else if (roomType === 'TRIPLE' || roomType === 'TP') capacity = 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col transition-transform hover:shadow-lg w-full"
    >
      {/* Image */}
      <div className="relative w-full h-64 md:h-72 lg:h-80">
        <Image
          src={
            roomType === 'SINGLE'
              ? images.oneInRoom
              : roomType === 'DOUBLE'
              ? images.twoInRoom
              : images.threeInRoom
          }
          alt={typeLabel}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg md:text-xl font-semibold text-gray-800">
            {typeLabel}
          </h3>
          <p className="text-green-700 font-semibold text-sm md:text-base">
            GHC {price.toLocaleString()}
          </p>
        </div>

        <p className="text-gray-600 text-sm mb-2">
          {typeLabel} with shared amenities and facilities
        </p>

        {/* Availability Badge - Prominently displayed */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-green-700">
              {totalAvailable} {totalAvailable === 1 ? 'room' : 'rooms'} left
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>Capacity: {capacity} person{capacity > 1 ? 's' : ''}</span>
          </div>
          {totalRooms > 0 && (
            <div className="flex items-center gap-1 text-gray-500">
              <span>{totalRooms} total rooms</span>
            </div>
          )}
        </div>

        {/* Button */}
        <button
          onClick={() => onBook(roomType)}
          disabled={totalAvailable === 0}
          className={`mt-auto cursor-pointer font-semibold py-3 rounded-md transition-colors text-sm md:text-base ${
            totalAvailable === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-[#FDD835] hover:bg-[#FBC02D] text-gray-900'
          }`}
        >
          {totalAvailable === 0 ? 'Fully Booked' : 'Book Now'}
        </button>
      </div>
    </motion.div>
  );
}


import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Users, CheckCircle } from "lucide-react";
import { images } from "@/lib/images";


