# Hostella API Documentation for Backend Team

**Base URL**: `https://example-prod.up.railway.app/api/v1`  
**Currency**: All prices and amounts are in **Ghana Cedis (GHC)**

## Table of Contents
1. [Authentication](#authentication)
2. [User Management](#user-management)
3. [Hostels](#hostels)
4. [Rooms](#rooms)
5. [Bookings](#bookings)
6. [Payments](#payments)
7. [Notifications](#notifications)
8. [Chat](#chat)
9. [Testimonials](#testimonials)
10. [Gallery](#gallery)
11. [Blog](#blog)
12. [FAQs](#faqs)
13. [Services](#services)
14. [Contact](#contact)
15. [WebSocket Specifications](#websocket-specifications-real-time-features)
16. [File Upload Specifications](#file-upload-specifications)
17. [Email Templates & Notifications](#email-templates--notifications)
18. [Webhooks Specifications](#webhooks-specifications)
19. [Rate Limiting Specifications](#rate-limiting-specifications)
20. [Caching Strategies](#caching-strategies)
21. [Response Format](#response-format)
22. [Error Handling](#error-handling)

---

## Authentication

### 1. User Login
**Endpoint**: `POST /auth/login`

**Request Body**:
```json
{
  "email": "string (required)",
  "password": "string (required, min 6 characters)"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "phone": "string",
      "avatar": "string (URL)"
    },
    "token": "string (JWT)"
  }
}
```

### 2. User Registration
**Endpoint**: `POST /auth/register`

**Request**: `multipart/form-data`
- `email` (string, required)
- `password` (string, required, min 6 characters)
- `confirmPassword` (string, required)
- `firstName` (string, required)
- `lastName` (string, required)
- `gender` (enum: "male" | "female", required)
- `level` (enum: "100" | "200" | "300" | "400", required)
- `school` (string, required)
- `studentId` (string, required)
- `phone` (string, required)
- `admissionLetter` (file, optional, max 5MB)

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "firstName": "string",
      "lastName": "string",
      "email": "string",
      "phone": "string",
      "avatar": "string",
      "gender": "string",
      "level": "string",
      "school": "string",
      "studentId": "string"
    },
    "token": "string (JWT)"
  }
}
```

### 3. Get Current User
**Endpoint**: `GET /auth/me`

**Headers**: `Authorization: Bearer {token}`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "avatar": "string"
  }
}
```

### 4. Forgot Password
**Endpoint**: `POST /auth/forgot-password`

**Request Body**:
```json
{
  "email": "string (required)"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "message": "Reset code sent to email"
  }
}
```

### 5. Verify Reset Code
**Endpoint**: `POST /auth/verify-reset-code`

**Request Body**:
```json
{
  "email": "string (required)",
  "code": "string (required, 6-digit code)"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "message": "Code verified successfully"
  }
}
```

### 6. Reset Password
**Endpoint**: `POST /auth/reset-password`

**Request Body**:
```json
{
  "email": "string (required)",
  "code": "string (required)",
  "newPassword": "string (required, min 6 characters)"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "message": "Password reset successfully"
  }
}
```

### 7. Logout
**Endpoint**: `POST /auth/logout`

**Headers**: `Authorization: Bearer {token}`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

---

## User Management

### 1. Update Profile
**Endpoint**: `PUT /user/profile`

**Headers**: `Authorization: Bearer {token}`

**Request**: `multipart/form-data`
- `firstName` (string, optional)
- `lastName` (string, optional)
- `phone` (string, optional)
- `avatar` (file, optional)

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "avatar": "string (URL)"
  }
}
```

### 2. Update Password
**Endpoint**: `PUT /user/password`

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "currentPassword": "string (required)",
  "newPassword": "string (required, min 6 characters)"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "message": "Password updated successfully"
  }
}
```

### 3. Get User Profile
**Endpoint**: `GET /user/profile`

**Headers**: `Authorization: Bearer {token}`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "avatar": "string",
    "gender": "string",
    "level": "string",
    "school": "string",
    "studentId": "string",
    "createdAt": "ISO 8601 datetime",
    "updatedAt": "ISO 8601 datetime"
  }
}
```

---

## Hostels

### 1. Get All Hostels (Paginated)
**Endpoint**: `GET /hostels`

**Query Parameters**:
- `page` (number, optional, default: 1)
- `limit` (number, optional, default: 10)
- `search` (string, optional)

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "string",
      "location": "string",
      "rating": 4.9,
      "description": "string",
      "image": "string (URL)",
      "images": ["string (URL)"],
      "amenities": ["string"],
      "address": "string",
      "phone": "string",
      "email": "string",
      "priceRange": {
        "min": 2000,
        "max": 5000
      },
      "availableRooms": 10,
      "totalRooms": 50,
      "createdAt": "ISO 8601 datetime",
      "updatedAt": "ISO 8601 datetime"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### 2. Get Hostel by ID
**Endpoint**: `GET /hostels/:id`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "string",
    "location": "string",
    "rating": 4.9,
    "description": "string",
    "image": "string (URL)",
    "images": ["string (URL)"],
    "amenities": ["24/7 Security", "Wi-Fi", "Water Supply"],
    "address": "string",
    "phone": "string",
    "email": "string",
    "priceRange": {
      "min": 2000,
      "max": 5000
    },
    "availableRooms": 10,
    "totalRooms": 50,
    "createdAt": "ISO 8601 datetime",
    "updatedAt": "ISO 8601 datetime"
  }
}
```

### 3. Get Featured Hostels
**Endpoint**: `GET /hostels/featured`

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "string",
      "location": "string",
      "rating": 4.9,
      "description": "string",
      "image": "string (URL)"
    }
  ]
}
```

---

## Rooms

### 1. Get Rooms by Hostel ID
**Endpoint**: `GET /hostels/:hostelId/rooms`

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "hostelId": 1,
      "title": "One-in-One",
      "type": "single",
      "price": 2500,
      "description": "Private room with personal space",
      "available": 5,
      "capacity": 1,
      "image": "string (URL)",
      "images": ["string (URL)"],
      "amenities": ["Bed", "Wardrobe", "Study Desk"],
      "isAvailable": true,
      "createdAt": "ISO 8601 datetime",
      "updatedAt": "ISO 8601 datetime"
    }
  ]
}
```

**Note**: `price` is in Ghana Cedis (GHC)

### 2. Get Room by ID
**Endpoint**: `GET /rooms/:id`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "hostelId": 1,
    "title": "One-in-One",
    "type": "single",
    "price": 2500,
    "description": "Private room with personal space",
    "available": 5,
    "capacity": 1,
    "image": "string (URL)",
    "images": ["string (URL)"],
    "amenities": ["Bed", "Wardrobe", "Study Desk"],
    "isAvailable": true
  }
}
```

**Note**: `price` is in Ghana Cedis (GHC)

### 3. Check Room Availability
**Endpoint**: `GET /rooms/:id/availability`

**Query Parameters**:
- `startDate` (ISO 8601 date, required)
- `endDate` (ISO 8601 date, required)

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "available": true,
    "availableCount": 3
  }
}
```

---

## Bookings

### 1. Create Booking
**Endpoint**: `POST /bookings`

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "hostelId": 1,
  "roomId": 2,
  "arrivalDate": "2025-01-15",
  "departureDate": "2025-06-15",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "emergencyContact": "string",
  "guardian": "string",
  "guardianPhone": "string",
  "occupation": "string",
  "specialRequests": "string (optional)",
  "hasAllergies": false,
  "allergyDetails": "string (optional)"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 1,
    "hostelId": 1,
    "roomId": 2,
    "bookingId": "BK12345678",
    "status": "pending_payment",
    "arrivalDate": "2025-01-15",
    "departureDate": "2025-06-15",
    "totalAmount": 2500,
    "paymentStatus": "pending",
    "createdAt": "ISO 8601 datetime",
    "updatedAt": "ISO 8601 datetime"
  }
}
```

### 2. Get All User Bookings
**Endpoint**: `GET /bookings/my-bookings`

**Headers**: `Authorization: Bearer {token}`

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "hostelId": 1,
      "roomId": 2,
      "roomNumber": "B12",
      "status": "room_allocated",
      "arrivalDate": "2025-01-15",
      "totalAmount": 2500,
      "paymentStatus": "paid",
      "hostel": {
        "id": 1,
        "name": "Lienda Ville",
        "location": "Kotei",
        "image": "string (URL)"
      },
      "room": {
        "id": 2,
        "title": "One-in-One",
        "type": "single",
        "price": 2500
      },
      "createdAt": "ISO 8601 datetime"
    }
  ]
}
```

### 3. Get Booking by ID
**Endpoint**: `GET /bookings/:id`

**Headers**: `Authorization: Bearer {token}`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "userId": 1,
    "hostelId": 1,
    "roomId": 2,
    "roomNumber": "B12",
    "bookingId": "BK12345678",
    "status": "room_allocated",
    "arrivalDate": "2025-01-15",
    "departureDate": "2025-06-15",
    "totalAmount": 2500,
    "paymentStatus": "paid",
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "emergencyContact": "string",
    "guardian": "string",
    "guardianPhone": "string",
    "occupation": "string",
    "specialRequests": "string",
    "hasAllergies": false,
    "allergyDetails": "string",
    "hostel": {...},
    "room": {...},
    "createdAt": "ISO 8601 datetime",
    "updatedAt": "ISO 8601 datetime"
  }
}
```

### 4. Update Booking
**Endpoint**: `PUT /bookings/:id`

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "status": "approved",
  "roomNumber": "B12",
  "arrivalDate": "2025-01-20"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    // Updated booking object
  }
}
```

### 5. Cancel Booking
**Endpoint**: `POST /bookings/:id/cancel`

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "reason": "string (optional)"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "message": "Booking cancelled successfully"
  }
}
```

### 6. Get All Bookings (Admin/Paginated)
**Endpoint**: `GET /bookings`

**Headers**: `Authorization: Bearer {token}`

**Query Parameters**:
- `page` (number, optional, default: 1)
- `limit` (number, optional, default: 10)
- `status` (string, optional: "pending_payment" | "pending_approval" | "approved" | "rejected" | "room_allocated" | "completed" | "cancelled")

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    // Array of booking objects
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

---

## Payments

**Currency**: All payment amounts are in Ghana Cedis (GHC)

### 1. Initiate Payment
**Endpoint**: `POST /payments/initiate`

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "bookingId": 1,
  "method": "bank" | "momo",
  "phoneNumber": "string (required if method is 'momo')"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "bookingId": 1,
    "amount": 2500,
    "method": "bank",
    "status": "pending",
    "reference": "PAY123456",
    "transactionId": "string (for momo)",
    "createdAt": "ISO 8601 datetime",
    "updatedAt": "ISO 8601 datetime"
  }
}
```

**Note**: `amount` is in Ghana Cedis (GHC)

### 2. Upload Receipt
**Endpoint**: `POST /payments/:id/receipt`

**Headers**: `Authorization: Bearer {token}`

**Request**: `multipart/form-data`
- `receipt` (file, required, image formats)

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "bookingId": 1,
    "amount": 2500,
    "method": "bank",
    "status": "pending",
    "reference": "PAY123456",
    "receiptUrl": "string (URL)",
    "createdAt": "ISO 8601 datetime",
    "updatedAt": "ISO 8601 datetime"
  }
}
```

**Note**: `amount` is in Ghana Cedis (GHC)

### 3. Verify Payment
**Endpoint**: `POST /payments/:id/verify`

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "reference": "string (transaction reference)"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "bookingId": 1,
    "amount": 2500,
    "method": "momo",
    "status": "completed",
    "reference": "PAY123456",
    "transactionId": "string",
    "createdAt": "ISO 8601 datetime",
    "updatedAt": "ISO 8601 datetime"
  }
}
```

**Note**: `amount` is in Ghana Cedis (GHC)

### 4. Get Payments by Booking ID
**Endpoint**: `GET /payments/booking/:bookingId`

**Headers**: `Authorization: Bearer {token}`

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "bookingId": 1,
      "amount": 2500,
      "method": "bank",
      "status": "completed",
      "reference": "PAY123456",
      "receiptUrl": "string (URL)",
      "createdAt": "ISO 8601 datetime"
    }
  ]
}
```

---

## Notifications

### 1. Get All Notifications
**Endpoint**: `GET /notifications`

**Headers**: `Authorization: Bearer {token}`

**Query Parameters**:
- `page` (number, optional, default: 1)
- `limit` (number, optional, default: 20)
- `unreadOnly` (boolean, optional)

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "type": "booking_approved" | "payment_received" | "room_allocated" | "maintenance_alert",
      "title": "string",
      "description": "string",
      "time": "string (e.g., '1 min ago')",
      "read": false,
      "createdAt": "ISO 8601 datetime"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

### 2. Mark Notification as Read
**Endpoint**: `PUT /notifications/:id/read`

**Headers**: `Authorization: Bearer {token}`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "message": "Notification marked as read"
  }
}
```

