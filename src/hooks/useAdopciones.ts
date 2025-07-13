import { useState, useCallback, useMemo } from 'react';
import { useApi } from './useApi';
import { AdopcionesService } from '@/services/adopcionesService';
import type { Adopcion, CreateAdopcionRequest, UpdateAdopcionRequest } from '@/services/adopcionesService';

export function useAdopciones() {
  const apiClient = useApi();
  const [adopciones, setAdopciones] = useState<Adopcion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoizar el servicio para evitar recreaciones
  const adopcionesService = useMemo(() => new AdopcionesService(apiClient), [apiClient]);

  // Obtener todas las adopciones
  const fetchAdopciones = useCallback(async () => {
    console.log('🔄 fetchAdopciones ejecutándose...');
    setLoading(true);
    setError(null);
    try {
      const data = await adopcionesService.getAdopciones();
      console.log('✅ Adopciones obtenidas:', data.length);
      setAdopciones(data);
    } catch (err) {
      console.error('❌ Error fetching adopciones:', err);
      setError(err instanceof Error ? err.message : 'Error al obtener adopciones');
    } finally {
      setLoading(false);
    }
  }, [adopcionesService]);

  // Obtener una adopción por ID
  const fetchAdopcion = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await adopcionesService.getAdopcion(id);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener la adopción');
      console.error('Error fetching adopcion:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [adopcionesService]);

  // Crear una nueva adopción
  const createAdopcion = useCallback(async (data: CreateAdopcionRequest) => {
    setLoading(true);
    setError(null);
    try {
      const newAdopcion = await adopcionesService.createAdopcion(data);
      setAdopciones(prev => [...prev, newAdopcion]);
      return newAdopcion;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la adopción');
      console.error('Error creating adopcion:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [adopcionesService]);

  // Actualizar una adopción
  const updateAdopcion = useCallback(async (id: number, data: UpdateAdopcionRequest) => {
    setLoading(true);
    setError(null);
    try {
      const updatedAdopcion = await adopcionesService.updateAdopcion(id, data);
      setAdopciones(prev => 
        prev.map(adopcion => 
          adopcion.adopcionId === id ? updatedAdopcion : adopcion
        )
      );
      return updatedAdopcion;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar la adopción');
      console.error('Error updating adopcion:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [adopcionesService]);

  // Eliminar una adopción
  const deleteAdopcion = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await adopcionesService.deleteAdopcion(id);
      setAdopciones(prev => prev.filter(adopcion => adopcion.adopcionId !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar la adopción');
      console.error('Error deleting adopcion:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [adopcionesService]);

  // Obtener adopciones por estado
  const fetchAdopcionesByEstado = useCallback(async (estadoId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await adopcionesService.getAdopcionesByEstado(estadoId);
      setAdopciones(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener adopciones por estado');
      console.error('Error fetching adopciones by estado:', err);
    } finally {
      setLoading(false);
    }
  }, [adopcionesService]);

  // Obtener adopciones por usuario
  const fetchAdopcionesByUsuario = useCallback(async (usuarioId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await adopcionesService.getAdopcionesByUsuario(usuarioId);
      setAdopciones(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener adopciones por usuario');
      console.error('Error fetching adopciones by usuario:', err);
    } finally {
      setLoading(false);
    }
  }, [adopcionesService]);

  // Obtener adopciones por animal
  const fetchAdopcionesByAnimal = useCallback(async (animalId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await adopcionesService.getAdopcionesByAnimal(animalId);
      setAdopciones(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener adopciones por animal');
      console.error('Error fetching adopciones by animal:', err);
    } finally {
      setLoading(false);
    }
  }, [adopcionesService]);

  // Solicitar adopción
  const solicitarAdopcion = useCallback(async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      console.log('🔄 Solicitar adopción...');
      const result = await adopcionesService.solicitarAdopcion(data);
      console.log('✅ Adopción solicitada exitosamente');
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al solicitar adopción');
      console.error('Error solicitando adopción:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [adopcionesService]);

  // Limpiar error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    adopciones,
    loading,
    error,
    fetchAdopciones,
    fetchAdopcion,
    createAdopcion,
    updateAdopcion,
    deleteAdopcion,
    fetchAdopcionesByEstado,
    fetchAdopcionesByUsuario,
    fetchAdopcionesByAnimal,
    solicitarAdopcion,
    clearError,
  };
} 