import { create } from 'zustand';
import { Hostel } from '@/types/api';
import { hostelApi } from '@/lib/api';

interface HostelState {
  hostels: Hostel[];
  featuredHostels: Hostel[];
  selectedHostel: Hostel | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;

  fetchHostels: (params?: { page?: number; limit?: number; search?: string }) => Promise<void>;
  fetchFeaturedHostels: () => Promise<void>;
  fetchHostelById: (id: number) => Promise<void>;
  setSelectedHostel: (hostel: Hostel | null) => void;
  clearError: () => void;
}

export const useHostelStore = create<HostelState>((set) => ({
  hostels: [],
  featuredHostels: [],
  selectedHostel: null,
  loading: false,
  error: null,
  pagination: null,

  fetchHostels: async (params) => {
    set({ loading: true, error: null });
    try {
      const response = await hostelApi.getAll(params);
      set({
        hostels: response.data,
        pagination: response.pagination,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch hostels',
        loading: false,
      });
    }
  },

  fetchFeaturedHostels: async () => {
    set({ loading: true, error: null });
    try {
      const response = await hostelApi.getFeatured();
      set({
        featuredHostels: response.data,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch featured hostels',
        loading: false,
      });
    }
  },

  fetchHostelById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await hostelApi.getById(id);
      set({
        selectedHostel: response.data,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || 'Failed to fetch hostel',
        loading: false,
      });
    }
  },

  setSelectedHostel: (hostel) => set({ selectedHostel: hostel }),

  clearError: () => set({ error: null }),
}));
