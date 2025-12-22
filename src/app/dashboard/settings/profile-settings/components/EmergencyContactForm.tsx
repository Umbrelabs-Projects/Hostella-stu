"use client";
import React from "react";

interface EmergencyContactFormProps {
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  onChange: (
    field: "emergencyContactName" | "emergencyContactPhone" | "emergencyContactRelation",
    value: string
  ) => void;
}

export default function EmergencyContactForm({
  emergencyContactName,
  emergencyContactPhone,
  emergencyContactRelation,
  onChange,
}: EmergencyContactFormProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 mb-4">
        Note: For multiple emergency contacts, use the{" "}
        <span className="font-medium">Emergency Contacts</span> section in Settings.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Contact Name */}
        <div className="flex flex-col sm:col-span-2">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Contact Name
          </label>
          <input
            type="text"
            value={emergencyContactName}
            placeholder="Full name of emergency contact"
            onChange={(e) => onChange("emergencyContactName", e.target.value)}
            className="border px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Contact Phone */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Contact Phone
          </label>
          <input
            type="tel"
            value={emergencyContactPhone}
            placeholder="0241234567"
            onChange={(e) => onChange("emergencyContactPhone", e.target.value)}
            className="border px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Relation */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Relation
          </label>
          <input
            type="text"
            value={emergencyContactRelation}
            placeholder="e.g., Parent, Guardian, Sibling"
            onChange={(e) => onChange("emergencyContactRelation", e.target.value)}
            className="border px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
}

