import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useNotificationsStore } from '../useNotificationsStore';

jest.mock('../../lib/api', () => ({
  notificationApi: {
    markAsRead: jest.fn().mockResolvedValue({ success: true, data: { message: 'ok' } }),
  },
}));

describe('useNotificationsStore actions', () => {
  it('marks notification as read', async () => {
    const { result } = renderHook(() => useNotificationsStore());
    act(() => {
      result.current.addNotification({ id: 1, title: 't', body: 'b', read: false, createdAt: '' });
    });
    await act(async () => {
      await result.current.markAsRead(1);
    });
    expect(result.current.notifications[0].read).toBe(true);
  });
});
