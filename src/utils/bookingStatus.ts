/**
 * Booking Status Utilities
 * Provides helper functions for booking and payment status management
 * Based on Student Frontend Implementation Guide v1.0.0
 */

export interface BookingStatusInfo {
  label: string;
  color: 'orange' | 'blue' | 'green' | 'red' | 'gray';
  message: string;
  canCancel: boolean;
  canEdit: boolean;
}

export interface PaymentStatusInfo {
  label: string;
  color: 'blue' | 'orange' | 'green' | 'red' | 'gray';
  message: string;
}

/**
 * Get booking status information
 * @param status - Booking status (lowercase with spaces, e.g., "pending payment")
 * @returns Status information object
 */
export const getBookingStatusInfo = (status: string): BookingStatusInfo => {
  // Normalize status to lowercase with spaces
  const normalizedStatus = status.toLowerCase().replace(/_/g, ' ');
  
  const statusMap: Record<string, BookingStatusInfo> = {
    'pending payment': {
      label: 'Pending Payment',
      color: 'orange',
      message: 'Please proceed to payment to confirm your booking.',
      canCancel: true,
      canEdit: false,
    },
    'pending approval': {
      label: 'Pending Approval',
      color: 'blue',
      message: 'Payment confirmed. Waiting for admin approval.',
      canCancel: false,
      canEdit: false,
    },
    'approved': {
      label: 'Approved',
      color: 'green',
      message: 'Booking approved. Waiting for room assignment.',
      canCancel: false,
      canEdit: false,
    },
    'room_allocated': {
      label: 'Room Allocated',
      color: 'green',
      message: 'Room assigned. You are now a member!',
      canCancel: false,
      canEdit: false,
    },
    'room allocated': {
      label: 'Room Allocated',
      color: 'green',
      message: 'Room assigned. You are now a member!',
      canCancel: false,
      canEdit: false,
    },
    'cancelled': {
      label: 'Cancelled',
      color: 'red',
      message: 'This booking has been cancelled.',
      canCancel: true, // Can delete
      canEdit: false,
    },
    'rejected': {
      label: 'Rejected',
      color: 'red',
      message: 'This booking has been rejected.',
      canCancel: false,
      canEdit: false,
    },
    'expired': {
      label: 'Expired',
      color: 'gray',
      message: 'This booking has expired.',
      canCancel: false,
      canEdit: false,
    },
  };
  
  return statusMap[normalizedStatus] || {
    label: status,
    color: 'gray',
    message: 'Unknown status',
    canCancel: false,
    canEdit: false,
  };
};

/**
 * Get payment status information
 * @param status - Payment status (e.g., "INITIATED", "AWAITING_VERIFICATION")
 * @returns Payment status information object
 */
export const getPaymentStatusInfo = (status: string): PaymentStatusInfo => {
  const normalizedStatus = status.toUpperCase();
  
  const statusMap: Record<string, PaymentStatusInfo> = {
    'INITIATED': {
      label: 'Payment Initiated',
      color: 'blue',
      message: 'Payment has been initiated. Please complete the payment.',
    },
    'AWAITING_VERIFICATION': {
      label: 'Awaiting Verification',
      color: 'orange',
      message: 'Receipt uploaded. Admin will verify it shortly.',
    },
    'CONFIRMED': {
      label: 'Payment Confirmed',
      color: 'green',
      message: 'Payment has been confirmed.',
    },
    'FAILED': {
      label: 'Payment Failed',
      color: 'red',
      message: 'Payment failed. Please try again.',
    },
    'REFUNDED': {
      label: 'Refunded',
      color: 'gray',
      message: 'Payment has been refunded.',
    },
  };
  
  return statusMap[normalizedStatus] || {
    label: status,
    color: 'gray',
    message: 'Unknown payment status',
  };
};

/**
 * Normalize booking status to lowercase with spaces
 * @param status - Booking status (can be in various formats)
 * @returns Normalized status string
 */
export const normalizeBookingStatus = (status: string): string => {
  return status.toLowerCase().replace(/_/g, ' ');
};

/**
 * Check if booking can be cancelled
 * @param status - Booking status
 * @returns true if booking can be cancelled
 */
export const canCancelBooking = (status: string): boolean => {
  const statusInfo = getBookingStatusInfo(status);
  return statusInfo.canCancel;
};

/**
 * Check if booking can be edited
 * @param status - Booking status
 * @returns true if booking can be edited
 */
export const canEditBooking = (status: string): boolean => {
  const statusInfo = getBookingStatusInfo(status);
  return statusInfo.canEdit;
};

