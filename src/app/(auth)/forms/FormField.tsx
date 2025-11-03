"use client";
import React, { ReactNode, InputHTMLAttributes } from "react";
import {
  FieldError,
  UseFormRegister,
  FieldValues,
  Path,
} from "react-hook-form";

interface FormFieldProps<T extends FieldValues>
  extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: Path<T>;
  register: UseFormRegister<T>;
  error?: FieldError;
  children?: ReactNode;
}

export default function FormField<T extends FieldValues>({
  label,
  name,
  register,
  error,
  children,
  ...props
}: FormFieldProps<T>) {
  const isEmail = name === "email";

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {children ? (
        children
      ) : (
        <input
          {...register(name)}
          {...props}
          className={`p-2 ${
            isEmail ? "w-[22rem]" : "w-full md:w-[16rem]"
          } border rounded-lg focus:ring-1 focus:ring-yellow-400 outline-none ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        />
      )}

      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
    </div>
  );
}
