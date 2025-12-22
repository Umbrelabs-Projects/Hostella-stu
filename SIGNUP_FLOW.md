# Signup Flow Documentation

## Current Frontend Flow (3 Steps)

### Step 1: Email & Password Collection
**File**: `src/app/(auth)/signup/step1/page.tsx`

**What happens:**
1. User enters:
   - Email
   - Password
   - Confirm Password
2. On submit:
   - Data is saved to `localStorage` via `updateSignupData()`
   - Toast shows: "Otp sent to your email" ⚠️ **BUT NO API CALL IS MADE**
   - User proceeds to Step 2

**Current Issue**: The frontend shows "Otp sent to your email" but doesn't actually call any API to send the OTP.

---

### Step 2: OTP Verification
**File**: `src/app/(auth)/signup/step2/page.tsx`

**What happens:**
1. User enters a 5-digit OTP code
2. On submit:
   - Currently just sets `isVerified = true` ⚠️ **NO ACTUAL VERIFICATION**
   - After 1.5 seconds, proceeds to Step 3

**Current Issue**: The OTP is never actually verified with the backend. It just marks as verified locally.

---

### Step 3: Personal Details & Final Registration
**File**: `src/app/(auth)/signup/step3/page.tsx`

**What happens:**
1. User enters:
   - First Name
   - Last Name
   - Gender (male/female)
   - Level (100/200/300/400)
   - School
   - Student ID
   - Phone
   - Admission Letter (optional file)
2. On submit:
   - Combines all data from Step 1 + Step 3
   - Calls `/auth/register` with `multipart/form-data`
   - On success: redirects to dashboard

---

## Required Backend Changes

The backend needs to support a **2-phase registration** with OTP verification:

### Phase 1: Initiate Signup & Send OTP

**New Endpoint**: `POST /auth/signup/initiate`

**Request Body**:
```json
{
  "email": "student@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "message": "OTP sent to your email",
    "sessionId": "unique-session-id", // Store this for OTP verification
    "expiresIn": 300 // OTP expires in 5 minutes
  }
}
```

**Backend Logic:**
1. Validate email format and uniqueness
2. Validate password strength (min 6 characters)
3. Check if passwords match
4. Check if email already exists (if yes, return error)
5. Generate a 5-digit OTP
6. Store OTP in cache/database with:
   - Email
   - OTP code
   - Expiration time (5 minutes)
   - Session ID
