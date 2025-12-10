# Backend Developer Handoff Package

**Date**: December 10, 2025  
**Platform**: Hostella Student Accommodation Platform  
**Status**: ✅ **FRONTEND COMPLETE - READY FOR BACKEND INTEGRATION**

---

## 📦 What You're Receiving

This package contains everything needed for backend API development and integration:

### 1. **API_DOCUMENTATION.md** ⭐ PRIMARY REFERENCE
- Complete API endpoint specifications
- Request/response formats with examples
- All 13+ API modules documented:
  - Authentication
  - User Management
  - Hostels & Rooms
  - Bookings & Payments
  - Chat & Notifications
  - Content (Gallery, Blog, FAQ, Testimonials)
  - Services & Contact
- **Currency**: All prices in Ghana Cedis (GHC)
- Error handling and response formats

### 2. **CURRENCY_POLICY.md** 💰 CRITICAL FOR PAYMENTS
- Ghana Cedis (GHC) as exclusive currency
- Payment method specifications
- Pricing examples and formats
- Technical implementation details
- Developer checklist for currency handling

### 3. **README.md** 📋 PROJECT OVERVIEW
- Tech stack and dependencies
- Project structure
- Test suite information
- How to run tests locally
- Development setup

---

## 🎯 Quick Start for Backend Development

### Frontend is Using:
- **Base API URL**: `https://www.hostella.render.com/api/v1`
- **State Management**: Zustand (13 stores)
- **Authentication**: Token-based (JWT recommended)
- **Request Format**: JSON with Bearer token in Authorization header

### API Endpoints Required:
Implement all endpoints defined in **API_DOCUMENTATION.md** sections:

1. **Authentication** (`/auth/*`) - Login, Register, Password Reset
2. **Users** (`/users/*`) - Profile management
3. **Hostels** (`/hostels/*`) - CRUD operations
4. **Rooms** (`/hostels/:id/rooms/*`) - Room management
5. **Bookings** (`/bookings/*`) - Booking lifecycle
6. **Payments** (`/payments/*`) - Payment processing
7. **Chat** (`/chat/*`) - Real-time messaging
8. **Notifications** (`/notifications/*`) - Push notifications
9. **Gallery** (`/gallery/*`) - Image management
10. **Blog** (`/blog/*`) - Content management
11. **FAQ** (`/faqs/*`) - FAQ management
12. **Testimonials** (`/testimonials/*`) - Reviews
13. **Services** (`/services/*`) - Service listings
14. **Contact** (`/contact/*`) - Contact submissions

---

## ✅ Frontend Implementation Status

### Completed:
- ✅ Complete UI with 25+ pages
- ✅ Full authentication flow (Login, Signup, Password Reset)
- ✅ Booking flow with extra details
- ✅ Payment integration flow (receipt upload, verification)
- ✅ Dashboard with multiple sections
- ✅ Chat interface
- ✅ Notification system
- ✅ Gallery, Blog, FAQ, Testimonials pages
- ✅ TypeScript types for all entities
- ✅ Zustand state management (13 stores)
- ✅ Jest test suite (75 tests, all passing)
- ✅ Protected routes with middleware
- ✅ **Performance Optimizations**: Lazy loading, code splitting, skeleton loaders

### Pending Backend Integration:
- API endpoint implementations
- Database schema and models
- Authentication system (JWT or similar)
- Payment processing integration
- Email notifications
- Real-time chat (WebSocket)
- File storage for uploads

---

## 💡 Key Technical Requirements

### Authentication
```typescript
// Expected JWT token format
Authorization: Bearer <token>

// Token should be valid for 7 days
// Refresh mechanism recommended
```

### Currency (Critical!)
```typescript
// All amounts in Ghana Cedis (GHC)
{
  price: 2500,           // GHC 2,500
  amount: 5000,          // GHC 5,000
  currency: "GHC"        // Always GHC
}
```

### Room Prices
- Room prices are in GHC format
- Examples: GHC 2,500, GHC 3,500, GHC 5,000
- All pricing is per night

### Payment Methods
- MTN Mobile Money (Ghana)
- Telecel Cash (Ghana)
- AirtelTigo Money (Ghana)
- All amounts in GHC

### Booking Status Flow
```
pending_payment → pending_approval → approved → room_allocated → completed
                                    ↘ rejected
                                    ↘ cancelled
```

---

## 📋 Documentation Reference

| Document | Purpose | Use For |
|----------|---------|---------|
| **API_DOCUMENTATION.md** | Complete API specifications | Building all endpoints |
| **CURRENCY_POLICY.md** | Currency standards | Payment processing |
| **README.md** | Project overview | Development setup |

---

## 🗄️ Database Schema & Models

### Complete Entity Definitions with Full Implementation Details

