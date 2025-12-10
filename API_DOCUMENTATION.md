# Hostella API Documentation for Backend Team

**Base URL**: `https://www.hostella.render.com/api/v1`  
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
15. [Response Format](#response-format)
16. [Error Handling](#error-handling)

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
