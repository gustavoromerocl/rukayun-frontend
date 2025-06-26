import { create } from "zustand";

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string; // Puede venir del backend o de claims
  phone?: string;
  address?: string;
  bio?: string;
  birthDate?: string;
}

interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
})); 