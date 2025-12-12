import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useAuthStore } from '../../store/useAuthStore';

jest.mock('../../lib/api', () => ({
  setAuthToken: jest.fn(),
  authApi: {
    signIn: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    getCurrentUser: jest.fn(),
    updateProfile: jest.fn(),
    updatePassword: jest.fn(),
  },
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
}));

describe('useAuthStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should initialize with null user and token', () => {
    const { result } = renderHook(() => useAuthStore());
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('should update signup data correctly', () => {
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      result.current.updateSignupData({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      });
    });
    expect(result.current.signupData.firstName).toBe('John');
    expect(result.current.signupData.lastName).toBe('Doe');
  });

  it('should reset signup data', () => {
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      result.current.updateSignupData({ firstName: 'John' });
      result.current.resetSignupData();
    });
    expect(result.current.signupData).toEqual({});
  });

  it('should clear signup progress', () => {
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      result.current.updateSignupData({ firstName: 'John' });
      result.current.clearSignupProgress();
    });
    expect(result.current.signupData).toEqual({});
    expect(localStorage.getItem('signup-step')).toBeNull();
  });

  it('should update extra booking details with generated booking ID', () => {
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      result.current.updateExtraBookingDetails({
        hostelName: 'Test Hostel',
        roomTitle: 'Deluxe Room',
        price: '50',
      });
    });
    expect(result.current.extraBookingDetails.hostelName).toBe('Test Hostel');
    expect(result.current.extraBookingDetails.bookingId).toMatch(/^BK\d{8}$/);
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
