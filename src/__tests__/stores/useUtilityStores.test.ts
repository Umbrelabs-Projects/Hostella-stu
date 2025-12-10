import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { usePasswordResetStore } from '../../store/usePasswordResetStore';
import { useUIStore } from '../../store/useUIStore';

jest.mock('../../lib/api', () => ({
  authApi: {
    forgotPassword: jest.fn(),
    verifyResetCode: jest.fn(),
    resetPassword: jest.fn(),
  },
}));

describe('usePasswordResetStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with empty email and code', () => {
    const { result } = renderHook(() => usePasswordResetStore());
    expect(result.current.email).toBe('');
    expect(result.current.code).toBe('');
    expect(result.current.step).toBe('email');
  });

  it('should set email', () => {
    const { result } = renderHook(() => usePasswordResetStore());
    act(() => {
      result.current.setEmail('test@example.com');
    });
    expect(result.current.email).toBe('test@example.com');
  });

  it('should set code', () => {
    const { result } = renderHook(() => usePasswordResetStore());
    act(() => {
      result.current.setCode('123456');
    });
    expect(result.current.code).toBe('123456');
  });

  it('should set step', () => {
    const { result } = renderHook(() => usePasswordResetStore());
    act(() => {
      result.current.setStep('code');
    });
    expect(result.current.step).toBe('code');
  });

  it('should reset state', () => {
    const { result } = renderHook(() => usePasswordResetStore());
    act(() => {
      result.current.setEmail('test@example.com');
      result.current.setCode('123456');
      result.current.setStep('password');
      result.current.reset();
    });
    expect(result.current.email).toBe('');
    expect(result.current.code).toBe('');
    expect(result.current.step).toBe('email');
  });
});

describe('useUIStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with showNavbar true', () => {
    const { result } = renderHook(() => useUIStore());
    expect(result.current.showNavbar).toBe(true);
  });

  it('should set showNavbar', () => {
    const { result } = renderHook(() => useUIStore());
    act(() => {
      result.current.setShowNavbar(false);
    });
    expect(result.current.showNavbar).toBe(false);
    act(() => {
      result.current.setShowNavbar(true);
    });
    expect(result.current.showNavbar).toBe(true);
  });

  it('should set hydrated', () => {
    const { result } = renderHook(() => useUIStore());
    act(() => {
      result.current.setHydrated(true);
    });
    expect(result.current.hydrated).toBe(true);
  });
});
