import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SignupFormData } from "@/app/(auth)/validations/signupSchema";

interface User {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  token?: string;
}

interface AuthState {
  // Core state
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  // Signup (onboarding)
  signupData: Partial<SignupFormData>;
  updateSignupData: (newData: Partial<SignupFormData>) => void;
  resetSignupData: () => void;

  // Auth actions
  signIn: (credentials: { email: string; password: string }) => Promise<void>;
  signUp: (data: SignupFormData) => Promise<void>;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      signupData: {},
      updateSignupData: (newData) =>
        set((state) => ({
          signupData: { ...state.signupData, ...newData },
        })),
      resetSignupData: () => set({ signupData: {} }),

      // ---- AUTH ACTIONS ----
      signIn: async (credentials) => {
        set({ loading: true, error: null });
        try {
          // Simulate API call
          await new Promise((res) => setTimeout(res, 1000));

          const mockUser: User = {
            id: "123",
            firstName: "John",
            lastName: "Doe",
            email: credentials.email,
            token: "fake-jwt-token",
          };

          set({
            user: mockUser,
            isAuthenticated: true,
            loading: false,
            error: null,
          });
        } catch (err: unknown) {
          const message =
            err instanceof Error ? err.message : "Failed to sign in";
          set({ error: message, loading: false });
        }
      },

      signUp: async (data) => {
        set({ loading: true, error: null });
        try {
          await new Promise((res) => setTimeout(res, 1500));

          const mockUser: User = {
            id: "456",
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            token: "fake-signup-token",
          };

          set({
            user: mockUser,
            isAuthenticated: true,
            loading: false,
            error: null,
          });
        } catch (err: unknown) {
          const message =
            err instanceof Error ? err.message : "Failed to sign up";
          set({ error: message, loading: false });
        }
      },

      signOut: () => {
        set({
          user: null,
          isAuthenticated: false,
          signupData: {},
          loading: false,
          error: null,
        });
      },
    }),
    {
      name: "auth-storage", // 🗄️ Key name in localStorage
      partialize: (state) => ({
        // Only persist these keys
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
