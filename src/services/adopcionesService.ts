import { ApiClient } from '@/lib/api';

// Tipos para las adopciones basados en la respuesta real del backend
export interface AdopcionEstado {
  adopcionEstadoId: number;
  nombre: string;
}

export interface Animal {
  animalId: number;
  nombre: string;
  peso: number;
  fechaRegistro: string;
  fechaNacimiento: string;
  publicado: boolean;
  descripcion: string;
  especieId: number;
  sexoId: number;
  organizacionId: number;
  fechaEliminacion: string | null;
  tamanoId: number;
  nivelActividadId: number;
  especie: any | null;
  sexo: any | null;
  organizacion: any | null;
  tamano: any | null;
  nivelActividad: any | null;
  animalImagenes: any[];
  edad: number;
}

export interface Seguimiento {
  // Definir estructura cuando esté disponible
}

export interface Adopcion {
  adopcionId: number;
  animalId: number;
  usuarioId: number;
  adopcionEstadoId: number;
  fechaCreacion: string;
  fechaActualizacion: string;
  descripcionFamilia: string;
  usuario: any | null;
  adopcionEstado: AdopcionEstado;
  animal: Animal;
  seguimientos: Seguimiento[];
}

export interface CreateAdopcionRequest {
  animalId: number;
  usuarioId: number;
  descripcionFamilia?: string;
}

export interface UpdateAdopcionRequest {
  adopcionEstadoId?: number;
  descripcionFamilia?: string;
}

export interface SolicitarAdopcionRequest {
  animalId: number;
  usuarioId: number;
  descripcionFamilia?: string;
}

// Servicio de adopciones
export class AdopcionesService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  // Obtener todas las adopciones
  async getAdopciones(): Promise<Adopcion[]> {
    return this.apiClient.get<Adopcion[]>('/adopciones');
  }

  // Obtener una adopción por ID
  async getAdopcion(id: number): Promise<Adopcion> {
    return this.apiClient.get<Adopcion>(`/adopciones/${id}`);
  }

  // Crear una nueva adopción
  async createAdopcion(data: CreateAdopcionRequest): Promise<Adopcion> {
    return this.apiClient.post<Adopcion>('/adopciones', data);
  }

  // Actualizar una adopción
  async updateAdopcion(id: number, data: UpdateAdopcionRequest): Promise<Adopcion> {
    return this.apiClient.put<Adopcion>(`/adopciones/${id}`, data);
  }

  // Eliminar una adopción
  async deleteAdopcion(id: number): Promise<void> {
    return this.apiClient.delete<void>(`/adopciones/${id}`);
  }

  // Obtener adopciones por estado
  async getAdopcionesByEstado(estadoId: number): Promise<Adopcion[]> {
    return this.apiClient.get<Adopcion[]>(`/adopciones?adopcionEstadoId=${estadoId}`);
  }

  // Obtener adopciones por usuario
  async getAdopcionesByUsuario(usuarioId: number): Promise<Adopcion[]> {
    return this.apiClient.get<Adopcion[]>(`/adopciones?usuarioId=${usuarioId}`);
  }

  // Obtener adopciones por animal
  async getAdopcionesByAnimal(animalId: number): Promise<Adopcion[]> {
    return this.apiClient.get<Adopcion[]>(`/adopciones?animalId=${animalId}`);
  }

  // Solicitar adopción (endpoint público)
  async solicitarAdopcion(data: SolicitarAdopcionRequest): Promise<any> {
    return this.apiClient.post<any>('/adopciones/solicitar', data);
  }
} 