import { useState, useCallback, useMemo } from 'react';
import { useApi } from './useApi';
import { AnimalesService } from '@/services/animalesService';
import type { 
  Animal, 
  AnimalesFilters, 
  CreateAnimalRequest, 
  UpdateAnimalRequest 
} from '@/services/animalesService';

export function useAnimales() {
  const apiClient = useApi();
  const [animales, setAnimales] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    page: 1,
    pageSize: 12,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  });

  // Memoizar el servicio para evitar recreaciones
  const animalesService = useMemo(() => new AnimalesService(apiClient), [apiClient]);

  // Obtener animales con filtros y paginación
  const fetchAnimales = useCallback(async (filters: AnimalesFilters = {}) => {
    console.log('🔄 fetchAnimales ejecutándose...', filters);
    setLoading(true);
    setError(null);
    try {
      console.log('📡 Llamando a animalesService.getAnimales...');
      const response = await animalesService.getAnimales(filters);
      console.log('✅ Animales obtenidos:', response.items.length, 'animales');
      console.log('📊 Datos de paginación:', {
        totalCount: response.totalCount,
        page: response.page,
        pageSize: response.pageSize,
        totalPages: response.totalPages
      });
      setAnimales(response.items);
      setPagination({
        totalCount: response.totalCount,
        page: response.page,
        pageSize: response.pageSize,
        totalPages: response.totalPages,
        hasPreviousPage: response.hasPreviousPage,
        hasNextPage: response.hasNextPage,
      });
      console.log('✅ Estado actualizado con', response.items.length, 'animales');
    } catch (err) {
      console.error('❌ Error fetching animales:', err);
      
      // Manejar específicamente errores de timeout/aborto
      if (err instanceof Error) {
        if (err.message.includes('timeout') || err.message.includes('aborted')) {
          setError('La conexión tardó demasiado. Verifica tu conexión a internet e intenta nuevamente.');
        } else {
          setError(err.message || 'Error al obtener animales');
        }
      } else {
        setError('Error al obtener animales');
      }
    } finally {
      setLoading(false);
      console.log('🏁 fetchAnimales completado');
    }
  }, [animalesService]);

  // Obtener un animal por ID
  const fetchAnimal = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await animalesService.getAnimal(id);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener el animal');
      console.error('Error fetching animal:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [animalesService]);

  // Crear un nuevo animal
  const createAnimal = useCallback(async (data: CreateAnimalRequest) => {
    console.log('🆕 Creando animal con datos:', data);
    setLoading(true);
    setError(null);
    try {
      console.log('📡 Llamando a animalesService.createAnimal...');
      const newAnimal = await animalesService.createAnimal(data);
      console.log('✅ Animal creado exitosamente:', newAnimal);
      // No actualizar el estado local aquí, dejar que fetchAnimales lo haga
      // para evitar inconsistencias
      return newAnimal;
    } catch (err) {
      console.error('❌ Error creating animal:', err);
      setError(err instanceof Error ? err.message : 'Error al crear el animal');
      throw err;
    } finally {
      setLoading(false);
      console.log('🏁 createAnimal completado');
    }
  }, [animalesService]);

  // Actualizar un animal
  const updateAnimal = useCallback(async (id: number, data: UpdateAnimalRequest) => {
    console.log('✏️ Actualizando animal con ID:', id, 'datos:', data);
    setLoading(true);
    setError(null);
    try {
      console.log('📡 Llamando a animalesService.updateAnimal...');
      const updatedAnimal = await animalesService.updateAnimal(id, data);
      console.log('✅ Animal actualizado exitosamente:', updatedAnimal);
      // No actualizar el estado local aquí, dejar que fetchAnimales lo haga
      // para evitar inconsistencias
      return updatedAnimal;
    } catch (err) {
      console.error('❌ Error updating animal:', err);
      setError(err instanceof Error ? err.message : 'Error al actualizar el animal');
      throw err;
    } finally {
      setLoading(false);
      console.log('🏁 updateAnimal completado');
    }
  }, [animalesService]);

  // Eliminar un animal
  const deleteAnimal = useCallback(async (id: number) => {
    console.log('🗑️ Eliminando animal con ID:', id);
    setLoading(true);
    setError(null);
    try {
      console.log('📡 Llamando a animalesService.deleteAnimal...');
      await animalesService.deleteAnimal(id);
      console.log('✅ Animal eliminado exitosamente');
      // No actualizar el estado local aquí, dejar que fetchAnimales lo haga
      // para evitar inconsistencias
    } catch (err) {
      console.error('❌ Error deleting animal:', err);
      setError(err instanceof Error ? err.message : 'Error al eliminar el animal');
      throw err;
    } finally {
      setLoading(false);
      console.log('🏁 deleteAnimal completado');
    }
  }, [animalesService]);

  // Obtener animales por organización
  const fetchAnimalesByOrganizacion = useCallback(async (organizacionId: number, filters: AnimalesFilters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await animalesService.getAnimalesByOrganizacion(organizacionId, filters);
      setAnimales(response.items);
      setPagination({
        totalCount: response.totalCount,
        page: response.page,
        pageSize: response.pageSize,
        totalPages: response.totalPages,
        hasPreviousPage: response.hasPreviousPage,
        hasNextPage: response.hasNextPage,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener animales por organización');
      console.error('Error fetching animales by organizacion:', err);
    } finally {
      setLoading(false);
    }
  }, [animalesService]);

  // Obtener animales publicados
  const fetchAnimalesPublicados = useCallback(async (filters: AnimalesFilters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await animalesService.getAnimalesPublicados(filters);
      setAnimales(response.items);
      setPagination({
        totalCount: response.totalCount,
        page: response.page,
        pageSize: response.pageSize,
        totalPages: response.totalPages,
        hasPreviousPage: response.hasPreviousPage,
        hasNextPage: response.hasNextPage,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener animales publicados');
      console.error('Error fetching animales publicados:', err);
    } finally {
      setLoading(false);
    }
  }, [animalesService]);

  // Subir imagen de animal
  const uploadAnimalImage = async (animalId: number, imageFile: File): Promise<any> => {
    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      
      const uploadResponse = await apiClient.post(`/animales/${animalId}/imagenes`, formData);
      return uploadResponse;
    } catch (error) {
      console.error('Error al subir imagen:', error);
      throw error;
    }
  };

  // Eliminar imagen de animal
  const deleteAnimalImage = async (animalId: number, imagenId: number): Promise<void> => {
    try {
      await animalesService.deleteAnimalImage(animalId, imagenId);
    } catch (error) {
      console.error('Error al eliminar imagen:', error);
      throw error;
    }
  };

  // Limpiar error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    animales,
    loading,
    error,
    pagination,
    fetchAnimales,
    fetchAnimal,
    createAnimal,
    updateAnimal,
    deleteAnimal,
    fetchAnimalesByOrganizacion,
    fetchAnimalesPublicados,
    uploadAnimalImage,
    deleteAnimalImage,
    clearError,
  };
} 