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
  gender?: "MALE" | "FEMALE" | "OTHER";
  emailVerified?: boolean;
  phoneVerified?: boolean;
  // University Information
  campus?: string;
  programme?: string;
  studentRefNumber?: string;
  level?: string;
  // Health Information
  hasHealthCondition?: boolean;
  healthCondition?: string;
  bloodType?: string;
  allergies?: string;
  // Emergency Contact (Legacy - Single Contact)
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
}

// Extended signup data type to include session IDs
type ExtendedSignupData = Partial<FullSignUpData> & {
  sessionId?: string;
  verifiedSessionId?: string;
};

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  signupData: ExtendedSignupData;
  extraBookingDetails: Partial<ExtraDetailsFormValues>;

  updateSignupData: (newData: Partial<ExtendedSignupData>) => void;
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
          // Try to get complete profile first, fallback to basic profile
          try {
            const res = await apiFetch<any>(
              "/onboarding/profile"
            );
            console.log("fetchProfile: Complete profile response", res);
            console.log("fetchProfile: Response keys", Object.keys(res));
            
            // Handle different response formats:
            // 1. { success: true, data: { user: User } } - nested user in data
            // 2. { success: true, data: User } - user directly in data
            // 3. { user: User } - user at top level
            // 4. Direct User object
            let userData: User;
            
            // First check if data exists and has a nested user
            if ("data" in res && res.data && typeof res.data === "object" && res.data !== null) {
              if ("user" in res.data && res.data.user && typeof res.data.user === "object") {
                // Format: { success: true, data: { user: User } }
                userData = res.data.user as User;
                console.log("fetchProfile: Found nested user in data.user");
              } else if ("id" in res.data) {
                // Format: { success: true, data: User }
                userData = res.data as User;
                console.log("fetchProfile: Found user directly in data");
              } else {
                // Fallback: treat data as user
                userData = res.data as User;
                console.log("fetchProfile: Treating data as user (fallback)");
              }
            } else if ("user" in res && res.user && typeof res.user === "object") {
              // Format: { user: User }
              userData = res.user as User;
              console.log("fetchProfile: Found user at top level");
            } else if (typeof res === "object" && res !== null && "id" in res) {
              // Direct User object
              userData = res as User;
              console.log("fetchProfile: Treating response as direct user object");
            } else {
              throw new Error("Unable to extract user data from response");
            }
            
            console.log("fetchProfile: Extracted user data", userData);
            console.log("fetchProfile: User data keys", Object.keys(userData));
            console.log("fetchProfile: Programme field check", {
              programme: userData.programme,
              hasProgramme: 'programme' in userData,
              programmeType: typeof userData.programme,
              campus: userData.campus,
              studentRefNumber: userData.studentRefNumber,
              level: userData.level,
              allKeys: Object.keys(userData),
            });
            
            // Map alternative field names if backend uses different names
            const mappedData = { ...userData } as any;
            if (mappedData.school && !mappedData.campus) {
              mappedData.campus = mappedData.school;
            }
            if (mappedData.studentId && !mappedData.studentRefNumber) {
              mappedData.studentRefNumber = mappedData.studentId;
            }
            // Check for alternative programme field names
            if (!mappedData.programme) {
              // Try common alternative names
              if (mappedData.program) {
                mappedData.programme = mappedData.program;
              } else if (mappedData.course) {
                mappedData.programme = mappedData.course;
              } else if (mappedData.degree) {
                mappedData.programme = mappedData.degree;
              } else if (mappedData.major) {
                mappedData.programme = mappedData.major;
              }
            }
            
            console.log("fetchProfile: Mapped user data", mappedData);
            set({ user: mappedData as User, loading: false });
          } catch (error) {
            console.error("fetchProfile: Complete profile failed, trying basic profile", error);
            // Fallback to basic profile if complete profile endpoint fails
            const res = await apiFetch<any>(
              "/auth/me"
            );
            console.log("fetchProfile: Basic profile response", res);
            console.log("fetchProfile: Basic response keys", Object.keys(res));
            
            // Handle different response formats (same logic as above)
            let userData: User;
            
            // First check if data exists and has a nested user
            if ("data" in res && res.data && typeof res.data === "object" && res.data !== null) {
              if ("user" in res.data && res.data.user && typeof res.data.user === "object") {
                // Format: { success: true, data: { user: User } }
                userData = res.data.user as User;
                console.log("fetchProfile: Found nested user in data.user (basic)");
              } else if ("id" in res.data) {
                // Format: { success: true, data: User }
                userData = res.data as User;
                console.log("fetchProfile: Found user directly in data (basic)");
              } else {
                // Fallback: treat data as user
                userData = res.data as User;
                console.log("fetchProfile: Treating data as user (basic fallback)");
              }
            } else if ("user" in res && res.user && typeof res.user === "object") {
              // Format: { user: User }
              userData = res.user as User;
              console.log("fetchProfile: Found user at top level (basic)");
            } else if (typeof res === "object" && res !== null && "id" in res) {
              // Direct User object
              userData = res as User;
              console.log("fetchProfile: Treating response as direct user object (basic)");
            } else {
              throw new Error("Unable to extract user data from response (basic)");
            }
            
            console.log("fetchProfile: Extracted user data (basic)", userData);
            console.log("fetchProfile: User data keys (basic)", Object.keys(userData));
            
            // Map alternative field names
            const mappedData = { ...userData } as any;
            if (mappedData.school && !mappedData.campus) {
              mappedData.campus = mappedData.school;
            }
            if (mappedData.studentId && !mappedData.studentRefNumber) {
              mappedData.studentRefNumber = mappedData.studentId;
            }
            if (!mappedData.programme) {
              if (mappedData.program) {
                mappedData.programme = mappedData.program;
              } else if (mappedData.course) {
                mappedData.programme = mappedData.course;
              } else if (mappedData.degree) {
                mappedData.programme = mappedData.degree;
              } else if (mappedData.major) {
                mappedData.programme = mappedData.major;
              }
            }
            
            set({ user: mappedData as User, loading: false });
          }
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
          const res = await apiFetch<any>(
            "/auth/login",
            {
              method: "POST",
              body: JSON.stringify(data),
            }
          );
          
          // Handle different response formats
          let user: User;
          let token: string;
          
          if ("data" in res && res.data) {
            if ("user" in res.data && "token" in res.data) {
              user = res.data.user;
              token = res.data.token;
            } else {
              // Fallback: try direct access
              user = (res as any).user || res.data;
              token = (res as any).token || res.data.token;
            }
          } else if ("user" in res && "token" in res) {
            user = res.user;
            token = res.token;
          } else {
            throw new Error("Invalid response format from login endpoint");
          }
          
          setAuthToken(token);
          setAuthCookie(token);
          set({ user, token, loading: false });
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

          const res = await apiFetch<any>(
            "/auth/register",
            {
              method: "POST",
              body: formData,
            }
          );
          
          // Handle different response formats
          let user: User;
          let token: string;
          
          if ("data" in res && res.data) {
            if ("user" in res.data && "token" in res.data) {
              user = res.data.user;
              token = res.data.token;
            } else {
              // Fallback: try direct access
              user = (res as any).user || res.data;
              token = (res as any).token || res.data.token;
            }
          } else if ("user" in res && "token" in res) {
            user = res.user;
            token = res.token;
          } else {
            throw new Error("Invalid response format from register endpoint");
          }

          setAuthToken(token);
          setAuthCookie(token);
          set({ user, token, loading: false });
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
          const res = await apiFetch<any>("/auth/profile", {
            method: "PUT",
            body: formData,
          });
          
          // Handle different response formats
          let userData: User;
          if ("user" in res && res.user) {
            userData = res.user;
          } else if ("data" in res && res.data) {
            userData = res.data;
          } else {
            userData = res as User;
          }
          
          // Map alternative field names
          const mappedData = { ...userData } as any;
          if (mappedData.school && !mappedData.campus) {
            mappedData.campus = mappedData.school;
          }
          if (mappedData.studentId && !mappedData.studentRefNumber) {
            mappedData.studentRefNumber = mappedData.studentId;
          }
          if (!mappedData.programme) {
            if (mappedData.program) {
              mappedData.programme = mappedData.program;
            } else if (mappedData.course) {
              mappedData.programme = mappedData.course;
            } else if (mappedData.degree) {
              mappedData.programme = mappedData.degree;
            } else if (mappedData.major) {
              mappedData.programme = mappedData.major;
            }
          }
          
          set({ user: mappedData as User, loading: false });
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
                // Try to get complete profile first, fallback to basic profile
                try {
                  const res = await apiFetch<any>("/onboarding/profile");
                  // Handle different response formats
                  let userData: User;
                  if ("user" in res && res.user) {
                    userData = res.user;
                  } else if ("data" in res && res.data) {
                    userData = res.data;
                  } else {
                    userData = res as User;
                  }
                  
                  // Map alternative field names
                  const mappedData = { ...userData } as any;
                  if (mappedData.school && !mappedData.campus) {
                    mappedData.campus = mappedData.school;
                  }
                  if (mappedData.studentId && !mappedData.studentRefNumber) {
                    mappedData.studentRefNumber = mappedData.studentId;
                  }
                  
                  set({ user: mappedData as User, token, loading: false });
                } catch {
                  // Fallback to basic profile if complete profile endpoint fails
                  const res = await apiFetch<any>("/auth/me");
                  // Handle different response formats
                  let userData: User;
                  if ("user" in res && res.user) {
                    userData = res.user;
                  } else if ("data" in res && res.data) {
                    userData = res.data;
                  } else {
                    userData = res as User;
                  }
                  
                  // Map alternative field names
                  const mappedData = { ...userData } as any;
                  if (mappedData.school && !mappedData.campus) {
                    mappedData.campus = mappedData.school;
                  }
                  if (mappedData.studentId && !mappedData.studentRefNumber) {
                    mappedData.studentRefNumber = mappedData.studentId;
                  }
                  
                  set({ user: mappedData as User, token, loading: false });
                }
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
