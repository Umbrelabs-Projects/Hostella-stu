import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useHostelStore } from '../../store/useHostelStore';
import { useRoomStore } from '../../store/useRoomStore';
import { usePaymentStore } from '../../store/usePaymentStore';
import { Hostel, Room } from '@/types/api';

jest.mock('../../lib/api', () => ({
  hostelApi: {
    getAll: jest.fn(),
    getById: jest.fn(),
    search: jest.fn(),
  },
  roomApi: {
    getAll: jest.fn(),
    getById: jest.fn(),
    getByHostelId: jest.fn(),
  },
  paymentApi: {
    create: jest.fn(),
    verify: jest.fn(),
    getUserPayments: jest.fn(),
  },
}));

describe('useHostelStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with empty hostels array', () => {
    const { result } = renderHook(() => useHostelStore());
    expect(result.current.hostels).toEqual([]);
    expect(result.current.selectedHostel).toBeNull();
  });

  it('should set selected hostel', () => {
    const { result } = renderHook(() => useHostelStore());
    const mockHostel: Hostel = {
      id: '1',
      name: 'Test Hostel',
      location: 'Test Location',
      rating: 4.5,
      campus: null,
      description: null,
      image: null,
      images: [],
      amenities: [],
      priceRange: { min: 0, max: 0 },
      availableRooms: 0,
      totalRooms: 0,
      createdAt: '2024-01-01T00:00:00Z',
    };
    act(() => {
      result.current.setSelectedHostel(mockHostel);
    });
    expect(result.current.selectedHostel).toEqual(mockHostel);
  });
});

describe('useRoomStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with empty rooms array', () => {
    const { result } = renderHook(() => useRoomStore());
    expect(result.current.rooms).toEqual([]);
    expect(result.current.selectedRoom).toBeNull();
  });

  it('should set selected room', () => {
    const { result } = renderHook(() => useRoomStore());
    const mockRoom: Room = {
      id: '1',
      hostelId: '1',
      title: 'Deluxe Room',
      type: 'SINGLE',
      price: 50,
      description: 'Test room',
      available: 1,
      capacity: 1,
    };
    act(() => {
      result.current.setSelectedRoom(mockRoom);
    });
    expect(result.current.selectedRoom).toEqual(mockRoom);
  });
});

describe('usePaymentStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with empty payments array', () => {
    const { result } = renderHook(() => usePaymentStore());
    expect(result.current.payments).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  it('should clear error', () => {
    const { result } = renderHook(() => usePaymentStore());
    act(() => {
      result.current.clearError();
    });
    expect(result.current.error).toBeNull();
  });
});
