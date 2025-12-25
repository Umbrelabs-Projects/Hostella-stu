"use client";

import { usePathname } from "next/navigation";
import HeaderLeft from "./HeaderLeft";
import HeaderRight from "./HeaderRight";
import { useHostelStore } from "@/store/useHostelStore";
import { useBookingStore } from "@/store/useBookingStore";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const { selectedHostel } = useHostelStore();
  const { selectedBooking } = useBookingStore();

  let title = "Dashboard";

  // Show hostel name for payment pages
  if (segments.includes("payment")) {
    if (selectedBooking?.hostelName) {
      title = selectedBooking.hostelName;
    } else {
      title = "Payment";
    }
  } else if (segments.includes("receipt")) {
    title = "Payment Receipt";
  } else if (segments.includes("success")) {
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
  } else if (segments.includes("room-details")) {
    title = "Room Details";
  } else if (segments.includes("move-in-instructions")) {
    title = "Move-in Instructions";
  } else if (segments.length > 0) {
    const lastSegment = segments[segments.length - 1];
    
    // Skip showing IDs (non-numeric long strings that look like IDs)
    // Check if it's a long alphanumeric string (likely an ID)
    if (/^[a-z0-9]{20,}$/i.test(lastSegment)) {
      // It's likely an ID, check if we have a better title from context
      const secondToLast = segments[segments.length - 2];
      if (secondToLast === "room-details") {
        title = "Room Details";
      } else if (secondToLast === "move-in-instructions") {
        title = "Move-in Instructions";
      } else if (secondToLast === "receipt") {
        title = "Payment Receipt";
      } else {
        // Default to showing the parent segment or a generic title
        title = secondToLast ? secondToLast.replace(/^\w/, (c) => c.toUpperCase()) : "Details";
      }
    } else if (/^\d+$/.test(lastSegment)) {
      // Handle numeric IDs (legacy support)
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