### 3. Mark All Notifications as Read
**Endpoint**: `PUT /notifications/read-all`

**Headers**: `Authorization: Bearer {token}`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "message": "All notifications marked as read"
  }
}
```

### 4. Delete Notification
**Endpoint**: `DELETE /notifications/:id`

**Headers**: `Authorization: Bearer {token}`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "message": "Notification deleted successfully"
  }
}
```

### 5. Delete All Notifications
**Endpoint**: `DELETE /notifications`

**Headers**: `Authorization: Bearer {token}`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "message": "All notifications deleted successfully"
  }
}
```

---

## Chat

### 1. Get User Chats
**Endpoint**: `GET /chats`

**Headers**: `Authorization: Bearer {token}`

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "lastMessage": "string",
      "lastMessageTime": "ISO 8601 datetime",
      "unreadCount": 3,
      "adminName": "Support Team",
      "adminAvatar": "string (URL)"
    }
  ]
}
```

### 2. Get Chat Messages
**Endpoint**: `GET /chats/:chatId/messages`

**Headers**: `Authorization: Bearer {token}`

**Query Parameters**:
- `page` (number, optional, default: 1)
- `limit` (number, optional, default: 50)

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "chatId": 1,
      "sender": "student" | "admin",
      "content": "string",
      "timestamp": "ISO 8601 datetime",
      "type": "text" | "image" | "voice" | "file",
      "fileUrl": "string (URL, optional)",
      "fileName": "string (optional)",
      "read": true
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 100,
    "totalPages": 2
  }
}
```

### 3. Send Message
**Endpoint**: `POST /chats/:chatId/messages`

**Headers**: `Authorization: Bearer {token}`

**Request** (for text):
```json
{
  "content": "string",
  "type": "text"
}
```

**Request** (for file/image/voice): `multipart/form-data`
- `file` (file, required)
- `content` (string, optional)
- `type` (string: "image" | "voice" | "file")

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "chatId": 1,
    "sender": "student",
    "content": "string",
    "timestamp": "ISO 8601 datetime",
    "type": "text",
    "read": false
  }
}
```

