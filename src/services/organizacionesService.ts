import { ApiClient } from '@/lib/api';
import type { Organizacion } from '@/services/usuariosService';

export class OrganizacionesService {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  // Obtener todas las organizaciones
  async obtenerOrganizaciones(): Promise<Organizacion[]> {
    return this.apiClient.get<Organizacion[]>('/organizaciones');
  }

  // Obtener una organización por ID
  async obtenerOrganizacion(id: number): Promise<Organizacion> {
    return this.apiClient.get<Organizacion>(`/organizaciones/${id}`);
  }

  // Crear una nueva organización
  async crearOrganizacion(data: Omit<Organizacion, 'organizacionId' | 'fechaEliminacion'>): Promise<Organizacion> {
    return this.apiClient.post<Organizacion>('/organizaciones', data);
  }

  // Actualizar una organización
  async actualizarOrganizacion(id: number, data: Partial<Organizacion>): Promise<Organizacion> {
    return this.apiClient.put<Organizacion>(`/organizaciones/${id}`, data);
  }

  // Eliminar una organización (soft delete)
  async eliminarOrganizacion(id: number): Promise<void> {
    return this.apiClient.delete<void>(`/organizaciones/${id}`);
  }
} 