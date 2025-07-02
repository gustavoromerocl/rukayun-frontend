import { useState, useEffect, useCallback } from 'react';
import { useApi } from './useApi';
import { OrganizacionesService } from '@/services/organizacionesService';
import type { Organizacion } from '@/services/usuariosService';

export function useOrganizaciones() {
  const apiClient = useApi();
  const [organizaciones, setOrganizaciones] = useState<Organizacion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganizaciones = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const organizacionesService = new OrganizacionesService(apiClient);
      const organizacionesData = await organizacionesService.obtenerOrganizaciones();
      setOrganizaciones(organizacionesData);
    } catch (err) {
      console.error('Error cargando organizaciones:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar las organizaciones');
    } finally {
      setLoading(false);
    }
  }, [apiClient]);

  const createOrganizacion = useCallback(async (data: Omit<Organizacion, 'organizacionId' | 'fechaEliminacion'>) => {
    try {
      const organizacionesService = new OrganizacionesService(apiClient);
      const nuevaOrganizacion = await organizacionesService.crearOrganizacion(data);
      setOrganizaciones(prev => [...prev, nuevaOrganizacion]);
      return nuevaOrganizacion;
    } catch (err) {
      console.error('Error creando organización:', err);
      throw err;
    }
  }, [apiClient]);

  const updateOrganizacion = useCallback(async (id: number, data: Partial<Organizacion>) => {
    try {
      const organizacionesService = new OrganizacionesService(apiClient);
      const organizacionActualizada = await organizacionesService.actualizarOrganizacion(id, data);
      setOrganizaciones(prev => prev.map(org => 
        org.organizacionId === id ? organizacionActualizada : org
      ));
      return organizacionActualizada;
    } catch (err) {
      console.error('Error actualizando organización:', err);
      throw err;
    }
  }, [apiClient]);

  const deleteOrganizacion = useCallback(async (id: number) => {
    try {
      const organizacionesService = new OrganizacionesService(apiClient);
      await organizacionesService.eliminarOrganizacion(id);
      setOrganizaciones(prev => prev.filter(org => org.organizacionId !== id));
    } catch (err) {
      console.error('Error eliminando organización:', err);
      throw err;
    }
  }, [apiClient]);

  useEffect(() => {
    fetchOrganizaciones();
  }, [fetchOrganizaciones]);

  return {
    organizaciones,
    loading,
    error,
    fetchOrganizaciones,
    createOrganizacion,
    updateOrganizacion,
    deleteOrganizacion,
  };
} 