### 4. Mark Messages as Read
**Endpoint**: `PUT /chats/:chatId/read`

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "messageIds": [1, 2, 3]
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "message": "Messages marked as read"
  }
}
```

---

## Testimonials

### 1. Get All Testimonials
**Endpoint**: `GET /testimonials`

**Query Parameters**:
- `page` (number, optional, default: 1)
- `limit` (number, optional, default: 10)

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "string",
      "image": "string (URL)",
      "rating": 5,
      "text": "string",
      "hostelId": 1,
      "createdAt": "ISO 8601 datetime"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### 2. Create Testimonial
**Endpoint**: `POST /testimonials`

**Headers**: `Authorization: Bearer {token}`

**Request Body**:
```json
{
  "name": "string",
  "rating": 5,
  "text": "string",
  "hostelId": 1
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "string",
    "image": "string (URL)",
    "rating": 5,
    "text": "string",
    "hostelId": 1,
    "createdAt": "ISO 8601 datetime"
  }
}
```

---

## Gallery

### 1. Get All Gallery Images
**Endpoint**: `GET /gallery`

**Query Parameters**:
- `page` (number, optional, default: 1)
- `limit` (number, optional, default: 20)
- `category` (string, optional: "rooms" | "facilities" | "exterior" | "common_areas")

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "src": "string (URL)",
      "alt": "string",
      "category": "rooms",
      "hostelId": 1,
      "createdAt": "ISO 8601 datetime"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### 2. Get Hostel Gallery
**Endpoint**: `GET /hostels/:hostelId/gallery`

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "src": "string (URL)",
      "alt": "string",
      "category": "rooms",
      "createdAt": "ISO 8601 datetime"
    }
  ]
}
```

---

## Blog

### 1. Get All Blog Posts
**Endpoint**: `GET /blog`

**Query Parameters**:
- `page` (number, optional, default: 1)
- `limit` (number, optional, default: 10)
- `category` (string, optional)
- `tag` (string, optional)

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "string",
      "slug": "string",
      "excerpt": "string",
      "content": "string (HTML/Markdown)",
      "author": {
        "id": 1,
        "name": "string",
        "avatar": "string (URL)"
      },
      "image": "string (URL)",
      "category": "string",
      "tags": ["string"],
      "publishedAt": "ISO 8601 datetime",
      "createdAt": "ISO 8601 datetime",
      "updatedAt": "ISO 8601 datetime"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### 2. Get Blog Post by Slug
**Endpoint**: `GET /blog/:slug`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "string",
    "slug": "string",
    "excerpt": "string",
    "content": "string (HTML/Markdown)",
    "author": {
      "id": 1,
      "name": "string",
      "avatar": "string (URL)"
    },
    "image": "string (URL)",
    "category": "string",
    "tags": ["string"],
    "publishedAt": "ISO 8601 datetime",
    "createdAt": "ISO 8601 datetime",
    "updatedAt": "ISO 8601 datetime"
  }
}
```

### 3. Get Blog Categories
**Endpoint**: `GET /blog/categories`

**Response** (200 OK):
```json
{
  "success": true,
  "data": ["Accommodation Tips", "Student Life", "Safety", "Campus News"]
}
```

---

## FAQs

### 1. Get All FAQs
**Endpoint**: `GET /faqs`

**Query Parameters**:
- `category` (string, optional)

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "question": "string",
      "answer": "string",
      "category": "General" | "Booking" | "Payment" | "Facilities",
      "order": 1,
      "createdAt": "ISO 8601 datetime",
      "updatedAt": "ISO 8601 datetime"
    }
  ]
}
```

### 2. Get FAQ Categories
**Endpoint**: `GET /faqs/categories`

**Response** (200 OK):
```json
{
  "success": true,
  "data": ["General", "Booking", "Payment", "Facilities"]
}
```

---

## Services

### 1. Get All Services
**Endpoint**: `GET /services`

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "string",
      "description": "string",
      "icon": "string (icon name or URL)",
      "image": "string (URL)",
      "features": ["string"],
      "createdAt": "ISO 8601 datetime"
    }
  ]
}
```

### 2. Get Service by ID
**Endpoint**: `GET /services/:id`

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "string",
    "description": "string",
    "icon": "string",
    "image": "string (URL)",
    "features": ["string"],
    "createdAt": "ISO 8601 datetime"
  }
}
```

---

## Contact

### 1. Submit Contact Message
**Endpoint**: `POST /contact`

**Request Body**:
```json
{
  "name": "string (required)",
  "email": "string (required)",
  "phone": "string (optional)",
  "subject": "string (required)",
  "message": "string (required)"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "message": "Message sent successfully. We'll get back to you soon."
  }
}
```

---

## WebSocket Specifications (Real-Time Features)

### Connection Initialization

**URL**: `wss://example-prod.up.railway.app/socket.io/?EIO=4&transport=websocket`

**Headers**:
```
Authorization: Bearer {token}
```

