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
  ContactMessage
} from '@/types/api';

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

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

// Base fetch function
export async function apiFetch<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "https://www.hostella.render.com/api/v1";
  
  // Don't set Content-Type for FormData (browser will set it with boundary)
  const isFormData = options.body instanceof FormData;
  
  const headers: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers as Record<string, string> | undefined),
  };

  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
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
      if (isJson) {
        const errorData = await res.json();
        throw new ApiError(
          errorData.message || `API error: ${res.status}`,
          res.status,
          errorData.errors
        );
      } else {
        const text = await res.text();
        throw new ApiError(text || `API error: ${res.status}`, res.status);
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
    apiFetch<ApiResponse<{ user: any; token: string }>>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (data: FormData) =>
    apiFetch<ApiResponse<{ user: any; token: string }>>('/auth/register', {
      method: 'POST',
      body: data,
    }),

  me: () => apiFetch<ApiResponse<any>>('/auth/me'),

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
    apiFetch<ApiResponse<any>>('/user/profile', {
      method: 'PUT',
      body: data,
    }),

  updatePassword: (currentPassword: string, newPassword: string) =>
    apiFetch<ApiResponse<{ message: string }>>('/user/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  getProfile: () => apiFetch<ApiResponse<any>>('/user/profile'),
};

// ============================================
// HOSTEL API ENDPOINTS
// ============================================
export const hostelApi = {
  getAll: (params?: { page?: number; limit?: number; search?: string }) =>
    apiFetch<PaginatedResponse<Hostel>>(
      `/hostels?${new URLSearchParams(params as any).toString()}`
    ),

  getById: (id: number) => apiFetch<ApiResponse<Hostel>>(`/hostels/${id}`),

  getFeatured: () => apiFetch<ApiResponse<Hostel[]>>('/hostels/featured'),
};

// ============================================
// ROOM API ENDPOINTS
// ============================================
export const roomApi = {
  getByHostelId: (hostelId: number) =>
    apiFetch<ApiResponse<Room[]>>(`/hostels/${hostelId}/rooms`),

  getById: (id: number) => apiFetch<ApiResponse<Room>>(`/rooms/${id}`),

  checkAvailability: (roomId: number, startDate: string, endDate: string) =>
    apiFetch<ApiResponse<{ available: boolean; availableCount: number }>>(
      `/rooms/${roomId}/availability?startDate=${startDate}&endDate=${endDate}`
    ),
};

// ============================================
// BOOKING API ENDPOINTS
// ============================================
export const bookingApi = {
  create: (data: any) =>
    apiFetch<ApiResponse<Booking>>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getAll: (params?: { page?: number; limit?: number; status?: string }) =>
    apiFetch<PaginatedResponse<Booking>>(
      `/bookings?${new URLSearchParams(params as any).toString()}`
    ),

  getById: (id: number) => apiFetch<ApiResponse<Booking>>(`/bookings/${id}`),

  update: (id: number, data: Partial<Booking>) =>
    apiFetch<ApiResponse<Booking>>(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  cancel: (id: number, reason?: string) =>
    apiFetch<ApiResponse<{ message: string }>>(`/bookings/${id}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),

  getUserBookings: () => apiFetch<ApiResponse<Booking[]>>('/bookings/my-bookings'),
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
export const notificationApi = {
  getAll: (params?: { page?: number; limit?: number; unreadOnly?: boolean }) =>
    apiFetch<PaginatedResponse<any>>(
      `/notifications?${new URLSearchParams(params as any).toString()}`
    ),

  markAsRead: (id: number) =>
    apiFetch<ApiResponse<{ message: string }>>(`/notifications/${id}/read`, {
      method: 'PUT',
    }),

  markAllAsRead: () =>
    apiFetch<ApiResponse<{ message: string }>>('/notifications/read-all', {
      method: 'PUT',
    }),

  delete: (id: number) =>
    apiFetch<ApiResponse<{ message: string }>>(`/notifications/${id}`, {
      method: 'DELETE',
    }),

  deleteAll: () =>
    apiFetch<ApiResponse<{ message: string }>>('/notifications', {
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
      `/chats/${chatId}/messages?${new URLSearchParams(params as any).toString()}`
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
      `/testimonials?${new URLSearchParams(params as any).toString()}`
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
      `/gallery?${new URLSearchParams(params as any).toString()}`
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
      `/blog?${new URLSearchParams(params as any).toString()}`
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
      `/faqs?${new URLSearchParams(params as any).toString()}`
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
