import { renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useGalleryStore } from '../useGalleryStore';

describe('useGalleryStore', () => {
  it('initializes empty', () => {
    const { result } = renderHook(() => useGalleryStore());
    expect(result.current.images).toEqual([]);
  });
});
