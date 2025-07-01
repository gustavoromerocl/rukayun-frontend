import { ApiClient } from '@/lib/api';

export interface Usuario {
  usuarioId: number;
  username: string;
  nombres: string;
  apellidos: string;
  activo: boolean;
  fechaCreacion: string;
  direccion: string | null;
  telefono: string | null;
  telefono2: string | null;
  comuna: string | null;
  rol: string;
  // Campos opcionales para compatibilidad
  nombre?: string;
  email?: string;
  organizacionId?: number;
  organizacion?: {
    organizacionId: number;
    nombre: string;
  };
}

export interface VerificarPerfilResponse {
  usuario?: Usuario; // Opcional porque puede devolver directamente el usuario
  mensaje?: string;
}

// La respuesta real del backend es directamente un Usuario
export type VerificarPerfilResponseReal = Usuario;

// Servicio de usuarios
export class UsuariosService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  // Verificar perfil del usuario autenticado
  async verificarPerfil(): Promise<Usuario> {
    return this.apiClient.post<Usuario>('/usuarios/perfil/verificar');
  }

  // Obtener perfil del usuario
  async obtenerPerfil(): Promise<Usuario> {
    return this.apiClient.get<Usuario>('/usuarios/perfil');
  }

  // Actualizar perfil del usuario
  async actualizarPerfil(data: Partial<Usuario>): Promise<Usuario> {
    return this.apiClient.put<Usuario>('/usuarios/perfil', data);
  }
} 