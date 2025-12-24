import { 
  Hostel, 
  Room, 
  Booking, 
  Testimonial, 
  GalleryImage, 
  BlogPost, 
  FAQ, 
  Payment,
  Chat,
  ChatMessage,
  Service,
  ContactMessage,
  CreateBookingData,
  UserBookingsResponse
} from '@/types/api';
import { User } from '@/store/useAuthStore';
import { Notification } from '@/types/notifications';
import {
  transformListHostelsResponse,
  transformHostelResponse,
  transformHostel,
  BackendHostel
} from '@/utils/hostelTransformers';

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

// Get token from multiple sources (store, localStorage, or module variable)
function getAuthToken(): string | null {
  // First, try the module variable (set by setAuthToken)
  if (authToken) {
    return authToken;
  }

  // Fallback: Try to get from localStorage (Zustand persist)
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('auth-storage');
      if (stored) {
        const parsed = JSON.parse(stored);
        const token = parsed?.state?.token;
        if (token) {
          // Sync it to module variable for future use
          authToken = token;
          return token;
        }
      }
    } catch (error) {
      console.warn('Failed to read token from localStorage:', error);
    }
  }

  return null;
}

// Generic API response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// API Error class
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Helper function to build query strings
function buildQueryString(params?: Record<string, string | number | boolean | undefined>): string {
  if (!params) return '';
  const filtered = Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined)
  ) as Record<string, string>;
  return new URLSearchParams(filtered).toString();
}

