"use client";

import Image, { StaticImageData } from "next/image";
import React from "react";

interface RoomCardProps {
  image: string | StaticImageData;
  title: string;
  price: string;
  description: string;
  available: string;
  onBook: () => void;
}

export default function RoomCard({
  image,
  title,
  price,
  description,
  available,
  onBook,
}: RoomCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col transition-transform hover:-translate-y-1 hover:shadow-lg w-full">
      {/* Image */}
      <div className="relative w-full h-64 md:h-72 lg:h-80">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg md:text-xl font-semibold text-gray-800">
            {title}
          </h3>
          <p className="text-green-700 font-semibold text-sm md:text-base">
            {price}
          </p>
        </div>

        <p className="text-gray-600 text-sm mb-2">{description}</p>
        <p className="text-green-800 font-semibold text-sm mb-6">{available}</p>

        {/* Button */}
        <button
          onClick={onBook}
          className="mt-auto cursor-pointer bg-[#FDD835] hover:bg-[#FBC02D] text-gray-900 font-semibold py-3 rounded-md transition-colors text-sm md:text-base"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
