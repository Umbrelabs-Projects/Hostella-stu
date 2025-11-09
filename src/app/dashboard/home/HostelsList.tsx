"use client";

import { useState } from "react";
import SearchBar from "./components/SearchBar";
import HostelCard from "./components/HostelCard";
import { images } from "@/lib/images";

const hostelsData = [
    {
      id: 1,
      name: "Lienda Ville",
      location: "Kotei",
      rating: 4.9,
      description: "Modern facilities with 24/7 security",
      image: images.hostel0,
    },
    {
      id: 2,
      name: "Gabealle Verd",
      location: "Kotei",
      rating: 4.9,
      description: "Modern facilities with 24/7 security",
      image: images.hostel1,
    },
    {
      id: 3,
      name: "WestVille",
      location: "Ayeduase",
      rating: 4.8,
      description: "Affordable rooms near campus",
      image: images.hostel2,
    },
    {
      id: 4,
      name: "NorthVille",
      location: "Bomso",
      rating: 4.8,
      description: "Affordable rooms near campus",
      image: images.hostel3,
    },
    {
      id: 5,
      name: "South Ridge Hostel",
      location: "Ayigya",
      rating: 4.7,
      description: "Spacious rooms with steady power and Wi-Fi",
      image: images.hostel0,
    },
    {
      id: 6,
      name: "EastVille Lodge",
      location: "Kentinkrono",
      rating: 4.6,
      description: "Quiet environment ideal for students",
      image: images.hostel1,
    },
    {
      id: 7,
      name: "Royal Heights",
      location: "Ayeduase",
      rating: 4.9,
      description: "Premium student residence with gym access",
      image: images.hostel2,
    },
    {
      id: 8,
      name: "Suncrest Hostel",
      location: "Kotei",
      rating: 4.7,
      description: "Comfortable and modern with serene surroundings",
      image: images.hostel3,
    },
    {
      id: 9,
      name: "HillTop Apartments",
      location: "Bomso",
      rating: 4.8,
      description: "Fully furnished rooms close to campus",
      image: images.hostel0,
    },
  ];
  

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
