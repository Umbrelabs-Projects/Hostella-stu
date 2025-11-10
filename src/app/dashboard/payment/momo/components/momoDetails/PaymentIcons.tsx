"use client";

import { images } from "@/lib/images";
import Image from "next/image";
import React from "react";

const PaymentIcons: React.FC = () => {
  return (
    <div className="flex justify-center space-x-2 mt-4">
      <Image
        src={images.mtn}
        alt="MTN Mobile Money"
        width={60}
        height={30}
        className="rounded-md"
      />
      <Image
        src={images.telecel}
        alt="telecel Cash"
        width={60}
        height={30}
        className="rounded-md"
      />
      <Image
        src={images.airtelTigo}
        alt="AirtelTigo Money"
        width={60}
        height={30}
        className="rounded-md"
      />
    </div>
  );
};

export default PaymentIcons;
