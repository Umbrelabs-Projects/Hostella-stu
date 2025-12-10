import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useGalleryStore } from '../../store/useGalleryStore';
import { useBlogStore } from '../../store/useBlogStore';
import { useFAQStore } from '../../store/useFAQStore';
import { useTestimonialStore } from '../../store/useTestimonialStore';

jest.mock('../../lib/api', () => ({
  galleryApi: {
    getAll: jest.fn(),
  },
  blogApi: {
    getAll: jest.fn(),
    getById: jest.fn(),
  },
  faqApi: {
    getAll: jest.fn(),
  },
  testimonialApi: {
    getAll: jest.fn(),
  },
}));

describe('useGalleryStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with empty images array', () => {
    const { result } = renderHook(() => useGalleryStore());
    expect(result.current.images).toEqual([]);
    expect(result.current.loading).toBe(false);
  });
});

describe('useBlogStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with empty posts array', () => {
    const { result } = renderHook(() => useBlogStore());
    expect(result.current.posts).toEqual([]);
    expect(result.current.selectedPost).toBeNull();
  });

  it('should clear error', () => {
    const { result } = renderHook(() => useBlogStore());
    act(() => {
      result.current.clearError();
    });
    expect(result.current.error).toBeNull();
  });
});

describe('useFAQStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with empty faqs array', () => {
    const { result } = renderHook(() => useFAQStore());
    expect(result.current.faqs).toEqual([]);
    expect(result.current.loading).toBe(false);
  });
});

describe('useTestimonialStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with empty testimonials array', () => {
    const { result } = renderHook(() => useTestimonialStore());
    expect(result.current.testimonials).toEqual([]);
    expect(result.current.loading).toBe(false);
  });
});
