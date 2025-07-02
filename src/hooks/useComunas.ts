import { useState, useEffect, useCallback } from 'react';
import { useApi } from './useApi';
import { UsuariosService } from '@/services/usuariosService';
import type { Comuna } from '@/services/usuariosService';

export function useComunas() {
  const apiClient = useApi();
  const [comunas, setComunas] = useState<Comuna[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComunas = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const usuariosService = new UsuariosService(apiClient);
      const comunasData = await usuariosService.obtenerComunas();
      setComunas(comunasData);
    } catch (err) {
      console.error('Error cargando comunas:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar las comunas');
    } finally {
      setLoading(false);
    }
  }, [apiClient]);

  useEffect(() => {
    fetchComunas();
  }, [fetchComunas]);

  return {
    comunas,
    loading,
    error,
    fetchComunas,
  };
} 