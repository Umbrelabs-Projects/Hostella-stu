# Currency Policy - Hostella Platform

**Effective Date**: December 10, 2025  
**Currency**: Ghana Cedis (GHC / ₵)

---

## 📋 Overview

All monetary amounts, prices, and payments on the Hostella platform are conducted exclusively in **Ghana Cedis (GHC)**, the official currency of the Republic of Ghana.

- **Currency Code**: GHC
- **Currency Symbol**: ₵
- **Decimal Places**: 2
- **Example**: ₵2,500.00 or GHC 2,500

---

## 💰 Where Currency is Used

### 1. Room Pricing
All hostel room prices are displayed and managed in GHC:

```javascript
// Example room price
{
  id: 1,
  title: "One-in-One",
  price: "GHC 2,500",      // Ghana Cedis
  description: "Private room"
}
```

### 2. Booking Amounts
When a student books a room, the total booking amount is in GHC:

```javascript
// Booking data
{
  bookingId: "BK12345678",
  roomTitle: "Two-in-One",
  price: "GHC 2,500",       // Ghana Cedis
  hostelName: "Lienda Ville"
}
```

### 3. Payment Processing
All payments (Bank Transfer, Mobile Money) are processed in GHC:

```javascript
// Payment record
{
  id: 1,
  bookingId: 1,
  amount: 2500,              // In GHC
  method: "momo",
  status: "completed",
  reference: "PAY123456"
}
```

### 4. Transaction History
All transaction records maintain amounts in GHC:

```javascript
// Transaction
{
  id: 1,
  type: "booking_payment",
  amount: 2500,              // Ghana Cedis
  transactionDate: "2025-12-10",
  status: "successful"
}
```

---

## 🛠️ Technical Implementation

### API Documentation
- Base URL: `https://example-prod.up.railway.app/api/v1`
- **Currency Declaration**: All prices and amounts are in Ghana Cedis (GHC)
- All payment endpoints handle amounts in GHC

### Frontend Display
Room cards display prices as:
```
GHC 2,500
```

Booking details show:
```
Total Amount: GHC 2,500
Payment Method: Mobile Money
Network: MTN Ghana
```

### Database Storage
- Prices stored as integers (minor units) or decimals (2dp) in GHC; prefer integers in minor units to avoid floating errors
- Currency context provided through API documentation and frontend labels

### Type Definitions
```typescript
// src/types/api.ts
// IMPORTANT: All prices and monetary amounts are in Ghana Cedis (GHC)

interface Room {
  price: string | number;  // In Ghana Cedis (transport as number)
}

interface Booking {
  totalAmount?: number;    // In Ghana Cedis (transport as number)
}

interface Payment {
  amount: number;          // In Ghana Cedis (transport as number)
}
```

---

## 💳 Payment Methods (All in GHC)

### 1. Mobile Money
Supported networks for GHC payments:
- **MTN Ghana** - MTN Mobile Money
- **Telecel Ghana** - Telecel Cash
- **AirtelTigo Ghana** - Airteltigo Money

Example:
```
Amount: GHC 2,500
Network: MTN Ghana
Phone Number: 024XXXXXXX
Status: Pending verification
```

### 2. Bank Transfer
For GHC bank transfers:
- Amount in GHC: 2,500
- Receipt verification required
- Bank details provided to user

---

## 📋 Pricing Examples

### Room Pricing (Monthly)
| Room Type | Price |
|-----------|-------|
| One-in-One (Single) | GHC 2,500 |
| Two-in-One (Double) | GHC 2,500 |
| Four-in-One (Shared) | GHC 1,500 - 2,000 |

**Note**: These are example prices and may vary by hostel and availability.

---

## 🔄 Conversion Reference

For backend developers working with international systems:
- 1 GHC = ~0.082 USD (approximate, rates vary)
- Exchange rates are **NOT** managed by this system
- All calculations are in GHC only

---

## ⚠️ Important Notes for Developers

### 1. API Consistency
- All API responses return amounts in GHC (whole numbers)
- No automatic conversion is performed
- Currency symbol (₵) is added by frontend only

### 2. Formatting
- UI displays: "GHC 2,500"
- Database stores: 2500 (number)
- API returns: 2500 (number)

### 3. Validation
- Accept amounts in GHC format
- Validate that amounts are positive numbers
- Reject amounts in other currencies

### 4. Documentation
- All API endpoints document amounts as GHC
- Payment endpoints clearly state GHC currency
- Type definitions include GHC note

---

## 📚 Related Documentation

- **API_DOCUMENTATION.md** - All payment endpoints in GHC
- **README.md** - Tech stack includes currency info
- **src/types/api.ts** - Type definitions with GHC note
- **src/lib/constants.tsx** - Sample prices in GHC

---

## ✅ Checklist for Backend Developer

When implementing payment APIs:
- ✅ All amounts in Ghana Cedis
- ✅ Accept numeric amounts (e.g., 2500 for GHC 2,500)
- ✅ Validate against hostel pricing
- ✅ Store amounts as numbers in database
- ✅ Return amounts in GHC in API responses
- ✅ Document all endpoints with GHC specification
- ✅ Validate payment methods support GHC
- ✅ Test with realistic GHC amounts

---

## 🔗 Resources

- **Ghana Cedis on Wikipedia**: Information about GHC
- **Bank of Ghana**: Official currency information
- **Hostel Pricing Database**: Room prices maintained in system

---

**Prepared By**: Development Team  
**Last Updated**: December 10, 2025  
**Status**: Active & In Use
