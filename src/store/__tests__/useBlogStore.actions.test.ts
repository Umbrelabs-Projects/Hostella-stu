import { renderHook, act } from '@testing-library/react';
import { useBlogStore } from '../../store/useBlogStore';
import * as api from '../../lib/api';

jest.mock('../../lib/api', () => ({
  blogApi: {
    getAll: jest.fn(),
    getBySlug: jest.fn(),
    getCategories: jest.fn(),
  },
}));

describe('useBlogStore actions', () => {
  it('fetches posts and sets pagination', async () => {
    (api.blogApi.getAll as jest.Mock).mockResolvedValue({ data: [{ slug: 'post-1', title: 'Post 1' }], pagination: { page: 1, limit: 10, total: 1, totalPages: 1 } });

    const { result } = renderHook(() => useBlogStore());
    await act(async () => {
      await result.current.fetchPosts({ page: 1, limit: 10 });
    });
    expect(result.current.posts.length).toBe(1);
    expect(result.current.pagination?.total).toBe(1);
  });

  it('fetches categories', async () => {
    (api.blogApi.getCategories as jest.Mock).mockResolvedValue({ data: ['news', 'updates'] });

    const { result } = renderHook(() => useBlogStore());
    await act(async () => {
      await result.current.fetchCategories();
    });
    expect(result.current.categories).toEqual(['news', 'updates']);
  });
});
