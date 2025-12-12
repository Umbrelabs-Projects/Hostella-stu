import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useChatStore } from '../../store/useChatStore';
import { useNotificationsStore } from '../../store/useNotificationsStore';
import { Chat } from '@/types/api';

jest.mock('../../lib/api', () => ({
  chatApi: {
    getChats: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    sendMessage: jest.fn(),
    getMessages: jest.fn(),
  },
  notificationApi: {
    getAll: jest.fn(),
    markAsRead: jest.fn(),
    markAllAsRead: jest.fn(),
  },
}));

describe('useChatStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with empty chats array', () => {
    const { result } = renderHook(() => useChatStore());
    expect(result.current.chats).toEqual([]);
    expect(result.current.selectedChat).toBeNull();
  });

  it('should set selected chat', () => {
    const { result } = renderHook(() => useChatStore());
    const mockChat: Partial<Chat> = {
      id: 1,
      lastMessage: 'Hello',
      lastMessageTime: '',
      unreadCount: 0,
      userId: 1,
    };
    act(() => {
      result.current.setSelectedChat(mockChat);
    });
    expect(result.current.selectedChat).toEqual(mockChat);
  });
});

describe('useNotificationsStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with empty notifications array', () => {
    const { result } = renderHook(() => useNotificationsStore());
    expect(result.current.notifications).toEqual([]);
  });

  it('should clear error', () => {
    const { result } = renderHook(() => useNotificationsStore());
    act(() => {
      result.current.clearError();
    });
    expect(result.current.error).toBeNull();
  });
});