// Base fetch function
export async function apiFetch<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL ?? "https://api.hostella.app/api/v1";
  
  // Don't set Content-Type for FormData (browser will set it with boundary)
  const isFormData = options.body instanceof FormData;
  
  const headers: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers as Record<string, string> | undefined),
  };

  // Get token from store/localStorage/module variable
  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${baseUrl}${endpoint}`, { 
      ...options, 
      headers 
    });

    // Handle different response types
    const contentType = res.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    if (!res.ok) {
      // Clone response to read it without consuming the stream
      const responseClone = res.clone();
      
      if (isJson) {
        let errorData;
        try {
          errorData = await res.json();
        } catch (parseError) {
          // If JSON parsing fails, try to get text
          const text = await responseClone.text();
          console.error('API Error - JSON parse failed, got text:', {
            status: res.status,
            statusText: res.statusText,
            url: `${baseUrl}${endpoint}`,
            method: options.method || 'GET',
            requestBody: typeof options.body === 'string' ? options.body : JSON.stringify(options.body),
            text,
          });
          throw new ApiError(text || `API error: ${res.status}`, res.status);
        }
        
        console.error('API Error Response:', {
          status: res.status,
          statusText: res.statusText,
          url: `${baseUrl}${endpoint}`,
          method: options.method || 'GET',
          requestBody: typeof options.body === 'string' ? options.body : JSON.stringify(options.body),
          errorData,
          errorDataKeys: Object.keys(errorData || {}),
        });
        
        // Handle different error response formats
        // Backend returns: { success: false, status: "fail", message: "...", errors: [{ field, message }], statusCode: 400 }
        let errorMessage = errorData?.message || 
                          errorData?.error || 
                          `API error: ${res.status} - ${res.statusText}`;
        
        // Extract error messages from errors array if available
        if (Array.isArray(errorData?.errors) && errorData.errors.length > 0) {
          const errorMessages = errorData.errors.map((e: { field?: string; message: string }) => 
            e.message || `${e.field}: ${e.message}`
          );
          errorMessage = errorMessages.join(', ');
        } else if (typeof errorData?.errors === 'object' && errorData.errors !== null) {
          // Handle object format errors
          const errorMessages = Object.entries(errorData.errors).map(([field, messages]) => {
            const msgArray = Array.isArray(messages) ? messages : [messages];
            return `${field}: ${msgArray.join(', ')}`;
          });
          errorMessage = errorMessages.join('; ');
        }
        
        // Convert errors array to the format expected by ApiError
        let errorDetails: Record<string, string[]> | undefined;
        if (Array.isArray(errorData?.errors)) {
          errorDetails = {};
          errorData.errors.forEach((e: { field?: string; message: string }) => {
            const field = e.field || 'general';
            if (!errorDetails![field]) {
              errorDetails![field] = [];
            }
            errorDetails![field].push(e.message);
          });
        } else if (errorData?.errors && typeof errorData.errors === 'object') {
          errorDetails = errorData.errors as Record<string, string[]>;
        }
        
        throw new ApiError(
          errorMessage,
          res.status,
          errorDetails
        );
      } else {
        const text = await res.text();
        console.error('API Error Response (non-JSON):', {
          status: res.status,
          statusText: res.statusText,
          url: `${baseUrl}${endpoint}`,
          method: options.method || 'GET',
          requestBody: typeof options.body === 'string' ? options.body : JSON.stringify(options.body),
          text,
          textLength: text?.length,
        });
        throw new ApiError(text || `API error: ${res.status} - ${res.statusText}`, res.status);
      }
    }

    if (isJson) {
      return (await res.json()) as T;
    } else {
      return (await res.text()) as unknown as T;
    }
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    if (err instanceof Error) {
      throw new ApiError(err.message, 500);
    }
    throw new ApiError('An unexpected error occurred', 500);
  }
}

// ============================================
// AUTH API ENDPOINTS
// ============================================
export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<ApiResponse<{ user: User; token: string }>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  initiateSignup: (data: { email: string; password: string; confirmPassword: string }) =>
    apiFetch<ApiResponse<{ message: string; sessionId: string; expiresIn: number }>>(
      '/auth/signup/initiate',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    ),

  verifyOtp: (data: { email: string; otp: string; sessionId: string }) =>
    apiFetch<ApiResponse<{ message: string; verifiedSessionId: string; expiresIn: number }>>(
      '/auth/signup/verify-otp',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    ),

  register: (data: FormData) =>
    apiFetch<ApiResponse<{ user: User; token: string }>>('/auth/register', {
      method: 'POST',
      body: data,
    }),

  me: () => apiFetch<ApiResponse<User>>('/auth/me'),

  getCompleteProfile: () => apiFetch<ApiResponse<User>>('/onboarding/profile'),

  forgotPassword: (email: string) =>
    apiFetch<ApiResponse<{ message: string }>>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  verifyResetCode: (email: string, code: string) =>
    apiFetch<ApiResponse<{ message: string }>>('/auth/verify-reset-code', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    }),

  resetPassword: (email: string, code: string, newPassword: string) =>
    apiFetch<ApiResponse<{ message: string }>>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, code, newPassword }),
    }),

  logout: () =>
    apiFetch<ApiResponse<{ message: string }>>('/auth/logout', {
      method: 'POST',
    }),
};

// ============================================
// USER API ENDPOINTS
// ============================================
export const userApi = {
  updateProfile: (data: FormData) =>
    apiFetch<ApiResponse<User>>('/auth/profile', {
      method: 'PUT',
      body: data,
    }),

  updatePassword: (currentPassword: string, newPassword: string) =>
    apiFetch<ApiResponse<{ message: string }>>('/auth/password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  getProfile: () => apiFetch<ApiResponse<User>>('/auth/me'),
};

// ============================================
// HOSTEL API ENDPOINTS
// ============================================
// Backend response types for hostels
interface BackendHostelListResponse {
  success: boolean;
  data: {
    hostels: BackendHostel[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

interface BackendHostelSingleResponse {
  success: boolean;
  data: {
    hostel?: BackendHostel;
  } | BackendHostel;
}

export const hostelApi = {
  getAll: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await apiFetch<BackendHostelListResponse>(
      `/hostels?${buildQueryString(params)}`
    );
    // Transform backend response to frontend format
    return transformListHostelsResponse(response);
  },

  getById: async (id: string | number) => {
    const response = await apiFetch<BackendHostelSingleResponse>(`/hostels/${id}`);
    // Transform backend response to frontend format
    return transformHostelResponse(response);
  },

  getFeatured: async (): Promise<ApiResponse<Hostel[]>> => {
    const response = await apiFetch<BackendHostelListResponse | ApiResponse<BackendHostel[]>>('/hostels/featured');
    // Check if response has nested structure (like getAll) or direct array
    if ('data' in response && 'hostels' in (response.data as { hostels?: unknown })) {
      // Nested structure like getAll
      const transformed = transformListHostelsResponse(response as BackendHostelListResponse);
      return {
        success: transformed.success,
        data: transformed.data,
      };
    } else if ('data' in response && Array.isArray(response.data)) {
      // Direct array format - check if items need transformation
      const firstItem = response.data[0];
      // Check if it's a BackendHostel (has images array) or already transformed (has image string)
      if (firstItem && 'images' in firstItem && Array.isArray(firstItem.images)) {
        // Needs transformation
        return {
          success: response.success,
          data: (response.data as BackendHostel[]).map(transformHostel),
        };
      }
      // Already in frontend format
      return response as unknown as ApiResponse<Hostel[]>;
    }
    // Fallback: assume it's already in frontend format
    return response as unknown as ApiResponse<Hostel[]>;
  },
};

// ============================================
// ROOM API ENDPOINTS
// ============================================
export const roomApi = {
  getByHostelId: (hostelId: string) =>
    apiFetch<ApiResponse<Room[]>>(`/hostels/${hostelId}/rooms`),

  getById: (id: string) => apiFetch<ApiResponse<Room>>(`/rooms/${id}`),

  checkAvailability: (roomId: string, startDate: string, endDate: string) =>
    apiFetch<ApiResponse<{ available: boolean; availableCount: number }>>(
      `/rooms/${roomId}/availability?startDate=${startDate}&endDate=${endDate}`
    ),
};

// ============================================
// BOOKING API ENDPOINTS
// ============================================
export const bookingApi = {
  create: (data: CreateBookingData) =>
    apiFetch<ApiResponse<Booking>>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAll: (params?: { page?: number; limit?: number; status?: string }) =>
    apiFetch<PaginatedResponse<Booking>>(
      `/bookings?${buildQueryString(params)}`
    ),

  getById: (id: string) => apiFetch<ApiResponse<Booking>>(`/bookings/${id}`),

  update: (id: string, data: Partial<Booking>) =>
    apiFetch<ApiResponse<Booking>>(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  cancel: (id: string, reason?: string) =>
    apiFetch<ApiResponse<{ booking: Booking }>>(`/bookings/${id}/cancel`, {
      method: 'DELETE',
      body: reason ? JSON.stringify({ reason }) : undefined,
    }),

  getUserBookings: (params?: { page?: number; limit?: number; status?: string }) => {
    const queryString = params ? `?${buildQueryString(params)}` : '';
    return apiFetch<UserBookingsResponse>(`/bookings/my-bookings${queryString}`);
  },
};

// ============================================
// PAYMENT API ENDPOINTS
// ============================================
export const paymentApi = {
  initiate: (bookingId: number, method: 'bank' | 'momo', phoneNumber?: string) =>
    apiFetch<ApiResponse<Payment>>('/payments/initiate', {
      method: 'POST',
      body: JSON.stringify({ bookingId, method, phoneNumber }),
    }),

  uploadReceipt: (paymentId: number, receipt: FormData) =>
    apiFetch<ApiResponse<Payment>>(`/payments/${paymentId}/receipt`, {
      method: 'POST',
      body: receipt,
    }),

  verify: (paymentId: number, reference: string) =>
    apiFetch<ApiResponse<Payment>>(`/payments/${paymentId}/verify`, {
      method: 'POST',
      body: JSON.stringify({ reference }),
    }),

  getByBookingId: (bookingId: number) =>
    apiFetch<ApiResponse<Payment[]>>(`/payments/booking/${bookingId}`),
};

// ============================================
// NOTIFICATION API ENDPOINTS
// ============================================
export interface NotificationResponse {
  success: boolean;
  notifications: Notification[];
  total: number;
  unreadCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export const notificationApi = {
  getAll: (params?: { page?: number; pageSize?: number; unreadOnly?: boolean }) => {
    const queryParams: Record<string, string> = {};
    if (params?.page) queryParams.page = String(params.page);
    if (params?.pageSize) queryParams.pageSize = String(params.pageSize);
    if (params?.unreadOnly !== undefined) queryParams.unreadOnly = String(params.unreadOnly);
    
    return apiFetch<NotificationResponse>(
      `/notifications?${buildQueryString(queryParams)}`
    );
  },

  markAsRead: (id: string) =>
    apiFetch<ApiResponse<{ message: string }>>(`/notifications/${id}/read`, {
      method: 'POST',
    }),

  markAllAsRead: () =>
    apiFetch<ApiResponse<{ message: string }>>('/notifications/mark-all-read', {
      method: 'POST',
    }),

  delete: (id: string) =>
    apiFetch<ApiResponse<{ message: string }>>(`/notifications/${id}`, {
      method: 'DELETE',
    }),
};

// ============================================
// CHAT API ENDPOINTS
// ============================================
export const chatApi = {
  getChats: () => apiFetch<ApiResponse<Chat[]>>('/chats'),

  getMessages: (chatId: number, params?: { page?: number; limit?: number }) =>
    apiFetch<PaginatedResponse<ChatMessage>>(
      `/chats/${chatId}/messages?${buildQueryString(params)}`
    ),

  sendMessage: (chatId: number, content: string, type: 'text' | 'image' | 'voice' | 'file' = 'text', file?: FormData) =>
    apiFetch<ApiResponse<ChatMessage>>(`/chats/${chatId}/messages`, {
      method: 'POST',
      body: file || JSON.stringify({ content, type }),
    }),

  markAsRead: (chatId: number, messageIds: number[]) =>
    apiFetch<ApiResponse<{ message: string }>>(`/chats/${chatId}/read`, {
      method: 'PUT',
      body: JSON.stringify({ messageIds }),
    }),
};

// ============================================
// TESTIMONIAL API ENDPOINTS
// ============================================
export const testimonialApi = {
  getAll: (params?: { page?: number; limit?: number }) =>
    apiFetch<PaginatedResponse<Testimonial>>(
      `/testimonials?${buildQueryString(params)}`
    ),

  create: (data: Omit<Testimonial, 'id' | 'createdAt'>) =>
    apiFetch<ApiResponse<Testimonial>>('/testimonials', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ============================================
// GALLERY API ENDPOINTS
// ============================================
export const galleryApi = {
  getAll: (params?: { page?: number; limit?: number; category?: string }) =>
    apiFetch<PaginatedResponse<GalleryImage>>(
      `/gallery?${buildQueryString(params)}`
    ),

  getByHostelId: (hostelId: number) =>
    apiFetch<ApiResponse<GalleryImage[]>>(`/hostels/${hostelId}/gallery`),
};

// ============================================
// BLOG API ENDPOINTS
// ============================================
export const blogApi = {
  getAll: (params?: { page?: number; limit?: number; category?: string; tag?: string }) =>
    apiFetch<PaginatedResponse<BlogPost>>(
      `/blog?${buildQueryString(params)}`
    ),

  getBySlug: (slug: string) => apiFetch<ApiResponse<BlogPost>>(`/blog/${slug}`),

  getCategories: () => apiFetch<ApiResponse<string[]>>('/blog/categories'),
};

// ============================================
// FAQ API ENDPOINTS
// ============================================
export const faqApi = {
  getAll: (params?: { category?: string }) =>
    apiFetch<ApiResponse<FAQ[]>>(
      `/faqs?${buildQueryString(params)}`
    ),

  getCategories: () => apiFetch<ApiResponse<string[]>>('/faqs/categories'),
};

// ============================================
// SERVICE API ENDPOINTS
// ============================================
export const serviceApi = {
  getAll: () => apiFetch<ApiResponse<Service[]>>('/services'),

  getById: (id: number) => apiFetch<ApiResponse<Service>>(`/services/${id}`),
};

// ============================================
// CONTACT API ENDPOINTS
// ============================================
export const contactApi = {
  submit: (data: Omit<ContactMessage, 'id' | 'status' | 'createdAt'>) =>
    apiFetch<ApiResponse<{ message: string }>>('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ============================================
// EMERGENCY CONTACTS API ENDPOINTS
// ============================================
export interface EmergencyContactResponse {
  id: string;
  name: string;
  phone: string;
  relation: string;
  createdAt: string;
  updatedAt: string;
}

export const emergencyContactsApi = {
  getAll: () =>
    apiFetch<ApiResponse<EmergencyContactResponse[]>>('/emergency-contacts'),

  create: (data: { name: string; phone: string; relation: string }) =>
    apiFetch<ApiResponse<EmergencyContactResponse>>('/emergency-contacts', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: { name?: string; phone?: string; relation?: string }) =>
    apiFetch<ApiResponse<EmergencyContactResponse>>(`/emergency-contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiFetch<ApiResponse<{ message: string }>>(`/emergency-contacts/${id}`, {
      method: 'DELETE',
    }),
};
