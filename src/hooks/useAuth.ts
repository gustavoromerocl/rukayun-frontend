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
  const hasVerifiedRef = useRef(false);

  // Debug: Log cada vez que el componente se renderiza
  console.log('🔄 useAuth render - accounts:', accounts?.length, 'usuario:', !!usuario, 'loading:', loading, 'hasVerified:', hasVerifiedRef.current);

  // Memoizar el servicio para evitar recreaciones
  const usuariosService = useMemo(() => {
    console.log('🔧 Creando nuevo UsuariosService');
    return new UsuariosService(apiClient);
  }, [apiClient]);

  // Verificar perfil del usuario
  const verificarPerfil = useCallback(async () => {
    console.log('🚀 verificarPerfil llamado');
    
    if (!accounts || accounts.length === 0) {
      console.log('❌ No hay sesión activa para verificar perfil');
      setUsuario(null);
      hasVerifiedRef.current = false;
      return null;
    }

    // Evitar múltiples intentos simultáneos
    if (loading || hasVerifiedRef.current) {
      console.log('⏳ Ya está cargando o ya verificado, saltando verificación');
      return usuario;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🔍 Verificando perfil del usuario...');
      
      const usuarioData = await usuariosService.verificarPerfil();
      
      console.log('✅ Perfil verificado:', usuarioData);
      setUsuario(usuarioData);
      hasVerifiedRef.current = true;
      
      return usuarioData;
      
    } catch (err) {
      console.error('❌ Error verificando perfil:', err);
      setError(err instanceof Error ? err.message : 'Error al verificar perfil');
      setUsuario(null);
      hasVerifiedRef.current = false;
      return null;
    } finally {
      setLoading(false);
      console.log('🏁 verificarPerfil completado');
    }
  }, [accounts, usuariosService, loading, usuario]);

  // Verificar perfil solo una vez cuando hay una sesión activa
  useEffect(() => {
    console.log('📋 useEffect ejecutándose - accounts:', accounts?.length, 'usuario:', !!usuario, 'loading:', loading, 'hasVerified:', hasVerifiedRef.current);
    
    const hasActiveAccount = accounts && accounts.length > 0;
    
    if (hasActiveAccount && !usuario && !loading && !hasVerifiedRef.current) {
      console.log('🔄 Sesión detectada, verificando perfil...');
      verificarPerfil();
    } else if (!hasActiveAccount) {
      console.log('❌ No hay sesión activa, limpiando usuario');
      setUsuario(null);
      hasVerifiedRef.current = false;
    }
  }, [accounts, usuario, loading, verificarPerfil]);

  // Limpiar error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    usuario,
    loading,
    error,
    verificarPerfil,
    clearError,
    isAuthenticated: !!usuario,
  };
} 