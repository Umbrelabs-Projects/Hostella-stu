import { renderHook, act } from '@testing-library/react';
import { useGalleryStore } from '../../store/useGalleryStore';
import * as api from '../../lib/api';

jest.mock('../../lib/api', () => ({
  galleryApi: {
    getAll: jest.fn(),
    getByHostelId: jest.fn(),
  },
}));

describe('useGalleryStore actions', () => {
  it('fetches images with pagination', async () => {
    (api.galleryApi.getAll as jest.Mock).mockResolvedValue({ data: [{ id: 1, url: '/img1.jpg' }], pagination: { page: 1, limit: 10, total: 1, totalPages: 1 } });

    const { result } = renderHook(() => useGalleryStore());
    await act(async () => {
      await result.current.fetchImages({ page: 1, limit: 10 });
    });
    expect(result.current.images.length).toBe(1);
    expect(result.current.pagination?.page).toBe(1);
  });

  it('fetches images by hostel id', async () => {
    (api.galleryApi.getByHostelId as jest.Mock).mockResolvedValue({ data: [{ id: 2, url: '/img2.jpg' }] });

    const { result } = renderHook(() => useGalleryStore());
    await act(async () => {
      await result.current.fetchImagesByHostelId(5);
    });
    expect(result.current.images.length).toBe(1);
    expect(result.current.images[0].id).toBe(2);
  });
});
