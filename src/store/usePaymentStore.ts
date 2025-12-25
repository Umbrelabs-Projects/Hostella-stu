import { create } from 'zustand';
import { Payment } from '@/types/api';
import { paymentApi, ApiError } from '@/lib/api';

interface PaymentInitiationResult {
  payment: Payment;
  bankDetails?: import('@/types/api').BankDetails;
  authorizationUrl?: string; // For Paystack redirect
  isNewPayment: boolean;
  message?: string;
}

interface PaymentState {
  payments: Payment[];
  currentPayment: Payment | null;
  loading: boolean;
  error: string | null;

  initiatePayment: (
    bookingId: string | number,
    provider: 'BANK_TRANSFER' | 'PAYSTACK',
    payerPhone?: string
  ) => Promise<PaymentInitiationResult | null>;
  uploadReceipt: (paymentId: string | number, receipt: File) => Promise<void>;
  verifyPayment: (paymentId: string | number, reference: string) => Promise<void>;
  verifyPaymentByReference: (reference: string) => Promise<Payment | null>;
  fetchPaymentsByBookingId: (bookingId: string | number, silent?: boolean) => Promise<void>;
  setCurrentPayment: (payment: Payment | null) => void;
  clearError: () => void;
}

export const usePaymentStore = create<PaymentState>((set) => ({
  payments: [],
  currentPayment: null,
  loading: false,
  error: null,

  initiatePayment: async (bookingId, provider, payerPhone) => {
    set({ loading: true, error: null });
    try {
      // ⚠️ CRITICAL: This endpoint CREATES a payment record
      // Only call this when user explicitly clicks "Proceed to Payment" button
      // DO NOT call this automatically on page load
      const response = await paymentApi.initiate(bookingId, provider, payerPhone);
      
      // Response structure: { success: true, data: { payment: Payment, bankDetails?: BankDetails, authorizationUrl?: string, isNewPayment: boolean, message: string } }
      const responseData = response.data as any;
      let payment = responseData?.payment;
      const bankDetails = responseData?.bankDetails;
      const authorizationUrl = responseData?.authorizationUrl;
      const isNewPayment = responseData?.isNewPayment ?? true;
      const message = responseData?.message;
      
      // Handle legacy response structure (if payment is directly in data)
      if (!payment && responseData && typeof responseData === 'object' && 'id' in responseData) {
        payment = responseData;
      }
      
      // Payment Status Auto-Correction (per guide)
      // If payment status is AWAITING_VERIFICATION but receiptUrl is null,
      // automatically change status to INITIATED
      if (payment && 
          payment.status === 'AWAITING_VERIFICATION' &&
          !payment.receiptUrl) {
        payment = {
          ...payment,
          status: 'INITIATED' as const
        };
      }
      
      // Attach bankDetails to payment object for easy access in components
      if (payment && bankDetails) {
        payment = {
          ...payment,
          bankDetails: bankDetails as any,
        };
      }
      
      set({
        currentPayment: payment,
        loading: false,
        error: null,
      });
      
      // Handle Paystack redirect
      if (provider === 'PAYSTACK' && authorizationUrl) {
        window.location.href = authorizationUrl;
        return null; // Don't return data if redirecting
      }
      
      // Return payment with metadata
      return {
        payment,
        bankDetails,
        authorizationUrl,
        isNewPayment,
        message
      };
    } catch (error: unknown) {
      // Handle different error types with user-friendly messages
      let errorMessage = 'Failed to initiate payment. Please try again.';
      
      if (error instanceof ApiError) {
        // Handle specific status codes
        switch (error.statusCode) {
          case 400:
            errorMessage = error.message || 'Invalid booking or payment details. Please check and try again.';
            break;
          case 401:
            errorMessage = 'Authentication required. Please log in again.';
            break;
          case 403:
            errorMessage = 'You do not have permission to initiate this payment.';
            break;
          case 404:
            errorMessage = 'Booking not found. Please refresh and try again.';
            break;
          case 409:
            // Payment might already exist
            errorMessage = 'Payment already exists for this booking.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage = error.message || `Payment initiation failed (${error.statusCode}). Please try again.`;
        }
      } else if (error instanceof Error) {
        // Handle network errors or other errors
        if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else if (error.message.includes('JSON') || error.message.includes('non-JSON')) {
          errorMessage = 'Server returned an invalid response. Please try again or contact support.';
        } else {
          errorMessage = error.message || 'Failed to initiate payment. Please try again.';
        }
      }
      
      set({
        error: errorMessage,
        loading: false,
      });
      
      // Re-throw error so component can handle it if needed
      throw new Error(errorMessage);
    }
  },

  uploadReceipt: async (paymentId, receipt) => {
    set({ loading: true, error: null });
    try {
      // Ensure receipt is a File object
      if (!(receipt instanceof File)) {
        throw new Error('Invalid file. Please select a valid image file.');
      }
      
      const formData = new FormData();
      formData.append('receipt', receipt);
      
      console.log('Uploading receipt:', {
        paymentId,
        fileName: receipt.name,
        fileSize: receipt.size,
        fileType: receipt.type,
      });
      
      const response = await paymentApi.uploadReceipt(paymentId, formData);
      
      // Response structure: { success: true, data: { payment: Payment, message: string } }
      const responseData = response.data as any;
      let payment = responseData?.payment || response.data;
      const message = responseData?.message;
      
      // Payment Status Auto-Correction (per guide)
      // If payment status is AWAITING_VERIFICATION but receiptUrl is null,
      // automatically change status to INITIATED (shouldn't happen after upload, but defensive)
      if (payment && 
          payment.status === 'AWAITING_VERIFICATION' &&
          !payment.receiptUrl) {
        payment = {
          ...payment,
          status: 'INITIATED' as const
        };
      }
      
      set({
        currentPayment: payment,
        loading: false,
        error: null,
      });
      
      if (message) {
        console.log('Upload success message:', message);
      }
    } catch (error: unknown) {
      console.error('Receipt upload error:', {
        error,
        paymentId,
        errorType: error instanceof Error ? error.constructor.name : typeof error,
        errorMessage: error instanceof Error ? error.message : String(error),
      });
      
      let errorMessage = 'Failed to upload receipt. Please try again.';
      
      if (error instanceof ApiError) {
        switch (error.statusCode) {
          case 400:
            errorMessage = error.message || 'Invalid file format or size. Please check and try again.';
            break;
          case 401:
            errorMessage = 'Authentication required. Please log in again.';
            break;
          case 403:
            errorMessage = 'You do not have permission to upload receipt for this payment.';
            break;
          case 404:
            errorMessage = 'Payment not found. Please refresh and try again.';
            break;
          case 413:
            errorMessage = 'File too large. Maximum size is 5MB.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          default:
            errorMessage = error.message || `Upload failed (${error.statusCode}). Please try again.`;
        }
      } else if (error instanceof Error) {
        if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.';
        } else if (error.message.includes('JSON') || error.message.includes('non-JSON')) {
          errorMessage = 'Server returned an invalid response. The endpoint might be incorrect.';
        } else {
          errorMessage = error.message;
        }
      }
      
      set({
        error: errorMessage,
        loading: false,
      });
      throw error; // Re-throw so component can handle it
    }
  },

  verifyPayment: async (paymentId, reference) => {
    set({ loading: true, error: null });
    try {
      const response = await paymentApi.verify(paymentId, reference);
      set({
        currentPayment: response.data,
        loading: false,
      });
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : 'Failed to verify payment',
        loading: false,
      });
    }
  },

  // Verify payment by reference (for Paystack payments)
  // Uses GET /api/v1/payments/verify/:reference endpoint
  verifyPaymentByReference: async (reference) => {
    set({ loading: true, error: null });
    try {
      const response = await paymentApi.verifyByReference(reference);
      set({
        currentPayment: response.data,
        loading: false,
        error: null,
      });
      return response.data;
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : 'Failed to verify payment',
        loading: false,
      });
      return null;
    }
  },

  fetchPaymentsByBookingId: async (bookingId, silent = false) => {
    // Prevent duplicate requests - if already loading, skip
    const state = usePaymentStore.getState();
    if (state.loading && !silent) {
      return; // Already fetching, skip duplicate request
    }
    
    // Only set loading for non-silent requests (initial fetches)
    if (!silent) {
      set({ loading: true, error: null });
    }
    try {
      const response = await paymentApi.getByBookingId(bookingId);
      
      // Response structure: { success: true, data: Payment } (per guide)
      // Handle both nested structure (legacy) and flat structure (new) for compatibility
      const paymentData = response.data as any;
      let payment: Payment | null = null;
      
      if (paymentData?.payment !== undefined) {
        // Legacy nested structure: { payment: Payment | null }
        payment = paymentData.payment;
      } else if (Array.isArray(paymentData)) {
        // Legacy array structure: Payment[]
        payment = paymentData.length > 0 ? paymentData[paymentData.length - 1] : null;
      } else if (paymentData && typeof paymentData === 'object' && 'id' in paymentData) {
        // New flat structure: Payment (direct) - per guide
        payment = paymentData as Payment;
      }
      
      // Payment Status Auto-Correction (per guide)
      // If payment status is AWAITING_VERIFICATION but receiptUrl is null,
      // automatically change status to INITIATED
      if (payment && 
          payment.status === 'AWAITING_VERIFICATION' &&
          !payment.receiptUrl) {
        payment = {
          ...payment,
          status: 'INITIATED' as const
        };
      }
      
      // Convert single payment to array for consistency with UI
      const paymentsArray = payment ? [payment] : [];
      
      // Update state - only set loading to false if it was set to true (non-silent mode)
      if (silent) {
        // Silent mode: update data without changing loading state
        set({
          payments: paymentsArray,
          currentPayment: payment,
          error: null,
        });
      } else {
        // Normal mode: update data and set loading to false
        set({
          payments: paymentsArray,
          currentPayment: payment,
          loading: false,
          error: null,
        });
      }
    } catch (error: unknown) {
      // If it's a 404, treat it as no payment found (not an error)
      if (error instanceof ApiError) {
        if (error.statusCode === 404) {
          // No payment found for this booking - this is normal, not an error
          if (silent) {
            set({
              payments: [],
              currentPayment: null,
              error: null,
            });
          } else {
            set({
              payments: [],
              currentPayment: null,
              loading: false,
              error: null,
            });
          }
          return;
        }
      }
      
      // For other errors, log but don't show error to user (empty state is handled in UI)
      console.warn('Failed to fetch payment for booking:', bookingId, error);
      if (silent) {
        // Silent mode: don't update loading state
        set({
          payments: [],
          currentPayment: null,
          error: null, // Don't set error - let UI show "No payment attempts" message
        });
      } else {
        set({
          payments: [],
          currentPayment: null,
          loading: false,
          error: null, // Don't set error - let UI show "No payment attempts" message
        });
      }
    }
  },

  setCurrentPayment: (payment) => set({ currentPayment: payment }),

  clearError: () => set({ error: null }),
}));
