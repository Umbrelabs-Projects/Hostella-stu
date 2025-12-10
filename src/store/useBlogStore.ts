import { create } from 'zustand';
import { BlogPost } from '@/types/api';
import { blogApi } from '@/lib/api';

interface BlogState {
  posts: BlogPost[];
  selectedPost: BlogPost | null;
  categories: string[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;

  fetchPosts: (params?: { page?: number; limit?: number; category?: string; tag?: string }) => Promise<void>;
  fetchPostBySlug: (slug: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  clearError: () => void;
}

export const useBlogStore = create<BlogState>((set) => ({
  posts: [],
  selectedPost: null,
  categories: [],
  loading: false,
  error: null,
  pagination: null,

  fetchPosts: async (params) => {
    set({ loading: true, error: null });
    try {
      const response = await blogApi.getAll(params);
      set({
        posts: response.data,
        pagination: response.pagination,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch blog posts',
        loading: false,
      });
    }
  },

  fetchPostBySlug: async (slug) => {
    set({ loading: true, error: null });
    try {
      const response = await blogApi.getBySlug(slug);
      set({
        selectedPost: response.data,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch blog post',
        loading: false,
      });
    }
  },

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const response = await blogApi.getCategories();
      set({
        categories: response.data,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch categories',
        loading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
