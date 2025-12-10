import { create } from 'zustand';
import { GalleryImage } from '@/types/api';
import { galleryApi } from '@/lib/api';

interface GalleryState {
  images: GalleryImage[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;

  fetchImages: (params?: { page?: number; limit?: number; category?: string }) => Promise<void>;
  fetchImagesByHostelId: (hostelId: number) => Promise<void>;
  clearError: () => void;
}

export const useGalleryStore = create<GalleryState>((set) => ({
  images: [],
  loading: false,
  error: null,
  pagination: null,

  fetchImages: async (params) => {
    set({ loading: true, error: null });
    try {
      const response = await galleryApi.getAll(params);
      set({
        images: response.data,
        pagination: response.pagination,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch gallery images',
        loading: false,
      });
    }
  },

  fetchImagesByHostelId: async (hostelId) => {
    set({ loading: true, error: null });
    try {
      const response = await galleryApi.getByHostelId(hostelId);
      set({
        images: response.data,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch hostel gallery',
        loading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));
