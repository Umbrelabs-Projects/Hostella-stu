import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useBookingStore } from '../useBookingStore';
import { Booking } from '@/types/api';

jest.mock('../../lib/api', () => ({
  bookingApi: {
    getAll: jest.fn(),
    getById: jest.fn(),
    getUserBookings: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    cancel: jest.fn(),
  },
}));

describe('useBookingStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with empty bookings array', () => {
    const { result } = renderHook(() => useBookingStore());
    expect(result.current.bookings).toEqual([]);
    expect(result.current.selectedBooking).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('sets selected booking', () => {
    const { result } = renderHook(() => useBookingStore());
    const mockBooking: Booking = {
      id: 1,
      userId: 1,
      hostelId: 1,
      roomId: 1,
      status: 'pending_payment',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
    };
    act(() => {
      result.current.setSelectedBooking(mockBooking);
    });
    expect(result.current.selectedBooking).toEqual(mockBooking);
  });

  it('clears error', () => {
    const { result } = renderHook(() => useBookingStore());
    act(() => {
      result.current.clearError();
    });
    expect(result.current.error).toBeNull();
  });
});
