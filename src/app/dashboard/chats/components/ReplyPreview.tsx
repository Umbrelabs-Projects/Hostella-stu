"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChatMessageType } from "@/types/chatType";

interface ReplyPreviewProps {
  repliedTo: ChatMessageType;
  onCancel: () => void;
}

export default function ReplyPreview({ repliedTo, onCancel }: ReplyPreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      className="mb-3 p-3 bg-slate-50 border-l-4 border-blue-500 rounded flex items-start justify-between gap-3"
    >
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-600">
          Replying to {repliedTo.sender === "student" ? "Student" : "Admin"}
        </p>
        <p className="text-sm text-slate-700 truncate">{repliedTo.content}</p>
      </div>

      <Button variant="ghost" size="icon" onClick={onCancel} className="h-6 w-6">
        <X className="h-4 w-4" />
      </Button>
    </motion.div>
  );
}
