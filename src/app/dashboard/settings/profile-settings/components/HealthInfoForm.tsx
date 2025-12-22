"use client";
import React from "react";

interface HealthInfoFormProps {
  hasHealthCondition: boolean;
  healthCondition: string;
  bloodType: string;
  allergies: string;
  onChange: (
    field: "hasHealthCondition" | "healthCondition" | "bloodType" | "allergies",
    value: string | boolean
  ) => void;
}

export default function HealthInfoForm({
  hasHealthCondition,
  healthCondition,
  bloodType,
  allergies,
  onChange,
}: HealthInfoFormProps) {
  return (
    <div className="space-y-4">
      {/* Has Health Condition Checkbox */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="hasHealthCondition"
          checked={hasHealthCondition}
          onChange={(e) => {
            onChange("hasHealthCondition", e.target.checked);
            // Clear health condition if unchecked
            if (!e.target.checked) {
              onChange("healthCondition", "");
            }
          }}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label
          htmlFor="hasHealthCondition"
          className="ml-2 block text-sm font-medium text-gray-900"
        >
          I have a health condition
        </label>
      </div>

      {/* Health Condition Details */}
      {hasHealthCondition && (
        <div className="flex flex-col">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Condition Details
          </label>
          <textarea
            value={healthCondition}
            onChange={(e) => onChange("healthCondition", e.target.value)}
            placeholder="Describe your health condition, required medications, and any special instructions..."
            rows={4}
            className="border px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            Be specific: Include condition name, required medications, and emergency procedures if needed.
          </p>
        </div>
      )}

      {/* Blood Type */}
      <div className="flex flex-col">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Blood Type
        </label>
        <select
          value={bloodType}
          onChange={(e) => onChange("bloodType", e.target.value)}
          className="border px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select blood type</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>
      </div>

      {/* Allergies */}
      <div className="flex flex-col">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Allergies
        </label>
        <input
          type="text"
          value={allergies}
          onChange={(e) => onChange("allergies", e.target.value)}
          placeholder="e.g., Peanuts, Shellfish, Dust, Pollen"
          className="border px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          List all known allergies, separated by commas if multiple.
        </p>
      </div>
    </div>
  );
}

