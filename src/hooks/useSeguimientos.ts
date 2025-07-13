import { useState, useCallback, useMemo } from 'react';
import { useApi } from './useApi';
import { SeguimientosService } from '@/services/seguimientosService';
import type { 
  Seguimiento, 
  SeguimientosFilters, 
  CreateSeguimientoRequest, 
  UpdateSeguimientoRequest 
} from '@/services/seguimientosService';

export function useSeguimientos() {
  const apiClient = useApi();
  const [seguimientos, setSeguimientos] = useState<Seguimiento[]>([]);
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
  const seguimientosService = useMemo(() => new SeguimientosService(apiClient), [apiClient]);

  // Obtener seguimientos con filtros y paginación
  const fetchSeguimientos = useCallback(async (filters: SeguimientosFilters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await seguimientosService.getSeguimientos(filters);
      const data = Array.isArray(response) ? response : response.items;
      setSeguimientos(data);
      setPagination({
        totalCount: Array.isArray(response) ? data.length : response.totalCount,
        page: Array.isArray(response) ? 1 : response.page,
        pageSize: Array.isArray(response) ? data.length : response.pageSize,
        totalPages: Array.isArray(response) ? 1 : response.totalPages,
        hasPreviousPage: Array.isArray(response) ? false : response.hasPreviousPage,
        hasNextPage: Array.isArray(response) ? false : response.hasNextPage,
      });
    } catch (err) {
      setSeguimientos([]);
      setPagination({
        totalCount: 0,
        page: 1,
        pageSize: 12,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      });
      setError(err instanceof Error ? err.message : 'Error al obtener seguimientos');
    } finally {
      setLoading(false);
    }
  }, [seguimientosService]);

  // Obtener un seguimiento por ID
  const fetchSeguimiento = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await seguimientosService.getSeguimiento(id);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener el seguimiento');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [seguimientosService]);

  // Crear un nuevo seguimiento
  const createSeguimiento = useCallback(async (data: CreateSeguimientoRequest) => {
    setLoading(true);
    setError(null);
    try {
      const newSeguimiento = await seguimientosService.createSeguimiento(data);
      return newSeguimiento;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear el seguimiento');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [seguimientosService]);

  // Actualizar un seguimiento
  const updateSeguimiento = useCallback(async (id: number, data: UpdateSeguimientoRequest) => {
    setLoading(true);
    setError(null);
    try {
      const updatedSeguimiento = await seguimientosService.updateSeguimiento(id, data);
      return updatedSeguimiento;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar el seguimiento');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [seguimientosService]);

  // Eliminar un seguimiento
  const deleteSeguimiento = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await seguimientosService.deleteSeguimiento(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el seguimiento');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [seguimientosService]);

  // Obtener seguimientos por adopción
  const fetchSeguimientosByAdopcion = useCallback(async (adopcionId: number, filters: SeguimientosFilters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await seguimientosService.getSeguimientosByAdopcion(adopcionId, filters);
      setSeguimientos(response.items);
      setPagination({
        totalCount: response.totalCount,
        page: response.page,
        pageSize: response.pageSize,
        totalPages: response.totalPages,
        hasPreviousPage: response.hasPreviousPage,
        hasNextPage: response.hasNextPage,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener seguimientos por adopción');
      setSeguimientos([]);
    } finally {
      setLoading(false);
    }
  }, [seguimientosService]);

  // Obtener seguimientos por usuario
  const fetchSeguimientosByUsuario = useCallback(async (usuarioId: number, filters: SeguimientosFilters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await seguimientosService.getSeguimientosByUsuario(usuarioId, filters);
      const data = Array.isArray(response) ? response : response.items;
      setSeguimientos(data);
      setPagination({
        totalCount: Array.isArray(response) ? data.length : response.totalCount,
        page: Array.isArray(response) ? 1 : response.page,
        pageSize: Array.isArray(response) ? data.length : response.pageSize,
        totalPages: Array.isArray(response) ? 1 : response.totalPages,
        hasPreviousPage: Array.isArray(response) ? false : response.hasPreviousPage,
        hasNextPage: Array.isArray(response) ? false : response.hasNextPage,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al obtener seguimientos por usuario');
      setSeguimientos([]);
    } finally {
      setLoading(false);
    }
  }, [seguimientosService]);

  // Limpiar error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    seguimientos,
    loading,
    error,
    pagination,
    fetchSeguimientos,
    fetchSeguimiento,
    createSeguimiento,
    updateSeguimiento,
    deleteSeguimiento,
    fetchSeguimientosByAdopcion,
    fetchSeguimientosByUsuario,
    clearError,
  };
} 