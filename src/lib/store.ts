import { create } from "zustand";
import type { Comuna } from "@/services/usuariosService";
import { UsuariosService } from "@/services/usuariosService";
import { useApi } from "@/hooks/useApi";

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
  // Comunas
  comunas: Comuna[];
  loadingComunas: boolean;
  errorComunas: string | null;
  fetchComunas: (apiClient: any) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  user: null,
  setUser: (user) => set({ user }),
  // Comunas
  comunas: [],
  loadingComunas: false,
  errorComunas: null,
  fetchComunas: async (apiClient) => {
    if (get().comunas.length > 0) return;
    set({ loadingComunas: true, errorComunas: null });
    try {
      const service = new UsuariosService(apiClient);
      const comunas = await service.obtenerComunas();
      set({ comunas, loadingComunas: false });
    } catch (err: any) {
      set({ errorComunas: err.message || 'Error al cargar comunas', loadingComunas: false });
    }
  },
})); 