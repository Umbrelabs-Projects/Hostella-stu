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

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
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
          const res = await apiFetch<{ user: User; token: string }>(
            "/auth/login",
            {
              method: "POST",
              body: JSON.stringify(data),
            }
          );
          setAuthToken(res.token);
          set({ user: res.user, token: res.token, loading: false });
        } catch (err: unknown) {
          // Narrow the type
          const errorMessage =
            err instanceof Error ? err.message : "SignIn failed";
          set({ error: errorMessage, loading: false });
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

          const res = await apiFetch<{ user: User; token: string }>(
            "/auth/register",
            {
              method: "POST",
              body: formData,
            }
          );

          setAuthToken(res.token);
          set({ user: res.user, token: res.token, loading: false });
          get().clearSignupProgress();
        } catch (err: unknown) {
          // Narrow the type
          const errorMessage =
            err instanceof Error ? err.message : " SignUp failed";
          set({ error: errorMessage, loading: false });
        }
      },

      // --- Profile Update ---
      updateProfile: async (formData) => {
        set({ loading: true });
        try {
          const updatedUser = await apiFetch<User>("/user/updateProfile", {
            method: "PUT",
            body: formData,
          });
          set({ user: updatedUser, loading: false });
        } catch (err: unknown) {
          // Narrow the type
          const errorMessage =
            err instanceof Error ? err.message : "Profile update failed";
          set({ error: errorMessage, loading: false });
        }
      },

      // --- Password Update ---
      updatePassword: async (payload) => {
        set({ loading: true });
        try {
          await apiFetch("/user/updatePassword", {
            method: "POST",
            body: JSON.stringify(payload),
          });
          set({ loading: false });
        } catch (err: unknown) {
          // Narrow the type
          const errorMessage =
            err instanceof Error ? err.message : "Password update failed";
          set({ error: errorMessage, loading: false });
        }
      },

      signOut: async () => {
        setAuthToken(null);
        set({ user: null, token: null });
        localStorage.removeItem("auth-storage");
        get().clearSignupProgress();
        get().resetExtraBookingDetails();
      },

      restoreSession: async () => {
        set({ loading: true });
        try {
          const stored = localStorage.getItem("auth-storage");
          if (stored) {
            const parsed = JSON.parse(stored);
            const token = parsed?.state?.token;
            if (token) {
              setAuthToken(token);
              const user = await apiFetch<User>("/auth/me");
              set({ user, token, loading: false });
              return;
            }
          }

          // restore partials
          const savedSignup = localStorage.getItem("signup-data");
          const savedExtra = localStorage.getItem("extra-booking-details");
          if (savedSignup) set({ signupData: JSON.parse(savedSignup) });
          if (savedExtra) set({ extraBookingDetails: JSON.parse(savedExtra) });

          set({ loading: false });
        } catch {
          setAuthToken(null);
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
    }
  )
);
