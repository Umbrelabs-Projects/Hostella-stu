import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SignInFormData } from "@/app/(auth)/validations/signInSchema";
import { setAuthToken, apiFetch } from "@/lib/api";
import { SignUpFormData } from "@/app/(auth)/validations/signUpSchema";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;

  signupData: Partial<SignUpFormData>;
  updateSignupData: (newData: Partial<SignUpFormData>) => void;
  resetSignupData: () => void;

  signIn: (data: SignInFormData) => Promise<void>;
  signUp: (data: SignUpFormData) => Promise<void>;
  signOut: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,

      signupData: {},
      updateSignupData: (newData) =>
        set((state) => ({ signupData: { ...state.signupData, ...newData } })),
      resetSignupData: () => set({ signupData: {} }),

      // Sign in using SignInFormData
      signIn: async (data: SignInFormData) => {
        set({ loading: true, error: null });
        try {
          const res = await apiFetch<{ user: User; token: string }>("/auth/login", {
            method: "POST",
            body: JSON.stringify(data),
          });

          setAuthToken(res.token);
          set({ user: res.user, token: res.token, loading: false });
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : "Login failed";
          set({ error: message, loading: false });
        }
      },

      // Sign up using SignupFormData
      signUp: async (data: SignUpFormData) => {
        set({ loading: true, error: null });
        try {
          const res = await apiFetch<{ user: User; token: string }>("/auth/register", {
            method: "POST",
            body: JSON.stringify(data),
          });

          setAuthToken(res.token);
          set({ user: res.user, token: res.token, loading: false });
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : "Signup failed";
          set({ error: message, loading: false });
        }
      },

      signOut: async () => {
        setAuthToken(null);
        set({ user: null, token: null });
        localStorage.removeItem("auth-storage");
      },

      restoreSession: async () => {
        set({ loading: true });
        try {
          const stored = localStorage.getItem("auth-storage");
          if (stored) {
            const parsed: { state?: { token?: string; user?: User } } = JSON.parse(stored);
            if (parsed.state?.token) {
              setAuthToken(parsed.state.token);

              // Fetch latest user info
              const user = await apiFetch<User>("/auth/me");
              set({ user, token: parsed.state.token, loading: false });
              return;
            }
          }
          set({ loading: false });
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : "Failed to restore session";
          console.error("Restore session error:", message);
          set({ user: null, token: null, loading: false });
          setAuthToken(null);
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
);
