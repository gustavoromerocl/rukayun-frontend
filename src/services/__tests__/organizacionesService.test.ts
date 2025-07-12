import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrganizacionesService } from '../organizacionesService';

// Mock del ApiClient
const mockApiClient = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
};

const organizacionMock = {
  organizacionId: 1,
  nombre: 'ONG 1',
  nombreContacto: 'Juan',
  telefonoContacto: '123',
  emailContacto: 'a@b.com',
  direccion: 'Calle 1',
  fechaEliminacion: null,
  comuna: {
    comunaId: 1,
    nombre: 'Comuna 1',
  },
  usuariosId: [1, 2],
};

const usuarioMock = {
  usuarioId: 1,
  username: 'usuario1',
  nombres: 'Juan',
  apellidos: 'Pérez',
  activo: true,
  fechaCreacion: '2023-01-01',
  direccion: 'Calle 123',
  telefono: '123456789',
  telefono2: null,
  comuna: {
    comunaId: 1,
    nombre: 'Comuna 1',
  },
  rol: 'usuario',
  nombre: 'Juan Pérez',
  email: 'juan@example.com',
  organizacionId: 1,
  organizacion: {
    organizacionId: 1,
    nombre: 'ONG 1',
  },
};

describe('OrganizacionesService', () => {
  let organizacionesService: OrganizacionesService;

  beforeEach(() => {
    vi.clearAllMocks();
    organizacionesService = new OrganizacionesService(mockApiClient as any);
  });

  describe('obtenerOrganizaciones', () => {
    it('debería obtener todas las organizaciones', async () => {
      const organizacionesMock = [organizacionMock, { ...organizacionMock, organizacionId: 2, nombre: 'ONG 2' }];
      mockApiClient.get.mockResolvedValue(organizacionesMock);

      const result = await organizacionesService.obtenerOrganizaciones();

      expect(mockApiClient.get).toHaveBeenCalledWith('/organizaciones');
      expect(result).toEqual(organizacionesMock);
    });

    it('debería manejar errores en obtenerOrganizaciones', async () => {
      const error = new Error('Error al obtener organizaciones');
      mockApiClient.get.mockRejectedValue(error);

      await expect(organizacionesService.obtenerOrganizaciones()).rejects.toThrow('Error al obtener organizaciones');
    });
  });

  describe('obtenerOrganizacion', () => {
    it('debería obtener una organización por ID', async () => {
      mockApiClient.get.mockResolvedValue(organizacionMock);

      const result = await organizacionesService.obtenerOrganizacion(1);

      expect(mockApiClient.get).toHaveBeenCalledWith('/organizaciones/1');
      expect(result).toEqual(organizacionMock);
    });

    it('debería manejar errores en obtenerOrganizacion', async () => {
      const error = new Error('Organización no encontrada');
      mockApiClient.get.mockRejectedValue(error);

      await expect(organizacionesService.obtenerOrganizacion(999)).rejects.toThrow('Organización no encontrada');
    });
  });

  describe('crearOrganizacion', () => {
    it('debería crear una organización', async () => {
      const newOrganizacion = { ...organizacionMock, organizacionId: 3, nombre: 'Nueva ONG' };
      mockApiClient.post.mockResolvedValue(newOrganizacion);

      const createData = {
        nombre: 'Nueva ONG',
        nombreContacto: 'María',
        telefonoContacto: '456',
        emailContacto: 'maria@test.com',
        direccion: 'Calle 2',
        comuna: {
          comunaId: 2,
          nombre: 'Comuna 2',
        },
        usuariosId: [],
      };

      const result = await organizacionesService.crearOrganizacion(createData);

      expect(mockApiClient.post).toHaveBeenCalledWith('/organizaciones', createData);
      expect(result).toEqual(newOrganizacion);
    });

    it('debería manejar errores en crearOrganizacion', async () => {
      const error = new Error('Error al crear organización');
      mockApiClient.post.mockRejectedValue(error);

      const createData = {
        nombre: 'Nueva ONG',
        nombreContacto: 'María',
        telefonoContacto: '456',
        emailContacto: 'maria@test.com',
        direccion: 'Calle 2',
        comuna: {
          comunaId: 2,
          nombre: 'Comuna 2',
        },
        usuariosId: [],
      };

      await expect(organizacionesService.crearOrganizacion(createData)).rejects.toThrow('Error al crear organización');
    });
  });

  describe('actualizarOrganizacion', () => {
    it('debería actualizar una organización', async () => {
      const updatedOrganizacion = { ...organizacionMock, nombre: 'ONG Actualizada' };
      mockApiClient.put.mockResolvedValue(updatedOrganizacion);

      const updateData = {
        nombre: 'ONG Actualizada',
        emailContacto: 'nuevo@test.com',
      };

      const result = await organizacionesService.actualizarOrganizacion(1, updateData);

      expect(mockApiClient.put).toHaveBeenCalledWith('/organizaciones/1', updateData);
      expect(result).toEqual(updatedOrganizacion);
    });

    it('debería manejar errores en actualizarOrganizacion', async () => {
      const error = new Error('Error al actualizar organización');
      mockApiClient.put.mockRejectedValue(error);

      const updateData = { nombre: 'ONG Actualizada' };

      await expect(organizacionesService.actualizarOrganizacion(1, updateData)).rejects.toThrow('Error al actualizar organización');
    });
  });

  describe('eliminarOrganizacion', () => {
    it('debería eliminar una organización', async () => {
      mockApiClient.delete.mockResolvedValue(undefined);

      await organizacionesService.eliminarOrganizacion(1);

      expect(mockApiClient.delete).toHaveBeenCalledWith('/organizaciones/1');
    });

    it('debería manejar errores en eliminarOrganizacion', async () => {
      const error = new Error('Error al eliminar organización');
      mockApiClient.delete.mockRejectedValue(error);

      await expect(organizacionesService.eliminarOrganizacion(1)).rejects.toThrow('Error al eliminar organización');
    });
  });

  describe('agregarUsuarioAOrganizacion', () => {
    it('debería agregar un usuario a una organización', async () => {
      mockApiClient.post.mockResolvedValue(undefined);

      await organizacionesService.agregarUsuarioAOrganizacion(1, 3);

      expect(mockApiClient.post).toHaveBeenCalledWith('/organizaciones/1/usuarios/3');
    });

    it('debería manejar errores en agregarUsuarioAOrganizacion', async () => {
      const error = new Error('Error al agregar usuario a organización');
      mockApiClient.post.mockRejectedValue(error);

      await expect(organizacionesService.agregarUsuarioAOrganizacion(1, 3)).rejects.toThrow('Error al agregar usuario a organización');
    });
  });

  describe('removerUsuarioDeOrganizacion', () => {
    it('debería remover un usuario de una organización', async () => {
      mockApiClient.delete.mockResolvedValue(undefined);

      await organizacionesService.removerUsuarioDeOrganizacion(1, 2);

      expect(mockApiClient.delete).toHaveBeenCalledWith('/organizaciones/1/usuarios/2');
    });

    it('debería manejar errores en removerUsuarioDeOrganizacion', async () => {
      const error = new Error('Error al remover usuario de organización');
      mockApiClient.delete.mockRejectedValue(error);

      await expect(organizacionesService.removerUsuarioDeOrganizacion(1, 2)).rejects.toThrow('Error al remover usuario de organización');
    });
  });

  describe('obtenerUsuariosDeOrganizacion', () => {
    it('debería obtener usuarios de una organización', async () => {
      const usuariosMock = [usuarioMock, { ...usuarioMock, usuarioId: 2, username: 'usuario2' }];
      mockApiClient.get.mockResolvedValue(usuariosMock);

      const result = await organizacionesService.obtenerUsuariosDeOrganizacion(1);

      expect(mockApiClient.get).toHaveBeenCalledWith('/usuarios?organizacionId=1');
      expect(result).toEqual(usuariosMock);
    });

    it('debería manejar errores en obtenerUsuariosDeOrganizacion', async () => {
      const error = new Error('Error al obtener usuarios de organización');
      mockApiClient.get.mockRejectedValue(error);

      await expect(organizacionesService.obtenerUsuariosDeOrganizacion(1)).rejects.toThrow('Error al obtener usuarios de organización');
    });
  });

  describe('obtenerTodosLosUsuarios', () => {
    it('debería obtener todos los usuarios', async () => {
      const todosUsuariosMock = [usuarioMock, { ...usuarioMock, usuarioId: 2, username: 'usuario2' }];
      mockApiClient.get.mockResolvedValue(todosUsuariosMock);

      const result = await organizacionesService.obtenerTodosLosUsuarios();

      expect(mockApiClient.get).toHaveBeenCalledWith('/usuarios');
      expect(result).toEqual(todosUsuariosMock);
    });

    it('debería manejar errores en obtenerTodosLosUsuarios', async () => {
      const error = new Error('Error al obtener todos los usuarios');
      mockApiClient.get.mockRejectedValue(error);

      await expect(organizacionesService.obtenerTodosLosUsuarios()).rejects.toThrow('Error al obtener todos los usuarios');
    });
  });

  describe('obtenerMiOrganizacion', () => {
    it('debería obtener mi organización', async () => {
      const miOrganizacionMock = [organizacionMock];
      mockApiClient.get.mockResolvedValue(miOrganizacionMock);

      const result = await organizacionesService.obtenerMiOrganizacion();

      expect(mockApiClient.get).toHaveBeenCalledWith('/organizaciones/me');
      expect(result).toEqual(organizacionMock);
    });

    it('debería manejar errores en obtenerMiOrganizacion', async () => {
      const error = new Error('Error al obtener mi organización');
      mockApiClient.get.mockRejectedValue(error);

      await expect(organizacionesService.obtenerMiOrganizacion()).rejects.toThrow('Error al obtener mi organización');
    });

    it('debería manejar array vacío en obtenerMiOrganizacion', async () => {
      mockApiClient.get.mockResolvedValue([]);

      const result = await organizacionesService.obtenerMiOrganizacion();

      expect(mockApiClient.get).toHaveBeenCalledWith('/organizaciones/me');
      expect(result).toBeUndefined();
    });
  });
}); 