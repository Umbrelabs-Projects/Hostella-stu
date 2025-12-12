import { renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useChatStore } from '../useChatStore';

jest.mock('../../lib/api', () => ({
  chatApi: {
    getChats: jest.fn(),
    getMessages: jest.fn(),
    sendMessage: jest.fn(),
  },
}));

describe('useChatStore', () => {
  it('initial state', () => {
    const { result } = renderHook(() => useChatStore());
    expect(result.current.chats).toEqual([]);
    expect(result.current.selectedChat).toBeNull();
  });
});
