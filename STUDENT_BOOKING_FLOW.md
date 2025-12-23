# Student Booking Flow - Complete Status Journey

This document outlines the complete booking flow for students, including all statuses they will encounter from booking creation to final status.

---

## 📋 Booking Status Flow

### Status Progression

```
1. PENDING_PAYMENT (Initial)
   ↓
2. PENDING_APPROVAL (After Payment)
   ↓
3. APPROVED (Admin Approved)
   ↓
4. ROOM_ALLOCATED (Room Assigned)
   ↓
5. COMPLETED (Final Status)
```

### Alternative Paths (Can happen at any point)

```
- CANCELLED (Student or Admin cancels)
- REJECTED (Admin rejects booking)
- EXPIRED (Payment deadline passed)
```

---

## 🔄 Complete Status Definitions

### 1. **PENDING_PAYMENT** (Initial Status)
**When:** Immediately after booking creation  
**What it means:** Booking created, waiting for student to make payment  
**Student Actions:**
- Can view booking details
- Can proceed to payment
- Can cancel booking
- Cannot edit booking

**Backend Requirements:**
- Booking record created
- `paymentStatus: "pending"`
- `paymentDueDate` set (typically 7 days from creation)
- Notification sent to student

**Frontend Display:**
- Status badge: "Pending Payment" (yellow/orange)
- Action button: "Proceed to Payment"
- Warning: "Payment due by [date]"
- Cancel button available

---

### 2. **PENDING_APPROVAL** (After Payment)
**When:** Student completes payment (bank transfer receipt uploaded or MoMo verified)  
**What it means:** Payment received, waiting for admin to review and approve  
**Student Actions:**
- Can view booking details
- Can view payment receipt
- Cannot cancel (must contact admin)
- Cannot edit booking

**Backend Requirements:**
- `paymentStatus: "paid"` or `"completed"`
- Payment record linked to booking
- Admin notification sent
- Booking queued for admin review

**Frontend Display:**
- Status badge: "Pending Approval" (blue)
- Message: "Your payment has been received. Waiting for admin approval."
- No action buttons (read-only)
- Estimated approval time: "Usually within 24-48 hours"

---

### 3. **APPROVED** (Admin Approved)
**When:** Admin reviews and approves the booking  
**What it means:** Booking approved, waiting for room assignment  
**Student Actions:**
- Can view booking details
- Can see approval confirmation
- Cannot cancel (must contact admin)
- Cannot edit booking

**Backend Requirements:**
- `approvedAt` timestamp set
- `approvedBy` (admin ID) recorded
- Notification sent to student
- Booking ready for room assignment

**Frontend Display:**
- Status badge: "Approved" (green)
- Message: "Your booking has been approved! Room assignment in progress."
- Confirmation details shown
- Contact info for questions

---

### 4. **ROOM_ALLOCATED** (Room Assigned)
**When:** Admin assigns a specific room to the student  
**What it means:** Room number assigned, student can move in  
**Student Actions:**
- Can view room details
- Can see room number
- Can view move-in instructions
- Cannot cancel (must contact admin for changes)

**Backend Requirements:**
- `allocatedRoomNumber` set
- `allocatedAt` timestamp set
- Room status updated to "OCCUPIED"
- Notification sent to student with room details

**Frontend Display:**
- Status badge: "Room Allocated" (green)
- Room number prominently displayed
- Move-in date and instructions
- Hostel contact information
- Map/directions if available

---

### 5. **COMPLETED** (Final Status)
**When:** Student checks out or booking period ends  
**What it means:** Booking successfully completed  
**Student Actions:**
- Can view booking history
- Can leave review/feedback
- Cannot make changes

**Backend Requirements:**
- `completedAt` timestamp set
- Room status updated to "AVAILABLE"
- Final invoice/receipt generated
- Booking archived

**Frontend Display:**
- Status badge: "Completed" (gray/green)
- Completion date shown
- Option to leave review
- Download receipt option

---

## ❌ Cancellation & Rejection Statuses

### **CANCELLED**
**When:** 
- Student cancels before payment
- Student cancels after payment (with admin approval)
- Admin cancels due to policy violation

