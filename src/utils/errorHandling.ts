import { toast } from 'sonner';

/**
 * Error handling utilities matching the guide patterns
 */

/**
 * Handle payment-related errors with appropriate user messages
 */
export const handlePaymentError = (error: unknown): void => {
  const errorMessage = error instanceof Error ? error.message : 'An error occurred';
  
  // Payment deadline passed
  if (errorMessage.toLowerCase().includes('deadline')) {
    toast.error('Payment deadline has passed. Please create a new booking.');
    return;
  }
  
  // Room already assigned
  if (errorMessage.toLowerCase().includes('already assigned')) {
    toast.error('This booking already has a room assigned.');
    return;
  }
  
  // Payment already initiated
  if (errorMessage.toLowerCase().includes('already initiated') || 
      errorMessage.toLowerCase().includes('already exists')) {
    toast.info('Payment already initiated. Please check payment status.');
    return;
  }
  
  // Invalid room type
  if (errorMessage.toLowerCase().includes('room type mismatch')) {
    toast.error('Selected room type does not match your booking.');
    return;
  }
  
  // Generic payment error
  toast.error(errorMessage || 'Failed to process payment. Please try again.');
};

/**
 * Handle booking-related errors with appropriate user messages
 */
export const handleBookingError = (error: unknown): void => {
  const errorMessage = error instanceof Error ? error.message : 'An error occurred';
  
  // Booking not found
  if (errorMessage.toLowerCase().includes('not found')) {
    toast.error('Booking not found. Please check your booking ID.');
    return;
  }
  
  // Booking already exists
  if (errorMessage.toLowerCase().includes('already exists')) {
    toast.info('You already have an active booking for this hostel.');
    return;
  }
  
  // Generic booking error
  toast.error(errorMessage || 'Failed to process booking. Please try again.');
};

/**
 * Handle API errors with appropriate user messages
 */
export const handleApiError = (error: unknown, defaultMessage: string = 'An error occurred'): void => {
  const errorMessage = error instanceof Error ? error.message : defaultMessage;
  
  // Network errors
  if (errorMessage.toLowerCase().includes('network') || 
      errorMessage.toLowerCase().includes('fetch')) {
    toast.error('Network error. Please check your connection and try again.');
    return;
  }
  
  // Authentication errors
  if (errorMessage.toLowerCase().includes('unauthorized') ||
      errorMessage.toLowerCase().includes('authentication')) {
    toast.error('Session expired. Please log in again.');
    return;
  }
  
  // Generic error
  toast.error(errorMessage || defaultMessage);
};

