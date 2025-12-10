import { create } from 'zustand';
import { FAQ } from '@/types/api';
import { faqApi } from '@/lib/api';

interface FAQState {
  faqs: FAQ[];
  categories: string[];
  loading: boolean;
  error: string | null;

  fetchFAQs: (params?: { category?: string }) => Promise<void>;
  fetchCategories: () => Promise<void>;
  clearError: () => void;
}

export const useFAQStore = create<FAQState>((set) => ({
  faqs: [],
  categories: [],
  loading: false,
  error: null,

  fetchFAQs: async (params) => {
    set({ loading: true, error: null });
    try {
      const response = await faqApi.getAll(params);
      set({
        faqs: response.data,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch FAQs',
        loading: false,
      });
    }
  },

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const response = await faqApi.getCategories();
      set({
        categories: response.data,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch FAQ categories',
        loading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
