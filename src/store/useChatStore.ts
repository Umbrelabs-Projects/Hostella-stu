import { create } from 'zustand';
import { Chat, ChatMessage } from '@/types/api';
import { chatApi } from '@/lib/api';

interface ChatState {
  chats: Chat[];
  selectedChat: Chat | null;
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;

  fetchChats: () => Promise<void>;
  fetchMessages: (chatId: number, params?: { page?: number; limit?: number }) => Promise<void>;
  sendMessage: (chatId: number, content: string, type?: 'text' | 'image' | 'voice' | 'file', file?: File) => Promise<void>;
  markAsRead: (chatId: number, messageIds: number[]) => Promise<void>;
  setSelectedChat: (chat: Chat | null) => void;
  addMessage: (message: ChatMessage) => void;
  clearError: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  chats: [],
  selectedChat: null,
  messages: [],
  loading: false,
  error: null,
  pagination: null,

  fetchChats: async () => {
    set({ loading: true, error: null });
    try {
      const response = await chatApi.getChats();
      set({
        chats: response.data,
        loading: false,
      });
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch chats',
        loading: false,
      });
    }
  },

  fetchMessages: async (chatId, params) => {
    set({ loading: true, error: null });
    try {
      const response = await chatApi.getMessages(chatId, params);
      set({
        messages: response.data,
        pagination: response.pagination,
        loading: false,
      });
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch messages',
        loading: false,
      });
    }
  },

  sendMessage: async (chatId, content, type = 'text', file) => {
    set({ loading: true, error: null });
    try {
      let formData: FormData | undefined;
      if (file) {
        formData = new FormData();
        formData.append('file', file);
        formData.append('content', content);
        formData.append('type', type);
      }

      const response = await chatApi.sendMessage(chatId, content, type, formData);
      set((state) => ({
        messages: [...state.messages, response.data],
        loading: false,
      }));
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : 'Failed to send message',
        loading: false,
      });
    }
  },

  markAsRead: async (chatId, messageIds) => {
    try {
      await chatApi.markAsRead(chatId, messageIds);
      set((state) => ({
        messages: state.messages.map((m) =>
          messageIds.includes(m.id) ? { ...m, read: true } : m
        ),
      }));
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : 'Failed to mark messages as read',
      });
    }
  },

  setSelectedChat: (chat) => set({ selectedChat: chat }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  clearError: () => set({ error: null }),
}));
