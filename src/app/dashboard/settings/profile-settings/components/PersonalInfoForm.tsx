"use client";
import React from "react";

interface PersonalInfoFormProps {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  onChange: (field: "firstName" | "lastName" | "phone", value: string) => void;
}

export default function PersonalInfoForm({
  firstName,
  lastName,
  phone,
  email,
  onChange,
}: PersonalInfoFormProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* First Name */}
      <div className="flex flex-col">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          First Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={firstName}
          placeholder="First Name"
          onChange={(e) => onChange("firstName", e.target.value)}
          className="border px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Last Name */}
      <div className="flex flex-col">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Last Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={lastName}
          placeholder="Last Name"
          onChange={(e) => onChange("lastName", e.target.value)}
          className="border px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Phone */}
      <div className="flex flex-col sm:col-span-2">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Phone Number
        </label>
        <input
          type="tel"
          value={phone}
          placeholder="0241234567"
          onChange={(e) => onChange("phone", e.target.value)}
          className="border px-4 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Email (disabled) */}
      <div className="flex flex-col sm:col-span-2">
        <label className="block text-sm font-medium text-gray-900 mb-2">
          Email Address
        </label>
        <input
          type="email"
          value={email}
          disabled
          placeholder={email ? undefined : "Fetching from account..."}
          className="border px-4 py-2 rounded-lg w-full bg-gray-100 cursor-not-allowed"
        />
      </div>
    </div>
  );
}
