import { renderHook, act } from '@testing-library/react';
import { useGalleryStore } from '../../store/useGalleryStore';
import * as api from '../../lib/api';

jest.mock('../../lib/api', () => ({
  galleryApi: {
    getAll: jest.fn(),
  },
}));

describe('useGalleryStore error path', () => {
  it('sets error when fetchImages fails', async () => {
    (api.galleryApi.getAll as jest.Mock).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useGalleryStore());
    await act(async () => {
      await result.current.fetchImages({ page: 1 });
    });
    expect(result.current.error).toBe('Network error');
    expect(result.current.loading).toBe(false);
  });
});
