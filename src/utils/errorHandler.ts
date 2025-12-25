/**
 * Error Handler Utilities
 * Provides helper functions for API error handling
 * Based on Student Frontend Implementation Guide v1.0.0
 */

/**
 * Handle API errors and return user-friendly messages
 * @param error - Error object from API call
 * @returns User-friendly error message
 */
export const handleApiError = (error: any): string => {
  if (error?.message) {
    // Check for known error messages
    const errorMessages: Record<string, string> = {
      'Booking is not ready for payment': 'This booking cannot be paid for at this time.',
      'Payment already exists for this booking': 'Payment has already been initiated. Please check your payment status.',
      'No payment found for this booking': 'No payment has been initiated yet.',
      'Receipt upload is only for bank transfers': 'Receipt upload is only available for bank transfer payments.',
      'Only bookings with pending payment or cancelled status can be deleted': 'This booking cannot be cancelled.',
      'Booking not found': 'Booking not found. Please check the booking ID.',
      'Unauthorized': 'You are not authorized to perform this action.',
      'Forbidden': 'You do not have permission to access this resource.',
      'Not Found': 'The requested resource was not found.',
      'Internal Server Error': 'An internal server error occurred. Please try again later.',
    };
    
    // Return mapped message if available
    if (errorMessages[error.message]) {
      return errorMessages[error.message];
    }
    
    // Return the error message as-is if it's user-friendly
    return error.message;
  }
  
  // Handle error objects with different structures
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error?.response?.data?.error) {
    return error.response.data.error;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  // Default error message
  return 'An error occurred. Please try again.';
};

/**
 * Check if error is a network error
 * @param error - Error object
 * @returns true if error is a network error
 */
export const isNetworkError = (error: any): boolean => {
  if (error?.message) {
    return error.message.includes('fetch') || 
           error.message.includes('network') || 
           error.message.includes('NetworkError');
  }
  return false;
};

/**
 * Check if error is an authentication error
 * @param error - Error object
 * @returns true if error is an authentication error
 */
export const isAuthError = (error: any): boolean => {
  if (error?.statusCode === 401 || error?.status === 401) {
    return true;
  }
  if (error?.message?.toLowerCase().includes('unauthorized') || 
      error?.message?.toLowerCase().includes('authentication')) {
    return true;
  }
  return false;
};

/**
 * Get error status code
 * @param error - Error object
 * @returns Status code or null
 */
export const getErrorStatusCode = (error: any): number | null => {
  if (error?.statusCode) {
    return error.statusCode;
  }
  if (error?.status) {
    return error.status;
  }
  if (error?.response?.status) {
    return error.response.status;
  }
  return null;
};

