import { create } from 'zustand';
import { Booking, CreateBookingData } from '@/types/api';
import { bookingApi } from '@/lib/api';

interface BookingState {
  bookings: Booking[];
  selectedBooking: Booking | null;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;

  fetchBookings: (params?: { page?: number; limit?: number; status?: string }) => Promise<void>;
  fetchUserBookings: () => Promise<void>;
  fetchBookingById: (id: string) => Promise<void>;
  createBooking: (data: CreateBookingData) => Promise<Booking | null>;
  updateBooking: (id: string, data: Partial<Booking>) => Promise<void>;
  cancelBooking: (id: string, reason?: string) => Promise<void>;
  setSelectedBooking: (booking: Booking | null) => void;
  clearError: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  bookings: [],
  selectedBooking: null,
  loading: false,
  error: null,
  pagination: null,

  fetchBookings: async (params) => {
    set({ loading: true, error: null });
    try {
      const response = await bookingApi.getAll(params);
      set({
        bookings: response.data,
        pagination: response.pagination,
        loading: false,
      });
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch bookings',
        loading: false,
      });
    }
  },

  fetchUserBookings: async (params?: { page?: number; limit?: number; status?: string }) => {
    set({ loading: true, error: null });
    try {
      const response = await bookingApi.getUserBookings(params);
      set({
        bookings: response.data.bookings,
        pagination: {
          page: response.data.page,
          limit: response.data.pageSize,
          total: response.data.total,
          totalPages: Math.ceil(response.data.total / response.data.pageSize),
        },
        loading: false,
      });
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch user bookings',
        loading: false,
      });
    }
  },

  fetchBookingById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await bookingApi.getById(id);
      set({
        selectedBooking: response.data,
        loading: false,
      });
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch booking',
        loading: false,
      });
    }
  },

  createBooking: async (data) => {
    set({ loading: true, error: null });
    try {
      console.log('Creating booking with data:', data);
      const response = await bookingApi.create(data);
      console.log('Booking created successfully:', response);
      set((state) => ({
        bookings: [response.data, ...state.bookings],
        selectedBooking: response.data,
        loading: false,
      }));
      return response.data;
    } catch (error: unknown) {
      console.error('Booking creation error:', error);
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error details:', error);
      }
      set({
        error: error instanceof Error ? error.message : 'Failed to create booking',
        loading: false,
      });
      throw error; // Re-throw so the component can handle it
    }
  },

  updateBooking: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const response = await bookingApi.update(id, data);
      set((state) => ({
        bookings: state.bookings.map((b) =>
          b.id === id ? response.data : b
        ),
        selectedBooking:
          state.selectedBooking?.id === id
            ? response.data
            : state.selectedBooking,
        loading: false,
      }));
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update booking',
        loading: false,
      });
    }
  },

  cancelBooking: async (id, reason?: string) => {
    set({ loading: true, error: null });
    try {
      const response = await bookingApi.cancel(id, reason);
      set((state) => ({
        bookings: state.bookings.map((b) =>
          b.id === id ? response.data.booking : b
        ),
        selectedBooking:
          state.selectedBooking?.id === id
            ? response.data.booking
            : state.selectedBooking,
        loading: false,
      }));
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : 'Failed to cancel booking',
        loading: false,
      });
      throw error;
    }
  },

  setSelectedBooking: (booking) => set({ selectedBooking: booking }),

  clearError: () => set({ error: null }),
}));
