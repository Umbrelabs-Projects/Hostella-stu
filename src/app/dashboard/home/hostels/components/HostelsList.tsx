"use client";

import { useState } from "react";
import SearchBar from "../../components/SearchBar";
import HostelCard from "../HostelCard";
import { hostelsData } from "@/lib/constants";
  

export default function HostelsList() {
  const [query, setQuery] = useState("");

  const filteredHostels = hostelsData.filter((h) =>
    h.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen py-12 px-4 md:px-8">
      <SearchBar value={query} onChange={setQuery} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {filteredHostels.length > 0 ? (
          filteredHostels.map((hostel) => (
            <HostelCard key={hostel.id} hostel={hostel} />
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No hostels found.
          </p>
        )}
      </div>
    </div>
  );
}
