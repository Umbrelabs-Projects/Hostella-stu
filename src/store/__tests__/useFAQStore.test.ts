import { renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useFAQStore } from '../useFAQStore';

describe('useFAQStore', () => {
  it('initializes empty', () => {
    const { result } = renderHook(() => useFAQStore());
    expect(result.current.faqs).toEqual([]);
  });
});
