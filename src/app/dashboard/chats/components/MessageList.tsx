"use client";

import { ChatMessageType } from "@/types/chatType";
import { ChatMessage } from "./ChatMessage";
import { AnimatePresence, motion } from "framer-motion";

interface MessageListProps {
  messages: ChatMessageType[];
  onReply: (message: ChatMessageType) => void;
}

export default function MessageList({ messages, onReply }: MessageListProps) {
  return (
    <div className="flex flex-col gap-4">
      <AnimatePresence>
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <ChatMessage
              sender={msg.sender}
              content={msg.content}
              timestamp={msg.timestamp}
              onReply={() => onReply(msg)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
