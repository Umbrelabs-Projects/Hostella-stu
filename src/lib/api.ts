import { 
  Hostel, 
  Room, 
  Booking, 
  Testimonial, 
  GalleryImage, 
  BlogPost, 
  FAQ, 
  Payment,
  PaymentInitiationResponse,
  BankDetails,
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
  // Ensure API URL includes /api/v1 if not already present
  // Supports API_URL without /api/v1 - will automatically add it
  const getBaseUrl = () => {
    const envUrl = process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL;
    if (envUrl) {
      // Remove trailing slash if present
      const cleanUrl = envUrl.replace(/\/$/, '');
      
      // If URL already contains /api/v1, use as is
      if (cleanUrl.includes('/api/v1')) {
        return cleanUrl;
      }
      
      // If URL doesn't have /api/v1, add it
      return `${cleanUrl}/api/v1`;
    }
    return "https://api.hostella.app/api/v1";
  };
  
  const baseUrl = getBaseUrl();
  
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
        } catch {
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
        
        // Only log detailed error if errorData has meaningful content
        const errorDataKeys = Object.keys(errorData || {});
        const hasMessage = !!(errorData?.message || errorData?.error || errorData?.statusText);
        const hasErrors = Array.isArray(errorData?.errors) && errorData.errors.length > 0;
        const isEmptyObject = errorDataKeys.length === 0;
        
        // Don't log empty error responses - they're usually 404s or permission errors
        // Only log if there's actual error content (message, error field, or errors array)
        const shouldLogError = hasMessage || hasErrors || (!isEmptyObject && errorDataKeys.length > 0);
        
        // For 404 errors, don't log at all (expected for missing resources)
        const isNotFound = res.status === 404;
        
        // Only log errors with meaningful content, and never log 404s
        if (shouldLogError && !isNotFound && !isEmptyObject) {
          console.error('API Error Response:', {
            status: res.status,
            statusText: res.statusText,
            url: `${baseUrl}${endpoint}`,
            method: options.method || 'GET',
            requestBody: typeof options.body === 'string' ? options.body : JSON.stringify(options.body),
            errorData,
            errorDataKeys,
          });
        }
        // Suppress logging for empty error responses and 404s
        
        // Handle different error response formats
        // Backend returns: { success: false, status: "fail", message: "...", errors: [{ field, message }], statusCode: 400 }
        let errorMessage = errorData?.message || 
                          errorData?.error || 
                          errorData?.statusText;
        
        // If no error message in response, provide meaningful message based on status code
        if (!errorMessage) {
          switch (res.status) {
            case 404:
              errorMessage = 'Resource not found';
              break;
            case 403:
              errorMessage = 'You do not have permission to access this resource';
              break;
            case 401:
              errorMessage = 'Authentication required';
              break;
            case 500:
              errorMessage = 'Internal server error';
              break;
            default:
              errorMessage = `API error: ${res.status} - ${res.statusText}`;
          }
        }
        
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
        const trimmedText = text?.trim() || '';
        const hasContent = trimmedText.length > 0;
        
        // Always log error details in development for debugging
        // In production, only log if there's content or it's a server error (5xx)
        const isDevelopment = process.env.NODE_ENV === 'development';
        const isServerError = res.status >= 500;
        const shouldLogError = isDevelopment || hasContent || isServerError;
        
        if (shouldLogError) {
          const errorDetails: Record<string, any> = {
            status: res.status,
            statusText: res.statusText,
            url: `${baseUrl}${endpoint}`,
            method: options.method || 'GET',
          };
          
          // Only include request body if it's not too large (for security)
          if (options.body) {
            const bodyStr = typeof options.body === 'string' ? options.body : JSON.stringify(options.body);
            if (bodyStr.length < 1000) {
              errorDetails.requestBody = bodyStr;
            } else {
              errorDetails.requestBody = '[Body too large to log]';
            }
          }
          
          if (hasContent) {
            errorDetails.responseText = trimmedText;
            errorDetails.textLength = trimmedText.length;
          } else {
            errorDetails.responseText = '[Empty response body]';
          }
          
          if (isDevelopment || isServerError) {
            console.error('API Error Response (non-JSON):', errorDetails);
          } else {
            console.warn('API Error Response (non-JSON):', errorDetails);
          }
        }
        
        // Create meaningful error message based on status code
        let errorMessage = trimmedText;
        if (!errorMessage) {
          switch (res.status) {
            case 400:
              errorMessage = 'Bad request. Please check your input and try again.';
              break;
            case 401:
              errorMessage = 'Authentication required. Please log in again.';
              break;
            case 403:
              errorMessage = 'You do not have permission to perform this action.';
              break;
            case 404:
              errorMessage = 'Resource not found. Please check the URL and try again.';
              break;
            case 409:
              errorMessage = 'Conflict. This resource may already exist.';
              break;
            case 422:
              errorMessage = 'Validation error. Please check your input.';
              break;
            case 500:
              errorMessage = 'Internal server error. Please try again later.';
              break;
            case 502:
              errorMessage = 'Bad gateway. The server is temporarily unavailable.';
              break;
            case 503:
              errorMessage = 'Service unavailable. Please try again later.';
              break;
            default:
              errorMessage = `API error: ${res.status} ${res.statusText || 'Unknown error'}`;
          }
        }
        
        throw new ApiError(errorMessage, res.status);
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

  // Delete booking (only for PENDING_PAYMENT or CANCELLED status)
  // Endpoint: DELETE /api/v1/bookings/:id
  delete: (id: string) =>
    apiFetch<ApiResponse<{ success: boolean; message: string }>>(`/bookings/${id}`, {
      method: 'DELETE',
    }),

  getUserBookings: (params?: { page?: number; limit?: number; status?: string }) => {
    const queryString = params ? `?${buildQueryString(params)}` : '';
    return apiFetch<UserBookingsResponse>(`/bookings/my-bookings${queryString}`);
  },

  // Get booking statistics
  // Endpoint: GET /api/v1/bookings/stats/summary
  getStats: () =>
    apiFetch<ApiResponse<{
      stats: {
        total: number;
        pendingPayment: number;
        pendingApproval: number;
        approved: number;
        roomAllocated: number;
        completed: number;
        cancelled: number;
      };
    }>>('/bookings/stats/summary'),
};