**Connection Handshake**:
```json
{
  "type": "CONNECT",
  "data": {
    "userId": "string",
    "token": "string"
  }
}
```

**Expected Response**:
```json
{
  "type": "CONNECT_SUCCESS",
  "data": {
    "connectionId": "socket-uuid-string",
    "userId": "user-id",
    "connectedAt": "2025-01-15T10:30:00Z",
    "status": "connected"
  }
}
```

### Chat Messages (Real-Time)

**Event**: `chat:send-message`

**Client Sends**:
```json
{
  "type": "chat:send-message",
  "data": {
    "conversationId": "string",
    "senderId": "string",
    "message": "string (required, max 5000 characters)",
    "attachments": [
      {
        "url": "string",
        "type": "image|file|video",
        "fileName": "string"
      }
    ],
    "timestamp": "2025-01-15T10:30:00Z"
  }
}
```

**Server Broadcasts to Conversation Participants**:
```json
{
  "type": "chat:message-received",
  "data": {
    "id": "message-uuid",
    "conversationId": "string",
    "senderId": "string",
    "senderName": "John Doe",
    "senderAvatar": "string (URL)",
    "message": "Hello, do you have availability?",
    "attachments": [],
    "readBy": ["string"],
    "createdAt": "2025-01-15T10:30:00Z",
    "isEdited": false,
    "editedAt": null
  }
}
```

**Event**: `chat:typing-indicator`

**Client Sends**:
```json
{
  "type": "chat:typing-indicator",
  "data": {
    "conversationId": "string",
    "userId": "string",
    "isTyping": true
  }
}
```

**Server Broadcasts**:
```json
{
  "type": "chat:user-typing",
  "data": {
    "conversationId": "string",
    "userId": "string",
    "userName": "Jane Smith",
    "isTyping": true
  }
}
```

**Event**: `chat:mark-as-read`

**Client Sends**:
```json
{
  "type": "chat:mark-as-read",
  "data": {
    "conversationId": "string",
    "messageIds": ["msg-id-1", "msg-id-2"],
    "readAt": "2025-01-15T10:30:00Z"
  }
}
```

**Server Broadcasts**:
```json
{
  "type": "chat:messages-read",
  "data": {
    "conversationId": "string",
    "messageIds": ["msg-id-1", "msg-id-2"],
    "readBy": "user-id",
    "readByName": "John Doe",
    "readAt": "2025-01-15T10:30:00Z"
  }
}
```

### Notifications (Real-Time)

**Event**: `notification:new`

**Server Sends to User**:
```json
{
  "type": "notification:new",
  "data": {
    "id": "notif-uuid",
    "userId": "string",
    "type": "booking_confirmed|payment_received|room_allocated|chat_message|promotion",
    "title": "Booking Confirmed",
    "message": "Your booking for Comfort Hostel has been confirmed. Room will be allocated within 24 hours.",
    "icon": "string (URL)",
    "actionUrl": "/dashboard/booking/12345",
    "metadata": {
      "bookingId": "12345",
      "hostelId": "789",
      "amount": 1250.00,
      "currency": "GHC"
    },
    "isRead": false,
    "createdAt": "2025-01-15T10:30:00Z",
    "expiresAt": "2025-01-22T10:30:00Z"
  }
}
```

**Event**: `notification:mark-read`

**Client Sends**:
```json
{
  "type": "notification:mark-read",
  "data": {
    "notificationIds": ["notif-uuid-1", "notif-uuid-2"]
  }
}
```

**Server Response**:
```json
{
  "type": "notification:read-success",
  "data": {
    "notificationIds": ["notif-uuid-1", "notif-uuid-2"],
    "markedAt": "2025-01-15T10:30:00Z"
  }
}
```

### Booking Status Updates (Real-Time)

**Event**: `booking:status-changed`

**Server Sends to User**:
```json
{
  "type": "booking:status-changed",
  "data": {
    "bookingId": "12345",
    "userId": "user-id",
    "oldStatus": "pending_payment",
    "newStatus": "pending_approval",
    "timestamp": "2025-01-15T10:30:00Z",
    "changedBy": "admin-id",
    "changedByName": "Admin User",
    "reason": "Payment verified successfully",
    "nextAction": "Admin will review and allocate a room within 24 hours"
  }
}
```

### Connection Events

**Event**: `connection:disconnect`

**Server Sends**:
```json
{
  "type": "connection:disconnect",
  "data": {
    "reason": "user_logout|token_expired|server_maintenance|connection_lost",
    "message": "Your session has expired. Please log in again.",
    "reconnectAfter": 30
  }
}
```

**Event**: `connection:ping`

**Server Sends (Every 30 seconds)**:
```json
{
  "type": "connection:ping",
  "data": {
    "timestamp": "2025-01-15T10:30:00Z"
  }
}
```

**Client Should Respond**:
```json
{
  "type": "connection:pong",
  "data": {
    "timestamp": "2025-01-15T10:30:00Z"
  }
}
```

---

## File Upload Specifications

### Image Upload Endpoints

**Endpoint**: `POST /upload/images`

**Headers**:
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Parameters**:
```
files: File[] (required, array of files)
category: "hostel|room|gallery|profile|blog|testimonial" (required)
metadata: {
  title: string (optional),
  description: string (optional),
  hostelId: string (optional, required if category=hostel|room|gallery)
}
```

