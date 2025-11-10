"use client";

import { useState } from "react";
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
    <section className="min-h-screen bg-[#FFF8E1] py-12 px-4 md:px-8 flex flex-col items-center">
      {/* Search */}
      <div className="w-full max-w-3xl mb-8">
        <SearchBar value={query} onChange={setQuery} />
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-6xl">
        {filteredRooms.length > 0 ? (
          filteredRooms.map((room) => (
            <RoomCard
              key={room.id}
              image={room.image}
              title={room.title}
              price={room.price}
              description={room.description}
              available={room.available}
              onBook={() => router.push(`/dashboard/home/extra-booking-details/${room.id}`)}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full">
            No rooms found matching “{query}”
          </p>
        )}
      </div>
    </section>
  );
}
