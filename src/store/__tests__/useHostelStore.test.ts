import { renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useHostelStore } from '../useHostelStore';

describe('useHostelStore', () => {
  it('initializes empty', () => {
    const { result } = renderHook(() => useHostelStore());
    expect(result.current.hostels).toEqual([]);
    expect(result.current.selectedHostel).toBeNull();
  });
});
