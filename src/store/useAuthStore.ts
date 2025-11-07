// store/useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { setAuthToken, apiFetch } from "@/lib/api";
import { FullSignUpData } from "@/app/(auth)/validations/signUpSchema";
import { SignInFormData } from "@/app/(auth)/validations/signInSchema";

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

  signupData: Partial<FullSignUpData>;
  updateSignupData: (newData: Partial<FullSignUpData>) => void;
  resetSignupData: () => void;

  signIn: (data: SignInFormData) => Promise<void>;
  signUp: (data: FullSignUpData) => Promise<void>;
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
          const message = err instanceof Error ? err.message : "Login failed";
          set({ error: message, loading: false });
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
          get().resetSignupData();
        } catch (err: unknown) {
          const message = err instanceof Error ? err.message : "SignUp failed";
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
            const parsed = JSON.parse(stored);
            const token = parsed?.state?.token;
            if (token) {
              setAuthToken(token);
              const user = await apiFetch<User>("/auth/me");
              set({ user, token, loading: false });
              return;
            }
          }
          set({ loading: false });
        } catch {
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
