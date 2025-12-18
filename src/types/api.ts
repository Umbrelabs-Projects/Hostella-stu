// Type definitions for API entities
// IMPORTANT: All prices and monetary amounts are in Ghana Cedis (GHC)

export interface Hostel {
  id: string;
  name: string;
  location: string | null;
  campus: string | null;
  rating: number;
  description: string;
  image: string | null;
  images: string[];
  amenities: string[];
  priceRange: {
    min: number;
    max: number;
  };
  availableRooms: number;
  totalRooms: number;
  createdAt: string;
}

export interface Room {
  id: number;
  hostelId: number;
  title: string;
  type: string;
  price: string | number;
  description: string;
  available: string | number;
  capacity: number;
  image: string;
  images?: string[];
  amenities?: string[];
  isAvailable?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Booking {
  id: number;
  userId: number;
  hostelId: number;
  roomId: number;
  roomNumber?: string;
  status: 'pending_payment' | 'pending_approval' | 'approved' | 'rejected' | 'room_allocated' | 'completed' | 'cancelled';
  arrivalDate?: string;
  departureDate?: string;
  totalAmount?: number;
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: 'bank' | 'momo';
  bookingId?: string;
  createdAt?: string;
  updatedAt?: string;
  hostel?: Hostel;
  room?: Room;
  // Extra booking details
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  emergencyContact?: string;
  guardian?: string;
  guardianPhone?: string;
  occupation?: string;
  specialRequests?: string;
  hasAllergies?: boolean;
  allergyDetails?: string;
  price?: string | number;
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

// Type for creating a new booking
export interface CreateBookingData {
  hostelId: number;
  roomId: number;
  arrivalDate?: string;
  departureDate?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  emergencyContact?: string;
  guardian?: string;
  guardianPhone?: string;
  occupation?: string;
  specialRequests?: string;
  hasAllergies?: boolean;
  allergyDetails?: string;
  paymentMethod?: 'bank' | 'momo';
}
