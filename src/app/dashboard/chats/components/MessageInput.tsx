"use client";

import { Mic, Paperclip, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VoiceRecorder } from "./VoiceRecorder";
import { useRef, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MessageInputProps {
  input: string;
  setInput: (value: string) => void;
  isRecording: boolean;
  setIsRecording: (value: boolean) => void;
  onSend: () => void;
  onSendVoice: (audioBlob: Blob) => void;
  repliedTo?: { sender: string; content: string };
  onCancelReply?: () => void;
}

export default function MessageInput({
  input,
  setInput,
  isRecording,
  setIsRecording,
  onSend,
  onSendVoice,
  repliedTo,
  onCancelReply,
}: MessageInputProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileAttach = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) console.log("File selected:", file.name);
  };

  return (
    <div className="flex flex-col w-full gap-2 py-3">
      {/* Reply Preview Animated */}
      <AnimatePresence>
        {repliedTo && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-2"
          >
            <div className="p-3 bg-slate-50 border-l-4 border-blue-500 rounded flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-600">
                  Replying to{" "}
                  {repliedTo.sender === "student" ? "Student" : "Admin"}
                </p>
                <p className="text-sm text-slate-700 truncate">
                  {repliedTo.content}
                </p>
              </div>
              {onCancelReply && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onCancelReply}
                  className="h-6 w-6"
                >
                  ✕
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input / Voice Recorder */}
      <div className="flex gap-2 items-center w-full">
        {isRecording ? (
          <VoiceRecorder
            onSendVoice={onSendVoice}
            onCancel={() => setIsRecording(false)}
          />
        ) : (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              title="Attach file"
            >
              <Paperclip className="h-5 w-5 text-slate-600" />
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileAttach}
            />

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsRecording(true)}
              title="Record voice message"
            >
              <Mic className="h-5 w-5 text-slate-600" />
            </Button>

            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSend()}
              className="flex-1 rounded-full bg-slate-100 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
            />

            <motion.div whileTap={{ scale: 0.9 }} className="flex-shrink-0">
              <Button
                onClick={onSend}
                size="icon"
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full h-10 w-10"
                title="Send message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
