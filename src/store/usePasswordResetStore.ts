import { create } from 'zustand';
import { authApi } from '@/lib/api';

interface PasswordResetState {
  email: string;
  code: string;
  loading: boolean;
  error: string | null;
  step: 'email' | 'code' | 'password' | 'success';
  
  setEmail: (email: string) => void;
  setCode: (code: string) => void;
  setStep: (step: 'email' | 'code' | 'password' | 'success') => void;
  
  sendResetCode: (email: string) => Promise<boolean>;
  verifyCode: (email: string, code: string) => Promise<boolean>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<boolean>;
  
  reset: () => void;
  clearError: () => void;
}

export const usePasswordResetStore = create<PasswordResetState>((set, get) => ({
  email: '',
  code: '',
  loading: false,
  error: null,
  step: 'email',
  
  setEmail: (email) => set({ email }),
  setCode: (code) => set({ code }),
  setStep: (step) => set({ step }),
  
  sendResetCode: async (email) => {
    set({ loading: true, error: null });
    try {
      await authApi.forgotPassword(email);
      set({ email, step: 'code', loading: false });
      return true;
    } catch (error: any) {
      set({
        error: error.message || 'Failed to send reset code',
        loading: false,
      });
      return false;
    }
  },
  
  verifyCode: async (email, code) => {
    set({ loading: true, error: null });
    try {
      await authApi.verifyResetCode(email, code);
      set({ code, step: 'password', loading: false });
      return true;
    } catch (error: any) {
      set({
        error: error.message || 'Invalid verification code',
        loading: false,
      });
      return false;
    }
  },
  
  resetPassword: async (email, code, newPassword) => {
    set({ loading: true, error: null });
    try {
      await authApi.resetPassword(email, code, newPassword);
      set({ step: 'success', loading: false });
      return true;
    } catch (error: any) {
      set({
        error: error.message || 'Failed to reset password',
        loading: false,
      });
      return false;
    }
  },
  
  reset: () => set({
    email: '',
    code: '',
    loading: false,
    error: null,
    step: 'email',
  }),
  
  clearError: () => set({ error: null }),
}));