**File Requirements**:
- **Allowed Formats**: `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`
- **Max File Size**: 5MB per image
- **Max Upload**: 10 files per request
- **Recommended Dimensions**:
  - Profile: 300x300px
  - Hostel/Room: 1200x800px
  - Gallery: 1400x900px
  - Blog: 1200x600px
  - Testimonial: 150x150px

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "uploadedImages": [
      {
        "id": "image-uuid-1",
        "originalName": "hostel-entrance.jpg",
        "fileName": "hostel-entrance-2025-01-15-uuid.jpg",
        "url": "https://example-prod.up.railway.app/uploads/hostels/hostel-entrance-2025-01-15-uuid.jpg",
        "thumbnailUrl": "https://example-prod.up.railway.app/uploads/hostels/thumb-hostel-entrance-2025-01-15-uuid.jpg",
        "size": 2048576,
        "sizeFormatted": "2.0 MB",
        "mimeType": "image/jpeg",
        "dimensions": {
          "width": 1920,
          "height": 1080
        },
        "category": "hostel",
        "uploadedAt": "2025-01-15T10:30:00Z"
      },
      {
        "id": "image-uuid-2",
        "originalName": "room-view.png",
        "fileName": "room-view-2025-01-15-uuid.png",
        "url": "https://example-prod.up.railway.app/uploads/rooms/room-view-2025-01-15-uuid.png",
        "thumbnailUrl": "https://example-prod.up.railway.app/uploads/rooms/thumb-room-view-2025-01-15-uuid.png",
        "size": 3145728,
        "sizeFormatted": "3.0 MB",
        "mimeType": "image/png",
        "dimensions": {
          "width": 1920,
          "height": 1440
        },
        "category": "room",
        "uploadedAt": "2025-01-15T10:30:00Z"
      }
    ],
    "totalUploaded": 2,
    "failedUploads": 0
  }
}
```

### Document Upload Endpoint

**Endpoint**: `POST /upload/documents`

**Headers**:
```
Authorization: Bearer {token}
Content-Type: multipart/form-data
```

**Request Parameters**:
```
file: File (required, single file)
documentType: "admission_letter|id_document|proof_of_address" (required)
userId: string (required)
```

**File Requirements**:
- **Allowed Formats**: `.pdf`, `.doc`, `.docx`, `.jpg`, `.jpeg`, `.png`
- **Max File Size**: 10MB
- **Required for**: Student registration (admission letter)

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "documentId": "doc-uuid",
    "fileName": "admission-letter-2025-01-15-uuid.pdf",
    "url": "https://example-prod.up.railway.app/uploads/documents/admission-letter-2025-01-15-uuid.pdf",
    "documentType": "admission_letter",
    "size": 1024576,
    "sizeFormatted": "1.0 MB",
    "mimeType": "application/pdf",
    "uploadedAt": "2025-01-15T10:30:00Z",
    "verificationStatus": "pending",
    "verifiedAt": null,
    "verifiedBy": null
  }
}
```

### Image Deletion

**Endpoint**: `DELETE /upload/images/{imageId}`

**Headers**:
```
Authorization: Bearer {token}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "message": "Image deleted successfully",
    "deletedImageId": "image-uuid",
    "deletedAt": "2025-01-15T10:30:00Z"
  }
}
```

### Upload Error Handling

**Error Response** (400 Bad Request):
```json
{
  "success": false,
  "message": "Upload failed",
  "errors": [
    {
      "fileName": "large-file.jpg",
      "reason": "File size exceeds maximum limit of 5MB",
      "providedSize": "7.5 MB"
    },
    {
      "fileName": "document.txt",
      "reason": "File type not allowed. Allowed types: jpg, jpeg, png, webp, gif"
    }
  ]
}
```

---

## Email Templates & Notifications

### 1. Registration Confirmation Email

**Trigger**: User successfully registers

**Template Variables**:
- `{firstName}` - User's first name
- `{email}` - User's email address
- `{verificationLink}` - Email verification link
- `{loginUrl}` - Direct login URL
- `{currentYear}` - Current year

**Email Content**:
```
Subject: Welcome to Hostella! Confirm Your Email Address

Dear {firstName},

Thank you for registering with Hostella! We're excited to have you as part of our community.

To complete your account setup, please verify your email address by clicking the link below:

{verificationLink}

If you didn't create this account, please ignore this email.

Your login credentials:
- Email: {email}
- Password: You set this during registration

Once verified, you can:
✓ Browse and book hostels
✓ Track your bookings in real-time
✓ Chat with hostel managers
✓ Manage your profile

If you have any issues, contact us at support@hostella.com

Best regards,
The Hostella Team
© {currentYear} Hostella. All rights reserved.
```

**HTML Structure**:
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #007bff; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; }
    .button { background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; display: inline-block; margin: 20px 0; }
    .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to Hostella!</h1>
    </div>
    <div class="content">
      <p>Hi {firstName},</p>
      <p>Thank you for registering with Hostella. To complete your account setup, please verify your email address:</p>
      <a href="{verificationLink}" class="button">Verify Email Address</a>
      <p>If the button doesn't work, copy and paste this link in your browser:</p>
      <p>{verificationLink}</p>
    </div>
    <div class="footer">
      <p>&copy; {currentYear} Hostella. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
```

### 2. Password Reset Email

**Trigger**: User requests password reset

**Template Variables**:
- `{firstName}` - User's first name
- `{resetLink}` - Password reset link with token
- `{expiryTime}` - Code expiry (e.g., "24 hours")

**Email Content**:
```
Subject: Reset Your Hostella Password

Hi {firstName},

We received a request to reset your password. If you didn't make this request, you can ignore this email.

To reset your password, click the link below:

{resetLink}

This link expires in {expiryTime}.

For security reasons:
- Never share this link with anyone
- We will never ask for your password via email
- If you didn't request this, your account may be compromised

Need help? Contact support@hostella.com

Best regards,
The Hostella Team
```

### 3. Booking Confirmation Email

**Trigger**: Booking created and payment initiated

**Template Variables**:
- `{firstName}` - User's first name
- `{bookingId}` - Unique booking ID
- `{hostelName}` - Hostel name
- `{checkInDate}` - Check-in date (formatted: DD/MM/YYYY)
- `{checkOutDate}` - Check-out date (formatted: DD/MM/YYYY)
- `{roomType}` - Type of room booked
- `{totalAmount}` - Total booking amount
- `{currency}` - Currency (GHC)
- `{bookingUrl}` - Link to booking details
- `{paymentDeadline}` - Payment due date

**Email Content**:
```
Subject: Booking Confirmation - Booking ID: {bookingId}

Dear {firstName},

Your booking has been created successfully! Here are your booking details:

--- BOOKING DETAILS ---
Booking ID: {bookingId}
Hostel: {hostelName}
Room Type: {roomType}
Check-in: {checkInDate}
Check-out: {checkOutDate}
Duration: X nights
Total Amount: {totalAmount} {currency}

--- PAYMENT REQUIRED ---
Please complete payment by {paymentDeadline} to secure your booking.

Payment Status: Pending
Booking Status: Pending Payment

View your booking and complete payment here:
{bookingUrl}

--- NEXT STEPS ---
1. Complete payment through the portal
2. You'll receive room allocation within 24 hours of payment
3. A hostel manager may contact you with additional information

--- CANCELLATION POLICY ---
- Free cancellation up to 7 days before check-in
- 50% refund for cancellations 3-7 days before check-in
- Non-refundable if cancelled within 3 days of check-in

Questions? Contact the hostel manager directly through the app or email support@hostella.com

