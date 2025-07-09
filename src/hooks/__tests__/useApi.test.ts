import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useApi } from '../useApi';
import { ApiClient } from '@/lib/api';

// Mock de MSAL
vi.mock('@azure/msal-react', () => ({
  useMsal: () => ({
    instance: {
      acquireTokenSilent: vi.fn(),
      getActiveAccount: vi.fn(),
    },
  }),
}));

// Mock de ApiClient
vi.mock('@/lib/api', () => ({
  ApiClient: vi.fn().mockImplementation(() => ({
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  })),
}));

describe('useApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debería crear un ApiClient con la instancia de MSAL', () => {
    const { result } = renderHook(() => useApi());
    
    expect(ApiClient).toHaveBeenCalledTimes(1);
    expect(result.current).toBeInstanceOf(Object);
    expect(typeof result.current.get).toBe('function');
    expect(typeof result.current.post).toBe('function');
    expect(typeof result.current.put).toBe('function');
    expect(typeof result.current.delete).toBe('function');
  });

  it('debería retornar un ApiClient válido', () => {
    const { result } = renderHook(() => useApi());
    
    expect(result.current).toBeInstanceOf(Object);
    expect(typeof result.current.get).toBe('function');
    expect(typeof result.current.post).toBe('function');
    expect(typeof result.current.put).toBe('function');
    expect(typeof result.current.delete).toBe('function');
  });
}); 