import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useComunas } from '../useComunas';

// Mock del store
const mockStore = {
  comunas: [] as Array<{ comunaId: number; nombre: string }>,
  loadingComunas: false,
  errorComunas: null as string | null,
  fetchComunas: vi.fn(),
};

vi.mock('@/lib/store', () => ({
  useAppStore: vi.fn((selector) => selector(mockStore)),
}));

// Mock de useApi
vi.mock('./useApi', () => ({
  useApi: () => ({
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  }),
}));

describe('useComunas', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStore.comunas = [];
    mockStore.loadingComunas = false;
    mockStore.errorComunas = null;
  });

  it('debería retornar el estado inicial correcto', () => {
    const { result } = renderHook(() => useComunas());
    
    expect(result.current.comunas).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('debería llamar fetchComunas cuando no hay comunas', async () => {
    mockStore.comunas = [];
    
    renderHook(() => useComunas());
    
    await waitFor(() => {
      expect(mockStore.fetchComunas).toHaveBeenCalledTimes(1);
    });
  });

  it('no debería llamar fetchComunas cuando ya hay comunas', async () => {
    mockStore.comunas = [{ comunaId: 1, nombre: 'Comuna 1' }];
    
    renderHook(() => useComunas());
    
    await waitFor(() => {
      expect(mockStore.fetchComunas).not.toHaveBeenCalled();
    });
  });

  it('debería retornar el estado de loading', () => {
    mockStore.loadingComunas = true;
    
    const { result } = renderHook(() => useComunas());
    
    expect(result.current.loading).toBe(true);
  });

  it('debería retornar el error cuando existe', () => {
    mockStore.errorComunas = 'Error al cargar comunas';
    
    const { result } = renderHook(() => useComunas());
    
    expect(result.current.error).toBe('Error al cargar comunas');
  });

  it('debería retornar las comunas cuando están cargadas', () => {
    const comunasMock = [
      { comunaId: 1, nombre: 'Comuna 1' },
      { comunaId: 2, nombre: 'Comuna 2' },
    ];
    mockStore.comunas = comunasMock;
    
    const { result } = renderHook(() => useComunas());
    
    expect(result.current.comunas).toEqual(comunasMock);
  });
}); 