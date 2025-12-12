import { create } from 'zustand';
import { Payment } from '@/types/api';
import { paymentApi } from '@/lib/api';

interface PaymentState {
  payments: Payment[];
  currentPayment: Payment | null;
  loading: boolean;
  error: string | null;

  initiatePayment: (
    bookingId: number,
    method: 'bank' | 'momo',
    phoneNumber?: string
  ) => Promise<Payment | null>;
  uploadReceipt: (paymentId: number, receipt: File) => Promise<void>;
  verifyPayment: (paymentId: number, reference: string) => Promise<void>;
  fetchPaymentsByBookingId: (bookingId: number) => Promise<void>;
  setCurrentPayment: (payment: Payment | null) => void;
  clearError: () => void;
}

export const usePaymentStore = create<PaymentState>((set) => ({
  payments: [],
  currentPayment: null,
  loading: false,
  error: null,

  initiatePayment: async (bookingId, method, phoneNumber) => {
    set({ loading: true, error: null });
    try {
      const response = await paymentApi.initiate(bookingId, method, phoneNumber);
      set({
        currentPayment: response.data,
        loading: false,
      });
      return response.data;
    } catch (error: unknown) {
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
      set({
        currentPayment: response.data,
        loading: false,
      });
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : 'Failed to upload receipt',
        loading: false,
      });
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

  fetchPaymentsByBookingId: async (bookingId) => {
    set({ loading: true, error: null });
    try {
      const response = await paymentApi.getByBookingId(bookingId);
      set({
        payments: response.data,
        loading: false,
      });
    } catch (error: unknown) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch payments',
        loading: false,
      });
    }
  },

  setCurrentPayment: (payment) => set({ currentPayment: payment }),

  clearError: () => set({ error: null }),
}));
