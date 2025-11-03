"use client";
import React from "react";

export default function FormField({
  label,
  name,
  register,
  error,
  children,
  ...props
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {children ? (
        children
      ) : (
        <input
          {...register(name)}
          {...props}
          className={`mt-1 w-full p-2 border rounded-lg focus:ring-1 focus:ring-yellow-400 outline-none ${
            error ? "border-red-500" : ""
          }`}
        />
      )}
      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
}
