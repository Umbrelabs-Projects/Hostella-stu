import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useBookingStore } from '../../store/useBookingStore';
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

  it('should initialize with empty bookings array', () => {
    const { result } = renderHook(() => useBookingStore());
    expect(result.current.bookings).toEqual([]);
    expect(result.current.selectedBooking).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('should set selected booking', () => {
    const { result } = renderHook(() => useBookingStore());
    const mockBooking: Booking = {
      id: '1',
      bookingId: 'BK-1',
      status: 'pending payment',
    };
    act(() => {
      result.current.setSelectedBooking(mockBooking);
    });
    expect(result.current.selectedBooking).toEqual(mockBooking);
  });

  it('should clear error', () => {
    const { result } = renderHook(() => useBookingStore());
    act(() => {
      result.current.clearError();
    });
    expect(result.current.error).toBeNull();
  });
});