Best regards,
The Hostella Team
```

**Expected JSON Payload for Email Service**:
```json
{
  "to": "user@example.com",
  "subject": "Booking Confirmation - Booking ID: BK-2025-001234",
  "templateId": "booking_confirmation",
  "variables": {
    "firstName": "John",
    "bookingId": "BK-2025-001234",
    "hostelName": "Comfort Hostel Accra",
    "checkInDate": "15/02/2025",
    "checkOutDate": "22/02/2025",
    "roomType": "Shared Dormitory",
    "totalAmount": "1250.00",
    "currency": "GHC",
    "bookingUrl": "https://hostella.com/dashboard/booking/BK-2025-001234",
    "paymentDeadline": "16/01/2025"
  },
  "sendAt": "2025-01-15T10:30:00Z"
}
```

### 4. Payment Confirmation Email

**Trigger**: Payment processed successfully

**Template Variables**:
- `{firstName}` - User's first name
- `{bookingId}` - Booking ID
- `{transactionId}` - Payment transaction ID
- `{amount}` - Payment amount
- `{paymentMethod}` - Payment method (Card, Mobile Money, Bank Transfer)
- `{paymentDate}` - Date of payment
- `{receiptUrl}` - Link to payment receipt

**Email Content**:
```
Subject: Payment Confirmed - Transaction ID: {transactionId}

Dear {firstName},

Your payment has been received and confirmed!

--- PAYMENT DETAILS ---
Booking ID: {bookingId}
Transaction ID: {transactionId}
Amount: {amount} GHC
Payment Method: {paymentMethod}
Date: {paymentDate}
Status: ✓ Successful

--- NEXT STEPS ---
Your booking is now under review. A hostel manager will:
1. Review your booking details
2. Allocate a room within 24 hours
3. Send you confirmation with room number and instructions

Download Receipt: {receiptUrl}

Your booking status will update automatically. Watch for notifications!

Questions? Reply to this email or visit https://hostella.com/dashboard

Best regards,
The Hostella Team
```

### 5. Room Allocation Email

**Trigger**: Admin allocates room to booking

**Template Variables**:
- `{firstName}` - User's first name
- `{bookingId}` - Booking ID
- `{hostelName}` - Hostel name
- `{roomNumber}` - Allocated room number
- `{bedNumber}` - Bed number (if applicable)
- `{checkInDate}` - Check-in date
- `{checkInTime}` - Check-in time (e.g., "2:00 PM")
- `{hostelPhone}` - Hostel contact number
- `{hostelEmail}` - Hostel email
- `{instructionsUrl}` - Link to check-in instructions

**Email Content**:
```
Subject: Your Room Has Been Allocated! - {hostelName}

Dear {firstName},

Great news! Your room has been allocated at {hostelName}.

--- ROOM DETAILS ---
Booking ID: {bookingId}
Hostel: {hostelName}
Room Number: {roomNumber}
Bed Number: {bedNumber}
Check-in Date: {checkInDate}
Check-in Time: {checkInTime} onwards

--- CHECK-IN INFORMATION ---
Please bring:
✓ Valid ID/Student ID
✓ This confirmation email
✓ Any documents submitted during booking

Hostel Contact:
Phone: {hostelPhone}
Email: {hostelEmail}

Check-in Instructions: {instructionsUrl}

--- HOSTEL RULES ---
- Quiet hours: 10:00 PM - 7:00 AM
- No smoking in common areas
- Respect other residents
- Report maintenance issues immediately

See you soon!

Best regards,
{hostelName} Team
```

### 6. Notification Broadcast Email

**Trigger**: Important platform announcements

**Template Variables**:
- `{firstName}` - User's first name
- `{title}` - Notification title
- `{message}` - Notification message
- `{actionUrl}` - URL to take action
- `{actionText}` - Button text

**Email Content**:
```
Subject: {title}

Hi {firstName},

{message}

[{actionText}]({actionUrl})

Best regards,
The Hostella Team
```

---

## Webhooks Specifications

### Webhook Configuration

**Endpoint**: `POST /webhooks/register`

**Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "url": "https://example.com/webhooks/hostella",
  "events": [
    "booking.created",
    "booking.payment_received",
    "booking.status_changed",
    "booking.cancelled",
    "payment.completed",
    "payment.failed",
    "room.allocated",
    "user.registered",
    "notification.sent"
  ],
  "secret": "webhook-secret-key-for-signature-verification",
  "description": "Main webhook for order processing",
  "retryPolicy": {
    "maxRetries": 5,
    "retryDelay": 60,
    "exponentialBackoff": true
  }
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "webhookId": "wh-uuid",
    "url": "https://example.com/webhooks/hostella",
    "events": ["booking.created", "booking.payment_received", ...],
    "status": "active",
    "createdAt": "2025-01-15T10:30:00Z"
  }
}
```

### Webhook Events

#### Event: booking.created

**Triggered**: When user creates a booking

**Payload**:
```json
{
  "webhookId": "wh-uuid",
  "eventId": "evt-uuid",
  "eventType": "booking.created",
  "timestamp": "2025-01-15T10:30:00Z",
  "data": {
    "bookingId": "BK-2025-001234",
    "userId": "user-uuid",
    "userName": "John Doe",
    "userEmail": "john@example.com",
    "hostelId": "hostel-uuid",
    "hostelName": "Comfort Hostel Accra",
    "roomType": "Shared Dormitory",
    "checkInDate": "2025-02-15",
    "checkOutDate": "2025-02-22",
    "numberOfNights": 7,
    "numberOfGuests": 1,
    "totalAmount": 1250.00,
    "currency": "GHC",
    "status": "pending_payment",
    "specialRequests": "High floor preferred, near window",
    "bookingUrl": "https://hostella.com/dashboard/booking/BK-2025-001234"
  }
}
```

#### Event: booking.payment_received

**Triggered**: When payment is confirmed

**Payload**:
```json
{
  "webhookId": "wh-uuid",
  "eventId": "evt-uuid",
  "eventType": "booking.payment_received",
  "timestamp": "2025-01-15T10:35:00Z",
  "data": {
    "bookingId": "BK-2025-001234",
    "paymentId": "pay-uuid",
    "userId": "user-uuid",
    "transactionId": "TXN-2025-001234",
    "amount": 1250.00,
    "currency": "GHC",
    "paymentMethod": "mobile_money",
    "paymentNetwork": "mtn",
    "status": "completed",
    "processingFee": 31.25,
    "netAmount": 1218.75,
    "processedAt": "2025-01-15T10:35:00Z",
    "receiptUrl": "https://hostella.com/receipts/pay-uuid"
  }
}
```

#### Event: booking.status_changed

**Triggered**: When booking status changes

**Payload**:
```json
{
  "webhookId": "wh-uuid",
  "eventId": "evt-uuid",
  "eventType": "booking.status_changed",
  "timestamp": "2025-01-15T11:00:00Z",
  "data": {
    "bookingId": "BK-2025-001234",
    "userId": "user-uuid",
    "previousStatus": "pending_payment",
    "newStatus": "pending_approval",
    "reason": "Payment verified successfully",
    "changedBy": "admin-uuid",
    "changedByName": "Admin User",
    "additionalInfo": {
      "estimatedAllocationTime": "24 hours",
      "nextAction": "Admin review required"
    }
  }
}
```

