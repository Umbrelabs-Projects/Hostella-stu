"use client";

import React from "react";
import { Clock, Eye, CheckCircle, XCircle } from "lucide-react";

interface PaymentStatusBadgeProps {
  status: string;
}

export default function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const base = "px-3 py-1.5 text-xs font-semibold rounded-full shadow-sm flex items-center gap-1.5";
  const normalizedStatus = status.toUpperCase().replace(/\s+/g, '_');
  
  const statusConfig: Record<string, { 
    bg: string; 
    text: string; 
    label: string; 
    icon: React.ReactNode;
  }> = {
    PENDING: {
      bg: "bg-orange-100",
      text: "text-orange-800",
      label: "Pending Payment",
      icon: <Clock className="w-3 h-3" />
    },
    INITIATED: {
      bg: "bg-amber-100",
      text: "text-amber-800",
      label: "Payment Initiated",
      icon: <Clock className="w-3 h-3" />
    },
    AWAITING_VERIFICATION: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      label: "Awaiting Verification",
      icon: <Eye className="w-3 h-3" />
    },
    CONFIRMED: {
      bg: "bg-green-100",
      text: "text-green-800",
      label: "Payment Confirmed",
      icon: <CheckCircle className="w-3 h-3" />
    },
    FAILED: {
      bg: "bg-red-100",
      text: "text-red-800",
      label: "Payment Failed",
      icon: <XCircle className="w-3 h-3" />
    },
  };

  const config = statusConfig[normalizedStatus] || {
    bg: "bg-gray-100",
    text: "text-gray-700",
    label: status,
    icon: <Clock className="w-3 h-3" />
  };

  return (
    <span className={`${base} ${config.bg} ${config.text} backdrop-blur-md`}>
      {config.icon}
      {config.label}
    </span>
  );
}

