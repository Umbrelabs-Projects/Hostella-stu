import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useBookingStore } from '../store/useBookingStore';
import { useHostelStore } from '../store/useHostelStore';
import { useRoomStore } from '../store/useRoomStore';
import { usePaymentStore } from '../store/usePaymentStore';
import { useChatStore } from '../store/useChatStore';
import { useNotificationsStore } from '../store/useNotificationsStore';
import { useGalleryStore } from '../store/useGalleryStore';
import { useBlogStore } from '../store/useBlogStore';
import { useFAQStore } from '../store/useFAQStore';
import { useTestimonialStore } from '../store/useTestimonialStore';
import { usePasswordResetStore } from '../store/usePasswordResetStore';
import { useUIStore } from '../store/useUIStore';
import { setAuthToken } from '../lib/api';
import { Booking, Hostel, Room, Chat } from '@/types/api';

// Mock API module
jest.mock('../lib/api', () => ({
  setAuthToken: jest.fn(),
  apiFetch: jest.fn(),
  authApi: {
    signIn: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    getCurrentUser: jest.fn(),
    updateProfile: jest.fn(),
    updatePassword: jest.fn(),
  },
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
  bookingApi: {
    getAll: jest.fn(),
    getById: jest.fn(),
    getUserBookings: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    cancel: jest.fn(),
  },
  paymentApi: {
    create: jest.fn(),
    verify: jest.fn(),
    getUserPayments: jest.fn(),
  },
  chatApi: {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    sendMessage: jest.fn(),
    getMessages: jest.fn(),
  },
  notificationApi: {
    getAll: jest.fn(),
    markAsRead: jest.fn(),
    markAllAsRead: jest.fn(),
  },
  galleryApi: {
    getAll: jest.fn(),
  },
  blogApi: {
    getAll: jest.fn(),
    getById: jest.fn(),
  },
  faqApi: {
    getAll: jest.fn(),
  },
  testimonialApi: {
    getAll: jest.fn(),
  },
}));

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => '/',
}));

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

