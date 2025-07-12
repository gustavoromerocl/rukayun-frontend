import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useMsal } from '@azure/msal-react';
import { useApi } from './useApi';
import { UsuariosService } from '@/services/usuariosService';
import type { Usuario } from '@/services/usuariosService';
import { useAppStore } from '@/lib/store';
import { useAuthError } from './useAuthError';

export function useAuth() {
  const { accounts } = useMsal();
  const apiClient = useApi();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasLoadedRef = useRef(false);
  const { setIsColaborator, user: storeUser, setUser } = useAppStore();
  const { handleAuthError } = useAuthError();

  // Debug: Log cada vez que el componente se renderiza
  console.log('🔄 useAuth render - accounts:', accounts?.length, 'usuario:', !!usuario, 'loading:', loading, 'hasLoaded:', hasLoadedRef.current);

  // Memoizar el servicio para evitar recreaciones
  const usuariosService = useMemo(() => {
    console.log('🔧 Creando nuevo UsuariosService');
    return new UsuariosService(apiClient);
  }, [apiClient]);

  // Función para determinar si el usuario es colaborador
  const determinarRolColaborador = useCallback((userRole: string) => {
    const rolesColaboradores = ['SUPER_ADMIN', 'ADMIN', 'COLABORADOR'];
    // Hacer la comparación case-insensitive para mayor flexibilidad
    const userRoleUpper = userRole.toUpperCase();
    const esColaborador = rolesColaboradores.some(rol => 
      userRoleUpper.includes(rol) || rol.includes(userRoleUpper)
    );
    setIsColaborator(esColaborador);
    console.log('👤 Rol del usuario:', userRole, 'Es colaborador:', esColaborador);
  }, [setIsColaborator]);

  // Verificar perfil del usuario desde el backend (solo primera vez)
  const verificarPerfil = useCallback(async () => {
    console.log('🚀 verificarPerfil llamado');
    
    if (!accounts || accounts.length === 0) {
      console.log('❌ No hay sesión activa para verificar perfil');
      setUsuario(null);
      setUser(null);
      hasLoadedRef.current = false;
      setIsColaborator(false);
      return null;
    }

    // Evitar múltiples intentos simultáneos
    if (loading || hasLoadedRef.current) {
      console.log('⏳ Ya está cargando o ya cargado, saltando verificación');
      return usuario;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🔍 Verificando perfil del usuario desde backend...');
      
      const usuarioData = await usuariosService.verificarPerfil();
      
      console.log('✅ Perfil verificado:', usuarioData);
      setUsuario(usuarioData);
      setUser(usuarioData); // Guardar en Zustand
      hasLoadedRef.current = true;
      
      // Determinar rol del usuario
      const userRole = usuarioData.rol || 'USER';
      determinarRolColaborador(userRole);
      
      return usuarioData;
      
    } catch (err) {
      console.error('❌ Error verificando perfil:', err);
      
      // Manejar errores de autenticación específicamente
      if (err instanceof Error) {
        if (err.message.includes('Sesión expirada') || 
            err.message.includes('401') || 
            err.message.includes('403')) {
          handleAuthError(err);
          return null;
        }
      }
      
      setError(err instanceof Error ? err.message : 'Error al verificar perfil');
      setUsuario(null);
      setUser(null);
      hasLoadedRef.current = false;
      setIsColaborator(false);
      return null;
    } finally {
      setLoading(false);
      console.log('🏁 verificarPerfil completado');
    }
  }, [accounts, usuariosService, loading, usuario, determinarRolColaborador, setIsColaborator, setUser]);

  // Cargar perfil cuando hay una sesión activa
  useEffect(() => {
    console.log('📋 useEffect ejecutándose - accounts:', accounts?.length, 'usuario:', !!usuario, 'loading:', loading, 'hasLoaded:', hasLoadedRef.current);
    
    const hasActiveAccount = accounts && accounts.length > 0;
    
    if (hasActiveAccount) {
      // Si ya tenemos datos en Zustand, usarlos
      if (storeUser && !usuario && !loading && !hasLoadedRef.current) {
        console.log('📦 Usando datos del store de Zustand');
        setUsuario(storeUser);
        hasLoadedRef.current = true;
        
        // Determinar rol del usuario desde el store
        const userRole = storeUser.rol || 'USER';
        determinarRolColaborador(userRole);
      }
      // Si no hay datos en Zustand, verificar perfil
      else if (!storeUser && !usuario && !loading && !hasLoadedRef.current) {
        console.log('🔄 Sesión detectada, verificando perfil...');
        verificarPerfil();
      }
    } else {
      console.log('❌ No hay sesión activa, limpiando usuario');
      setUsuario(null);
      setUser(null);
      hasLoadedRef.current = false;
      setIsColaborator(false);
    }
  }, [accounts, usuario, loading, storeUser, verificarPerfil, setIsColaborator, setUser, determinarRolColaborador]);

  // Recargar perfil (forzar nueva verificación)
  const recargarPerfil = useCallback(() => {
    hasLoadedRef.current = false;
    setUsuario(null);
    setUser(null);
    if (accounts && accounts.length > 0) {
      verificarPerfil();
    }
  }, [accounts, verificarPerfil, setUser]);

  // Limpiar error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    usuario,
    loading,
    error,
    cargarPerfil: verificarPerfil, // Mantener compatibilidad
    recargarPerfil,
    clearError,
    isAuthenticated: !!usuario,
  };
} 