import type { IPublicClientApplication } from "@azure/msal-browser";

// Configuración base de la API
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Interceptor para agregar token de Microsoft a las requests
const createAuthInterceptor = (msalInstance: IPublicClientApplication) => {
  return async (config: RequestInit): Promise<RequestInit> => {
    try {
      // Obtener la cuenta activa
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length > 0) {
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
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

    try {
      const response = await fetch(url, {
        ...configWithAuth,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Si la respuesta es 204 No Content, no intentar parsear JSON
      if (response.status === 204) {
        return {} as T;
      }

      // Verificar si hay contenido en la respuesta antes de intentar parsear JSON
      const responseText = await response.text();
      if (responseText.trim()) {
        return JSON.parse(responseText);
      }
      
      // Si no hay contenido, retornar un objeto vacío
      return {} as T;
    } catch (error) {
      clearTimeout(timeoutId);
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

export { ApiClient, API_CONFIG }; 