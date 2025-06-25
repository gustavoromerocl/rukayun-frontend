import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
  role: string; // 'admin' | 'voluntario' | ...
}

interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
})); 