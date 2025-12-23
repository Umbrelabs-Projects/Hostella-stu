import { create } from 'zustand';
import { Room } from '@/types/api';
import { roomApi } from '@/lib/api';

interface RoomState {
  rooms: Room[];
  selectedRoom: Room | null;
  loading: boolean;
  error: string | null;
  availability: {
    available: boolean;
    availableCount: number;
  } | null;

  fetchRoomsByHostelId: (hostelId: string) => Promise<void>;
  fetchRoomById: (id: string) => Promise<void>;
  checkAvailability: (roomId: string, startDate: string, endDate: string) => Promise<void>;
  setSelectedRoom: (room: Room | null) => void;
  clearError: () => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  rooms: [],
  selectedRoom: null,
  loading: false,
  error: null,
  availability: null,

  fetchRoomsByHostelId: async (hostelId) => {
    set({ loading: true, error: null });
    try {
      const response = await roomApi.getByHostelId(hostelId);
      // Ensure data is always an array
      const roomsData = Array.isArray(response.data) ? response.data : [];
      set({
        rooms: roomsData,
        loading: false,
      });
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch rooms',
        loading: false,
        rooms: [], // Reset to empty array on error
      });
    }
  },

  fetchRoomById: async (id) => {
    set({ loading: true, error: null });
    try {
      const response = await roomApi.getById(id);
      set({
        selectedRoom: response.data,
        loading: false,
      });
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch room',
        loading: false,
      });
    }
  },

  checkAvailability: async (roomId, startDate, endDate) => {
    set({ loading: true, error: null });
    try {
      const response = await roomApi.checkAvailability(roomId, startDate, endDate);
      set({
        availability: response.data,
        loading: false,
      });
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : 'Failed to check availability',
        loading: false,
      });
    }
  },

  setSelectedRoom: (room) => set({ selectedRoom: room }),

  clearError: () => set({ error: null }),
}));
