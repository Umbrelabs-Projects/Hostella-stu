"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ContactField from "./contact/ContactField";
import { contactSchema, ContactFormData } from "./contact/contactSchema";
import { contactApi } from "@/lib/api";
import { useState } from "react";

const ContactFormSection = () => {
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setSuccessMessage("");
    setErrorMessage("");
    
    try {
      await contactApi.submit(data);
      setSuccessMessage("Thank you! Your message has been sent successfully. We'll get back to you soon.");
      reset();
      
      // Clear success message after 5 seconds
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error: any) {
      setErrorMessage(error.message || "Failed to send message. Please try again.");
    }
  };

  return (
    <div className="w-full p-5 bg-white rounded-r-2xl">
      <h2 className="text-3xl font-semibold text-gray-900 mb-8">
        Get In Touch
      </h2>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-800 rounded-md">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-800 rounded-md">
          {errorMessage}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <ContactField
          name="name"
          label="Your Name"
          placeholder="Enter your full name"
          register={register}
          error={errors.name}
        />
        <ContactField
          name="email"
          label="Your Email"
          placeholder="Enter your email address"
          type="email"
          register={register}
          error={errors.email}
        />
        <ContactField
          name="phone"
          label="Phone Number"
          placeholder="Enter your phone number"
          type="tel"
          register={register}
          error={errors.phone}
        />
        <ContactField
          name="message"
          label="Message"
          placeholder="Type here..."
          register={register}
          error={errors.message}
          fullWidth
        />

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#F4B400] cursor-pointer hover:bg-[#dba600] text-white font-medium py-2.5 px-10 rounded-md shadow-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Sending..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactFormSection;
