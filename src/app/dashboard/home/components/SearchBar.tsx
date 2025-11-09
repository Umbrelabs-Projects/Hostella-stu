"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="w-full mx-auto mb-8">
      <div className="flex items-center bg-white shadow-sm border rounded-xl px-4 py-2">
        <Search size={20} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search for Hostel"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 outline-none text-gray-700"
        />
      </div>
    </div>
  );
}
