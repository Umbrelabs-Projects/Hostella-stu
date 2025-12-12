import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useUIStore } from '../useUIStore';

describe('useUIStore', () => {
  it('initializes with defaults', () => {
    const { result } = renderHook(() => useUIStore());
    expect(result.current.showNavbar).toBe(true);
    expect(typeof result.current.hydrated).toBe('boolean');
  });

  it('sets navbar visibility', () => {
    const { result } = renderHook(() => useUIStore());
    act(() => result.current.setShowNavbar(false));
    expect(result.current.showNavbar).toBe(false);
  });
});
