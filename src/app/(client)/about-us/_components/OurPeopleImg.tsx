import { images } from "@/lib/images";
import Image from "next/image";
import React from "react";

export default function OurPeopleImg() {
  return (
    <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden">
      {/* Background Image */}
      <Image
        src={images.ourPeopleImg}
        alt="room"
        fill
        className="object-cover"
        priority
      />
    </div>
  );
}
