"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatHeader from "./components/ChatHeader";
import MessageList from "./components/MessageList";
import MessageInput from "./components/MessageInput";
import ReplyPreview from "./components/ReplyPreview";
import { ChatMessage } from "@/types/api";
import { useChatStore } from "@/store/useChatStore";
import { ErrorState } from "@/components/ui/error";
import { SkeletonList } from "@/components/ui/skeleton";

export default function ChatPage() {
  const { messages, selectedChat, loading, error, fetchChats, fetchMessages, sendMessage } = useChatStore();
  const [repliedTo, setRepliedTo] = useState<ChatMessage | null>(null);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  // When chat is selected, fetch messages
  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.id);
    }
  }, [selectedChat, fetchMessages]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || !selectedChat) return;

    try {
      await sendMessage(selectedChat.id, input, "text");
      setInput("");
      setRepliedTo(null);
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  const handleSendVoice = async (audioBlob: Blob) => {
    if (!selectedChat) return;
    setIsRecording(false);

    try {
      // Convert Blob to File
      const file = new File([audioBlob], "audio.webm", { type: audioBlob.type });
      await sendMessage(selectedChat.id, "[Voice message]", "voice", file);
    } catch (err) {
      console.error("Failed to send voice message", err);
    }
  };

  if (loading && messages.length === 0) {
    return (
      <div className="flex relative flex-col h-screen md:h-full bg-slate-50">
        <div className="px-4 py-4 border-b">
          <div className="animate-pulse h-6 bg-gray-200 rounded w-32" />
        </div>
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-19">
          <SkeletonList count={5} />
        </div>
      </div>
    );
  }
  if (error && messages.length === 0) return <ErrorState message={error} onRetry={fetchChats} />;

  // Convert ChatMessage to ChatMessageType for MessageList component
  const chatMessageTypes = messages.map((msg) => ({
    id: msg.id,
    sender: msg.sender as "student" | "admin",
    content: msg.content,
    timestamp: msg.timestamp,
    type: (msg.type === "voice" ? "voice" : "text") as "text" | "voice",
  }));

  return (
    <div className="flex relative flex-col h-screen md:h-full bg-slate-50">
      <ChatHeader />

      {/* Messages scrollable area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-19 space-y-4">
        <MessageList messages={chatMessageTypes} onReply={() => {}} />
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar + Reply preview */}
      <div className="border-t fixed z-10 left-0 md:left-[21%] right-[0] md:right-[1%] bottom-0 bg-white p-3 sm:p-4 flex flex-col">
        <AnimatePresence>
          {repliedTo && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="mb-2"
            >
              <ReplyPreview
                repliedTo={repliedTo as any}
                onCancel={() => setRepliedTo(null)}
              />
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
