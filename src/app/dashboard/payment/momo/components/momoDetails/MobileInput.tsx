"use client";

import React from "react";

interface MobileInputProps {
  mobileNumber: string;
  setMobileNumber: (value: string) => void;
  error?: string;
}

const MobileInput: React.FC<MobileInputProps> = ({ mobileNumber, setMobileNumber, error }) => {
  return (
    <div>
      <label
        htmlFor="mobileNumber"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Mobile Number
      </label>
      <input
        type="tel"
        id="mobileNumber"
        name="mobileNumber"
        placeholder="e.g., 0541234567"
        value={mobileNumber}
        onChange={(e) => setMobileNumber(e.target.value)}
        required
        className={`mt-1 block w-full py-3 px-4 border rounded-lg shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-sm ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default MobileInput;