#### Event: room.allocated

**Triggered**: When room is allocated to user

**Payload**:
```json
{
  "webhookId": "wh-uuid",
  "eventId": "evt-uuid",
  "eventType": "room.allocated",
  "timestamp": "2025-01-16T10:30:00Z",
  "data": {
    "bookingId": "BK-2025-001234",
    "userId": "user-uuid",
    "roomId": "room-uuid",
    "roomNumber": "305",
    "bedNumber": "B2",
    "hostelId": "hostel-uuid",
    "hostelName": "Comfort Hostel Accra",
    "checkInDate": "2025-02-15",
    "checkInTime": "14:00",
    "checkOutDate": "2025-02-22",
    "checkInInstructions": "Present at reception with ID",
    "amenities": ["WiFi", "Air Conditioning", "Shared Kitchen", "Hot Water"],
    "hostelPhone": "+233 24 123 4567",
    "hostelEmail": "info@comforthostel.com"
  }
}
```

### Webhook Signature Verification

**Header Included**: `X-Hostella-Signature`

**Signature Generation** (Backend):
```javascript
const crypto = require('crypto');

const secret = webhook.secret;
const payload = JSON.stringify(webhookPayload);
const signature = crypto
  .createHmac('sha256', secret)
  .update(payload)
  .digest('hex');
```

**Verification** (Your Backend):
```javascript
const crypto = require('crypto');
const signature = req.headers['x-hostella-signature'];
const secret = process.env.WEBHOOK_SECRET;
const payload = req.rawBody; // Raw body as string

const expectedSignature = crypto
  .createHmac('sha256', secret)
  .update(payload)
  .digest('hex');

if (signature !== expectedSignature) {
  return res.status(401).json({ error: 'Invalid signature' });
}
```

### Webhook Response Requirements

**Expected Response from Your Endpoint** (200 OK):
```json
{
  "success": true,
  "eventId": "evt-uuid",
  "message": "Webhook processed successfully"
}
```

**Response Time**: Must respond within 30 seconds

**Retry Policy**:
- Retry on 5xx status codes
- Retry on network timeouts
- Exponential backoff: 1min, 2min, 4min, 8min, 16min
- Maximum 5 retry attempts
- After max retries, webhook is marked as failed

### Webhook Management

**Get Webhooks**: `GET /webhooks`

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "webhookId": "wh-uuid",
      "url": "https://example.com/webhooks/hostella",
      "events": ["booking.created", "payment.completed"],
      "status": "active",
      "lastDelivered": "2025-01-15T10:35:00Z",
      "deliveryStatus": "success",
      "failedAttempts": 0,
      "createdAt": "2025-01-15T10:30:00Z"
    }
  ]
}
```

**Update Webhook**: `PUT /webhooks/{webhookId}`

**Delete Webhook**: `DELETE /webhooks/{webhookId}`

---

## Rate Limiting Specifications

### Rate Limit Headers

**All Responses Include**:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1705334400
X-RateLimit-RetryAfter: 60
```

### Rate Limit Tiers

#### Unauthenticated Requests
- **Limit**: 20 requests per minute per IP
- **Applies to**: Public endpoints (hostel search, blog posts, FAQs)
- **Reset**: Every 60 seconds

#### Authenticated Standard Users
- **Limit**: 100 requests per minute per user
- **Applies to**: All authenticated endpoints
- **Reset**: Every 60 seconds

#### Authenticated Admin Users
- **Limit**: 500 requests per minute per user
- **Applies to**: All endpoints including admin operations
- **Reset**: Every 60 seconds

#### API Key Requests (Backend-to-Backend)
- **Limit**: 1000 requests per minute per API key
- **Applies to**: Server-to-server communications
- **Reset**: Every 60 seconds

### Endpoint-Specific Rate Limits

#### Authentication Endpoints
```
POST /auth/login - 5 requests per 15 minutes (per email)
POST /auth/register - 3 requests per hour (per IP)
POST /auth/forgot-password - 3 requests per hour (per email)
```

#### Chat Endpoints
```
POST /chat/{conversationId}/messages - 30 messages per minute
GET /chat/conversations - 60 requests per minute
```

#### Booking Endpoints
```
POST /bookings - 10 bookings per hour (per user)
PUT /bookings/{bookingId} - 20 updates per hour (per booking)
```

### Rate Limit Exceeded Response (429 Too Many Requests)

```json
{
  "success": false,
  "message": "Rate limit exceeded",
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "retryAfter": 60,
    "limit": 100,
    "remaining": 0,
    "reset": "2025-01-15T10:31:00Z"
  }
}
```

**Header**:
```
Retry-After: 60
```

### Rate Limit Implementation Strategy

**Backend Implementation**:
```javascript
// Using Redis for distributed rate limiting
const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis');
const redis = require('redis');

const client = redis.createClient({
  host: 'redis.hostella.com',
  port: 6379
});

const limiter = rateLimit({
  store: new RedisStore({
    client: client,
    prefix: 'rate-limit:'
  }),
  windowMs: 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
  skip: (req) => {
    // Skip rate limiting for admin users
    return req.user?.role === 'admin';
  }
});

app.use(limiter);
```

---

## Caching Strategies

### Cache Layers Architecture

```
Client (Browser)
    ↓
CDN Cache (Cloudflare/Vercel)
    ↓
Backend Cache (Redis)
    ↓
Database Query
```

### Frontend Caching Strategy

**Service Worker Cache** (for offline support):
```javascript
// Cache hostels and rooms for offline access
const CACHE_NAMES = {
  hostels: 'hostels-v1',
  rooms: 'rooms-v1',
  bookings: 'bookings-v1',
  images: 'images-v1'
};

const CACHE_CONFIG = {
  hostels: {
    ttl: 3600, // 1 hour
    maxAge: 86400 // 24 hours
  },
  rooms: {
    ttl: 1800, // 30 minutes
    maxAge: 86400
  },
  bookings: {
    ttl: 300, // 5 minutes (real-time data)
    maxAge: 3600
  },
  images: {
    ttl: 604800, // 7 days
    maxAge: 2592000 // 30 days
  }
};
```

### Backend Redis Caching Strategy

**Cache Keys Pattern**:
```
hostels:all:{page}:{limit} - 1 hour TTL
hostels:{hostelId} - 6 hours TTL
hostels:{hostelId}:rooms - 2 hours TTL
hostels:{hostelId}:reviews - 4 hours TTL
rooms:{roomId} - 6 hours TTL
blog:posts:{page} - 2 hours TTL
blog:post:{postId} - 6 hours TTL
gallery:{hostelId} - 4 hours TTL
testimonials:approved - 6 hours TTL
faqs - 12 hours TTL
user:{userId}:profile - 30 minutes TTL
user:{userId}:bookings - 5 minutes TTL
user:{userId}:notifications - 1 minute TTL
search:hostels:{query} - 1 hour TTL
```

