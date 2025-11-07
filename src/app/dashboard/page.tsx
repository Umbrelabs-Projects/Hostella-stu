import { images } from "@/lib/images";
import Image from "next/image";
import React from "react";

export default function page() {
  return (
    <div>
      <Image src={images.dashboardImg} alt="profile" />
    </div>
  );
}
