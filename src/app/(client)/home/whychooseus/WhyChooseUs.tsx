import { images } from "@/lib/images";
import React from "react";
import FeatureCard from "./_components/FeatureCard";

export default function WhyChooseUs() {
  const features = [
    {
      icon: images.secureBooking,
      title: "Secure Booking",
      description:
        "Safe and secure payment processing with multiple payment options including mobile money",
    },
    {
      icon: images.support,
      title: "24/7 Support",
      description:
        "Round-the-clock customer support via live chat and WhatsApp for all your queries",
    },
    {
      icon: images.student,
      title: "Student Focused",
      description:
        "Designed specifically for university students with affordable pricing and flexible options",
    },
  ];
  return (
    <div className="flex flex-col my-12 justify-center items-center">
      <h1 className="text-2xl font-bold">Why Choose Us?</h1>
      <div className="flex flex-wrap gap-6 my-8 justify-center">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </div>
  );
}
