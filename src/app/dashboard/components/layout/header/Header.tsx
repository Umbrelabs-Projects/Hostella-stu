"use client";

import { usePathname } from "next/navigation";
import HeaderLeft from "./HeaderLeft";
import HeaderRight from "./HeaderRight";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();

  const title =
    pathname
      .split("/")
      .pop()
      ?.replace(/^\w/, (c) => c.toUpperCase()) || "Dashboard";

  return (
    <div className="flex items-center justify-between border-b bg-white px-4 py-3 shadow-sm">
      <HeaderLeft title={title} onMenuClick={onMenuClick} />
      <HeaderRight />
    </div>
  );
}
