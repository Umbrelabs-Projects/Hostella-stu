"use client";

import { Phone, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ChatHeader() {
  return (
    <div className="bg-white shadow-sm border-b border-slate-200 px-6 py-4 flex items-center justify-between">
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
        <Button variant="ghost" size="icon">
          <Phone className="h-5 w-5 text-slate-600" />
        </Button>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5 text-slate-600" />
        </Button>
      </div>
    </div>
  );
}
