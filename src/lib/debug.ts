import { getTokenCacheStats } from './api';

// Función para mostrar estadísticas del sistema de autenticación
export const debugAuthSystem = () => {
  const tokenStats = getTokenCacheStats();
  
  console.group('🔍 Debug del Sistema de Autenticación');
  console.log('📊 Estadísticas del caché de tokens:', tokenStats);
  console.log('🌐 URL actual:', window.location.href);
  console.log('⏰ Timestamp:', new Date().toLocaleString());
  console.groupEnd();
  
  return tokenStats;
};

// Función para limpiar logs de debugging
export const clearDebugLogs = () => {
  console.clear();
  console.log('🧹 Logs de debugging limpiados');
};

// Función para exportar información de debugging
export const exportDebugInfo = () => {
  const debugInfo = {
    timestamp: new Date().toISOString(),
    url: window.location.href,
    userAgent: navigator.userAgent,
    tokenStats: getTokenCacheStats(),
    localStorage: Object.keys(localStorage),
    sessionStorage: Object.keys(sessionStorage),
  };
  
  console.log('📤 Información de debugging exportada:', debugInfo);
  return debugInfo;
}; 