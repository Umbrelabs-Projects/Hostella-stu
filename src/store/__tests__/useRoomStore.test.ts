import { renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRoomStore } from '../useRoomStore';

describe('useRoomStore', () => {
  it('initializes empty', () => {
    const { result } = renderHook(() => useRoomStore());
    expect(result.current.rooms).toEqual([]);
    expect(result.current.selectedRoom).toBeNull();
  });
});
