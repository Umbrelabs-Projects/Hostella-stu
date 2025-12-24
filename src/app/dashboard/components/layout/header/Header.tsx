"use client";

import { usePathname } from "next/navigation";
import HeaderLeft from "./HeaderLeft";
import HeaderRight from "./HeaderRight";
import { useHostelStore } from "@/store/useHostelStore";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const { selectedHostel } = useHostelStore();

  let title = "Dashboard";

  // Show "Payment" if the path includes "payment"
  if (segments.includes("success")) {
    title = "Booking Successful";
  } else if (segments.includes("rooms") && segments.length > 0) {
    // For rooms page, show hostel name from store
    if (selectedHostel) {
      title = selectedHostel.name;
    } else {
      // Fallback if hostel not loaded yet
      title = "Rooms";
    }
  } else if (segments.includes("extra-booking-details") && segments.length > 0) {
    // For extra-booking-details page, show hostel name from store
    if (selectedHostel) {
      title = selectedHostel.name;
    } else {
      // Fallback if hostel not loaded yet
      title = "Booking Details";
    }
  } else if (segments.length > 0) {
    const lastSegment = segments[segments.length - 1];
    
    // Handle numeric IDs (legacy support)
    if (/^\d+$/.test(lastSegment)) {
      const id = Number(lastSegment);
      title = `ID: ${id}`;
    } else {
      // Capitalize first letter of segment
      title = lastSegment.replace(/^\w/, (c) => c.toUpperCase());
    }
  }

  return (
    <div className="sticky top-0 z-40 flex items-center justify-between border-b bg-white px-4 py-3 shadow-sm">
      <HeaderLeft title={title} onMenuClick={onMenuClick} />
      <HeaderRight />
    </div>
  );
}
