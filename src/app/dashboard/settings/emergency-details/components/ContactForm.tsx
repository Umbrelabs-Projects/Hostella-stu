"use client";

import { Button } from "@/components/ui/button";
import { EmergencyContact } from "./types";

interface ContactFormProps {
  formData: Omit<EmergencyContact, "id">;
  onChange: (field: keyof Omit<EmergencyContact, "id">, value: string) => void;
  onCancel: () => void;
  onSave: () => void;
  editing?: boolean;
  loading?: boolean;
}

export const ContactForm = ({
  formData,
  onChange,
  onCancel,
  onSave,
  editing,
  loading = false,
}: ContactFormProps) => (
  <div className="border-2 border-gray-200 rounded-lg p-4 sm:p-6 space-y-4 bg-gray-50">
    <h3 className="font-semibold text-gray-900">
      {editing ? "Edit Contact" : "Add New Contact"}
    </h3>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {(["name", "relationship", "phone"] as const).map((field) => (
        <input
          key={field}
          type={field === "phone" ? "tel" : "text"}
          placeholder={
            field === "name"
              ? "Full Name"
              : field.charAt(0).toUpperCase() + field.slice(1)
          }
          value={formData[field]}
          onChange={(e) => onChange(field, e.target.value)}
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
      ))}
    </div>
    <div className="flex flex-col sm:flex-row gap-3 pt-2">
      <Button
        onClick={onSave}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
      >
        {loading ? "Saving..." : editing ? "Update Contact" : "Add Contact"}
      </Button>
      <Button
        onClick={onCancel}
        variant="outline"
        className="border-gray-300 text-gray-700 hover:bg-gray-50 w-full sm:w-auto"
      >
        Cancel
      </Button>
    </div>
  </div>
);
