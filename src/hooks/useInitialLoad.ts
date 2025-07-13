import { useState, useEffect, useRef } from 'react';
import { useAuth } from './useAuth';
import { useComunas } from './useComunas';
import { useAppStore } from '@/lib/store';

// Estado global para el loading inicial
const globalInitialLoadState = {
  authLoaded: false,
  comunasLoaded: false,
  sidebarReady: false,
};

export function useInitialLoad() {
  const { loading: authLoading, usuario } = useAuth();
  const { loading: comunasLoading, comunas } = useComunas();
  const { isColaborator } = useAppStore();
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
  const hasInitialized = useRef(false);

  useEffect(() => {
    console.log('🔄 useInitialLoad - Estado actual:', {
      authLoading,
      authLoaded: globalInitialLoadState.authLoaded,
      comunasLoading,
      comunasLoaded: globalInitialLoadState.comunasLoaded,
      sidebarReady: globalInitialLoadState.sidebarReady,
      usuario: !!usuario,
      comunas: comunas.length,
      isColaborator
    });

    // Marcar auth como cargado cuando termine
    if (!authLoading && usuario && !globalInitialLoadState.authLoaded) {
      console.log('✅ Auth cargado');
      globalInitialLoadState.authLoaded = true;
    }

    // Marcar comunas como cargadas cuando terminen
    if (!comunasLoading && comunas.length > 0 && !globalInitialLoadState.comunasLoaded) {
      console.log('✅ Comunas cargadas');
      globalInitialLoadState.comunasLoaded = true;
    }

    // Marcar sidebar como listo cuando se determine el rol
    if (usuario && !globalInitialLoadState.sidebarReady) {
      console.log('✅ Sidebar listo (rol determinado)');
      globalInitialLoadState.sidebarReady = true;
    }

    // Verificar si todo está listo
    const allReady = globalInitialLoadState.authLoaded && 
                    globalInitialLoadState.comunasLoaded && 
                    globalInitialLoadState.sidebarReady;

    if (allReady && !hasInitialized.current) {
      console.log('🎉 Carga inicial completa');
      hasInitialized.current = true;
      setIsInitialLoadComplete(true);
    }

    // Resetear estado global si no hay usuario
    if (!usuario) {
      globalInitialLoadState.authLoaded = false;
      globalInitialLoadState.comunasLoaded = false;
      globalInitialLoadState.sidebarReady = false;
      hasInitialized.current = false;
      setIsInitialLoadComplete(false);
    }

  }, [authLoading, comunasLoading, usuario, comunas, isColaborator]);

  // Resetear estado global al recargar la página
  useEffect(() => {
    const handleBeforeUnload = () => {
      globalInitialLoadState.authLoaded = false;
      globalInitialLoadState.comunasLoaded = false;
      globalInitialLoadState.sidebarReady = false;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  return {
    isInitialLoadComplete,
    authLoading,
    comunasLoading,
    usuario,
    comunas
  };
} 