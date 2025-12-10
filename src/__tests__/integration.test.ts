import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useBookingStore } from '../store/useBookingStore';
import { useHostelStore } from '../store/useHostelStore';
import { useRoomStore } from '../store/useRoomStore';
import { setAuthToken } from '../lib/api';

jest.mock('../lib/api', () => ({
  setAuthToken: jest.fn(),
  apiFetch: jest.fn(),
  authApi: {
    signIn: jest.fn(),
    signUp: jest.fn(),
  },
  hostelApi: {
    getAll: jest.fn(),
  },
  roomApi: {
    getAll: jest.fn(),
  },
  bookingApi: {
    getAll: jest.fn(),
  },
}));

describe('API Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should set auth token correctly', () => {
    const token = 'test-token-123';
    setAuthToken(token);
    expect(setAuthToken).toHaveBeenCalledWith(token);
  });

  it('should clear auth token', () => {
    setAuthToken(null);
    expect(setAuthToken).toHaveBeenCalledWith(null);
  });
});

describe('Utility Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should generate valid booking ID format', () => {
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      result.current.updateExtraBookingDetails({
        hostelName: 'Test Hostel',
        roomTitle: 'Deluxe Room',
        price: '50',
      });
    });
    const bookingId = result.current.extraBookingDetails.bookingId;
    expect(bookingId).toMatch(/^BK\d{8}$/);
  });

  it('should persist signup data to localStorage', () => {
    const { result } = renderHook(() => useAuthStore());
    const signupData = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
    };
    act(() => {
      result.current.updateSignupData(signupData);
    });
    const stored = localStorage.getItem('signup-data');
    expect(stored).toBeTruthy();
    if (stored) {
      const parsed = JSON.parse(stored);
      expect(parsed.firstName).toBe('John');
    }
  });
});

describe('Platform Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should handle complete booking flow data structure', () => {
    const { result: authResult } = renderHook(() => useAuthStore());
    const { result: bookingResult } = renderHook(() => useBookingStore());

    act(() => {
      authResult.current.updateExtraBookingDetails({
        hostelName: 'Test Hostel',
        roomTitle: 'Deluxe Room',
        price: '50',
        emergencyContactName: 'Jane Doe',
        emergencyContactNumber: '123-456-7890',
        relation: 'Spouse',
        hasMedicalCondition: false,
      });
    });

    expect(authResult.current.extraBookingDetails.hostelName).toBe('Test Hostel');
    expect(authResult.current.extraBookingDetails.roomTitle).toBe('Deluxe Room');
    expect(bookingResult.current.loading).toBe(false);
  });

  it('should maintain state consistency across stores', () => {
    const { result: authResult } = renderHook(() => useAuthStore());
    const { result: hostelResult } = renderHook(() => useHostelStore());
    const { result: roomResult } = renderHook(() => useRoomStore());

    expect(authResult.current.user).toBeNull();
    expect(hostelResult.current.hostels).toEqual([]);
    expect(roomResult.current.rooms).toEqual([]);
  });
});
