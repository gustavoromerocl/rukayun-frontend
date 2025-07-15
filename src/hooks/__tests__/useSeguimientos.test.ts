import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSeguimientos } from '../useSeguimientos';

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

// Mock de SeguimientosService
vi.mock('@/services/seguimientosService', () => ({
  SeguimientosService: vi.fn().mockImplementation(() => mockSeguimientosService),
}));

const seguimientoBase = {
  seguimientoId: 1,
  adopcionId: 1,
  usuarioId: 1,
  fechaSeguimiento: '2023-01-01',
  observaciones: 'Observación de prueba',
  estado: 'PENDIENTE',
  createdAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
};

const paginationResponse = {
  items: [seguimientoBase],
  totalCount: 1,
  page: 1,
  pageSize: 12,
  totalPages: 1,
  hasPreviousPage: false,
  hasNextPage: false,
};

let mockSeguimientosService: any;

describe('useSeguimientos', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSeguimientosService = {
      getSeguimientos: vi.fn(),
      getSeguimiento: vi.fn(),
      createSeguimiento: vi.fn(),
      updateSeguimiento: vi.fn(),
      deleteSeguimiento: vi.fn(),
      getSeguimientosByAdopcion: vi.fn(),
      getSeguimientosByUsuario: vi.fn(),
    };
  });

  it('debería tener estado inicial correcto', () => {
    const { result } = renderHook(() => useSeguimientos());
    
    expect(result.current.seguimientos).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.pagination).toEqual({
      totalCount: 0,
      page: 1,
      pageSize: 12,
      totalPages: 0,
      hasPreviousPage: false,
      hasNextPage: false,
    });
  });

  it('debería obtener seguimientos exitosamente', async () => {
    mockSeguimientosService.getSeguimientos.mockResolvedValue(paginationResponse);
    
    const { result } = renderHook(() => useSeguimientos());

    await act(async () => {
      await result.current.fetchSeguimientos();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.seguimientos).toEqual([seguimientoBase]);
    expect(result.current.error).toBe(null);
    expect(result.current.pagination).toEqual({
      totalCount: 1,
      page: 1,
      pageSize: 12,
      totalPages: 1,
      hasPreviousPage: false,
      hasNextPage: false,
    });
  });

  it('debería manejar error al obtener seguimientos', async () => {
    mockSeguimientosService.getSeguimientos.mockRejectedValue(new Error('Error de carga'));
    
    const { result } = renderHook(() => useSeguimientos());

    await act(async () => {
      await result.current.fetchSeguimientos();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.seguimientos).toEqual([]);
    expect(result.current.error).toBe('Error de carga');
    expect(result.current.pagination).toEqual({
      totalCount: 0,
      page: 1,
      pageSize: 12,
      totalPages: 0,
      hasPreviousPage: false,
      hasNextPage: false,
    });
  });

  it('debería obtener un seguimiento por ID', async () => {
    mockSeguimientosService.getSeguimiento.mockResolvedValue(seguimientoBase);
    
    const { result } = renderHook(() => useSeguimientos());

    const seguimiento = await act(async () => {
      return await result.current.fetchSeguimiento(1);
    });

    expect(result.current.loading).toBe(false);
    expect(seguimiento).toEqual(seguimientoBase);
    expect(mockSeguimientosService.getSeguimiento).toHaveBeenCalledWith(1);
  });

  it('debería crear un seguimiento', async () => {
    const nuevoSeguimiento = { ...seguimientoBase, seguimientoId: 2 };
    mockSeguimientosService.createSeguimiento.mockResolvedValue(nuevoSeguimiento);
    
    const { result } = renderHook(() => useSeguimientos());

    const data = {
      adopcionId: 1,
      seguimientoTipoId: 1,
      fechaInteraccion: '2023-01-01T00:00:00Z',
      descripcion: 'Nueva observación',
    };

    const seguimiento = await act(async () => {
      return await result.current.createSeguimiento(data);
    });

    expect(result.current.loading).toBe(false);
    expect(seguimiento).toEqual(nuevoSeguimiento);
    expect(mockSeguimientosService.createSeguimiento).toHaveBeenCalledWith(data);
  });

  it('debería actualizar un seguimiento', async () => {
    const seguimientoActualizado = { ...seguimientoBase, observaciones: 'Observación actualizada' };
    mockSeguimientosService.updateSeguimiento.mockResolvedValue(seguimientoActualizado);
    
    const { result } = renderHook(() => useSeguimientos());

    const data = {
      observaciones: 'Observación actualizada',
    };

    const seguimiento = await act(async () => {
      return await result.current.updateSeguimiento(1, data);
    });

    expect(result.current.loading).toBe(false);
    expect(seguimiento).toEqual(seguimientoActualizado);
    expect(mockSeguimientosService.updateSeguimiento).toHaveBeenCalledWith(1, data);
  });

  it('debería eliminar un seguimiento', async () => {
    mockSeguimientosService.deleteSeguimiento.mockResolvedValue(undefined);
    
    const { result } = renderHook(() => useSeguimientos());

    await act(async () => {
      await result.current.deleteSeguimiento(1);
    });

    expect(result.current.loading).toBe(false);
    expect(mockSeguimientosService.deleteSeguimiento).toHaveBeenCalledWith(1);
  });

  it('debería obtener seguimientos por adopción', async () => {
    mockSeguimientosService.getSeguimientosByAdopcion.mockResolvedValue(paginationResponse);
    
    const { result } = renderHook(() => useSeguimientos());

    await act(async () => {
      await result.current.fetchSeguimientosByAdopcion(1);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.seguimientos).toEqual([seguimientoBase]);
    expect(mockSeguimientosService.getSeguimientosByAdopcion).toHaveBeenCalledWith(1, {});
  });

  it('debería obtener seguimientos por usuario', async () => {
    mockSeguimientosService.getSeguimientosByUsuario.mockResolvedValue(paginationResponse);
    
    const { result } = renderHook(() => useSeguimientos());

    await act(async () => {
      await result.current.fetchSeguimientosByUsuario(1);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.seguimientos).toEqual([seguimientoBase]);
    expect(mockSeguimientosService.getSeguimientosByUsuario).toHaveBeenCalledWith(1, {});
  });

  it('debería limpiar el error', async () => {
    mockSeguimientosService.getSeguimientos.mockRejectedValue(new Error('Error de prueba'));
    
    const { result } = renderHook(() => useSeguimientos());

    // Generar un error
    await act(async () => {
      await result.current.fetchSeguimientos();
    });

    expect(result.current.error).toBe('Error de prueba');

    // Limpiar el error
    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBe(null);
  });

  it('debería manejar errores en operaciones CRUD', async () => {
    mockSeguimientosService.createSeguimiento.mockRejectedValue(new Error('Error al crear'));
    mockSeguimientosService.updateSeguimiento.mockRejectedValue(new Error('Error al actualizar'));
    mockSeguimientosService.deleteSeguimiento.mockRejectedValue(new Error('Error al eliminar'));
    
    const { result } = renderHook(() => useSeguimientos());

    // Probar error en create
    await act(async () => {
      try {
        await result.current.createSeguimiento({ adopcionId: 1, seguimientoTipoId: 1, fechaInteraccion: '2023-01-01T00:00:00Z', descripcion: 'test' });
      } catch (error) {
        // Error esperado
      }
    });
    expect(result.current.error).toBe('Error al crear');

    // Limpiar error
    act(() => {
      result.current.clearError();
    });

    // Probar error en update
    await act(async () => {
      try {
        await result.current.updateSeguimiento(1, { observaciones: 'test' });
      } catch (error) {
        // Error esperado
      }
    });
    expect(result.current.error).toBe('Error al actualizar');

    // Limpiar error
    act(() => {
      result.current.clearError();
    });

    // Probar error en delete
    await act(async () => {
      try {
        await result.current.deleteSeguimiento(1);
      } catch (error) {
        // Error esperado
      }
    });
    expect(result.current.error).toBe('Error al eliminar');
  });
}); 