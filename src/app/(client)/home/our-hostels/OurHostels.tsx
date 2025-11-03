"use client";

import React from "react";
import HostelCard from "./components/HostelCard";
import { images } from "@/lib/images";

export default function OurHostels() {
  const hostelData = [
    {
      image: images.hostel0,
      title: "Lienda Ville",
      description: `We offer a comfortable and secure environment for students away from home.
It features spacious rooms, reliable internet access, and 24-hour security.
Residents enjoy a friendly community that encourages both study and relaxation.
Conveniently located near campus, it provides the perfect balance between comfort and convenience.`,
      position: "right" as const,
    },
    {
      image: images.hostel1,
      title: "Lienda Ville Annex",
      description:
        "We offer a comfortable and secure environment for students away from home.It features spacious rooms, reliable internet access, and 24-hour security.Residents enjoy a friendly community that encourages both study and relaxation.Conveniently located near campus, it provides the perfect balance between comfort and convenience",
      position: "left" as const,
    },
    {
      image: images.hostel2,
      title: "Gabealle Verd",
      description:
        "We offer a comfortable and secure environment for students away from home.It features spacious rooms, reliable internet access, and 24-hour security.Residents enjoy a friendly community that encourages both study and relaxation.Conveniently located near campus, it provides the perfect balance between comfort and convenience",
      position: "right" as const,
    },
    {
      image: images.hostel3,
      title: "Rhema Jason",
      description:
        "We offer a comfortable and secure environment for students away from home.It features spacious rooms, reliable internet access, and 24-hour security.Residents enjoy a friendly community that encourages both study and relaxation.Conveniently located near campus, it provides the perfect balance between comfort and convenience",
      position: "left" as const,
    },
  ];

  return (
    <div className="flex flex-col my-12 justify-center items-center">
      <h1 className="text-2xl md:text-5xl font-bold mb-10">Our Hostels</h1>
      {hostelData.map((hostel, index) => (
        <HostelCard
          key={index}
          image={hostel.image}
          title={hostel.title}
          description={hostel.description}
          infoPosition={hostel.position}
        />
      ))}
    </div>
  );
}
