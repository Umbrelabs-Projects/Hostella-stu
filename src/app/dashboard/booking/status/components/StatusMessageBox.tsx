"use client";
import React from "react";
import { LucideIcon } from "lucide-react";

interface StatusMessageBoxProps {
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  title?: string;
  message: string;
  padding?: string;
}

export default function StatusMessageBox({
  icon: Icon,
  iconColor,
  bgColor,
  borderColor,
  textColor,
  title,
  message,
  padding = "p-3",
}: StatusMessageBoxProps) {
  return (
    <div className={`mt-4 ${padding} ${bgColor} border ${borderColor} rounded-lg`}>
      <p className={`text-sm ${textColor} flex items-center gap-2`}>
        <Icon size={18} className={iconColor} />
        <span>
          {title && <strong>{title}</strong>} {message}
        </span>
      </p>
    </div>
  );
}

