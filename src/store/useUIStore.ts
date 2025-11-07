import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  showNavbar: boolean;
  hydrated: boolean;
  setShowNavbar: (visible: boolean) => void;
  setHydrated: (value: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      showNavbar: true,
      hydrated: false,
      setShowNavbar: (visible) => set({ showNavbar: visible }),
      setHydrated: (value) => set({ hydrated: value }),
    }),
    {
      name: "ui-storage",
      partialize: (state) => ({ showNavbar: state.showNavbar }),
      onRehydrateStorage: () => (state) => {
        // Runs after Zustand finishes rehydration
        state?.setHydrated(true);
      },
    }
  )
);
