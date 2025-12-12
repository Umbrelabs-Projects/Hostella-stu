import { renderHook } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useAuthStore } from '../../store/useAuthStore';

jest.mock('../../lib/api', () => ({
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
  testimonialApi: {
    getAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
  },
  galleryApi: {
    getAll: jest.fn(),
    getByHostelId: jest.fn(),
  },
  blogApi: {
    getAll: jest.fn(),
    getBySlug: jest.fn(),
    getCategories: jest.fn(),
  },
  faqApi: {
    getAll: jest.fn(),
    getCategories: jest.fn(),
  },
}));

describe('Platform stores', () => {
  it('auth store initializes', () => {
    const { result } = renderHook(() => useAuthStore());
    expect(result.current.user).toBeNull();
  });
});
