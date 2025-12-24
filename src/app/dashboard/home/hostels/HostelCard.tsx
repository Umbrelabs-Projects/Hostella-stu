"use client";

import Image from "next/image";
import { Star, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { Hostel } from "@/types/api";

interface HostelCardProps {
  hostel: Hostel;
}

export default function HostelCard({ hostel }: HostelCardProps) {
  const router = useRouter();

  const handleViewRooms = () => {
    router.push(`/dashboard/home/rooms/${String(hostel.id)}`);
  };

  // Handle null/undefined values
  const displayLocation = hostel.location || "Location not specified";
  const displayDescription = hostel.description || "No description available";
  const displayImage = hostel.image || "/placeholder-hostel.jpg";
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col h-full">
      <div className="relative w-full h-48">
        <Image
          src={displayImage}
          alt={hostel.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="flex flex-col justify-between h-full">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-lg">{hostel.name}</h3>
            <div className="flex items-center gap-1 text-yellow-500">
              <Star size={16} />
              <span className="text-sm text-gray-700">{hostel.rating || 0}</span>
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-1">{displayDescription}</p>
          <div className="flex items-center mt-2 text-gray-600 text-sm">
            <MapPin size={14} className="mr-1" /> {displayLocation}
          </div>
        </div>
        <button
          onClick={handleViewRooms}
          className="mt-4 w-full cursor-pointer bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 rounded-lg transition"
        >
          View Room Types
        </button>
      </div>
    </div>
  );
}
