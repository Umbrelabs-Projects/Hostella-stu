"use client";

import { usePathname } from "next/navigation";
import HeaderLeft from "./HeaderLeft";
import HeaderRight from "./HeaderRight";
import { roomsData, hostelsData } from "@/lib/constants";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  let title = "Dashboard";

  // Show "Payment" if the path includes "payment"
  if (segments.includes("payment")) {
    title = "Payment";
  } else if (segments.length > 0) {
    const lastSegment = segments[segments.length - 1];

    if (/^\d+$/.test(lastSegment)) {
      const id = Number(lastSegment);
      const room = roomsData.find((r) => r.id === id);

      if (segments.includes("extra-booking-details")) {
        // Show hostel name + room title
        if (room) {
          const hostel = hostelsData.find((h) => h.id === room.id);
          title = hostel ? `${hostel.name} • ${room.title}` : room.title;
        } else {
          title = `ID: ${id}`;
        }
      } else if (segments.includes("rooms")) {
        // Show only hostel name
        if (room) {
          const hostel = hostelsData.find((h) => h.id === room.id);
          title = hostel ? hostel.name : `Room ID: ${id}`;
        } else {
          title = `Room ID: ${id}`;
        }
      } else {
        title = room ? room.title : `ID: ${id}`;
      }
    } else {
      title = lastSegment.replace(/^\w/, (c) => c.toUpperCase());
    }
  }

  return (
    <div className="flex items-center justify-between border-b bg-white px-4 py-3 shadow-sm">
      <HeaderLeft title={title} onMenuClick={onMenuClick} />
      <HeaderRight />
    </div>
  );
}