#### 1. User Model - Complete Implementation
```typescript
interface User {
  // Primary identifier
  id: string; // UUID, primary key
  
  // Authentication credentials
  email: string; // Unique, required, validated format
  password: string; // Bcrypt hashed (minimum 6 chars, salt rounds: 10)
  
  // Personal information
  firstName: string; // Required, min 2 chars, max 50 chars
  lastName: string; // Required, min 2 chars, max 50 chars
  phone: string; // Required, Ghana format: +233XXXXXXXXX or 0XXXXXXXXX
  gender: "male" | "female"; // Required enum
  
  // Student information
  level: "100" | "200" | "300" | "400"; // Academic level, required
  school: string; // Educational institution name
  studentId: string; // Unique student ID from institution
  avatar: string; // Profile image URL (optional)
  
  // Account type & permissions
  role: "student" | "hostel_manager" | "admin"; // Default: "student"
  
  // Document verification
  admissionLetter: string; // File URL (optional)
  admissionLetterVerified: boolean; // Default: false
  verificationStatus: "pending" | "verified" | "rejected"; // Default: "pending"
  verificationRejectionReason?: string;
  
  // Account status
  emailVerified: boolean; // Email confirmation status, default: false
  isActive: boolean; // Account activation, default: true
  isBanned: boolean; // Ban status, default: false
  banReason?: string;
  
  // Tracking
  lastLogin: Date; // Last successful login timestamp
  loginAttempts: number; // Failed login count (reset after successful login)
  passwordChangedAt?: Date; // When password was last changed
  
  // Timestamps
  createdAt: Date; // Auto-set to current timestamp
  updatedAt: Date; // Auto-update on any change
  deletedAt?: Date; // Soft delete timestamp (NULL if not deleted)
}

// Database Indexes for Performance
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  gender ENUM('male', 'female') NOT NULL,
  level ENUM('100', '200', '300', '400') NOT NULL,
  school VARCHAR(255),
  student_id VARCHAR(100) UNIQUE,
  avatar TEXT,
  role ENUM('student', 'hostel_manager', 'admin') DEFAULT 'student',
  admission_letter TEXT,
  admission_letter_verified BOOLEAN DEFAULT FALSE,
  verification_status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
  verification_rejection_reason TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  is_banned BOOLEAN DEFAULT FALSE,
  ban_reason TEXT,
  last_login TIMESTAMP,
  login_attempts INTEGER DEFAULT 0,
  password_changed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  
  CONSTRAINT email_format CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'),
  CONSTRAINT phone_format CHECK (phone ~ '^(\+233|0)[0-9]{9}$')
);

CREATE UNIQUE INDEX idx_user_email ON users(email) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX idx_user_student_id ON users(student_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_user_role ON users(role);
CREATE INDEX idx_user_verification ON users(verification_status);
CREATE INDEX idx_user_active ON users(is_active);
```

#### 2. Hostel Model - Complete Implementation
```typescript
interface Hostel {
  // Identifiers
  id: string; // UUID, primary key
  name: string; // Unique hostel name
  slug: string; // URL-friendly slug, auto-generated from name
  
  // Basic information
  location: string; // District/area name (required)
  address: string; // Detailed street address (required)
  city: string; // City name
  region: string; // Region in Ghana
  
  // Geographic data
  gps: {
    latitude: number; // Valid range: -90 to 90
    longitude: number; // Valid range: -180 to 180
  };
  
  // Descriptive content
  description: string; // Max 2000 characters
  rules: string; // House rules and policies
  amenities: string[]; // Array: WiFi, 24/7 Security, Water Supply, etc.
  facilities: string[]; // Array: Kitchens, Laundry, Parking, etc.
  
  // Contact information
  phone: string; // Ghana format: +233XXXXXXXXX
  email: string; // Verified email
  website?: string; // Optional website URL
  
  // Management
  managerId: string; // FK to User (hostel_manager role)
  managerName: string; // Cached manager name for sorting
  
  // Images
  image: string; // Main image URL (required)
  images: string[]; // Array of image URLs (max 20)
  imageCount: number; // Count of images
  
  // Pricing structure
  priceRange: {
    min: number; // Minimum room price in GHC
    max: number; // Maximum room price in GHC
  };
  currency: "GHC"; // Always Ghana Cedis
  
  // Capacity tracking
  totalRooms: number; // Total room count
  availableRooms: number; // Available rooms count
  roomTypes: Array<{
    type: string; // e.g., "One-in-One", "Four-in-One"
    count: number;
    available: number;
    price: number;
  }>;
  
  // Ratings & reviews
  rating: number; // 1-5 (calculated average)
  ratingCount: number; // Total reviews
  reviewCount: number; // Count of reviews
  averageRating: number; // Decimal average (e.g., 4.75)
  
  // Verification & status
  isVerified: boolean; // Admin verification flag
  verificationDate?: Date; // When verified by admin
  verifiedBy?: string; // Admin ID who verified
  
  accountStatus: "active" | "suspended" | "inactive";
  isActive: boolean; // Default: true
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date; // Soft delete
}

// Database Schema
CREATE TABLE hostels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) UNIQUE NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  location VARCHAR(255) NOT NULL,
  address VARCHAR(500) NOT NULL,
  city VARCHAR(100) NOT NULL,
  region VARCHAR(100),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  description TEXT,
  rules TEXT,
  amenities TEXT[], -- PostgreSQL array
  facilities TEXT[],
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  website VARCHAR(500),
  manager_id UUID NOT NULL REFERENCES users(id),
  manager_name VARCHAR(255),
  image TEXT NOT NULL,
  images TEXT[],
  image_count INTEGER DEFAULT 0,
  price_min INTEGER NOT NULL,
  price_max INTEGER NOT NULL,
  currency VARCHAR(3) DEFAULT 'GHC',
  total_rooms INTEGER DEFAULT 0,
  available_rooms INTEGER DEFAULT 0,
  room_types JSONB, -- Store as JSON array
  rating DECIMAL(2, 1) DEFAULT 0,
  rating_count INTEGER DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_date TIMESTAMP,
  verified_by UUID REFERENCES users(id),
  account_status ENUM('active', 'suspended', 'inactive') DEFAULT 'active',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

CREATE UNIQUE INDEX idx_hostel_name ON hostels(name) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX idx_hostel_slug ON hostels(slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_hostel_location ON hostels(location);
CREATE INDEX idx_hostel_manager ON hostels(manager_id);
CREATE INDEX idx_hostel_verified ON hostels(is_verified);
CREATE INDEX idx_hostel_active ON hostels(is_active);
CREATE INDEX idx_hostel_rating ON hostels(rating DESC);
```

