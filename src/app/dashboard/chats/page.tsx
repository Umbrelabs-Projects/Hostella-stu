"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatHeader from "./components/ChatHeader";
import MessageList from "./components/MessageList";
import MessageInput from "./components/MessageInput";
import ReplyPreview from "./components/ReplyPreview";
import { ChatMessageType } from "@/types/chatType";

const INITIAL_MESSAGES: ChatMessageType[] = [
  { id: 1, sender: "student", content: "Hi, I have a question...", timestamp: "2:15 PM", type: "text" },
  { id: 2, sender: "admin", content: "Of course! What do you need help with?", timestamp: "2:16 PM", type: "text" },
  { id: 3, sender: "student", content: "Can I submit it a day late?", timestamp: "2:17 PM", type: "text" },
  { id: 4, sender: "admin", content: "Late submissions are accepted with penalty.", timestamp: "2:18 PM", type: "text" },
  { id: 5, sender: "student", content: "Thank you so much!", timestamp: "2:19 PM", type: "text" },
  { id: 6, sender: "admin", content: "Good luck with your exam!", timestamp: "2:20 PM", type: "text" },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessageType[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [repliedTo, setRepliedTo] = useState<ChatMessageType | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const newMsg: ChatMessageType = {
      id: messages.length + 1,
      sender: "student",
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "text",
    };

    setMessages([...messages, newMsg]);
    setInput("");
    setRepliedTo(null);
  };

  const handleSendVoice = (audioBlob: Blob) => {
    setIsRecording(false);

    const newMsg: ChatMessageType = {
      id: messages.length + 1,
      sender: "student",
      content: "[Voice message]",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "voice",
      audio: audioBlob,
    };

    setMessages([...messages, newMsg]);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <ChatHeader />

      {/* Messages scrollable area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
        <MessageList messages={messages} onReply={setRepliedTo} />
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar + Reply preview */}
      <div className="border-t bg-white p-3 sm:p-4 flex flex-col">
        <AnimatePresence>
          {repliedTo && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="mb-2"
            >
              <ReplyPreview repliedTo={repliedTo} onCancel={() => setRepliedTo(null)} />
            </motion.div>
          )}
        </AnimatePresence>

        <MessageInput
          input={input}
          setInput={setInput}
          isRecording={isRecording}
          setIsRecording={setIsRecording}
          onSend={handleSendMessage}
          onSendVoice={handleSendVoice}
        />
      </div>
    </div>
  );
}
