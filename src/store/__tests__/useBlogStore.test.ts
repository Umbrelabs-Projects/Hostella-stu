import { renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useBlogStore } from '../useBlogStore';

describe('useBlogStore', () => {
  it('initializes empty', () => {
    const { result } = renderHook(() => useBlogStore());
    expect(result.current.posts).toEqual([]);
  });
});
