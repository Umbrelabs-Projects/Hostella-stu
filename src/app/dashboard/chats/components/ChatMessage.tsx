"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { RotateCcw } from "lucide-react";

interface ChatMessageProps {
  sender: "student" | "admin";
  content: string;
  timestamp: string;
  onReply?: () => void;
}

export function ChatMessage({
  sender,
  content,
  timestamp,
  onReply,
}: ChatMessageProps) {
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);
  const isStudent = sender === "student";

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const handleContextMenuReply = () => {
    onReply?.();
    setContextMenu(null);
  };

  return (
    <>
      <div
        className={cn(
          "flex gap-3 group",
          isStudent ? "justify-end" : "justify-start"
        )}
        onContextMenu={handleContextMenu}
      >
        {!isStudent && (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            A
          </div>
        )}
        <div className="flex flex-col gap-1 max-w-[70%] sm:max-w-md">
          <div className="flex items-end gap-2">
            <div
              className={cn(
                "px-4 py-3 rounded-3xl shadow-sm",
                isStudent
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-white text-slate-900 rounded-bl-none border border-slate-200"
              )}
            >
              <p className="text-sm leading-relaxed">{content}</p>
            </div>
           
          </div>
          <p
            className={cn(
              "text-xs px-4",
              isStudent
                ? "text-right text-slate-500"
                : "text-left text-slate-500"
            )}
          >
            {timestamp}
          </p>
        </div>
        {isStudent && (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            S
          </div>
        )}
      </div>

      {contextMenu && (
        <>
          {/* Overlay to close menu on click */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setContextMenu(null)}
          />
          {/* Context menu */}
          <div
            ref={contextMenuRef}
            className="fixed z-50 bg-white rounded-lg shadow-lg border border-slate-200 py-1 min-w-max"
            style={{
              top: `${contextMenu.y}px`,
              left: `${contextMenu.x}px`,
            }}
          >
            <button
              onClick={handleContextMenuReply}
              className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 flex items-center gap-2 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              Reply
            </button>
          </div>
        </>
      )}
    </>
  );
}
