import React from "react";
import { FieldError, UseFormRegister } from "react-hook-form";
import { ContactFormData } from "./contactSchema";

interface ContactFieldProps {
  name: keyof ContactFormData;
  label: string;
  placeholder: string;
  type?: string;
  register: UseFormRegister<ContactFormData>;
  error?: FieldError;
  fullWidth?: boolean;
}

const ContactField: React.FC<ContactFieldProps> = ({
  name,
  label,
  placeholder,
  type = "text",
  register,
  error,
  fullWidth = false,
}) => (
  <div className={fullWidth ? "md:col-span-2" : ""}>
    <label className="text-sm font-medium text-gray-800">
      {label} {name !== "message" && <span className="text-red-500">*</span>}
    </label>

    {name === "message" ? (
      <textarea
        {...register(name)}
        placeholder={placeholder}
        className={`w-full mt-2 border-b border-gray-300 focus:border-[#F4B400] outline-none py-2 text-sm min-h-[80px] transition-colors ${
          error ? "border-red-400" : ""
        }`}
      />
    ) : (
      <input
        {...register(name)}
        type={type}
        placeholder={placeholder}
        className={`w-full mt-2 border-b border-gray-300 focus:border-[#F4B400] outline-none py-2 text-sm transition-colors ${
          error ? "border-red-400" : ""
        }`}
      />
    )}

    {error && <p className="text-xs text-red-500 mt-1">{error.message}</p>}
  </div>
);

export default ContactField;