#### 3. Room Model - Complete Implementation
```typescript
interface Room {
  id: string; // UUID
  hostelId: string; // FK to Hostel
  
  // Room identification
  title: string; // e.g., "One-in-One", "Four-in-One", "Dormitory"
  type: "single" | "double" | "shared_4" | "shared_6" | "dormitory";
  roomNumber?: string; // Physical room number in hostel
  description: string; // Room features and details
  
  // Pricing (always in GHC)
  price: number; // Per night price in GHC
  currency: "GHC"; // Always Ghana Cedis
  pricePerMonth?: number; // Monthly rate if applicable
  deposit?: number; // Security deposit if required
  
  // Capacity
  capacity: number; // Number of students who can stay
  totalBeds: number; // Actual bed count
  occupiedBeds?: number; // Current occupancy
  
  // Features
  amenities: string[]; // ["Bed", "Wardrobe", "Desk", "Fan", "WiFi", etc.]
  features: string[]; // Additional features
  image: string; // Main image URL
  images: string[]; // Gallery (max 10 images)
  
  // Availability
  available: number; // Available room count
  totalCount: number; // Total rooms of this type in hostel
  isAvailable: boolean; // Quick check flag
  
  // Booking constraints
  minimumStay: number; // Minimum nights (default: 1)
  maximumStay?: number; // Maximum nights (optional)
  cancellationPolicy: {
    daysBeforeCheckIn: number; // Free cancellation days before
    refundPercentage: number; // % refund if cancelled within period
  };
  
  // Status
  status: "active" | "maintenance" | "unavailable" | "archived";
  maintenanceUntil?: Date; // When maintenance ends
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Database Schema
CREATE TABLE rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hostel_id UUID NOT NULL REFERENCES hostels(id),
  title VARCHAR(255) NOT NULL,
  type ENUM('single', 'double', 'shared_4', 'shared_6', 'dormitory'),
  room_number VARCHAR(20),
  description TEXT,
  price INTEGER NOT NULL, -- in GHC cents (multiply by 100)
  currency VARCHAR(3) DEFAULT 'GHC',
  price_per_month INTEGER,
  deposit INTEGER,
  capacity INTEGER NOT NULL,
  total_beds INTEGER NOT NULL,
  occupied_beds INTEGER DEFAULT 0,
  amenities TEXT[],
  features TEXT[],
  image TEXT NOT NULL,
  images TEXT[],
  available INTEGER NOT NULL DEFAULT 0,
  total_count INTEGER NOT NULL DEFAULT 0,
  is_available BOOLEAN DEFAULT TRUE,
  minimum_stay INTEGER DEFAULT 1,
  maximum_stay INTEGER,
  cancellation_policy_days INTEGER DEFAULT 7,
  cancellation_refund_percentage INTEGER DEFAULT 100,
  status ENUM('active', 'maintenance', 'unavailable', 'archived') DEFAULT 'active',
  maintenance_until TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_room_hostel ON rooms(hostel_id);
CREATE INDEX idx_room_available ON rooms(is_available);
CREATE INDEX idx_room_status ON rooms(status);
CREATE INDEX idx_room_price ON rooms(price);
```

#### 4. Booking Model - Complete Implementation
```typescript
interface Booking {
  // Primary identifiers
  id: string; // UUID
  bookingId: string; // Unique readable ID (e.g., "BK-2025-001234")
  
  // Relationships
  userId: string; // FK to User
  hostelId: string; // FK to Hostel
  roomId: string; // FK to Room
  roomNumber?: string; // Allocated room number
  bedNumber?: string; // Allocated bed number
  
  // Guest information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Emergency contact
  emergencyContact: string; // Contact person name
  emergencyPhone: string; // Contact phone number
  
  // Guardian information
  guardian: string; // Guardian name
  guardianPhone: string; // Guardian phone
  occupation: string; // Student occupation/year
  
  // Dates
  arrivalDate: Date; // Check-in date
  departureDate: Date; // Check-out date
  numberOfNights: number; // Calculated (departure - arrival)
  checkInTime?: string; // e.g., "14:00"
  checkOutTime?: string; // e.g., "10:00"
  
  // Special requirements
  specialRequests?: string; // Max 500 chars
  hasAllergies: boolean; // Default: false
  allergyDetails?: string; // Detailed allergy info
  
  // Pricing
  totalAmount: number; // In GHC
  currency: "GHC";
  depositAmount?: number; // If required
  
  // Status tracking
  status: "pending_payment" | "pending_approval" | "approved" | "room_allocated" | "completed" | "cancelled" | "rejected";
  paymentStatus: "pending" | "partial" | "completed";
  paymentDueDate: Date; // When payment must be completed
  
  // Booking lifecycle
  createdAt: Date;
  approvedAt?: Date;
  approvedBy?: string; // Admin ID
  allocatedAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  cancelReason?: string;
  
  // Notifications
  notificationSent: boolean; // Has confirmation email been sent
  reminderSent: boolean; // Has reminder email been sent
  
  updatedAt: Date;
}

// Database Schema
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id VARCHAR(50) UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id),
  hostel_id UUID NOT NULL REFERENCES hostels(id),
  room_id UUID NOT NULL REFERENCES rooms(id),
  room_number VARCHAR(20),
  bed_number VARCHAR(20),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  emergency_contact VARCHAR(100),
  emergency_phone VARCHAR(20),
  guardian VARCHAR(100),
  guardian_phone VARCHAR(20),
  occupation VARCHAR(100),
  arrival_date DATE NOT NULL,
  departure_date DATE NOT NULL,
  number_of_nights INTEGER NOT NULL,
  check_in_time VARCHAR(10),
  check_out_time VARCHAR(10),
  special_requests TEXT,
  has_allergies BOOLEAN DEFAULT FALSE,
  allergy_details TEXT,
  total_amount INTEGER NOT NULL, -- in GHC cents
  currency VARCHAR(3) DEFAULT 'GHC',
  deposit_amount INTEGER,
  status ENUM('pending_payment', 'pending_approval', 'approved', 'room_allocated', 'completed', 'cancelled', 'rejected') DEFAULT 'pending_payment',
  payment_status ENUM('pending', 'partial', 'completed') DEFAULT 'pending',
  payment_due_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  approved_at TIMESTAMP,
  approved_by UUID REFERENCES users(id),
  allocated_at TIMESTAMP,
  completed_at TIMESTAMP,
  cancelled_at TIMESTAMP,
  cancel_reason TEXT,
  notification_sent BOOLEAN DEFAULT FALSE,
  reminder_sent BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_booking_id ON bookings(booking_id);
CREATE INDEX idx_booking_user ON bookings(user_id);
CREATE INDEX idx_booking_hostel ON bookings(hostel_id);
CREATE INDEX idx_booking_status ON bookings(status);
CREATE INDEX idx_booking_dates ON bookings(arrival_date, departure_date);
CREATE INDEX idx_booking_payment_status ON bookings(payment_status);
```

