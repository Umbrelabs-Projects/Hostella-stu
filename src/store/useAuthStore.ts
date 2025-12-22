// /store/useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { setAuthToken, apiFetch } from "@/lib/api";
import { FullSignUpData } from "@/app/(auth)/validations/signUpSchema";
import { SignInFormData } from "@/app/(auth)/validations/signInSchema";
import { ExtraDetailsFormValues } from "@/app/dashboard/home/extra-booking-details/schemas/booking";

function generateBookingId() {
  const randomNum = Math.floor(10000000 + Math.random() * 90000000);
  return `BK${randomNum}`;
}

// Helper to set auth cookie for middleware
function setAuthCookie(token: string | null) {
  if (typeof window !== 'undefined') {
    if (token) {
      document.cookie = `auth-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}`; // 7 days
    } else {
      // Clear cookie with multiple attempts to ensure it's deleted
      const pastDate = 'Thu, 01 Jan 1970 00:00:01 GMT';
      document.cookie = `auth-token=; path=/; expires=${pastDate}`;
      document.cookie = `auth-token=; path=/; domain=${window.location.hostname}; expires=${pastDate}`;
      document.cookie = `auth-token=; path=/; expires=${pastDate}; SameSite=Lax`;
    }
  }
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
  hasHealthCondition?: boolean;
  healthCondition?: string;
  bloodType?: string;
  allergies?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  signupData: Partial<FullSignUpData>;
  extraBookingDetails: Partial<ExtraDetailsFormValues>;

  updateSignupData: (newData: Partial<FullSignUpData>) => void;
  resetSignupData: () => void;
  clearSignupProgress: () => void;

  updateExtraBookingDetails: (data: Partial<ExtraDetailsFormValues>) => void;
  resetExtraBookingDetails: () => void;

  signIn: (data: SignInFormData) => Promise<void>;
  signUp: (data: FullSignUpData) => Promise<void>;
  signOut: () => Promise<void>;
  restoreSession: () => Promise<void>;
  fetchProfile: () => Promise<void>;

  // newly added
  updateProfile: (updates: FormData) => Promise<void>;
  updatePassword: (payload: {
    currentPassword: string;
    newPassword: string;
  }) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,
      signupData: {},
      extraBookingDetails: {},

      // --- Signup Handlers ---
      updateSignupData: (newData) =>
        set((state) => {
          const updated = { ...state.signupData, ...newData };
          localStorage.setItem("signup-data", JSON.stringify(updated));
          return { signupData: updated };
        }),
      resetSignupData: () => {
        localStorage.removeItem("signup-data");
        return set({ signupData: {} });
      },
      clearSignupProgress: () => {
        localStorage.removeItem("signup-step");
        localStorage.removeItem("signup-data");
        set({ signupData: {} });
      },

      fetchProfile: async () => {
        set({ loading: true, error: null });
        try {
          const res = await apiFetch<{ success: boolean; data: User }>(
            "/auth/me"
          );
          set({ user: res.data, loading: false });
        } catch (err: unknown) {
          const errorMessage =
            err instanceof Error ? err.message : "Profile fetch failed";
          set({ error: errorMessage, loading: false });
          throw err;
        }
      },

      // --- Extra Booking Details ---
      updateExtraBookingDetails: (data) =>
        set((state) => {
          const bookingId =
            state.extraBookingDetails.bookingId || generateBookingId();
          const updated = { ...state.extraBookingDetails, ...data, bookingId };
          localStorage.setItem(
            "extra-booking-details",
            JSON.stringify(updated)
          );
          return { extraBookingDetails: updated };
        }),
      resetExtraBookingDetails: () => {
        localStorage.removeItem("extra-booking-details");
        return set({ extraBookingDetails: {} });
      },

      // --- Auth Logic ---
      signIn: async (data) => {
        set({ loading: true, error: null });
        try {
          const res = await apiFetch<{ success: boolean; data: { user: User; token: string } }>(
            "/auth/login",
            {
              method: "POST",
              body: JSON.stringify(data),
            }
          );
          const token = res.data.token;
          setAuthToken(token);
          setAuthCookie(token);
          set({ user: res.data.user, token, loading: false });
        } catch (err: unknown) {
          const errorMessage =
            err instanceof Error ? err.message : "SignIn failed";
          set({ error: errorMessage, loading: false });
          throw err;
        }
      },

      signUp: async (data) => {
        set({ loading: true, error: null });
        try {
          const formData = new FormData();
          Object.entries(data).forEach(([key, value]) => {
            if (value instanceof FileList) formData.append(key, value[0]);
            else if (value instanceof File) formData.append(key, value);
            else if (value != null) formData.append(key, String(value));
          });

          const res = await apiFetch<{ success: boolean; data: { user: User; token: string } }>(
            "/auth/register",
            {
              method: "POST",
              body: formData,
            }
          );

          const token = res.data.token;
          setAuthToken(token);
          setAuthCookie(token);
          set({ user: res.data.user, token, loading: false });
          get().clearSignupProgress();
        } catch (err: unknown) {
          const errorMessage =
            err instanceof Error ? err.message : "SignUp failed";
          set({ error: errorMessage, loading: false });
          throw err;
        }
      },

      // --- Profile Update ---
      updateProfile: async (formData) => {
        set({ loading: true, error: null });
        try {
          const res = await apiFetch<ApiResponse<User>>("/auth/profile", {
            method: "PUT",
            body: formData,
          });
          set({ user: res.data, loading: false });
        } catch (err: unknown) {
          const errorMessage =
            err instanceof Error ? err.message : "Profile update failed";
          set({ error: errorMessage, loading: false });
          throw err;
        }
      },

      // --- Password Update ---
      updatePassword: async (payload) => {
        set({ loading: true, error: null });
        try {
          await apiFetch("/auth/password", {
            method: "POST",
            body: JSON.stringify(payload),
          });
          set({ loading: false });
        } catch (err: unknown) {
          const errorMessage =
            err instanceof Error ? err.message : "Password update failed";
          set({ error: errorMessage, loading: false });
          throw err;
        }
      },

      signOut: async () => {
        try {
          await apiFetch("/auth/logout", { method: "POST" });
        } catch {
          // Ignore logout errors - still clear local state
        } finally {
          // Clear all authentication data
          setAuthToken(null);
          setAuthCookie(null);
          
          // Clear Zustand store state
          set({ user: null, token: null, error: null });
          
          // Clear all localStorage items related to auth
          localStorage.removeItem("auth-storage");
          localStorage.removeItem("signup-data");
          localStorage.removeItem("signup-step");
          localStorage.removeItem("extra-booking-details");
          
          // Clear signup progress and extra booking details from store
          get().clearSignupProgress();
          get().resetExtraBookingDetails();
        }
      },

      restoreSession: async () => {
        set({ loading: true });
        try {
          const stored = localStorage.getItem("auth-storage");
          if (stored) {
            const parsed = JSON.parse(stored);
            const token = parsed?.state?.token;
            if (token) {
              // Verify token is still valid by fetching user profile
              try {
                setAuthToken(token);
                setAuthCookie(token);
                const res = await apiFetch<{ success: boolean; data: User }>("/auth/me");
                set({ user: res.data, token, loading: false });
                return;
              } catch (error) {
                // Token is invalid, clear everything
                setAuthToken(null);
                setAuthCookie(null);
                localStorage.removeItem("auth-storage");
                set({ user: null, token: null, loading: false });
                return;
              }
            }
          }

          // restore partials (only if no auth token exists)
          const savedSignup = localStorage.getItem("signup-data");
          const savedExtra = localStorage.getItem("extra-booking-details");
          if (savedSignup) set({ signupData: JSON.parse(savedSignup) });
          if (savedExtra) set({ extraBookingDetails: JSON.parse(savedExtra) });

          set({ loading: false });
        } catch {
          setAuthToken(null);
          setAuthCookie(null);
          set({ user: null, token: null, loading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        signupData: state.signupData,
        extraBookingDetails: state.extraBookingDetails,
      }),
      onRehydrateStorage: () => (state) => {
        // Sync token to api.ts when store rehydrates from localStorage
        if (state?.token) {
          setAuthToken(state.token);
        }
      },
    }
  )
);
