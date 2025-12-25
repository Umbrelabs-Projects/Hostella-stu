import { create } from 'zustand';
import { Booking, CreateBookingData } from '@/types/api';
import { bookingApi, ApiError } from '@/lib/api';

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
  fetchUserBookings: (params?: { page?: number; limit?: number; status?: string }) => Promise<void>;
  fetchBookingById: (id: string) => Promise<void>;
  createBooking: (data: CreateBookingData) => Promise<Booking | null>;
  updateBooking: (id: string, data: Partial<Booking>) => Promise<void>;
  cancelBooking: (id: string, reason?: string) => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;
  getBookingStats: () => Promise<{
    total: number;
    pendingPayment: number;
    pendingApproval: number;
    approved: number;
    roomAllocated: number;
    completed: number;
    cancelled: number;
  } | null>;
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
      
      // Debug: Log the raw API response
      console.log('Raw API response (getUserBookings):', JSON.stringify(response, null, 2));
      
      // Transform bookings to extract and normalize all fields
      const transformedBookings = response.data.bookings.map((booking: unknown) => {
        // Type assertion for the raw booking data from API
        const rawBooking = booking as Booking & { 
          hostel?: { id?: string; image?: string; name?: string };
          totalAmount?: number | string; // Database field that might be present
          preferredRoomType?: 'SINGLE' | 'DOUBLE'; // Database field that might be present
          [key: string]: unknown;
        };
        
        // Debug: Log each raw booking
        console.log('Raw booking from API:', {
          id: rawBooking.id,
          price: rawBooking.price,
          totalAmount: rawBooking.totalAmount,
          roomTitle: rawBooking.roomTitle,
          preferredRoomType: rawBooking.preferredRoomType,
          allKeys: Object.keys(rawBooking),
        });
        
        // The backend should transform the data via formatBookingForFrontend()
        // Database: totalAmount → API: price (string)
        // Database: preferredRoomType (SINGLE/DOUBLE) → API: roomTitle (One-in-one/Two-in-one)
        // But if the backend hasn't transformed it, we need to do it here as a fallback
        const price = rawBooking.price ?? 
          (rawBooking.totalAmount !== undefined ? String(rawBooking.totalAmount) : null);
        
        const roomTitle = rawBooking.roomTitle ?? 
          (rawBooking.preferredRoomType === 'SINGLE' ? 'One-in-one' : 
           rawBooking.preferredRoomType === 'DOUBLE' ? 'Two-in-one' : null);
        
        const transformed: Booking = {
          ...rawBooking, // This spread includes all fields from API response
          // Ensure required fields are present
          id: rawBooking.id || '',
          bookingId: rawBooking.bookingId || '',
          status: rawBooking.status || 'pending payment',
          // Use transformed values or fallback to database fields
          price: price,
          roomTitle: roomTitle,
          // Only override if we need to extract from nested hostel object
          hostelName: rawBooking.hostelName ?? rawBooking.hostel?.name ?? null,
          hostelId: rawBooking.hostel?.id ?? rawBooking.hostelId ?? null,
          hostelImage: rawBooking.hostel?.image ?? rawBooking.hostelImage ?? null,
        };

        // Debug: Log transformed booking
        console.log('Transformed booking:', {
          id: transformed.id,
          price: transformed.price,
          roomTitle: transformed.roomTitle,
        });

        return transformed;
      });
      set({
        bookings: transformedBookings,
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

  fetchBookingById: async (id, silent = false) => {
    // Prevent duplicate requests - if already loading for this booking, skip
    const state = useBookingStore.getState();
    if (state.loading && state.selectedBooking?.id === id && !silent) {
      return; // Already fetching this booking, skip duplicate request
    }
    
    // Only set loading for non-silent requests (initial fetches)
    if (!silent) {
      set({ loading: true, error: null });
    }
    try {
      const response = await bookingApi.getById(id);
      
      // Debug: Log the raw API response
      console.log('Raw API response (getById):', JSON.stringify(response, null, 2));
      
      // Transform booking to extract and normalize all fields
      const booking = response.data as Booking & { 
        hostel?: { id?: string; image?: string; name?: string };
        totalAmount?: number | string; // Database field that might be present
        preferredRoomType?: 'SINGLE' | 'DOUBLE'; // Database field that might be present
        [key: string]: unknown;
      };

      // Debug: Log raw booking
      console.log('Raw booking from API (getById):', {
        id: booking.id,
        price: booking.price,
        totalAmount: booking.totalAmount,
        roomTitle: booking.roomTitle,
        preferredRoomType: booking.preferredRoomType,
        allKeys: Object.keys(booking),
      });

      // The backend should transform the data via formatBookingForFrontend()
      // Database: totalAmount → API: price (string)
      // Database: preferredRoomType (SINGLE/DOUBLE) → API: roomTitle (One-in-one/Two-in-one)
      // But if the backend hasn't transformed it, we need to do it here as a fallback
      const price = booking.price ?? 
        (booking.totalAmount !== undefined ? String(booking.totalAmount) : null);
      
      const roomTitle = booking.roomTitle ?? 
        (booking.preferredRoomType === 'SINGLE' ? 'One-in-one' : 
         booking.preferredRoomType === 'DOUBLE' ? 'Two-in-one' : null);

      const transformed: Booking = {
        ...booking, // This spread includes all fields from API response
        // Ensure required fields are present
        id: booking.id || id,
        bookingId: booking.bookingId || '',
        status: booking.status || 'pending payment',
        // Use transformed values or fallback to database fields
        price: price,
        roomTitle: roomTitle,
        // Only override if we need to extract from nested hostel object
        hostelName: booking.hostelName ?? booking.hostel?.name ?? null,
        hostelId: booking.hostel?.id ?? booking.hostelId ?? null,
        hostelImage: booking.hostel?.image ?? booking.hostelImage ?? null,
      };

      // Debug: Log transformed booking
      console.log('Transformed booking (getById):', {
        id: transformed.id,
        price: transformed.price,
        roomTitle: transformed.roomTitle,
      });
      // Update state - only set loading to false if it was set to true (non-silent mode)
      if (silent) {
        // Silent mode: update data without changing loading state
        set({
          selectedBooking: transformed,
        });
      } else {
        // Normal mode: update data and set loading to false
        set({
          selectedBooking: transformed,
          loading: false,
        });
      }
    } catch (error: unknown) {
      // Check if it's a 404 or empty response (booking not found)
      let errorMessage = 'Failed to fetch booking';
      let isNotFound = false;
      
      if (error instanceof ApiError) {
        if (error.statusCode === 404) {
          isNotFound = true;
          errorMessage = 'Booking not found';
        } else {
          errorMessage = error.message || `API error: ${error.statusCode}`;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
        // If the error message is generic or empty, provide more context
        if (errorMessage.includes('API error') || errorMessage === 'Failed to fetch booking' || !errorMessage.trim()) {
          errorMessage = `Booking not found or you don't have permission to view it. Please check the booking ID: ${id}`;
        }
      }
      
      // Only log errors that aren't 404s (not found is expected in some cases)
      if (!isNotFound) {
        console.warn('Error fetching booking:', {
          bookingId: id,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
      
      if (!silent) {
        set({
          error: errorMessage,
          loading: false,
        });
      } else {
        set({
          error: errorMessage,
        });
      }
    }
  },

  createBooking: async (data) => {
    set({ loading: true, error: null });
    try {
      console.log('Creating booking with data:', data);
      const response = await bookingApi.create(data);
      console.log('Booking created successfully:', response);
      // The backend already transforms the data via formatBookingForFrontend()
      // Database: totalAmount → API: price (string)
      // Database: preferredRoomType (SINGLE/DOUBLE) → API: roomTitle (One-in-one/Two-in-one)
      // So roomTitle and price are already in the correct format in the API response
      const booking = response.data as Booking & { 
        hostel?: { id?: string; image?: string; name?: string };
        [key: string]: unknown;
      };
      const transformed: Booking = {
        ...booking, // This spread includes roomTitle and price from API response
        // Ensure required fields are present
        id: booking.id || '',
        bookingId: booking.bookingId || '',
        status: booking.status || 'pending payment',
        // Only override if we need to extract from nested hostel object
        hostelName: booking.hostelName ?? booking.hostel?.name ?? null,
        hostelId: booking.hostel?.id ?? booking.hostelId ?? null,
        hostelImage: booking.hostel?.image ?? booking.hostelImage ?? null,
        // roomTitle and price are preserved from the spread above
      };
      set((state) => ({
        bookings: [transformed, ...state.bookings],
        selectedBooking: transformed,
        loading: false,
      }));
      return transformed;
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

  deleteBooking: async (id) => {
    set({ loading: true, error: null });
    try {
      await bookingApi.delete(id);
      // Remove booking from state
      set((state) => ({
        bookings: state.bookings.filter((b) => b.id !== id),
        selectedBooking:
          state.selectedBooking?.id === id ? null : state.selectedBooking,
        loading: false,
      }));
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete booking',
        loading: false,
      });
      throw error;
    }
  },

  getBookingStats: async () => {
    set({ loading: true, error: null });
    try {
      const response = await bookingApi.getStats();
      set({ loading: false });
      return response.data.stats;
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch booking statistics',
        loading: false,
      });
      return null;
    }
  },

  setSelectedBooking: (booking) => set({ selectedBooking: booking }),

  clearError: () => set({ error: null }),
}));