#### 5. Payment Model - Complete Implementation
```typescript
interface Payment {
  id: string; // UUID
  bookingId: string; // FK to Booking
  userId: string; // FK to User
  
  amount: number; // In GHC (store as cents)
  currency: "GHC";
  
  // Payment method details
  method: "mobile_money" | "bank_transfer" | "card";
  provider?: "mtn" | "vodafone" | "airtel"; // For mobile money
  accountNumber?: string; // For bank transfer
  cardLast4?: string; // For card payment
  
  // Transaction tracking
  transactionId?: string; // Provider's transaction ID
  reference: string; // Unique internal reference
  
  status: "pending" | "processing" | "completed" | "failed" | "cancelled";
  
  // Receipt handling
  receiptUrl?: string; // Uploaded receipt image URL
  receiptVerified: boolean; // Admin verification flag
  receiptVerifiedAt?: Date;
  receiptVerifiedBy?: string; // Admin ID
  
  // Fees & breakdown
  processingFee?: number; // Charged by provider (in GHC cents)
  netAmount?: number; // Amount after fees
  
  // Error tracking
  failureReason?: string; // Why payment failed
  failureCode?: string; // Provider error code
  
  // Timestamps
  createdAt: Date;
  completedAt?: Date;
  failedAt?: Date;
  updatedAt: Date;
}

// Database Schema
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id),
  user_id UUID NOT NULL REFERENCES users(id),
  amount INTEGER NOT NULL, -- in GHC cents
  currency VARCHAR(3) DEFAULT 'GHC',
  method ENUM('mobile_money', 'bank_transfer', 'card') NOT NULL,
  provider VARCHAR(50),
  account_number VARCHAR(100),
  card_last4 VARCHAR(4),
  transaction_id VARCHAR(255),
  reference VARCHAR(100) UNIQUE NOT NULL,
  status ENUM('pending', 'processing', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
  receipt_url TEXT,
  receipt_verified BOOLEAN DEFAULT FALSE,
  receipt_verified_at TIMESTAMP,
  receipt_verified_by UUID REFERENCES users(id),
  processing_fee INTEGER,
  net_amount INTEGER,
  failure_reason TEXT,
  failure_code VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  failed_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_payment_reference ON payments(reference);
CREATE INDEX idx_payment_booking ON payments(booking_id);
CREATE INDEX idx_payment_user ON payments(user_id);
CREATE INDEX idx_payment_status ON payments(status);
CREATE INDEX idx_payment_created ON payments(created_at DESC);
```

---

## ⚡ Frontend Performance Optimizations

### Lazy Loading & Code Splitting
The frontend implements strategic lazy loading for optimal performance:

**Lazy Loaded Components:**
- Homepage sections (WhyChooseUs, OurHostels, Testimonials)
- Blog, FAQ, Gallery sections
- Heavy dashboard components

**Implementation:**
```typescript
// Using Next.js dynamic imports with React Suspense
const Component = dynamic(() => import('./Component'), {
  loading: () => <SkeletonLoader />,
  ssr: true
});
```

### Skeleton Loaders
Instead of generic loading spinners, the frontend uses context-specific skeleton loaders that match the actual content layout. This improves perceived performance and user experience.

**Skeleton Types:**
- Card skeletons (for hostel/room listings)
- Text skeletons (for content blocks)
- List skeletons (for chat/notification lists)
- Form skeletons (for form fields)
- Banner skeletons (for hero sections)

### Performance Impact:
- Reduced First Contentful Paint (FCP)
- Improved Time to Interactive (TTI)
- Better user experience during API calls
- Smoother page transitions