### Cache Invalidation Rules

**Invalidate When**:

```javascript
// When hostel is updated
await redis.del(`hostels:${hostelId}`);
await redis.del(`hostels:all:*`); // Clear all pagination
await redis.del(`search:hostels:*`);

// When room is added/updated
await redis.del(`hostels:${hostelId}:rooms`);
await redis.del(`rooms:${roomId}`);

// When booking status changes
await redis.del(`user:${userId}:bookings`);
await redis.del(`user:${userId}:notifications`);

// When review is posted
await redis.del(`hostels:${hostelId}:reviews`);

// When blog post is published
await redis.del(`blog:posts:*`);
await redis.del(`search:hostels:*`);

// When testimonial is approved
await redis.del(`testimonials:approved`);
```

### Cache Implementation Example

**Redis Cache Layer**:
```javascript
// Get hostels with caching
const getHostels = async (page = 1, limit = 10) => {
  const cacheKey = `hostels:all:${page}:${limit}`;
  
  // Check cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Query database
  const hostels = await Hostel.find()
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
  
  // Store in cache for 1 hour
  await redis.setex(cacheKey, 3600, JSON.stringify(hostels));
  
  return hostels;
};
```

### Cache Warming Strategy

**Pre-load Popular Data**:
```javascript
// Run at server startup and periodically (every 6 hours)
const warmCache = async () => {
  console.log('Warming cache...');
  
  // Cache all hostels (first 3 pages)
  for (let page = 1; page <= 3; page++) {
    await getHostels(page, 10);
  }
  
  // Cache popular blog posts
  const popularPosts = await Blog.find({ featured: true });
  for (const post of popularPosts) {
    await redis.setex(
      `blog:post:${post.id}`,
      21600, // 6 hours
      JSON.stringify(post)
    );
  }
  
  // Cache FAQs
  const faqs = await FAQ.find();
  await redis.setex('faqs', 43200, JSON.stringify(faqs)); // 12 hours
  
  // Cache testimonials
  const testimonials = await Testimonial.find({ approved: true });
  await redis.setex(
    'testimonials:approved',
    21600,
    JSON.stringify(testimonials)
  );
  
  console.log('Cache warming completed');
};

// Schedule cache warming
schedule.scheduleJob('0 */6 * * *', warmCache); // Every 6 hours
```

### HTTP Caching Headers

**Immutable Resources** (images, static files):
```
Cache-Control: public, immutable, max-age=31536000
ETag: "unique-hash"
```

**Frequently Updated Content** (blog, testimonials):
```
Cache-Control: public, max-age=3600, stale-while-revalidate=86400
ETag: "hash-based-on-content"
Last-Modified: 2025-01-15T10:30:00Z
```

**User-Specific Content** (bookings, profile):
```
Cache-Control: private, max-age=300, must-revalidate
ETag: "user-specific-hash"
```

**Real-Time Content** (chat, notifications):
```
Cache-Control: no-cache, no-store, must-revalidate
Pragma: no-cache
Expires: 0
```

### Cache Statistics Endpoint

**Endpoint**: `GET /admin/cache/stats`

**Response**:
```json
{
  "success": true,
  "data": {
    "redisStats": {
      "connectedClients": 45,
      "usedMemory": "256MB",
      "usedMemoryPeak": "512MB",
      "totalCommandsProcessed": 1234567,
      "keysCount": 3456
    },
    "cacheHitRate": 0.87,
    "cacheMissRate": 0.13,
    "averageResponseTime": "12ms",
    "slowQueries": [
      {
        "query": "SELECT * FROM bookings WHERE userId = ?",
        "averageTime": "250ms",
        "count": 156
      }
    ],
    "topCachedKeys": [
      {
        "key": "hostels:all:1:10",
        "size": "45KB",
        "ttl": 3456,
        "hits": 5678
      }
    ]
  }
}
```

### Cache Flush Endpoint

**Endpoint**: `POST /admin/cache/flush`

**Request Body**:
```json
{
  "pattern": "*", // or specific pattern like "hostels:*"
  "async": true
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "keysDeleted": 3456,
    "flushDuration": "234ms",
    "message": "Cache flushed successfully"
  }
}
```

---

## Response Format

All API responses follow this standard format:

### Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  }
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [
    // Array of items
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

---

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    "field_name": ["Error message 1", "Error message 2"]
  }
}
```

### HTTP Status Codes
- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid authentication token
- `403 Forbidden` - User doesn't have permission
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Validation errors
- `500 Internal Server Error` - Server error

### Common Error Examples

#### Validation Error (422)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["Email is required", "Email must be valid"],
    "password": ["Password must be at least 6 characters"]
  }
}
```

#### Authentication Error (401)
```json
{
  "success": false,
  "message": "Unauthorized. Please login to continue."
}
```

#### Not Found Error (404)
```json
{
  "success": false,
  "message": "Hostel not found"
}
```

---

## Important Notes for Backend Team

1. **Authentication**: All endpoints marked with `Authorization: Bearer {token}` require JWT authentication in the Authorization header.

2. **File Uploads**: When uploading files (images, documents), use `multipart/form-data` content type.

3. **Dates**: All datetime fields should be in ISO 8601 format (e.g., `2025-01-15T10:30:00Z`).

4. **Pagination**: Implement cursor-based or offset-based pagination for all list endpoints.

5. **Rate Limiting**: Consider implementing rate limiting to prevent abuse.

6. **CORS**: Enable CORS for the frontend domain.

7. **Image URLs**: Return full URLs for all image fields, not relative paths.

8. **Search**: Implement full-text search for hostels and blogs where applicable.

9. **Validation**: Validate all inputs on the server side and return clear error messages.

10. **Status Codes**: Use appropriate HTTP status codes as documented above.

11. **Booking Status Flow**:
    - `pending_payment` → User created booking, waiting for payment
    - `pending_approval` → Payment received, waiting for admin approval
    - `approved` → Booking approved by admin
    - `room_allocated` → Room number assigned
    - `completed` → Student checked in
    - `cancelled` → Booking cancelled
    - `rejected` → Booking rejected by admin

12. **Real-time Features**: Consider implementing WebSocket or Server-Sent Events for:
    - Chat messages
    - Notifications
    - Booking status updates

13. **Email Notifications**: Send emails for:
    - Registration confirmation
    - Password reset
    - Booking confirmation
    - Payment confirmation
    - Room allocation

14. **Security**: 
    - Hash passwords using bcrypt
    - Implement CSRF protection
    - Validate file types and sizes for uploads
    - Sanitize user inputs to prevent XSS attacks
