import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useMsal } from '@azure/msal-react';
import { useApi } from './useApi';
import { UsuariosService } from '@/services/usuariosService';
import type { Usuario } from '@/services/usuariosService';

export function useAuth() {
  const { accounts } = useMsal();
  const apiClient = useApi();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasLoadedRef = useRef(false);

  // Debug: Log cada vez que el componente se renderiza
  console.log('🔄 useAuth render - accounts:', accounts?.length, 'usuario:', !!usuario, 'loading:', loading, 'hasLoaded:', hasLoadedRef.current);

  // Memoizar el servicio para evitar recreaciones
  const usuariosService = useMemo(() => {
    console.log('🔧 Creando nuevo UsuariosService');
    return new UsuariosService(apiClient);
  }, [apiClient]);

  // Cargar perfil del usuario desde el backend
  const cargarPerfil = useCallback(async () => {
    console.log('🚀 cargarPerfil llamado');
    
    if (!accounts || accounts.length === 0) {
      console.log('❌ No hay sesión activa para cargar perfil');
      setUsuario(null);
      hasLoadedRef.current = false;
      return null;
    }

    // Evitar múltiples intentos simultáneos
    if (loading || hasLoadedRef.current) {
      console.log('⏳ Ya está cargando o ya cargado, saltando carga');
      return usuario;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🔍 Cargando perfil del usuario desde backend...');
      
      const usuarioData = await usuariosService.obtenerPerfil();
      
      console.log('✅ Perfil cargado:', usuarioData);
      setUsuario(usuarioData);
      hasLoadedRef.current = true;
      
      return usuarioData;
      
    } catch (err) {
      console.error('❌ Error cargando perfil:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar perfil');
      setUsuario(null);
      hasLoadedRef.current = false;
      return null;
    } finally {
      setLoading(false);
      console.log('🏁 cargarPerfil completado');
    }
  }, [accounts, usuariosService, loading, usuario]);

  // Cargar perfil cuando hay una sesión activa
  useEffect(() => {
    console.log('📋 useEffect ejecutándose - accounts:', accounts?.length, 'usuario:', !!usuario, 'loading:', loading, 'hasLoaded:', hasLoadedRef.current);
    
    const hasActiveAccount = accounts && accounts.length > 0;
    
    if (hasActiveAccount && !usuario && !loading && !hasLoadedRef.current) {
      console.log('🔄 Sesión detectada, cargando perfil...');
      cargarPerfil();
    } else if (!hasActiveAccount) {
      console.log('❌ No hay sesión activa, limpiando usuario');
      setUsuario(null);
      hasLoadedRef.current = false;
    }
  }, [accounts, usuario, loading, cargarPerfil]);

  // Recargar perfil
  const recargarPerfil = useCallback(() => {
    hasLoadedRef.current = false;
    setUsuario(null);
    if (accounts && accounts.length > 0) {
      cargarPerfil();
    }
  }, [accounts, cargarPerfil]);

  // Limpiar error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    usuario,
    loading,
    error,
    cargarPerfil,
    recargarPerfil,
    clearError,
    isAuthenticated: !!usuario,
  };
} 