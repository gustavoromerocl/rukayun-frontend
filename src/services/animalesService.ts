import { ApiClient } from '@/lib/api';

// Tipos para los animales basados en la respuesta real del backend
export interface Especie {
  especieId: number;
  nombre: string;
}

export interface Sexo {
  sexoId: number;
  nombre: string;
}

export interface Comuna {
  comunaId: number;
  nombre: string;
}

export interface Organizacion {
  organizacionId: number;
  nombre: string;
  nombreContacto: string;
  telefonoContacto: string;
  emailContacto: string;
  direccion: string;
  comunaId: number;
  fechaEliminacion: string | null;
  comuna: Comuna | null;
  organizacionUsuarios: any[];
}

export interface Tamano {
  tamanoId: number;
  nombre: string;
}

export interface NivelActividad {
  nivelActividadId: number;
  nombre: string;
}

export interface AnimalImagen {
  animalImagenId: number;
  url: string;
  refCode: string;
  animalId: number;
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
  especie: Especie;
  sexo: Sexo;
  organizacion: Organizacion;
  tamano: Tamano;
  nivelActividad: NivelActividad;
  animalImagenes: AnimalImagen[];
  edad: number;
}

export interface AnimalesResponse {
  items: Animal[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface AnimalesFilters {
  search?: string;
  minEdad?: number;
  maxEdad?: number;
  sexoId?: number;
  nivelActividadId?: number;
  tamanoId?: number;
  especieId?: number;
  organizacionId?: number;
  comunaId?: number;
  publicado?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDescending?: boolean;
}

export interface CreateAnimalRequest {
  nombre: string;
  peso: number;
  fechaNacimiento: string;
  descripcion: string;
  especieId: number;
  sexoId: number;
  organizacionId: number;
  tamanoId: number;
  nivelActividadId: number;
  publicado?: boolean;
}

export interface UpdateAnimalRequest {
  nombre?: string;
  peso?: number;
  fechaNacimiento?: string;
  descripcion?: string;
  especieId?: number;
  sexoId?: number;
  organizacionId?: number;
  tamanoId?: number;
  nivelActividadId?: number;
  publicado?: boolean;
}

// Servicio de animales
export class AnimalesService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  // Obtener animales con filtros y paginación
  async getAnimales(filters: AnimalesFilters = {}): Promise<AnimalesResponse> {
    const params = new URLSearchParams();
    
    // Agregar filtros a los parámetros
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });

    const queryString = params.toString();
    const endpoint = queryString ? `/animales?${queryString}` : '/animales';
    
    return this.apiClient.get<AnimalesResponse>(endpoint);
  }

  // Obtener un animal por ID
  async getAnimal(id: number): Promise<Animal> {
    return this.apiClient.get<Animal>(`/animales/${id}`);
  }

  // Crear un nuevo animal
  async createAnimal(data: CreateAnimalRequest): Promise<Animal> {
    return this.apiClient.post<Animal>('/animales', data);
  }

  // Actualizar un animal
  async updateAnimal(id: number, data: UpdateAnimalRequest): Promise<Animal> {
    return this.apiClient.put<Animal>(`/animales/${id}`, data);
  }

  // Eliminar un animal
  async deleteAnimal(id: number): Promise<void> {
    return this.apiClient.delete<void>(`/animales/${id}`);
  }

  // Publicar/despublicar un animal
  async togglePublicacion(id: number, publicado: boolean): Promise<Animal> {
    return this.apiClient.put<Animal>(`/animales/${id}`, { publicado });
  }

  // Obtener animales por organización
  async getAnimalesByOrganizacion(organizacionId: number, filters: AnimalesFilters = {}): Promise<AnimalesResponse> {
    return this.getAnimales({ ...filters, organizacionId });
  }

  // Obtener animales publicados
  async getAnimalesPublicados(filters: AnimalesFilters = {}): Promise<AnimalesResponse> {
    return this.getAnimales({ ...filters, publicado: true });
  }

  // Eliminar imagen de animal
  async deleteAnimalImage(animalId: number, imagenId: number): Promise<void> {
    return this.apiClient.delete<void>(`/animales/${animalId}/imagenes/${imagenId}`);
  }
} 