**What it means:** Booking is cancelled, no longer active  
**Student Actions:**
- Can view cancellation reason
- Can view refund status (if applicable)
- Cannot reactivate booking

**Backend Requirements:**
- `cancelledAt` timestamp set
- `cancelReason` recorded
- Refund processed (if applicable)
- Room released (if allocated)

**Frontend Display:**
- Status badge: "Cancelled" (red)
- Cancellation reason shown
- Refund status (if applicable)
- Date of cancellation

---

### **REJECTED**
**When:** Admin rejects the booking after review  
**What it means:** Booking was not approved  
**Student Actions:**
- Can view rejection reason
- Can contact support
- Can create new booking
- Refund processed automatically

**Backend Requirements:**
- `rejectedAt` timestamp set
- `rejectionReason` recorded
- Refund processed automatically
- Notification sent to student

**Frontend Display:**
- Status badge: "Rejected" (red)
- Rejection reason shown
- Refund information
- Support contact information

---

### **EXPIRED**
**When:** Payment deadline passes without payment  
**What it means:** Booking expired due to non-payment  
**Student Actions:**
- Can view expiration notice
- Can create new booking
- Cannot reactivate expired booking

**Backend Requirements:**
- Automatic status update when `paymentDueDate` passes
- `expiredAt` timestamp set
- Room released (if any was reserved)
- Notification sent to student

**Frontend Display:**
- Status badge: "Expired" (orange/red)
- Expiration date shown
- Message: "Payment deadline passed"
- Option to create new booking

---

## 📊 Status Summary Table

| Status | Payment Status | Admin Action Required | Student Can Cancel | Next Possible Status |
|--------|---------------|----------------------|-------------------|---------------------|
| **PENDING_PAYMENT** | pending | No | Yes | PENDING_APPROVAL, CANCELLED, EXPIRED |
| **PENDING_APPROVAL** | paid | Yes (Review) | No* | APPROVED, REJECTED |
| **APPROVED** | paid | Yes (Assign Room) | No* | ROOM_ALLOCATED, CANCELLED |
| **ROOM_ALLOCATED** | paid | No | No* | COMPLETED, CANCELLED |
| **COMPLETED** | paid | No | No | - (Final) |
| **CANCELLED** | varies | No | No | - (Final) |
| **REJECTED** | refunded | No | No | - (Final) |
| **EXPIRED** | pending | No | No | - (Final) |

*Student can request cancellation through support, but cannot self-cancel

---

## 🔔 Notification Flow

### Status Change Notifications

1. **PENDING_PAYMENT**
   - Email: "Booking Created - Payment Required"
   - In-app: Booking created notification
   - SMS (optional): Payment reminder

2. **PENDING_APPROVAL**
   - Email: "Payment Received - Under Review"
   - In-app: Payment confirmed notification

3. **APPROVED**
   - Email: "Booking Approved - Room Assignment in Progress"
   - In-app: Approval notification

4. **ROOM_ALLOCATED**
   - Email: "Room Assigned - Move-in Details"
   - In-app: Room allocation notification
   - SMS (optional): Room number and move-in date

5. **COMPLETED**
   - Email: "Booking Completed - Thank You"
   - In-app: Completion notification
   - Review request

6. **CANCELLED/REJECTED/EXPIRED**
   - Email: Status-specific notification with reason
   - In-app: Status change notification

---

## 🎯 Student Actions by Status

### PENDING_PAYMENT
- ✅ View booking details
- ✅ Proceed to payment
- ✅ Cancel booking
- ✅ Edit profile (if needed)
- ❌ Edit booking dates/details

### PENDING_APPROVAL
- ✅ View booking details
- ✅ View payment receipt
- ✅ Contact support
- ❌ Cancel booking
- ❌ Edit booking

### APPROVED
- ✅ View booking details
- ✅ View approval confirmation
- ✅ Contact support
- ❌ Cancel booking
- ❌ Edit booking

### ROOM_ALLOCATED
- ✅ View room details
- ✅ View move-in instructions
- ✅ Contact hostel
- ✅ Request changes (through support)
- ❌ Self-cancel
- ❌ Edit booking

