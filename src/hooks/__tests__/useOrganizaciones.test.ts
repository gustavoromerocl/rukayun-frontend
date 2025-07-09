import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useOrganizaciones } from '../useOrganizaciones';

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

// Mock de OrganizacionesService
vi.mock('@/services/organizacionesService', () => ({
  OrganizacionesService: vi.fn().mockImplementation(() => mockOrganizacionesService),
}));

const organizacionBase = {
  organizacionId: 1,
  nombre: 'ONG 1',
  nombreContacto: 'Juan',
  telefonoContacto: '123',
  emailContacto: 'a@b.com',
  direccion: 'Calle 1',
  fechaEliminacion: null,
  comuna: { comunaId: 1, nombre: 'Comuna 1' },
  usuariosId: [1, 2],
};

let mockOrganizacionesService: any;

describe('useOrganizaciones', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockOrganizacionesService = {
      obtenerOrganizaciones: vi.fn(),
      crearOrganizacion: vi.fn(),
      actualizarOrganizacion: vi.fn(),
      eliminarOrganizacion: vi.fn(),
      agregarUsuarioAOrganizacion: vi.fn(),
      removerUsuarioDeOrganizacion: vi.fn(),
      obtenerOrganizacion: vi.fn(),
      obtenerUsuariosDeOrganizacion: vi.fn(),
      obtenerTodosLosUsuarios: vi.fn(),
      obtenerMiOrganizacion: vi.fn(),
    };
  });

  it('debería tener estado inicial correcto y cargar organizaciones automáticamente', async () => {
    mockOrganizacionesService.obtenerOrganizaciones.mockResolvedValue([organizacionBase]);
    const { result } = renderHook(() => useOrganizaciones());
    expect(result.current.loading).toBe(true);
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.organizaciones).toEqual([organizacionBase]);
    expect(result.current.error).toBe(null);
  });

  it('debería manejar error al cargar organizaciones', async () => {
    mockOrganizacionesService.obtenerOrganizaciones.mockRejectedValue(new Error('Error de carga'));
    const { result } = renderHook(() => useOrganizaciones());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.organizaciones).toEqual([]);
    expect(result.current.error).toBe('Error de carga');
  });

  it('debería crear una nueva organización', async () => {
    mockOrganizacionesService.obtenerOrganizaciones.mockResolvedValue([]);
    mockOrganizacionesService.crearOrganizacion.mockResolvedValue(organizacionBase);
    
    const { result } = renderHook(() => useOrganizaciones());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const nuevaOrg = {
      nombre: 'Nueva ONG',
      nombreContacto: 'María',
      telefonoContacto: '456',
      emailContacto: 'maria@test.com',
      direccion: 'Calle 2',
      comuna: { comunaId: 2, nombre: 'Comuna 2' },
      usuariosId: [],
    };

    await act(async () => {
      await result.current.createOrganizacion(nuevaOrg);
    });

    expect(mockOrganizacionesService.crearOrganizacion).toHaveBeenCalledWith(nuevaOrg);
    expect(result.current.organizaciones).toEqual([organizacionBase]);
  });

  it('debería actualizar una organización existente', async () => {
    mockOrganizacionesService.obtenerOrganizaciones.mockResolvedValue([organizacionBase]);
    const orgActualizada = { ...organizacionBase, nombre: 'ONG Actualizada' };
    mockOrganizacionesService.actualizarOrganizacion.mockResolvedValue(orgActualizada);
    
    const { result } = renderHook(() => useOrganizaciones());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const datosActualizacion = { nombre: 'ONG Actualizada' };
    await act(async () => {
      await result.current.updateOrganizacion(1, datosActualizacion);
    });

    expect(mockOrganizacionesService.actualizarOrganizacion).toHaveBeenCalledWith(1, datosActualizacion);
    expect(result.current.organizaciones).toEqual([orgActualizada]);
  });

  it('debería eliminar una organización', async () => {
    mockOrganizacionesService.obtenerOrganizaciones.mockResolvedValue([organizacionBase]);
    mockOrganizacionesService.eliminarOrganizacion.mockResolvedValue(undefined);
    
    const { result } = renderHook(() => useOrganizaciones());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.deleteOrganizacion(1);
    });

    expect(mockOrganizacionesService.eliminarOrganizacion).toHaveBeenCalledWith(1);
    expect(result.current.organizaciones).toEqual([]);
  });

  it('debería agregar un usuario a una organización', async () => {
    mockOrganizacionesService.obtenerOrganizaciones.mockResolvedValue([organizacionBase]);
    const orgConNuevoUsuario = { ...organizacionBase, usuariosId: [1, 2, 3] };
    mockOrganizacionesService.agregarUsuarioAOrganizacion.mockResolvedValue(undefined);
    mockOrganizacionesService.obtenerOrganizacion.mockResolvedValue(orgConNuevoUsuario);
    
    const { result } = renderHook(() => useOrganizaciones());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.agregarUsuarioAOrganizacion(1, 3);
    });

    expect(mockOrganizacionesService.agregarUsuarioAOrganizacion).toHaveBeenCalledWith(1, 3);
    expect(mockOrganizacionesService.obtenerOrganizacion).toHaveBeenCalledWith(1);
    expect(result.current.organizaciones).toEqual([orgConNuevoUsuario]);
  });

  it('debería remover un usuario de una organización', async () => {
    mockOrganizacionesService.obtenerOrganizaciones.mockResolvedValue([organizacionBase]);
    const orgSinUsuario = { ...organizacionBase, usuariosId: [1] };
    mockOrganizacionesService.removerUsuarioDeOrganizacion.mockResolvedValue(undefined);
    mockOrganizacionesService.obtenerOrganizacion.mockResolvedValue(orgSinUsuario);
    
    const { result } = renderHook(() => useOrganizaciones());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.removerUsuarioDeOrganizacion(1, 2);
    });

    expect(mockOrganizacionesService.removerUsuarioDeOrganizacion).toHaveBeenCalledWith(1, 2);
    expect(mockOrganizacionesService.obtenerOrganizacion).toHaveBeenCalledWith(1);
    expect(result.current.organizaciones).toEqual([orgSinUsuario]);
  });

  it('debería obtener usuarios de una organización', async () => {
    mockOrganizacionesService.obtenerOrganizaciones.mockResolvedValue([]);
    const usuariosMock = [
      { usuarioId: 1, username: 'user1', nombres: 'Juan', apellidos: 'Pérez', activo: true, fechaCreacion: '2023-01-01', direccion: null, telefono: null, telefono2: null, comuna: null, rol: 'usuario' },
    ];
    mockOrganizacionesService.obtenerUsuariosDeOrganizacion.mockResolvedValue(usuariosMock);
    
    const { result } = renderHook(() => useOrganizaciones());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const usuarios = await result.current.obtenerUsuariosDeOrganizacion(1);
    expect(mockOrganizacionesService.obtenerUsuariosDeOrganizacion).toHaveBeenCalledWith(1);
    expect(usuarios).toEqual(usuariosMock);
  });

  it('debería obtener todos los usuarios', async () => {
    mockOrganizacionesService.obtenerOrganizaciones.mockResolvedValue([]);
    const todosUsuariosMock = [
      { usuarioId: 1, username: 'user1', nombres: 'Juan', apellidos: 'Pérez', activo: true, fechaCreacion: '2023-01-01', direccion: null, telefono: null, telefono2: null, comuna: null, rol: 'usuario' },
      { usuarioId: 2, username: 'user2', nombres: 'María', apellidos: 'García', activo: true, fechaCreacion: '2023-01-01', direccion: null, telefono: null, telefono2: null, comuna: null, rol: 'usuario' },
    ];
    mockOrganizacionesService.obtenerTodosLosUsuarios.mockResolvedValue(todosUsuariosMock);
    
    const { result } = renderHook(() => useOrganizaciones());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const usuarios = await result.current.obtenerTodosLosUsuarios();
    expect(mockOrganizacionesService.obtenerTodosLosUsuarios).toHaveBeenCalled();
    expect(usuarios).toEqual(todosUsuariosMock);
  });

  it('debería obtener mi organización', async () => {
    mockOrganizacionesService.obtenerOrganizaciones.mockResolvedValue([]);
    mockOrganizacionesService.obtenerMiOrganizacion.mockResolvedValue(organizacionBase);
    
    const { result } = renderHook(() => useOrganizaciones());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const miOrg = await result.current.obtenerMiOrganizacion();
    expect(mockOrganizacionesService.obtenerMiOrganizacion).toHaveBeenCalled();
    expect(miOrg).toEqual(organizacionBase);
  });
}); 