**Affected Pages:**
- `/` (Home) - Lazy loads below-the-fold sections
- `/blog` - Skeleton cards while loading posts
- `/faq` - Skeleton list while loading FAQs
- `/dashboard` - Skeleton loaders for all data lists
- `/dashboard/booking` - Skeleton loaders for booking details
- `/dashboard/chats` - Skeleton loaders for messages

---

## 🧪 Testing

Frontend includes comprehensive test suite (75 tests):
- All Zustand stores tested
- API integration scenarios tested
- Booking flow validated
- Run tests with: `pnpm test`

### Test Coverage:
- useAuthStore (6 tests)
- useBookingStore (3 tests)
- useHostelStore, useRoomStore, usePaymentStore (8 tests)
- useChatStore, useNotificationsStore (4 tests)
- useGalleryStore, useBlogStore, useFAQStore, useTestimonialStore (8 tests)
- usePasswordResetStore, useUIStore (8 tests)
- Platform integration (37 tests)

---

## 🔐 Authentication & Authorization Implementation

### JWT Token Strategy

**Implementation Requirements:**

```typescript
// Token generation on login/signup
interface JWTPayload {
  userId: string; // UUID
  email: string;
  role: "student" | "hostel_manager" | "admin";
  iat: number; // Issued at timestamp
  exp: number; // Expiration timestamp (7 days)
  aud: string; // Audience: "hostella-mobile" or "hostella-web"
}

// Token configuration
const JWT_CONFIG = {
  secret: process.env.JWT_SECRET, // Strong 32+ char secret
  expiresIn: "7d", // 7 days expiration
  algorithm: "HS256",
  issuer: "hostella-api",
  audience: "hostella-app"
};

// Refresh token for extended sessions
interface RefreshToken {
  id: string; // UUID
  userId: string;
  token: string; // Hashed refresh token
  expiresAt: Date; // 30 days from creation
  revoked: boolean; // For logout
  revokedAt?: Date;
  createdAt: Date;
}

// Database schema for refresh tokens
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  revoked BOOLEAN DEFAULT FALSE,
  revoked_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_refresh_token_user ON refresh_tokens(user_id);
```

### Password Hashing Implementation

```typescript
// Use bcrypt with salt rounds
import bcrypt from 'bcrypt';

const BCRYPT_SALT_ROUNDS = 10;

// During registration/password change
async function hashPassword(password: string): Promise<string> {
  // Validate password strength
  if (password.length < 6) throw new Error("Password too short");
  if (!/[A-Z]/.test(password)) throw new Error("Needs uppercase");
  if (!/[0-9]/.test(password)) throw new Error("Needs number");
  
  // Hash password
  const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
  return await bcrypt.hash(password, salt);
}

// During login verification
async function verifyPassword(plaintext: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(plaintext, hash);
}

// Store hashed password in database
user.password = await hashPassword(req.body.password);
await user.save();
```

### Login Endpoint Implementation

```typescript
// POST /auth/login
async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required"
      });
    }
    
    // Find user with email (case-insensitive)
    const user = await User.findOne({ 
      email: email.toLowerCase() 
    });
    
    if (!user) {
      // Generic error to prevent email enumeration
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }
    
    // Check if account is locked due to failed attempts
    if (user.loginAttempts >= 5) {
      const timeSinceLastAttempt = Date.now() - user.lastFailedAttempt.getTime();
      const lockoutTime = 15 * 60 * 1000; // 15 minutes
      
      if (timeSinceLastAttempt < lockoutTime) {
        return res.status(429).json({
          success: false,
          message: "Account temporarily locked. Try again later."
        });
      }
      // Reset attempts after lockout period
      user.loginAttempts = 0;
    }
    
    // Verify password
    const passwordValid = await bcrypt.compare(password, user.password);
    
    if (!passwordValid) {
      // Increment failed attempts
      user.loginAttempts = (user.loginAttempts || 0) + 1;
      user.lastFailedAttempt = new Date();
      await user.save();
      
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }
    
    // Check if email is verified
    if (!user.emailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in"
      });
    }
    
    // Check if account is active
    if (!user.isActive || user.isBanned) {
      return res.status(403).json({
        success: false,
        message: "Account is inactive or banned"
      });
    }
    
    // Reset login attempts on successful login
    user.loginAttempts = 0;
    user.lastLogin = new Date();
    await user.save();
    
    // Generate tokens
    const accessToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    
    const refreshToken = jwt.sign(
      {
        userId: user.id,
        type: "refresh"
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "30d" }
    );
    
    // Store refresh token in database
    await RefreshToken.create({
      userId: user.id,
      token: await hashToken(refreshToken),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });
    
    // Return response
    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
          role: user.role,
          verificationStatus: user.verificationStatus
        },
        token: accessToken,
        refreshToken: refreshToken,
        expiresIn: 604800 // 7 days in seconds
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
}
```

### Registration Endpoint Implementation

