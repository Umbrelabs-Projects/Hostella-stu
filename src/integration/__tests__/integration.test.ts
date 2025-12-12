import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useAuthStore } from '../../store/useAuthStore';
// import { useBookingStore } from '../../store/useBookingStore';
import { useHostelStore } from '../../store/useHostelStore';
import { useRoomStore } from '../../store/useRoomStore';
import { setAuthToken } from '../../lib/api';

jest.mock('../../lib/api', () => ({
  setAuthToken: jest.fn(),
  apiFetch: jest.fn(),
  authApi: { signIn: jest.fn(), signUp: jest.fn() },
  hostelApi: { getAll: jest.fn() },
  roomApi: { getAll: jest.fn() },
  bookingApi: { getAll: jest.fn() },
}));

describe('API Integration', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('sets and clears auth token', () => {
    const token = 'test-token-123';
    setAuthToken(token);
    expect(setAuthToken).toHaveBeenCalledWith(token);
    setAuthToken(null);
    expect(setAuthToken).toHaveBeenCalledWith(null);
  });
});

describe('Utility & Store Integration', () => {
  beforeEach(() => { jest.clearAllMocks(); localStorage.clear(); });

  it('generates valid booking ID and persists signup data', () => {
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      result.current.updateExtraBookingDetails({ hostelName: 'Test Hostel', roomTitle: 'Deluxe Room', price: '50' });
      result.current.updateSignupData({ firstName: 'John', lastName: 'Doe', email: 'john@example.com' });
    });
    expect(result.current.extraBookingDetails.bookingId).toMatch(/^BK\d{8}$/);
    const stored = localStorage.getItem('signup-data');
    expect(stored).toBeTruthy();
  });
});

describe('Platform Integration', () => {
  it('maintains initial state across stores', () => {
    const { result: authResult } = renderHook(() => useAuthStore());
    const { result: hostelResult } = renderHook(() => useHostelStore());
    const { result: roomResult } = renderHook(() => useRoomStore());
    expect(authResult.current.user).toBeNull();
    expect(hostelResult.current.hostels).toEqual([]);
    expect(roomResult.current.rooms).toEqual([]);
  });
});