7. Send OTP via email (using your email service)
8. Return session ID (don't create user yet)

**Error Responses:**
- `400`: Email already exists
- `400`: Passwords don't match
- `400`: Invalid email format
- `400`: Password too weak
- `500`: Failed to send OTP

---

### Phase 2: Verify OTP

**New Endpoint**: `POST /auth/signup/verify-otp`

**Request Body**:
```json
{
  "email": "student@example.com",
  "otp": "12345",
  "sessionId": "unique-session-id"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "message": "OTP verified successfully",
    "verifiedSessionId": "unique-session-id", // Use this in final registration
    "expiresIn": 1800 // Session valid for 30 minutes
  }
}
```

**Backend Logic:**
1. Look up OTP by email and session ID
2. Check if OTP exists and hasn't expired
3. Verify OTP code matches
4. Mark session as verified
5. Store verified session (valid for 30 minutes)
6. Return success

**Error Responses:**
- `400`: Invalid OTP
- `400`: OTP expired
- `400`: Session not found
- `400`: OTP already used
- `429`: Too many attempts (rate limit)

---

### Phase 3: Complete Registration (Modified)

**Existing Endpoint**: `POST /auth/register` (MODIFIED)

**Request**: `multipart/form-data`
- `email` (string, required)
- `password` (string, required)
- `confirmPassword` (string, required)
- `verifiedSessionId` (string, required) ⚠️ **NEW FIELD**
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
      "studentId": "string",
      "emailVerified": true
    },
    "token": "string (JWT)"
  }
}
```

**Backend Logic:**
1. Verify `verifiedSessionId` exists and is valid
2. Verify email matches the session
3. Validate all other fields
4. Check if user already exists (shouldn't happen, but safety check)
5. Hash password
6. Create user in database
7. Upload admission letter if provided
8. Mark email as verified (since OTP was verified)
9. Generate JWT token
10. Invalidate the verified session
11. Return user and token

**Error Responses:**
- `400`: Invalid or expired verified session
- `400`: Email mismatch
- `400`: Email already registered
- `400`: Validation errors
- `500`: Registration failed

---

## Frontend Changes Required

### Step 1: Send OTP
**File**: `src/app/(auth)/signup/step1/page.tsx`

**Current Code:**
```typescript
const onSubmit = (data: Step1Data) => {
  updateSignupData(data);
  toast.info("Otp sent to your email");
  onNext();
};
```

**Should be:**
```typescript
const onSubmit = async (data: Step1Data) => {
  try {
    setLoading(true);
    const response = await authApi.initiateSignup(data);
    updateSignupData({ ...data, sessionId: response.data.sessionId });
    toast.success("OTP sent to your email");
    onNext();
  } catch (error) {
    toast.error(error.message || "Failed to send OTP");
  } finally {
    setLoading(false);
  }
};
```

---

### Step 2: Verify OTP
**File**: `src/app/(auth)/signup/step2/page.tsx`

**Current Code:**
```typescript
const onSubmit = (data: VerificationData) => {
  console.log("Verifying:", data);
  setIsVerified(true);
  setTimeout(() => onNext(), 1500);
};
```

**Should be:**
```typescript
const onSubmit = async (data: VerificationData) => {
  try {
    setLoading(true);
    const otpCode = data.otp.join("");
    const response = await authApi.verifyOtp({
      email: signupData.email,
      otp: otpCode,
      sessionId: signupData.sessionId
    });
    updateSignupData({ verifiedSessionId: response.data.verifiedSessionId });
    setIsVerified(true);
    toast.success("OTP verified successfully");
    setTimeout(() => onNext(), 1500);
  } catch (error) {
    toast.error(error.message || "Invalid OTP");
  }
};
```

---

### Step 3: Complete Registration
**File**: `src/app/(auth)/signup/step3/page.tsx`

**Current Code:**
```typescript
const fullData = {
  email: signupData.email,
  password: signupData.password,
  confirmPassword: signupData.confirmPassword,
  ...data,
};
await signUp(fullData);
```

**Should be:**
```typescript
const fullData = {
  email: signupData.email,
  password: signupData.password,
  confirmPassword: signupData.confirmPassword,
  verifiedSessionId: signupData.verifiedSessionId, // Add this
  ...data,
};
await signUp(fullData);
```

---

## API Service Updates

**File**: `src/lib/api.ts`

Add these new methods to `authApi`:

```typescript
export const authApi = {
  // ... existing methods

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

  // ... rest of methods
};
```

---

## Database/Session Storage

The backend needs to store OTP sessions. Options:

### Option 1: Redis (Recommended)
```javascript
// Store OTP
await redis.setex(
  `otp:${email}:${sessionId}`,
  300, // 5 minutes
  JSON.stringify({ otp: '12345', email, createdAt: Date.now() })
);

// Store verified session
await redis.setex(
  `verified:${sessionId}`,
  1800, // 30 minutes
  JSON.stringify({ email, verifiedAt: Date.now() })
);
```

### Option 2: Database Table
```sql
CREATE TABLE otp_sessions (
  id UUID PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  session_id VARCHAR(255) UNIQUE NOT NULL,
  otp VARCHAR(5) NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Security Considerations

1. **Rate Limiting**: Limit OTP requests per email (e.g., 3 per hour)
2. **OTP Expiration**: OTP should expire after 5 minutes
3. **Session Expiration**: Verified session should expire after 30 minutes
4. **OTP Format**: 5-digit numeric code
5. **One-Time Use**: OTP should be invalidated after successful verification
6. **Case Sensitivity**: OTP should be case-insensitive (if alphanumeric)
7. **Email Validation**: Verify email format before sending OTP

---

## Flow Diagram

```
User → Step 1 (Email/Password)
  ↓
Frontend → POST /auth/signup/initiate
  ↓
Backend → Generate OTP → Send Email → Return sessionId
  ↓
User → Step 2 (OTP Entry)
  ↓
Frontend → POST /auth/signup/verify-otp
  ↓
Backend → Verify OTP → Return verifiedSessionId
  ↓
User → Step 3 (Personal Details)
  ↓
Frontend → POST /auth/register (with verifiedSessionId)
  ↓
Backend → Verify Session → Create User → Return Token
  ↓
User → Redirected to Dashboard
```

---

## Testing Checklist

- [ ] Step 1: Email validation works
- [ ] Step 1: Password validation works
- [ ] Step 1: OTP is sent to email
- [ ] Step 1: Duplicate email is rejected
- [ ] Step 2: Valid OTP is accepted
- [ ] Step 2: Invalid OTP is rejected
- [ ] Step 2: Expired OTP is rejected
- [ ] Step 2: Rate limiting works
- [ ] Step 3: Registration completes with verified session
- [ ] Step 3: Registration fails without verified session
- [ ] Step 3: All fields are validated
- [ ] Step 3: File upload works
- [ ] Complete flow works end-to-end
