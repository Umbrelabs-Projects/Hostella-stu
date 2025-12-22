import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useNotificationsStore } from '../useNotificationsStore';
import { Notification } from '@/types/notifications';

jest.mock('../../lib/api', () => ({
  notificationApi: {
    markAsRead: jest.fn().mockResolvedValue({ success: true, data: { message: 'Notification marked as read' } }),
  },
}));

describe('useNotificationsStore actions', () => {
  beforeEach(() => {
    // Reset store state before each test
    useNotificationsStore.setState({
      notifications: [],
      broadcastNotifications: [],
      unreadCount: 0,
      error: null,
      loading: false,
      pagination: null,
    });
  });

  it('marks notification as read', async () => {
    const { result } = renderHook(() => useNotificationsStore());
    
    const testNotification: Notification = {
      id: 'notif_123',
      type: 'booking-approved',
      title: 'Booking Approved',
      description: 'Your booking has been approved',
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    act(() => {
      result.current.addNotification(testNotification);
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0].isRead).toBe(false);
    expect(result.current.unreadCount).toBe(1);

    await act(async () => {
      await result.current.markAsRead('notif_123');
    });

    expect(result.current.notifications[0].isRead).toBe(true);
    expect(result.current.unreadCount).toBe(0);
  });

  it('adds notification and updates unread count', () => {
    const { result } = renderHook(() => useNotificationsStore());

    const testNotification: Notification = {
      id: 'notif_456',
      type: 'broadcast',
      title: 'System Maintenance',
      description: 'Scheduled maintenance tonight',
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    act(() => {
      result.current.addNotification(testNotification);
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.broadcastNotifications).toHaveLength(1);
    expect(result.current.unreadCount).toBe(1);
    expect(result.current.notifications[0].id).toBe('notif_456');
  });

  it('does not increment unread count for already read notifications', () => {
    const { result } = renderHook(() => useNotificationsStore());

    const readNotification: Notification = {
      id: 'notif_789',
      type: 'payment-received',
      title: 'Payment Received',
      description: 'Your payment has been processed',
      isRead: true,
      createdAt: new Date().toISOString(),
    };

    act(() => {
      result.current.addNotification(readNotification);
    });

    expect(result.current.unreadCount).toBe(0);
  });
});