```typescript
// POST /auth/register
async function register(req: Request, res: Response) {
  try {
    const {
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      phone,
      gender,
      level,
      school,
      studentId
    } = req.body;
    
    // Validate required fields
    const requiredFields = [
      'email', 'password', 'confirmPassword', 'firstName', 
      'lastName', 'phone', 'gender', 'level', 'school', 'studentId'
    ];
    
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`,
          errors: { [field]: [`${field} is required`] }
        });
      }
    }
    
    // Validate passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
        errors: { confirmPassword: ["Passwords do not match"] }
      });
    }
    
    // Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
        errors: { password: ["Minimum 6 characters required"] }
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      email: email.toLowerCase() 
    });
    
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
        errors: { email: ["This email is already in use"] }
      });
    }
    
    // Check if student ID already exists
    const existingStudentId = await User.findOne({ studentId });
    
    if (existingStudentId) {
      return res.status(409).json({
        success: false,
        message: "Student ID already registered",
        errors: { studentId: ["This student ID is already registered"] }
      });
    }
    
    // Validate phone format (Ghana)
    const phoneRegex = /^(\+233|0)[0-9]{9}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number format",
        errors: { phone: ["Must be Ghana format: +233XXXXXXXXX or 0XXXXXXXXX"] }
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      firstName,
      lastName,
      phone,
      gender,
      level,
      school,
      studentId,
      role: "student",
      verificationStatus: "pending", // Require document verification
      emailVerified: false
    });
    
    // Generate email verification token
    const verificationToken = jwt.sign(
      { userId: user.id, type: "email_verification" },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    
    // Send verification email
    await sendVerificationEmail(user.email, verificationToken);
    
    // Generate JWT for initial access (limited permissions)
    const accessToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    
    return res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          verificationStatus: user.verificationStatus
        },
        token: accessToken,
        message: "Please check your email to verify your account"
      }
    });
    
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Registration failed"
    });
  }
}
```

### Middleware: Token Verification

```typescript
// Middleware to verify JWT token
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Missing or invalid authorization header"
      });
    }
    
    const token = authHeader.substring(7); // Remove "Bearer " prefix
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach decoded token to request
    (req as any).user = decoded;
    
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: "Token expired"
      });
    }
    
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: "Invalid token"
      });
    }
    
    return res.status(500).json({
      success: false,
      message: "Token verification failed"
    });
  }
};

// Middleware to check user role
export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    
    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "Insufficient permissions"
      });
    }
    
    next();
  };
};
```

---

## 📊 API Implementation Best Practices

### Input Validation Strategy

```typescript
// Use validation library (e.g., Joi, Zod, or class-validator)
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

// Example: Booking creation validation
class CreateBookingDTO {
  @IsString()
  @IsNotEmpty()
  hostelId: string;
  
  @IsString()
  @IsNotEmpty()
  roomId: string;
  
  @IsDate()
  @IsNotEmpty()
  arrivalDate: Date;
  
  @IsDate()
  @IsNotEmpty()
  departureDate: Date;
  
  @IsString()
  @MinLength(2)
  firstName: string;
  
  @IsString()
  @MinLength(2)
  lastName: string;
  
  @IsEmail()
  email: string;
  
  @Matches(/^(\+233|0)[0-9]{9}$/)
  phone: string;
}

// Validation middleware
export const validateRequest = (DTOClass: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dto = plainToClass(DTOClass, req.body);
    const errors = await validate(dto);
    
    if (errors.length > 0) {
      const formattedErrors: Record<string, string[]> = {};
      
      errors.forEach(error => {
        formattedErrors[error.property] = Object.values(error.constraints || {});
      });
      
      return res.status(422).json({
        success: false,
        message: "Validation failed",
        errors: formattedErrors
      });
    }
    
    next();
  };
};
```

### Error Handling Strategy

```typescript
// Custom error classes
class APIError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errors?: Record<string, string[]>
  ) {
    super(message);
  }
}

// Global error handler
export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", err);
  
  if (err instanceof APIError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors
    });
  }
  
  if (err instanceof jwt.JsonWebTokenError) {
    return res.status(401).json({
      success: false,
      message: "Authentication failed"
    });
  }
  
  // Default error response
  return res.status(500).json({
    success: false,
    message: "Internal server error"
  });
};

// Usage in route handlers
async function createBooking(req: Request, res: Response) {
  try {
    // ... implementation
  } catch (error) {
    if (error instanceof Prisma.UniqueConstraintFailedError) {
      throw new APIError(409, "Booking already exists");
    }
    throw error;
  }
}
```

### Pagination Implementation

```typescript
// Pagination helper
interface PaginationParams {
  page: number; // default: 1
  limit: number; // default: 10, max: 100
}

function getPaginationParams(query: any): PaginationParams {
  let page = parseInt(query.page) || 1;
  let limit = parseInt(query.limit) || 10;
  
  // Validate
  if (page < 1) page = 1;
  if (limit < 1) limit = 10;
  if (limit > 100) limit = 100;
  
  return { page, limit };
}

