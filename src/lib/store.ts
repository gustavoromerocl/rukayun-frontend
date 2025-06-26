import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string; // Puede venir del backend o de claims
  [key: string]: any; // Para permitir datos extra
}

interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
  hasHydrated: boolean;
  setHasHydrated: (hydrated: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      hasHydrated: false,
      setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),
    }),
    {
      name: "rukayun-user", // clave en localStorage
      partialize: (state) => ({ user: state.user }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated?.(true);
      },
    }
  )
); 