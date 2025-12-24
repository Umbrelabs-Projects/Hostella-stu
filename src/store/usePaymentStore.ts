import { create } from 'zustand';
import { Payment } from '@/types/api';
import { paymentApi, ApiError } from '@/lib/api';

interface PaymentInitiationResult {
  payment: Payment;
  bankDetails?: import('@/types/api').BankDetails;
  isNewPayment: boolean;
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
  fetchPaymentsByBookingId: (bookingId: string | number) => Promise<void>;
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
      
      // Response structure: { success: true, data: { payment: Payment, bankDetails?: BankDetails, isNewPayment: boolean } }
      const responseData = response.data as any;
      let payment = responseData?.payment;
      const bankDetails = responseData?.bankDetails;
      const isNewPayment = responseData?.isNewPayment ?? true;
      
      // Handle legacy response structure (if payment is directly in data)
      if (!payment && responseData && typeof responseData === 'object' && 'id' in responseData) {
        payment = responseData;
      }
      
      // Payment Status Auto-Correction (per guide)
      // If payment status is AWAITING_VERIFICATION but receiptUrl is null,
      // automatically change status to INITIATED
      if (payment && 
          (payment.status === 'AWAITING_VERIFICATION' || payment.status === 'awaiting_verification') &&
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
      
      // Return payment with metadata
      return {
        payment,
        bankDetails,
        isNewPayment
      };
    } catch (error: unknown) {
      // Backend returns 200 with existing payment if payment already exists
      // Only handle actual errors (network, validation, etc.)
      set({
        error: error instanceof Error ? error.message : 'Failed to initiate payment',
        loading: false,
      });
      return null;
    }
  },

  uploadReceipt: async (paymentId, receipt) => {
    set({ loading: true, error: null });
    try {
      const formData = new FormData();
      formData.append('receipt', receipt);
      const response = await paymentApi.uploadReceipt(paymentId, formData);
      
      // Handle both nested structure (new) and flat structure (legacy) for compatibility
      // Response structure: { success: true, data: { payment: Payment } } or { success: true, data: Payment }
      let payment = (response.data as any)?.payment || response.data;
      
      // Payment Status Auto-Correction (per guide)
      // If payment status is AWAITING_VERIFICATION but receiptUrl is null,
      // automatically change status to INITIATED (shouldn't happen after upload, but defensive)
      if (payment && 
          (payment.status === 'AWAITING_VERIFICATION' || payment.status === 'awaiting_verification') &&
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
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : 'Failed to upload receipt',
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

  fetchPaymentsByBookingId: async (bookingId) => {
    set({ loading: true, error: null });
    try {
      const response = await paymentApi.getByBookingId(bookingId);
      
      // Backend returns: { success: true, data: { payment: Payment | null } }
      // Handle both nested structure (new) and flat/array structure (legacy) for compatibility
      const paymentData = response.data as any;
      let payment: Payment | null = null;
      
      if (paymentData?.payment !== undefined) {
        // New structure: { payment: Payment | null }
        payment = paymentData.payment; // Can be null if no payment exists
      } else if (Array.isArray(paymentData)) {
        // Legacy structure: Payment[]
        payment = paymentData.length > 0 ? paymentData[paymentData.length - 1] : null;
      } else if (paymentData && typeof paymentData === 'object' && 'id' in paymentData) {
        // Flat structure: Payment (direct)
        payment = paymentData as Payment;
      }
      
      // Payment Status Auto-Correction (per guide)
      // If payment status is AWAITING_VERIFICATION but receiptUrl is null,
      // automatically change status to INITIATED
      if (payment && 
          (payment.status === 'AWAITING_VERIFICATION' || payment.status === 'awaiting_verification') &&
          !payment.receiptUrl) {
        payment = {
          ...payment,
          status: 'INITIATED' as const
        };
      }
      
      // Convert single payment to array for consistency with UI
      const paymentsArray = payment ? [payment] : [];
      
      set({
        payments: paymentsArray,
        currentPayment: payment,
        loading: false,
        error: null,
      });
    } catch (error: unknown) {
      // If it's a 404, treat it as no payment found (not an error)
      if (error instanceof ApiError) {
        if (error.statusCode === 404) {
          // No payment found for this booking - this is normal, not an error
          set({
            payments: [],
            currentPayment: null,
            loading: false,
            error: null,
          });
          return;
        }
      }
      
      // For other errors, log but don't show error to user (empty state is handled in UI)
      console.warn('Failed to fetch payment for booking:', bookingId, error);
      set({
        payments: [],
        currentPayment: null,
        loading: false,
        error: null, // Don't set error - let UI show "No payment attempts" message
      });
    }
  },

  setCurrentPayment: (payment) => set({ currentPayment: payment }),

  clearError: () => set({ error: null }),
}));
