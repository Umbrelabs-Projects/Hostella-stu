"use client";

import React from "react";

const MobileInput: React.FC = () => {
  return (
    <div>
      <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-2">
        Mobile Number
      </label>
      <input
        type="tel"
        id="mobileNumber"
        name="mobileNumber"
        placeholder="e.g., 054 123 4567"
        required
        className="mt-1 block w-full py-3 px-4 border border-gray-300 rounded-lg shadow-sm focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
      />
    </div>
  );
};

export default MobileInput;
