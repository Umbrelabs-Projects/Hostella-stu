// Type definitions for API entities
// IMPORTANT: All prices and monetary amounts are in Ghana Cedis (GHC)

export interface RoomType {
  type: 'One-in-one' | 'Two-in-one';
  title: string;
  value?: 'SINGLE' | 'DOUBLE'; // API value for booking creation (required by backend)
  total: number;
  available: number;
  price: number | { min: number; max: number };
}

export interface Hostel {
  id: string;
  name: string;
  location: string | null;
  campus: string | null;
  rating: number;
  description: string | null;
  image: string | null;
  images: string[];
  amenities: string[];
  facilities?: string[];
  priceRange: {
    min: number;
    max: number;
  };
  availableRooms: number;
  totalRooms: number;
  singleRooms?: number;
  doubleRooms?: number;
  noOfFloors?: string;
  phoneNumber?: string;
  roomTypes?: RoomType[];
  createdAt: string;
}

export interface RoomImage {
  id: string;
  url: string;
}

export interface Room {
  id: string;
  hostelId: string;
  roomNumber?: number | string;
  floorNumber?: number | null;
  title: string;
  type: 'SINGLE' | 'DOUBLE' | 'shared_4' | 'shared_6' | 'dormitory';
  price: number;
  description: string;
  available: number;
  capacity: number;
  currentOccupants?: number;
  image?: string;
  images?: RoomImage[] | string[];
  amenities?: string[];
  isAvailable?: boolean;
  status?: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'UNAVAILABLE';
  createdAt?: string;
  updatedAt?: string;
}

export interface Booking {
  id: string;
  bookingId: string; // e.g., "BK-1234"
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  gender?: 'male' | 'female' | null;
  level?: string | null;
  school?: string | null; // campus
  studentId?: string | null; // studentRefNumber
  phone?: string | null;
  hostelName?: string | null;
  hostelId?: string | null; // Hostel ID for fetching hostel details
  hostelImage?: string | null; // Hostel image URL
  hostelLocation?: string | null; // Hostel address/location
  hostelPhoneNumber?: string | null; // Hostel contact phone number
  roomTitle?: string | null; // "One-in-one" or "Two-in-one"
  price?: string | null;
  emergencyContactName?: string | null;
  emergencyContactNumber?: string | null;
  relation?: string | null;
  hasMedicalCondition?: boolean;
  medicalCondition?: string | null;
  status: 'pending payment' | 'pending approval' | 'approved' | 'room_allocated' | 'completed' | 'cancelled' | 'rejected' | 'expired';
  allocatedRoomNumber?: number | string | null;
  floorNumber?: number | null; // Floor number
  reportingDate?: string | null; // Move-in date (ISO string)
  assignedAt?: string | null; // Date when room was assigned (ISO string)
  room?: Room | null; // Complete room details object
  date?: string; // ISO date string
  createdAt?: string;
  updatedAt?: string;
}

// Response structure for getUserBookings
export interface UserBookingsResponse {
  success: boolean;
  data: {
    bookings: Booking[];
    total: number;
    page: number;
    pageSize: number;
  };
}

export interface Testimonial {
  id: string;
  name: string;
  image: string | null;
  rating: number;
  text: string;
  hostelId: string | null;
  createdAt: string;
}

export interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category?: string;
  hostelId?: number;
  createdAt?: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: {
    id: number;
    name: string;
    avatar?: string;
  };
  image: string;
  category: string;
  tags?: string[];
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Payment {
  id: number;
  bookingId: number;
  amount: number;
  provider: 'BANK_TRANSFER' | 'PAYSTACK' | 'bank' | 'momo'; // Support both formats
  method?: 'bank' | 'momo'; // Legacy support
  status: 'PENDING' | 'INITIATED' | 'AWAITING_VERIFICATION' | 'CONFIRMED' | 'FAILED' | 'REFUNDED' | 'pending' | 'initiated' | 'completed' | 'failed' | 'refunded'; // Support both formats
  reference: string;
  receiptUrl?: string;
  transactionId?: string;
  authorizationUrl?: string; // For Paystack redirect
  createdAt: string;
  updatedAt: string;
}

// Bank details returned when initiating BANK_TRANSFER payment
export interface BankDetails {
  accountName: string;
  accountNumber: string;
  bankName: string;
  amount: number;
  reference: string;
  branch?: string;
}

// Payment initiation response structure
export interface PaymentInitiationResponse {
  payment: Payment;
  bankDetails?: BankDetails; // Only for BANK_TRANSFER
  isNewPayment: boolean; // true for new payment, false for existing
}

export interface Chat {
  id: number;
  userId: number;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  adminName?: string;
  adminAvatar?: string;
}

export interface ChatMessage {
  id: number;
  chatId: number;
  sender: 'student' | 'admin';
  content: string;
  timestamp: string;
  type: 'text' | 'image' | 'voice' | 'file';
  fileUrl?: string;
  fileName?: string;
  audio?: Blob;
  read?: boolean;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  icon?: string;
  image?: string;
  features?: string[];
  createdAt?: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  createdAt: string;
}

// Type for creating a new booking (simplified)
export interface CreateBookingData {
  hostelId: string;
  preferredRoomType: 'SINGLE' | 'DOUBLE';
  // Optional - backend auto-sets to academic year
  startMonth?: number; // 1-12
  startYear?: number; // 2024+
  endMonth?: number; // 1-12
  endYear?: number; // 2024+
  phoneNumber?: string;
}
