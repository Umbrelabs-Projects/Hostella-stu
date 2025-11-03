"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ContactField from "./contact/ContactField";
import { contactSchema, ContactFormData } from "./contact/contactSchema";

const ContactFormSection = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    console.log("Form submitted:", data);
    await new Promise((resolve) => setTimeout(resolve, 800));
    reset();
  };

  return (
    <div className="w-full md:w-1/2">
      <h2 className="text-3xl font-semibold text-gray-900 mb-8">
        Get In Touch
      </h2>

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
