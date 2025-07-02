import { useState, useEffect, useCallback } from 'react';
import { useApi } from './useApi';
import { UsuariosService } from '@/services/usuariosService';
import type { Usuario } from '@/services/usuariosService';

export function useUsuarios(organizacionId?: number) {
  const apiClient = useApi();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsuarios = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const usuariosService = new UsuariosService(apiClient);
      const data = await usuariosService.listarUsuarios(organizacionId);
      setUsuarios(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  }, [apiClient, organizacionId]);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  return {
    usuarios,
    loading,
    error,
    fetchUsuarios,
    setUsuarios,
  };
} 