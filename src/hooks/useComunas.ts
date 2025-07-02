import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { useApi } from './useApi';

export function useComunas() {
  const apiClient = useApi();
  const comunas = useAppStore(state => state.comunas);
  const loading = useAppStore(state => state.loadingComunas);
  const error = useAppStore(state => state.errorComunas);
  const fetchComunas = useAppStore(state => state.fetchComunas);

  useEffect(() => {
    if (comunas.length === 0) {
      fetchComunas(apiClient);
    }
  }, [comunas.length, fetchComunas, apiClient]);

  return { comunas, loading, error };
} 