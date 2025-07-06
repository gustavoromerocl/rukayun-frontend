import { create } from "zustand";
import type { Comuna, Usuario } from "@/services/usuariosService";
import { UsuariosService } from "@/services/usuariosService";

interface AppState {
  user: Usuario | null;
  setUser: (user: Usuario | null) => void;
  // Comunas
  comunas: Comuna[];
  loadingComunas: boolean;
  errorComunas: string | null;
  fetchComunas: (apiClient: any) => Promise<void>;
  // Roles
  isColaborator: boolean;
  setIsColaborator: (isColaborator: boolean) => void;
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
  // Roles
  isColaborator: false,
  setIsColaborator: (isColaborator) => set({ isColaborator }),
})); 