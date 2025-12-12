import { renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useTestimonialStore } from '../useTestimonialStore';

describe('useTestimonialStore', () => {
  it('initializes empty', () => {
    const { result } = renderHook(() => useTestimonialStore());
    expect(result.current.testimonials).toEqual([]);
  });
});
