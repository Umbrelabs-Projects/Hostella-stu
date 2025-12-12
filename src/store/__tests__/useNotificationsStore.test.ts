import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useNotificationsStore } from '../useNotificationsStore';

describe('useNotificationsStore', () => {
  it('initial state', () => {
    const { result } = renderHook(() => useNotificationsStore());
    expect(result.current.notifications).toEqual([]);
  });

  it('set error clears', () => {
    const { result } = renderHook(() => useNotificationsStore());
    act(() => result.current.clearError());
    expect(result.current.error).toBeNull();
  });
});