// ============================================
// PAYMENT API ENDPOINTS
// ============================================
// See: STUDENT_PAYMENT_FLOW_GUIDE.md for complete payment flow documentation
export const paymentApi = {
  // Initiate payment
  // Endpoint: POST /api/v1/payments/booking/:bookingId
  // Body: { provider: "BANK_TRANSFER" | "PAYSTACK" }
  // Response: { payment: Payment, bankDetails?: BankDetails, authorizationUrl?: string, isNewPayment: boolean, message: string }
  // ⚠️ CRITICAL: Only call this when user explicitly clicks "Proceed to Payment" button
  // ⚠️ DO NOT call this automatically on page load - use GET /payments/booking/:bookingId instead
  // ⚠️ Backend returns existing payment if it exists (doesn't create duplicate)
  initiate: (bookingId: string | number, provider: 'BANK_TRANSFER' | 'PAYSTACK', payerPhone?: string, callbackUrl?: string) =>
    apiFetch<ApiResponse<PaymentInitiationResponse>>(`/payments/booking/${bookingId}`, {
      method: 'POST',
      body: JSON.stringify({ 
        provider, 
        ...(payerPhone && { payerPhone }),
        ...(callbackUrl && { callback_url: callbackUrl })
      }),
    }),

  // Upload receipt using paymentId (from initiate payment response)
  // Endpoint: POST /api/v1/payments/:id/upload-receipt-file
  // Important: Use payment.id from initiate payment response, NOT bookingId
  // Request: FormData with 'receipt' file (field name must be "receipt")
  // Response: { payment: Payment, message: string }
  // Note: Content-Type is automatically set by browser for FormData (multipart/form-data with boundary)
  uploadReceipt: (paymentId: string | number, receipt: FormData) =>
    apiFetch<ApiResponse<{ payment: Payment; message: string }>>(`/payments/${paymentId}/upload-receipt-file`, {
      method: 'POST',
      body: receipt, // FormData - Content-Type will be set automatically by browser
    }),

  // Verify payment by reference (for Paystack payments)
  // Endpoint: GET /api/v1/payments/verify/:reference
  // Used after Paystack payment completion to verify payment status
  verifyByReference: (reference: string) =>
    apiFetch<ApiResponse<Payment>>(`/payments/verify/${reference}`, {
      method: 'GET',
    }),

  // Verify payment by paymentId and reference (legacy/alternative method)
  // Endpoint: POST /api/v1/payments/:paymentId/verify
  // Body: { reference: string }
  verify: (paymentId: string | number, reference: string) =>
    apiFetch<ApiResponse<Payment>>(`/payments/${paymentId}/verify`, {
      method: 'POST',
      body: JSON.stringify({ reference }),
    }),

  // Get payment for a booking by bookingId
  // Endpoint: GET /api/v1/payments/booking/:bookingId
  // Returns single Payment object (not array) for the given booking
  // Response structure: { success: true, data: { payment: Payment } }
  getByBookingId: (bookingId: string | number) =>
    apiFetch<ApiResponse<{ payment: Payment }>>(`/payments/booking/${bookingId}`),

  // Get payment by payment ID
  // Endpoint: GET /api/v1/payments/:id
  getById: (paymentId: string | number) =>
    apiFetch<ApiResponse<{ payment: Payment }>>(`/payments/${paymentId}`),

  // Get my payments (paginated)
  // Endpoint: GET /api/v1/payments/my-payments
  // Query params: page, limit, status
  getMyPayments: (params?: { page?: number; limit?: number; status?: string }) => {
    const queryString = params ? `?${buildQueryString(params)}` : '';
    return apiFetch<PaginatedResponse<Payment>>(`/payments/my-payments${queryString}`);
  },
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
