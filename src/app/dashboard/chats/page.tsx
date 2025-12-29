"use client";

import { useState, useRef, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";
import ChatHeader from "./components/ChatHeader";
import MessageList from "./components/MessageList";
import MessageInput from "./components/MessageInput";
import ReplyPreview from "./components/ReplyPreview";
import { ChatMessageType } from "@/types/chatType";
import { useChatStore } from "@/store/useChatStore";
import { useAuthStore } from "@/store/useAuthStore";
import { ErrorState } from "@/components/ui/error";
import { SkeletonList } from "@/components/ui/skeleton";
export default function ChatPage() {
  const { messages, selectedChat, loading, error, fetchChats, fetchMessages, sendMessage, addMessage, chats } = useChatStore();
  const { user } = useAuthStore();
  const [repliedTo, setRepliedTo] = useState<ChatMessageType | null>(null);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [typingUsers, setTypingUsers] = useState<{ userId: string; firstName: string }[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') || '' : '';
  const firstName = typeof window !== 'undefined' ? localStorage.getItem('firstName') || '' : '';
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Socket.io connection
  useEffect(() => {
    const socket = io("http://localhost:5000"); // TODO: Use env for backend URL
    socketRef.current = socket;

    // Join room when chat is selected
    if (selectedChat) {
      socket.emit("join_room", selectedChat.id);
    }

    // Listen for new messages
    socket.on("new_message", (msg: any) => {
      addMessage(msg);
    });

    // Listen for typing events
    socket.on("user_typing", (data: { userId: string; firstName: string }) => {
      setTypingUsers((prev) => {
        if (prev.some((u) => u.userId === data.userId)) return prev;
        return [...prev, data];
      });
    });
    socket.on("user_stop_typing", (data: { userId: string }) => {
      setTypingUsers((prev) => prev.filter((u) => u.userId !== data.userId));
    });

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChat]);

  // When chat is selected, fetch messages
  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.id);
    }
  }, [selectedChat, fetchMessages]);

  // Filter chats based on access rules
  const getFilteredChats = () => {
    if (!user) return [];
    if (user.role === "SUPERADMIN") {
      return chats;
    }
    if (user.role === "ADMIN") {
      // Only chats for students in their assigned hostels
      // Assuming user.campus or user.hostelId is the admin's assigned hostel
      return chats.filter(chat => chat.hostelId === user.hostelId || chat.campus === user.campus);
    }
    if (user.role === "STUDENT") {
      // Only chat with admin of current hostel or hostel with active booking
      // Assuming chat.userId is the student's id
      return chats.filter(chat => chat.userId === user.id);
    }
    return [];
  };

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!selectedChat || !input.trim()) return;
    await sendMessage(selectedChat.id, input, 'text');
    setInput("");
    setRepliedTo(null);
  };

  const handleSendVoice = async (audioBlob: Blob) => {
    if (!selectedChat) return;
    setIsRecording(false);
    try {
      const formData = new FormData();
      formData.append("attachment", audioBlob, "audio.webm");
      formData.append("message", "[Voice message]");
      await fetch(`/api/v1/chat/${selectedChat.id}/attachments`, {
        method: "POST",
        body: formData,
      });
    } catch (err) {
      console.error("Failed to send voice message", err);
    }
  };
  // Typing indicator handlers
  const handleInputChange = (val: string) => {
    setInput(val);
    if (socketRef.current && selectedChat) {
      if (val) {
        socketRef.current.emit("typing", { roomId: selectedChat.id, userId, firstName });
      } else {
        socketRef.current.emit("stop_typing", { roomId: selectedChat.id, userId });
      }
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
      <div className="border-t fixed z-10 left-0 md:left-[21%] right-0 md:right-[1%] bottom-0 bg-white p-3 sm:p-4 flex flex-col">
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
                repliedTo={repliedTo}
                onCancel={() => setRepliedTo(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <MessageInput
          input={input}
          setInput={handleInputChange}
          isRecording={isRecording}
          setIsRecording={setIsRecording}
          onSend={handleSendMessage}
          onSendVoice={handleSendVoice}
          selectedChatId={selectedChat?.id}
        />
        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <div className="text-xs text-slate-500 px-4 pb-2">
            {typingUsers.map((u) => u.firstName).join(", ")} typing...
          </div>
        )}
      </div>
    </div>
  );
}