// Usage in controller
async function getAllHostels(req: Request, res: Response) {
  const { page, limit } = getPaginationParams(req.query);
  
  const skip = (page - 1) * limit;
  
  const [data, total] = await Promise.all([
    Hostel.find()
      .skip(skip)
      .limit(limit)
      .lean(),
    Hostel.countDocuments()
  ]);
  
  return res.json({
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  });
}
```

---

## 🧪 Backend Testing Strategy

### Unit Tests for Services

```typescript
// Example: Payment Service Tests
describe('PaymentService', () => {
  let paymentService: PaymentService;
  let bookingRepository: jest.Mocked<BookingRepository>;
  let paymentRepository: jest.Mocked<PaymentRepository>;
  
  beforeEach(() => {
    bookingRepository = {
      findById: jest.fn(),
      updateStatus: jest.fn()
    } as any;
    
    paymentRepository = {
      create: jest.fn(),
      findByReference: jest.fn(),
      update: jest.fn()
    } as any;
    
    paymentService = new PaymentService(
      bookingRepository,
      paymentRepository
    );
  });
  
  describe('initiatePayment', () => {
    it('should create pending payment for valid booking', async () => {
      const booking = { id: 'booking-1', totalAmount: 2500 };
      bookingRepository.findById.mockResolvedValue(booking);
      
      const payment = await paymentService.initiatePayment({
        bookingId: 'booking-1',
        method: 'mobile_money',
        phoneNumber: '0501234567'
      });
      
      expect(paymentRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          bookingId: 'booking-1',
          amount: 2500,
          status: 'pending'
        })
      );
      
      expect(payment.status).toBe('pending');
    });
    
    it('should reject payment for non-existent booking', async () => {
      bookingRepository.findById.mockResolvedValue(null);
      
      await expect(
        paymentService.initiatePayment({
          bookingId: 'invalid-id',
          method: 'mobile_money'
        })
      ).rejects.toThrow('Booking not found');
    });
  });
  
  describe('verifyPayment', () => {
    it('should update booking status when payment verified', async () => {
      const payment = {
        id: 'pay-1',
        bookingId: 'booking-1',
        status: 'completed'
      };
      
      paymentRepository.findByReference.mockResolvedValue(payment);
      bookingRepository.updateStatus.mockResolvedValue({});
      
      await paymentService.verifyPayment('payment-ref-123');
      
      expect(bookingRepository.updateStatus).toHaveBeenCalledWith(
        'booking-1',
        'pending_approval'
      );
    });
  });
});
```

### Integration Tests for Endpoints

```typescript
// Example: Booking Endpoint Tests
describe('POST /bookings', () => {
  let app: Express;
  let agent: supertest.SuperAgentRequest;
  
  beforeEach(() => {
    app = createApp();
    agent = request(app);
  });
  
  afterEach(async () => {
    await Booking.deleteMany({});
    await Hostel.deleteMany({});
    await Room.deleteMany({});
  });
  
  it('should create booking with valid data', async () => {
    const hostel = await createTestHostel();
    const room = await createTestRoom(hostel.id);
    const user = await createTestUser();
    const token = generateTestToken(user.id);
    
    const response = await agent
      .post('/api/v1/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send({
        hostelId: hostel.id,
        roomId: room.id,
        arrivalDate: '2025-02-15',
        departureDate: '2025-02-22',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '0501234567'
      });
    
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.bookingId).toBeDefined();
    expect(response.body.data.status).toBe('pending_payment');
  });
  
  it('should reject booking with invalid dates', async () => {
    const hostel = await createTestHostel();
    const room = await createTestRoom(hostel.id);
    const token = generateTestToken('user-1');
    
    const response = await agent
      .post('/api/v1/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send({
        hostelId: hostel.id,
        roomId: room.id,
        arrivalDate: '2025-02-22', // After departure
        departureDate: '2025-02-15',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '0501234567'
      });
    
    expect(response.status).toBe(422);
    expect(response.body.success).toBe(false);
    expect(response.body.errors.departureDate).toBeDefined();
  });
});
```

---

## 🚀 Integration Checklist for Backend

- [ ] Implement all endpoints in API_DOCUMENTATION.md
- [ ] Ensure all prices/amounts use Ghana Cedis (GHC)
- [ ] Set up JWT authentication with 7-day expiry
- [ ] Implement booking status flow
- [ ] Set up payment processing integration
- [ ] Create database schema matching API_DOCUMENTATION.md
- [ ] Set up email notifications
- [ ] Configure CORS for frontend domain
- [ ] Implement file upload for receipts
- [ ] Set up real-time chat (WebSocket recommended)
- [ ] Add input validation for all endpoints
- [ ] Add rate limiting for security
- [ ] Test all endpoints with frontend

---

## 📞 Endpoint Response Format

All endpoints should follow this format:

### Success Response:
```json
{
  "success": true,
  "data": { /* actual data */ },
  "message": "Operation successful"
}
```

### Error Response:
```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field": ["error message"]
  }
}
```

### Paginated Response:
```json
{
  "success": true,
  "data": [ /* array of items */ ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

## 🌍 Environment Variables Configuration

### Required .env Variables

```bash
# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/hostella_db
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=10
DATABASE_SSL=true

# API Configuration
NODE_ENV=production
API_PORT=3001
API_BASE_URL=https://www.hostella.render.com/api/v1
FRONTEND_URL=https://hostella.com
ALLOWED_ORIGINS=https://hostella.com,https://www.hostella.com

# Authentication
JWT_SECRET=your-super-secret-jwt-key-min-32-chars-long
JWT_EXPIRY=7d
REFRESH_TOKEN_SECRET=your-refresh-token-secret-min-32-chars
REFRESH_TOKEN_EXPIRY=30d

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@hostella.com
SMTP_PASSWORD=your-email-password
SMTP_FROM=Hostella <noreply@hostella.com>

# Payment Gateway Integration
PAYMENT_GATEWAY_API_KEY=your-payment-gateway-key
PAYMENT_GATEWAY_SECRET=your-payment-gateway-secret
PAYMENT_GATEWAY_MERCHANT_ID=your-merchant-id
PAYSTACK_SECRET_KEY=your-paystack-key
FLUTTERWAVE_SECRET_KEY=your-flutterwave-key

# File Storage
STORAGE_TYPE=aws|local|gcs
AWS_S3_BUCKET=hostella-uploads
AWS_S3_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret

# Redis Cache
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=redis-password

# Logging
LOG_LEVEL=info
LOG_FILE=logs/application.log

# WebSocket
WEBSOCKET_PORT=3002
WEBSOCKET_URL=wss://www.hostella.render.com
```

---

## 🐳 Docker & Deployment

### Production Deployment Checklist

```bash
# 1. Environment Setup
- Copy .env.example to .env.production
- Set all required environment variables
- Generate strong JWT_SECRET and REFRESH_TOKEN_SECRET
- Configure database connection string
- Set up S3 bucket for file uploads

# 2. Database Preparation
npm run db:migrate # Run all pending migrations
npm run db:seed   # Optional: seed test data

# 3. Build Application
npm run build     # TypeScript compilation
npm run test      # Run full test suite

# 4. Docker Build
docker build -t hostella-api:latest .

# 5. Push to Registry
docker tag hostella-api:latest docker.io/username/hostella-api:latest
docker push docker.io/username/hostella-api:latest

# 6. Kubernetes Deployment (if using K8s)
kubectl apply -f deployment.yml
kubectl apply -f service.yml
kubectl apply -f configmap.yml
kubectl apply -f secret.yml

# 7. Health Check
curl https://api.hostella.com/health
curl https://api.hostella.com/api/v1/health

# 8. Smoke Tests
npm run test:smoke # Quick integration tests on production
```

---

## 📊 Monitoring & Logging

### Application Metrics to Track

```
1. API Performance
   - Average response time per endpoint
   - P95, P99 response times
   - Error rate (4xx, 5xx)
   - Requests per second (throughput)

2. Database
   - Query execution time
   - Connection pool usage
   - Slow queries log
   - Transaction rollback rate

3. Business Metrics
   - Bookings per day
   - Payment success rate
   - User registration rate
   - Active users online (WebSocket connections)

4. Infrastructure
   - CPU usage
   - Memory usage
   - Disk I/O
   - Network bandwidth
```

### Monitoring Stack Setup

```yaml
# Use combination of:
- ELK Stack (Elasticsearch, Logstash, Kibana)
- Prometheus + Grafana
- Datadog or New Relic
- Sentry for error tracking
- CloudWatch (if AWS)
```

---

## 🎯 Implementation Timeline & Milestones

### Week 1: Foundation
**Goals**: Database, auth, API structure
- [ ] PostgreSQL database setup
- [ ] User model and migrations
- [ ] Registration endpoint (basic)
- [ ] Login endpoint with JWT
- [ ] Password reset flow
- [ ] Email service configured
- **Deliverable**: Users can register and login

### Week 2: Hostels & Rooms
**Goals**: Listing and search functionality
- [ ] Hostel model and CRUD endpoints
- [ ] Room model and CRUD endpoints
- [ ] Hostel search/filter endpoints
- [ ] Room availability checking
- [ ] Rating/review system
- **Deliverable**: Users can browse hostels and rooms

### Week 3: Bookings
**Goals**: Complete booking lifecycle
- [ ] Booking model and creation
- [ ] Booking retrieval endpoints
- [ ] Booking status management
- [ ] Booking cancellation
- [ ] Admin approval flow
- **Deliverable**: Users can create and manage bookings

### Week 4: Payments
**Goals**: Payment processing integration
- [ ] Payment model and endpoints
- [ ] Payment gateway integration
- [ ] Receipt upload handling
- [ ] Payment verification
- [ ] Automated email notifications
- **Deliverable**: Bookings can be paid for

### Week 5: Real-Time Features
**Goals**: WebSocket implementation
- [ ] WebSocket server setup
- [ ] Chat messaging system
- [ ] Real-time notifications
- [ ] Typing indicators
- [ ] Message read status
- **Deliverable**: Users can chat with hostel managers

### Week 6: Content Management
**Goals**: CMS features
- [ ] Gallery upload/management
- [ ] Blog CRUD endpoints
- [ ] FAQ management
- [ ] Testimonial management
- [ ] Services listing
- **Deliverable**: Admin can manage all content

### Week 7: Testing & Polish
**Goals**: Quality assurance
- [ ] Unit test coverage > 80%
- [ ] Integration tests for all endpoints
- [ ] End-to-end test scenarios
- [ ] Performance optimization
- [ ] Security audit
- **Deliverable**: Production-ready API

---

## 🔐 Security Considerations

1. **Token Management**: Implement JWT with 7-day expiry
2. **Password Reset**: Use secure tokens with expiration
3. **File Uploads**: Validate file types and sizes
4. **Input Validation**: Validate all incoming data
5. **Rate Limiting**: Prevent brute force attacks
6. **CORS**: Configure for frontend domain only
7. **SQL Injection**: Use parameterized queries
8. **XSS Prevention**: Sanitize user inputs

---

## 🎯 Priority Implementation Order

1. **Phase 1**: Authentication endpoints (login, register, logout)
2. **Phase 2**: Hostel and room listing endpoints
3. **Phase 3**: Booking system endpoints
4. **Phase 4**: Payment processing endpoints
5. **Phase 5**: User management endpoints
6. **Phase 6**: Chat and notifications
7. **Phase 7**: Content management (Gallery, Blog, FAQ, Testimonials)

---

## 📞 Support Information

For questions about:
- **API Requirements** → See API_DOCUMENTATION.md
- **Currency Specifications** → See CURRENCY_POLICY.md
- **Project Structure** → See README.md
- **Frontend Implementation** → Check src/ folder (TypeScript)

---

**Status**: ✅ All frontend components complete and tested  
**Tests**: 75/75 passing ✅  
**Ready for**: Backend API implementation  
**Currency**: Ghana Cedis (GHC) ✅

Good luck with the backend development! 🚀
