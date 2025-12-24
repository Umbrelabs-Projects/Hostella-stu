"use client";
import React from "react";

interface UniversityInfoFormProps {
  campus: string;
  programme: string;
  studentRefNumber: string;
  level: string;
  onChange: (
    field: "campus" | "programme" | "studentRefNumber" | "level",
    value: string
  ) => void;
}

export default function UniversityInfoForm({
  campus,
  programme,
  studentRefNumber,
  level,
  onChange,
}: UniversityInfoFormProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Campus */}
      <div className="flex flex-col">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Campus
        </label>
        <select
          value={campus}
          onChange={(e) => onChange("campus", e.target.value)}
          className="border px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select campus</option>
          <option value="KNUST">KNUST</option>
          <option value="KSTU">KSTU</option>
        </select>
      </div>

      {/* Programme */}
      <div className="flex flex-col">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Programme
        </label>
        <input
          type="text"
          value={programme}
          placeholder="e.g., Computer Science, Medicine"
          onChange={(e) => onChange("programme", e.target.value)}
          className="border px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Student Reference Number */}
      <div className="flex flex-col">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Student Reference Number
        </label>
        <input
          type="text"
          value={studentRefNumber}
          placeholder="Your student ID"
          onChange={(e) => onChange("studentRefNumber", e.target.value)}
          className="border px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Level */}
      <div className="flex flex-col">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Level
        </label>
        <select
          value={level}
          onChange={(e) => onChange("level", e.target.value)}
          className="border px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select level</option>
          <option value="100">100</option>
          <option value="200">200</option>
          <option value="300">300</option>
          <option value="400">400</option>
          <option value="Graduate">Graduate</option>
        </select>
      </div>
    </div>
  );
}

