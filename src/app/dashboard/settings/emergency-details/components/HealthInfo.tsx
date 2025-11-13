"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { HealthDetails } from "./types";

interface HealthInfoProps {
  healthDetails?: HealthDetails | null;
  onUpdate: (data: HealthDetails) => void;
}

export const HealthInfo = ({ healthDetails, onUpdate }: HealthInfoProps) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<HealthDetails>(healthDetails || {});

  const handleSave = () => {
    onUpdate(formData);
    setEditing(false);
  };

  return (
    <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-900 mb-2">Health Details</h3>
        <Button size="sm" onClick={() => setEditing(!editing)}>
          {editing ? "Cancel" : healthDetails ? "Edit" : "Add"}
        </Button>
      </div>

      {editing ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(["bloodType", "allergies", "conditions"] as const).map((field) => (
            <input
              key={field}
              type="text"
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={formData[field] || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, [field]: e.target.value }))
              }
              className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          ))}
          <div className="col-span-full flex justify-end pt-2">
            <Button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Save
            </Button>
          </div>
        </div>
      ) : healthDetails ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700">
          <p>
            <span className="font-medium text-gray-900">Blood Type:</span>{" "}
            {healthDetails.bloodType || "N/A"}
          </p>
          <p>
            <span className="font-medium text-gray-900">Allergies:</span>{" "}
            {healthDetails.allergies || "N/A"}
          </p>
          <p>
            <span className="font-medium text-gray-900">Conditions:</span>{" "}
            {healthDetails.conditions || "N/A"}
          </p>
        </div>
      ) : (
        <p className="text-gray-500 italic">No health details provided yet.</p>
      )}
    </div>
  );
};
