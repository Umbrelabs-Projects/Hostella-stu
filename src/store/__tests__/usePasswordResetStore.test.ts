import { renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';
import { usePasswordResetStore } from '../usePasswordResetStore';

describe('usePasswordResetStore', () => {
  it('initializes email step', () => {
    const { result } = renderHook(() => usePasswordResetStore());
    expect(result.current.step).toBe('email');
    expect(result.current.loading).toBe(false);
  });
});
