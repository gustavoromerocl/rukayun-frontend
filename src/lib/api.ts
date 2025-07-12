import type { IPublicClientApplication } from "@azure/msal-browser";

// Configuración base de la API
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Cache para tokens
interface TokenCache {
  token: string;
  expiresAt: number;
}

const tokenCache = new Map<string, TokenCache>();

// Interceptor para agregar token de Microsoft a las requests
const createAuthInterceptor = (msalInstance: IPublicClientApplication) => {
  return async (config: RequestInit): Promise<RequestInit> => {
    try {
      // Obtener la cuenta activa
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        const accountId = accounts[0].localAccountId || accounts[0].homeAccountId || 'default';
        const cacheKey = `${accountId}_id_token`;
        
        // Verificar si tenemos un token válido en caché
        const cachedToken = tokenCache.get(cacheKey);
        const now = Date.now();
        
        if (cachedToken && cachedToken.expiresAt > now) {
          console.log('🔑 Usando token en caché');
          return {
            ...config,
            headers: {
              ...config.headers,
              'Authorization': `Bearer ${cachedToken.token}`,
            },
          };
        }
        
        console.log('🔑 Obteniendo nuevo token de Azure AD B2C');
        // Obtener token de acceso para el scope del backend
        const response = await msalInstance.acquireTokenSilent({
          scopes: ["openid", "profile", "email"],
          account: accounts[0],
        });
        
        // Usar el ID token en lugar del access token
        const idToken = response.idToken;
        if (!idToken) {
          console.warn('No se pudo obtener el ID token');
          return config;
        }
        
        // Cachear el token por 50 minutos (los tokens suelen durar 1 hora)
        const expiresAt = now + (50 * 60 * 1000);
        tokenCache.set(cacheKey, {
          token: idToken,
          expiresAt: expiresAt,
        });
        
        console.log('🔑 Token cacheado hasta:', new Date(expiresAt).toLocaleTimeString());
        
        // Agregar el token al header Authorization
        return {
          ...config,
          headers: {
            ...config.headers,
            'Authorization': `Bearer ${idToken}`,
          },
        };
      }
    } catch (error) {
      console.error('Error obteniendo token:', error);
      
      // Limpiar caché si hay error de autenticación
      if (error instanceof Error) {
        if (error.message.includes('interaction_required') || 
            error.message.includes('consent_required') ||
            error.message.includes('login_required')) {
          console.log('🔐 Error de autenticación, limpiando caché');
          tokenCache.clear();
        }
      }
      
      // No intentar login interactivo automáticamente para evitar bucles
      // El usuario deberá hacer login manualmente si es necesario
    }
    
    return config;
  };
};

// Cliente HTTP base con interceptores
class ApiClient {
  private authInterceptor: (config: RequestInit) => Promise<RequestInit>;

  constructor(msalInstance: IPublicClientApplication) {
    this.authInterceptor = createAuthInterceptor(msalInstance);
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_CONFIG.baseURL}${endpoint}`;
    
    console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
    
    // Aplicar interceptor de autenticación
    const configWithAuth = await this.authInterceptor({
      ...options,
      headers: {
        ...API_CONFIG.headers,
        ...options.headers,
      },
    });

    // Crear un AbortController para manejar el timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log(`⏰ Timeout for ${options.method || 'GET'} ${url}`);
      controller.abort();
    }, API_CONFIG.timeout);

    try {
      const response = await fetch(url, {
        ...configWithAuth,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log(`✅ API Response: ${response.status} ${response.statusText} for ${options.method || 'GET'} ${url}`);

      if (!response.ok) {
        // Manejar errores de autenticación específicamente
        if (response.status === 401 || response.status === 403) {
          console.log('🔐 Error de autenticación en respuesta, limpiando caché');
          tokenCache.clear();
          throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
        }
        
        throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
      }

      // Si la respuesta es 204 No Content, no intentar parsear JSON
      if (response.status === 204) {
        console.log(`📭 204 No Content for ${options.method || 'GET'} ${url}`);
        return {} as T;
      }

      // Verificar si hay contenido en la respuesta antes de intentar parsear JSON
      const responseText = await response.text();
      if (responseText.trim()) {
        const parsed = JSON.parse(responseText);
        console.log(`📦 Parsed response for ${options.method || 'GET'} ${url}:`, parsed);
        return parsed;
      }
      
      // Si no hay contenido, retornar un objeto vacío
      console.log(`📭 Empty response for ${options.method || 'GET'} ${url}`);
      return {} as T;
    } catch (error) {
      clearTimeout(timeoutId);
      
      // Manejar específicamente errores de aborto
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.error(`❌ Request aborted for ${options.method || 'GET'} ${url}:`, error.message);
          throw new Error(`Request timeout after ${API_CONFIG.timeout}ms`);
        }
        console.error(`❌ API Error for ${options.method || 'GET'} ${url}:`, error.message);
      } else {
        console.error(`❌ Unknown API Error for ${options.method || 'GET'} ${url}:`, error);
      }
      
      throw error;
    }
  }

  // Métodos HTTP
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Función para limpiar el caché de tokens
export const clearTokenCache = () => {
  console.log('🧹 Limpiando caché de tokens');
  tokenCache.clear();
};

// Función para obtener estadísticas del caché (para debugging)
export const getTokenCacheStats = () => {
  return {
    size: tokenCache.size,
    entries: Array.from(tokenCache.entries()).map(([key, value]) => ({
      key,
      expiresAt: new Date(value.expiresAt).toLocaleString(),
      isValid: value.expiresAt > Date.now()
    }))
  };
};

export { ApiClient, API_CONFIG }; 