import { ApiClient } from '@/lib/api';

// Interfaces basadas en el endpoint de seguimientos
export interface Seguimiento {
  seguimientoId: number;
  adopcionId: number;
  usuarioId: number;
  fechaSeguimiento: string;
  estado: string;
  observaciones: string;
  proximaSeguimiento?: string;
  // Campos adicionales que pueden venir en la respuesta
  adopcion?: {
    adopcionId: number;
    animal: {
      animalId: number;
      nombre: string;
    };
    adoptante: {
      usuarioId: number;
      nombres: string;
      apellidos: string;
    };
  };
  usuario?: {
    usuarioId: number;
    nombres: string;
    apellidos: string;
  };
}

export interface SeguimientosFilters {
  usuarioId?: number | null;
  adopcionId?: number | null;
  page?: number;
  pageSize?: number;
}

export interface SeguimientosResponse {
  items: Seguimiento[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface CreateSeguimientoRequest {
  adopcionId: number;
  seguimientoTipoId: number;
  fechaInteraccion: string;
  descripcion: string;
}

export interface UpdateSeguimientoRequest {
  fechaSeguimiento?: string;
  estado?: string;
  observaciones?: string;
  proximaSeguimiento?: string;
}

export interface CerrarSeguimientoRequest {
  observacion: string;
}

// Servicio de seguimientos
export class SeguimientosService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  // Obtener seguimientos con filtros y paginación
  async getSeguimientos(filters: SeguimientosFilters = {}): Promise<SeguimientosResponse> {
    const params = new URLSearchParams();
    
    // Agregar filtros a los parámetros
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const queryString = params.toString();
    const endpoint = queryString ? `/seguimientos?${queryString}` : '/seguimientos';
    
    return this.apiClient.get<SeguimientosResponse>(endpoint);
  }

  // Obtener un seguimiento por ID
  async getSeguimiento(id: number): Promise<Seguimiento> {
    return this.apiClient.get<Seguimiento>(`/seguimientos/${id}`);
  }

  // Crear un nuevo seguimiento
  async createSeguimiento(data: CreateSeguimientoRequest): Promise<Seguimiento> {
    return this.apiClient.post<Seguimiento>('/seguimientos', data);
  }

  // Actualizar un seguimiento
  async updateSeguimiento(id: number, data: UpdateSeguimientoRequest): Promise<Seguimiento> {
    return this.apiClient.put<Seguimiento>(`/seguimientos/${id}`, data);
  }

  // Eliminar un seguimiento
  async deleteSeguimiento(id: number): Promise<void> {
    return this.apiClient.delete<void>(`/seguimientos/${id}`);
  }

  // Cerrar un seguimiento
  async cerrarSeguimiento(id: number, data: CerrarSeguimientoRequest): Promise<Seguimiento> {
    return this.apiClient.post<Seguimiento>(`/seguimientos/${id}/cerrar`, data);
  }

  // Obtener seguimientos por adopción
  async getSeguimientosByAdopcion(adopcionId: number, filters: SeguimientosFilters = {}): Promise<SeguimientosResponse> {
    return this.getSeguimientos({ ...filters, adopcionId });
  }

  // Obtener seguimientos por usuario
  async getSeguimientosByUsuario(usuarioId: number, filters: SeguimientosFilters = {}): Promise<SeguimientosResponse> {
    return this.getSeguimientos({ ...filters, usuarioId });
  }
} 