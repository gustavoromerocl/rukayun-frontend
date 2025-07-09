import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useUsuarios } from '../useUsuarios';
import { UsuariosService } from '@/services/usuariosService';

// Mock de useApi
const mockApiClient = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
};

vi.mock('../useApi', () => ({
  useApi: () => mockApiClient,
}));

// Mock de UsuariosService
vi.mock('@/services/usuariosService', () => ({
  UsuariosService: vi.fn().mockImplementation(() => ({
    listarUsuarios: vi.fn(),
  })),
}));

describe('useUsuarios', () => {
  let mockUsuariosService: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUsuariosService = {
      listarUsuarios: vi.fn(),
    };
    (UsuariosService as any).mockImplementation(() => mockUsuariosService);
  });

  it('debería retornar las funciones necesarias', () => {
    const { result } = renderHook(() => useUsuarios());
    
    expect(typeof result.current.fetchUsuarios).toBe('function');
    expect(typeof result.current.setUsuarios).toBe('function');
  });

  it('debería cargar usuarios automáticamente al montar', async () => {
    const usuariosMock = [
      { 
        usuarioId: 1, 
        username: 'user1', 
        nombres: 'Juan', 
        apellidos: 'Pérez',
        activo: true,
        fechaCreacion: '2023-01-01',
        direccion: null,
        telefono: null,
        telefono2: null,
        comuna: null,
        rol: 'usuario'
      },
      { 
        usuarioId: 2, 
        username: 'user2', 
        nombres: 'María', 
        apellidos: 'García',
        activo: true,
        fechaCreacion: '2023-01-01',
        direccion: null,
        telefono: null,
        telefono2: null,
        comuna: null,
        rol: 'usuario'
      },
    ];
    mockUsuariosService.listarUsuarios.mockResolvedValue(usuariosMock);

    const { result } = renderHook(() => useUsuarios());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(mockUsuariosService.listarUsuarios).toHaveBeenCalledWith(undefined);
    expect(result.current.usuarios).toEqual(usuariosMock);
    expect(result.current.error).toBe(null);
  });

  it('debería cargar usuarios con organizacionId', async () => {
    const organizacionId = 123;
    const usuariosMock = [
      { 
        usuarioId: 1, 
        username: 'user1', 
        nombres: 'Juan', 
        apellidos: 'Pérez',
        activo: true,
        fechaCreacion: '2023-01-01',
        direccion: null,
        telefono: null,
        telefono2: null,
        comuna: null,
        rol: 'usuario'
      },
    ];
    mockUsuariosService.listarUsuarios.mockResolvedValue(usuariosMock);

    renderHook(() => useUsuarios(organizacionId));

    await waitFor(() => {
      expect(mockUsuariosService.listarUsuarios).toHaveBeenCalledWith(organizacionId);
    });
  });

  it('debería manejar errores durante la carga', async () => {
    const errorMessage = 'Error al cargar usuarios';
    mockUsuariosService.listarUsuarios.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useUsuarios());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.usuarios).toEqual([]);
  });

  it('debería manejar errores genéricos', async () => {
    mockUsuariosService.listarUsuarios.mockRejectedValue('Error genérico');

    const { result } = renderHook(() => useUsuarios());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Error al cargar los usuarios');
  });

  it('debería permitir recargar usuarios manualmente', async () => {
    const usuariosMock = [
      { 
        usuarioId: 1, 
        username: 'user1', 
        nombres: 'Juan', 
        apellidos: 'Pérez',
        activo: true,
        fechaCreacion: '2023-01-01',
        direccion: null,
        telefono: null,
        telefono2: null,
        comuna: null,
        rol: 'usuario'
      },
    ];
    mockUsuariosService.listarUsuarios.mockResolvedValue(usuariosMock);

    const { result } = renderHook(() => useUsuarios());

    // Esperar a que termine la carga inicial
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Verificar que se cargaron los usuarios iniciales
    expect(result.current.usuarios).toEqual(usuariosMock);

    // Cambiar el mock para la recarga
    const nuevosUsuarios = [
      { 
        usuarioId: 2, 
        username: 'user2', 
        nombres: 'María', 
        apellidos: 'García',
        activo: true,
        fechaCreacion: '2023-01-01',
        direccion: null,
        telefono: null,
        telefono2: null,
        comuna: null,
        rol: 'usuario'
      },
    ];
    mockUsuariosService.listarUsuarios.mockResolvedValue(nuevosUsuarios);

    // Llamar fetchUsuarios manualmente usando act
    await act(async () => {
      await result.current.fetchUsuarios();
    });

    // Esperar a que el estado se actualice
    await waitFor(() => {
      expect(result.current.usuarios).toEqual(nuevosUsuarios);
    });
  });

  it('debería permitir establecer usuarios manualmente', async () => {
    // Mock para evitar la carga automática
    mockUsuariosService.listarUsuarios.mockResolvedValue([]);

    const { result } = renderHook(() => useUsuarios());

    // Esperar a que termine la carga inicial
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const usuariosManuales = [
      { 
        usuarioId: 1, 
        username: 'user1', 
        nombres: 'Juan', 
        apellidos: 'Pérez',
        activo: true,
        fechaCreacion: '2023-01-01',
        direccion: null,
        telefono: null,
        telefono2: null,
        comuna: null,
        rol: 'usuario'
      },
    ];

    // Usar act para setUsuarios
    act(() => {
      result.current.setUsuarios(usuariosManuales);
    });

    // Esperar a que el estado se actualice
    await waitFor(() => {
      expect(result.current.usuarios).toEqual(usuariosManuales);
    });
  });
}); 