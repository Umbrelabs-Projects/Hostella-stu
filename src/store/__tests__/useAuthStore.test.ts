import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useAuthStore } from '../useAuthStore';

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

  it('initializes with null user and token', () => {
    const { result } = renderHook(() => useAuthStore());
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('updates signup data correctly', () => {
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

  it('resets signup data', () => {
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      result.current.updateSignupData({ firstName: 'John' });
      result.current.resetSignupData();
    });
    expect(result.current.signupData).toEqual({});
  });
});
