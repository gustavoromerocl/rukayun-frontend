import { useEffect, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { useApi } from './useApi';

export function useComunas() {
  const apiClient = useApi();
  const comunas = useAppStore(state => state.comunas);
  const loading = useAppStore(state => state.loadingComunas);
  const error = useAppStore(state => state.errorComunas);
  const fetchComunas = useAppStore(state => state.fetchComunas);
  const hasInitialized = useRef(false);

  useEffect(() => {
    console.log('🔄 useComunas useEffect ejecutándose - hasInitialized:', hasInitialized.current, 'comunas.length:', comunas.length);
    
    if (!hasInitialized.current && comunas.length === 0) {
      console.log('✅ useComunas: Inicializando carga de comunas');
      hasInitialized.current = true;
      fetchComunas(apiClient);
    } else if (hasInitialized.current) {
      console.log('⏭️ useComunas: Ya inicializado, saltando llamada');
    } else {
      console.log('📦 useComunas: Comunas ya cargadas en store');
    }
  }, [comunas.length, fetchComunas, apiClient]);

  return { comunas, loading, error };
} 