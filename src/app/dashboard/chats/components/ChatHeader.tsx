"use client";

import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { images } from "@/lib/images";

export default function ChatHeader() {
  const phoneNumber = "+233552778748"; // Replace with your actual number
  const whatsappNumber = "+233552778748"; // In international format without "+" (e.g., 1XXXXXXXXXX)

  const handleWhatsAppClick = () => {
    // Open WhatsApp chat
    window.open(`https://wa.me/${whatsappNumber}`, "_blank");
  };

  const handlePhoneClick = () => {
    // Initiate phone call
    window.location.href = `tel:${phoneNumber}`;
  };
  return (
    <div className="bg-white fixed z-10 left-0 md:left-[21%] right-[0] md:right-[1%] top-[6%] md:top-[9%] shadow-sm border-b border-slate-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
          A
        </div>
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            Admin Support
          </h1>
          <p className="text-xs text-green-600 font-medium">Online</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={handleWhatsAppClick}
          className="cursor-pointer"
          variant="ghost"
          size="icon"
        >
          <Image src={images.whatsApp} alt="whatsApp" />
        </Button>
        <Button
          onClick={handlePhoneClick}
          className="cursor-pointer"
          variant="ghost"
          size="icon"
        >
          <Phone className="h-5 w-5 text-slate-600" />
        </Button>
      </div>
    </div>
  );
}
