"use client";

import { useState } from "react";

const ContactFormSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <div className="w-full md:w-1/2">
      <h2 className="text-3xl font-semibold text-gray-900 mb-8">
        Get In Touch
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Name */}
        <div>
          <label className="text-sm font-medium text-gray-800">
            Your Name <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            type="text"
            placeholder="Enter your first name"
            value={formData.name}
            onChange={handleChange}
            className="w-full mt-2 border-b border-gray-300 focus:border-[#F4B400] outline-none py-2 text-sm transition-colors"
          />
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-medium text-gray-800">
            Your Email <span className="text-red-500">*</span>
          </label>
          <input
            name="email"
            type="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={handleChange}
            className="w-full mt-2 border-b border-gray-300 focus:border-[#F4B400] outline-none py-2 text-sm transition-colors"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="text-sm font-medium text-gray-800">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            name="phone"
            type="tel"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleChange}
            className="w-full mt-2 border-b border-gray-300 focus:border-[#F4B400] outline-none py-2 text-sm transition-colors"
          />
        </div>

        {/* Message */}
        <div className="md:col-span-2">
          <label className="text-sm font-medium text-gray-800">Message</label>
          <textarea
            name="message"
            placeholder="Type here..."
            value={formData.message}
            onChange={handleChange}
            className="w-full mt-2 border-b border-gray-300 focus:border-[#F4B400] outline-none py-2 text-sm min-h-[80px] transition-colors"
          />
        </div>

        {/* Button */}
        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            className="bg-[#F4B400] cursor-pointer hover:bg-[#dba600] text-black font-medium py-2.5 px-10 rounded-md shadow-sm transition-all"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactFormSection;
