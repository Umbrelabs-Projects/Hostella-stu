import { renderHook, act } from '@testing-library/react';
import { useBlogStore } from '../../store/useBlogStore';
import * as api from '../../lib/api';

jest.mock('../../lib/api', () => ({
  blogApi: {
    getBySlug: jest.fn(),
  },
}));

describe('useBlogStore fetch by slug', () => {
  it('fetches post by slug and sets selectedPost', async () => {
    (api.blogApi.getBySlug as jest.Mock).mockResolvedValue({ data: { slug: 'hello-world', title: 'Hello World' } });

    const { result } = renderHook(() => useBlogStore());
    await act(async () => {
      await result.current.fetchPostBySlug('hello-world');
    });
    expect(result.current.selectedPost?.slug).toBe('hello-world');
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
