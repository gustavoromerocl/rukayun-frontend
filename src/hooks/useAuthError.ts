import { useCallback } from 'react';
import { useMsal } from '@azure/msal-react';
import { useNavigate } from 'react-router-dom';
import { clearTokenCache } from '@/lib/api';
import { toast } from 'sonner';

export function useAuthError() {
  const { instance } = useMsal();
  const navigate = useNavigate();

  const handleAuthError = useCallback((error: Error) => {
    console.log('🔐 Manejando error de autenticación:', error.message);
    
    // Limpiar caché de tokens
    clearTokenCache();
    
    // Mostrar mensaje al usuario
    toast.error('Sesión expirada. Redirigiendo al login...');
    
    // Redirigir al login después de un breve delay
    setTimeout(() => {
      instance.logoutPopup().then(() => {
        navigate('/');
      }).catch(() => {
        // Si falla el logout, redirigir de todas formas
        navigate('/');
      });
    }, 2000);
  }, [instance, navigate]);

  return { handleAuthError };
} 