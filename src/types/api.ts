// Type definitions for API entities
// IMPORTANT: All prices and monetary amounts are in Ghana Cedis (GHC)

export interface RoomType {
  type: 'One-in-one' | 'Two-in-one';
  title: string;
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

export interface Room {
  id: string;
  hostelId: string;
  roomNumber?: string;
  title: string;
  type: 'SINGLE' | 'DOUBLE' | 'shared_4' | 'shared_6' | 'dormitory';
  price: number;
  description: string;
  available: number;
  capacity: number;
  currentOccupants?: number;
  image?: string;
  images?: string[];
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
  roomTitle?: string | null; // "One-in-one" or "Two-in-one"
  price?: string | null;
  emergencyContactName?: string | null;
  emergencyContactNumber?: string | null;
  relation?: string | null;
  hasMedicalCondition?: boolean;
  medicalCondition?: string | null;
  status: 'pending payment' | 'pending approval' | 'approved' | 'room_allocated' | 'completed' | 'cancelled' | 'rejected' | 'expired';
  allocatedRoomNumber?: number | null;
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
  method: 'bank' | 'momo';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  reference: string;
  receiptUrl?: string;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
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