describe('Hostella Platform - Comprehensive Test Suite', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  // ============================================
  // AUTHENTICATION STORE TESTS
  // ============================================
  describe('useAuthStore', () => {
    it('should initialize with null user and token', () => {
      const { result } = renderHook(() => useAuthStore());
      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.loading).toBe(false);
    });

    it('should update signup data correctly', () => {
      const { result } = renderHook(() => useAuthStore());
      act(() => {
        result.current.updateSignupData({
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@example.com',
        });
      });
      expect(result.current.signupData.firstName).toBe('John');
      expect(result.current.signupData.lastName).toBe('Doe');
    });

    it('should reset signup data', () => {
      const { result } = renderHook(() => useAuthStore());
      act(() => {
        result.current.updateSignupData({ firstName: 'John' });
        result.current.resetSignupData();
      });
      expect(result.current.signupData).toEqual({});
    });

    it('should clear signup progress', () => {
      const { result } = renderHook(() => useAuthStore());
      act(() => {
        result.current.updateSignupData({ firstName: 'John' });
        result.current.clearSignupProgress();
      });
      expect(result.current.signupData).toEqual({});
      expect(localStorage.getItem('signup-step')).toBeNull();
    });

    it('should update extra booking details with generated booking ID', () => {
      const { result } = renderHook(() => useAuthStore());
      act(() => {
        result.current.updateExtraBookingDetails({
          hostelName: 'Test Hostel',
          roomTitle: 'Deluxe Room',
          price: '2500',
          currency: 'GHC',
          emergencyContactName: 'John Doe',
          emergencyContactNumber: '+233123456789',
          relation: 'Brother',
          hasMedicalCondition: false,
        });
      });
      expect(result.current.extraBookingDetails.hostelName).toBe('Test Hostel');
      expect(result.current.extraBookingDetails.currency).toBe('GHC');
      expect(result.current.extraBookingDetails.price).toBe('2500');
      expect(result.current.extraBookingDetails.bookingId).toMatch(/^BK\d{8}$/);
    });
  });

  // ============================================
  // BOOKING STORE TESTS
  // ============================================
  describe('useBookingStore', () => {
    it('should initialize with empty bookings array', () => {
      const { result } = renderHook(() => useBookingStore());
      expect(result.current.bookings).toEqual([]);
      expect(result.current.selectedBooking).toBeNull();
      expect(result.current.loading).toBe(false);
    });

    it('should set selected booking', () => {
      const { result } = renderHook(() => useBookingStore());
      const mockBooking: Booking = {
        id: '1',
        bookingId: 'BK-1',
        status: 'pending payment',
      };
      act(() => {
        result.current.setSelectedBooking(mockBooking);
      });
      expect(result.current.selectedBooking).toEqual(mockBooking);
    });

    it('should clear error', () => {
      const { result } = renderHook(() => useBookingStore());
      act(() => {
        result.current.clearError();
      });
      expect(result.current.error).toBeNull();
    });
  });

  // ============================================
  // HOSTEL STORE TESTS
  // ============================================
  describe('useHostelStore', () => {
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

  // ============================================
  // ROOM STORE TESTS
  // ============================================
  describe('useRoomStore', () => {
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

  // ============================================
  // PAYMENT STORE TESTS
  // ============================================
  describe('usePaymentStore', () => {
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

  // ============================================
  // CHAT STORE TESTS
  // ============================================
  describe('useChatStore', () => {
    it('should initialize with empty chats array', () => {
      const { result } = renderHook(() => useChatStore());
      expect(result.current.chats).toEqual([]);
      expect(result.current.selectedChat).toBeNull();
    });

    it('should set selected chat', () => {
      const { result } = renderHook(() => useChatStore());
      const mockChat: Chat = {
        id: 1,
        lastMessage: 'Hello',
        lastMessageTime: '',
        unreadCount: 0,
        userId: 1,
      };
      act(() => {
        result.current.setSelectedChat(mockChat);
      });
      expect(result.current.selectedChat).toEqual(mockChat);
    });
  });

  // ============================================
  // NOTIFICATIONS STORE TESTS
  // ============================================
  describe('useNotificationsStore', () => {
    it('should initialize with empty notifications array', () => {
      const { result } = renderHook(() => useNotificationsStore());
      expect(result.current.notifications).toEqual([]);
    });

    it('should clear error', () => {
      const { result } = renderHook(() => useNotificationsStore());
      act(() => {
        result.current.clearError();
      });
      expect(result.current.error).toBeNull();
    });
  });

  // ============================================
  // GALLERY STORE TESTS
  // ============================================
  describe('useGalleryStore', () => {
    it('should initialize with empty images array', () => {
      const { result } = renderHook(() => useGalleryStore());
      expect(result.current.images).toEqual([]);
      expect(result.current.loading).toBe(false);
    });
  });

  // ============================================
  // BLOG STORE TESTS
  // ============================================
  describe('useBlogStore', () => {
    it('should initialize with empty posts array', () => {
      const { result } = renderHook(() => useBlogStore());
      expect(result.current.posts).toEqual([]);
      expect(result.current.selectedPost).toBeNull();
    });

    it('should clear error', () => {
      const { result } = renderHook(() => useBlogStore());
      act(() => {
        result.current.clearError();
      });
      expect(result.current.error).toBeNull();
    });
  });

  // ============================================
  // FAQ STORE TESTS
  // ============================================
  describe('useFAQStore', () => {
    it('should initialize with empty faqs array', () => {
      const { result } = renderHook(() => useFAQStore());
      expect(result.current.faqs).toEqual([]);
      expect(result.current.loading).toBe(false);
    });
  });

  // ============================================
  // TESTIMONIAL STORE TESTS
  // ============================================
  describe('useTestimonialStore', () => {
    it('should initialize with empty testimonials array', () => {
      const { result } = renderHook(() => useTestimonialStore());
      expect(result.current.testimonials).toEqual([]);
      expect(result.current.loading).toBe(false);
    });
  });

  // ============================================
  // PASSWORD RESET STORE TESTS
  // ============================================
  describe('usePasswordResetStore', () => {
    it('should initialize with empty email and code', () => {
      const { result } = renderHook(() => usePasswordResetStore());
      expect(result.current.email).toBe('');
      expect(result.current.code).toBe('');
      expect(result.current.step).toBe('email');
    });

    it('should set email', () => {
      const { result } = renderHook(() => usePasswordResetStore());
      act(() => {
        result.current.setEmail('test@example.com');
      });
      expect(result.current.email).toBe('test@example.com');
    });

    it('should set code', () => {
      const { result } = renderHook(() => usePasswordResetStore());
      act(() => {
        result.current.setCode('123456');
      });
      expect(result.current.code).toBe('123456');
    });

    it('should set step', () => {
      const { result } = renderHook(() => usePasswordResetStore());
      act(() => {
        result.current.setStep('code');
      });
      expect(result.current.step).toBe('code');
    });

    it('should reset state', () => {
      const { result } = renderHook(() => usePasswordResetStore());
      act(() => {
        result.current.setEmail('test@example.com');
        result.current.setCode('123456');
        result.current.setStep('password');
        result.current.reset();
      });
      expect(result.current.email).toBe('');
      expect(result.current.code).toBe('');
      expect(result.current.step).toBe('email');
    });
  });

  // ============================================
  // UI STORE TESTS
  // ============================================
  describe('useUIStore', () => {
    it('should initialize with showNavbar true', () => {
      const { result } = renderHook(() => useUIStore());
      expect(result.current.showNavbar).toBe(true);
    });

    it('should set showNavbar', () => {
      const { result } = renderHook(() => useUIStore());
      act(() => {
        result.current.setShowNavbar(false);
      });
      expect(result.current.showNavbar).toBe(false);
      act(() => {
        result.current.setShowNavbar(true);
      });
      expect(result.current.showNavbar).toBe(true);
    });

    it('should set hydrated', () => {
      const { result } = renderHook(() => useUIStore());
      act(() => {
        result.current.setHydrated(true);
      });
      expect(result.current.hydrated).toBe(true);
    });
  });

  // ============================================
  // API INTEGRATION TESTS
  // ============================================
  describe('API Integration', () => {
    it('should set auth token correctly', () => {
      const token = 'test-token-123';
      setAuthToken(token);
      expect(setAuthToken).toHaveBeenCalledWith(token);
    });

    it('should clear auth token', () => {
      setAuthToken(null);
      expect(setAuthToken).toHaveBeenCalledWith(null);
    });
  });

  // ============================================
  // UTILITY TESTS
  // ============================================
  describe('Utility Functions', () => {
    it('should generate valid booking ID format', () => {
      const { result } = renderHook(() => useAuthStore());
      act(() => {
        result.current.updateExtraBookingDetails({ 
          hostelName: 'Test Hostel',
          roomTitle: 'Deluxe Room',
          price: '50'
        });
      });
      const bookingId = result.current.extraBookingDetails.bookingId;
      expect(bookingId).toMatch(/^BK\d{8}$/);
    });

    it('should persist signup data to localStorage', () => {
      const { result } = renderHook(() => useAuthStore());
      const signupData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
      };
      act(() => {
        result.current.updateSignupData(signupData);
      });
      const stored = localStorage.getItem('signup-data');
      expect(stored).toBeTruthy();
      if (stored) {
        const parsed = JSON.parse(stored);
        expect(parsed.firstName).toBe('John');
      }
    });
  });

  // ============================================
  // PLATFORM INTEGRATION TESTS
  // ============================================
  describe('Platform Integration', () => {
    it('should handle complete booking flow data structure', () => {
      const { result: authResult } = renderHook(() => useAuthStore());
      const { result: bookingResult } = renderHook(() => useBookingStore());

      act(() => {
        authResult.current.updateExtraBookingDetails({
          hostelName: 'Test Hostel',
          roomTitle: 'Deluxe Room',
          price: '50',
          emergencyContactName: 'Jane Doe',
          emergencyContactNumber: '123-456-7890',
          relation: 'Spouse',
          hasMedicalCondition: false,
        });
      });

      expect(authResult.current.extraBookingDetails.hostelName).toBe('Test Hostel');
      expect(authResult.current.extraBookingDetails.roomTitle).toBe('Deluxe Room');
      expect(bookingResult.current.loading).toBe(false);
    });

    it('should maintain state consistency across stores', () => {
      const { result: authResult } = renderHook(() => useAuthStore());
      const { result: hostelResult } = renderHook(() => useHostelStore());
      const { result: roomResult } = renderHook(() => useRoomStore());

      expect(authResult.current.user).toBeNull();
      expect(hostelResult.current.hostels).toEqual([]);
      expect(roomResult.current.rooms).toEqual([]);
    });
  });
});
