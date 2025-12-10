import { create } from 'zustand';
import { Testimonial } from '@/types/api';
import { testimonialApi } from '@/lib/api';

interface TestimonialState {
  testimonials: Testimonial[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;

  fetchTestimonials: (params?: { page?: number; limit?: number }) => Promise<void>;
  createTestimonial: (data: Omit<Testimonial, 'id' | 'createdAt'>) => Promise<void>;
  clearError: () => void;
}

export const useTestimonialStore = create<TestimonialState>((set) => ({
  testimonials: [],
  loading: false,
  error: null,
  pagination: null,

  fetchTestimonials: async (params) => {
    set({ loading: true, error: null });
    try {
      const response = await testimonialApi.getAll(params);
      set({
        testimonials: response.data,
        pagination: response.pagination,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch testimonials',
        loading: false,
      });
    }
  },

  createTestimonial: async (data) => {
    set({ loading: true, error: null });
    try {
      const response = await testimonialApi.create(data);
      set((state) => ({
        testimonials: [response.data, ...state.testimonials],
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || 'Failed to create testimonial',
        loading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