### COMPLETED
- ✅ View booking history
- ✅ Download receipt
- ✅ Leave review
- ❌ Make changes

---

## 📝 Backend Status Enum

```typescript
enum BookingStatus {
  PENDING_PAYMENT = "PENDING_PAYMENT",
  PENDING_APPROVAL = "PENDING_APPROVAL",
  APPROVED = "APPROVED",
  ROOM_ALLOCATED = "ROOM_ALLOCATED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  REJECTED = "REJECTED",
  EXPIRED = "EXPIRED"
}
```

---

## 🔄 Status Transition Rules

### Allowed Transitions

```
PENDING_PAYMENT → PENDING_APPROVAL (when payment completed)
PENDING_PAYMENT → CANCELLED (student cancels)
PENDING_PAYMENT → EXPIRED (payment deadline passes)

PENDING_APPROVAL → APPROVED (admin approves)
PENDING_APPROVAL → REJECTED (admin rejects)

APPROVED → ROOM_ALLOCATED (admin assigns room)
APPROVED → CANCELLED (admin/student cancels)

ROOM_ALLOCATED → COMPLETED (checkout/period ends)
ROOM_ALLOCATED → CANCELLED (admin cancels)

COMPLETED → (Final, no transitions)
CANCELLED → (Final, no transitions)
REJECTED → (Final, no transitions)
EXPIRED → (Final, no transitions)
```

### Forbidden Transitions

- Cannot go backwards (e.g., APPROVED → PENDING_PAYMENT)
- Cannot skip statuses (e.g., PENDING_PAYMENT → ROOM_ALLOCATED)
- Final statuses cannot change (COMPLETED, CANCELLED, REJECTED, EXPIRED)

---

## 💰 Payment Status Correlation

| Booking Status | Payment Status | Notes |
|---------------|---------------|-------|
| PENDING_PAYMENT | pending | Waiting for payment |
| PENDING_APPROVAL | paid/completed | Payment received, under review |
| APPROVED | paid/completed | Payment confirmed |
| ROOM_ALLOCATED | paid/completed | Payment confirmed |
| COMPLETED | paid/completed | Payment confirmed |
| CANCELLED | varies | May be pending or refunded |
| REJECTED | refunded | Automatic refund |
| EXPIRED | pending | No payment made |

---

## 🎨 Frontend Status Badge Colors

| Status | Color | Icon |
|--------|-------|------|
| PENDING_PAYMENT | Yellow/Orange | Clock |
| PENDING_APPROVAL | Blue | Hourglass |
| APPROVED | Green | Check Circle |
| ROOM_ALLOCATED | Green | Home |
| COMPLETED | Gray/Green | Check |
| CANCELLED | Red | X Circle |
| REJECTED | Red | X |
| EXPIRED | Orange | Clock Alert |

---

## 📱 API Response Format

### Booking Object with Status

```json
{
  "id": "booking123",
  "bookingId": "BK-1234",
  "status": "PENDING_PAYMENT",
  "paymentStatus": "pending",
  "paymentDueDate": "2025-01-17T10:00:00Z",
  "hostelName": "Lienda Ville",
  "roomTitle": "One-in-one",
  "price": "2500",
  "allocatedRoomNumber": null,
  "date": "2025-01-10T10:00:00Z",
  "createdAt": "2025-01-10T10:00:00Z",
  "updatedAt": "2025-01-10T10:00:00Z"
}
```

---

## ✅ Summary

**Normal Flow:**
1. Student creates booking → `PENDING_PAYMENT`
2. Student pays → `PENDING_APPROVAL`
3. Admin approves → `APPROVED`
4. Admin assigns room → `ROOM_ALLOCATED`
5. Student checks out → `COMPLETED`

**Alternative Flows:**
- Cancellation at any point (except final statuses)
- Rejection after payment review
- Expiration if payment not made

**Key Points:**
- Status progression is linear (cannot skip or go backwards)
- Final statuses are immutable
- Payment status correlates with booking status
- Notifications sent at each status change
- Student actions vary by status

---

**Last Updated:** January 2025

