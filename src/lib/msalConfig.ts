import type { Configuration } from "@azure/msal-browser";

// Obtener la URL base correcta
const getBaseUrl = () => {
  // En producción, usar la URL actual del navegador
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return window.location.origin;
  }
  // En desarrollo, usar la variable de entorno o localhost
  return import.meta.env.VITE_APP_HOST || 'http://localhost:5173';
};

const baseUrl = getBaseUrl();
const redirectUri = `${baseUrl}/dashboard`;

// Debug temporal para ver qué URL se está usando
console.log('MSAL Config - Base URL:', baseUrl);
console.log('MSAL Config - Redirect URI:', redirectUri);
console.log('MSAL Config - VITE_APP_HOST:', import.meta.env.VITE_APP_HOST);
console.log('MSAL Config - Window location:', typeof window !== 'undefined' ? window.location.origin : 'SSR');

export const msalConfig: Configuration = {
  auth: {
    clientId: "ce14b156-1e4a-4e31-bdc0-6b61de980f95", // Tu Application (client) ID
    authority: "https://accessmanagercloudnative1.b2clogin.com/accessmanagercloudnative1.onmicrosoft.com/B2C_1_singinsignup_rukayun",
    knownAuthorities: ["accessmanagercloudnative1.b2clogin.com"],
    redirectUri: redirectUri,
    postLogoutRedirectUri: baseUrl,
    navigateToLoginRequestUrl: false, // Evitar redirección automática
  },
  cache: {
    cacheLocation: "sessionStorage", // Usar sessionStorage en lugar de localStorage
    storeAuthStateInCookie: false, // No usar cookies para el estado de auth
  },
};