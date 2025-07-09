import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UsuariosService } from '../usuariosService';

// Mock del ApiClient
const mockApiClient = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
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

const comunaMock = {
  comunaId: 1,
  nombre: 'Comuna 1',
};

describe('UsuariosService', () => {
  let usuariosService: UsuariosService;

  beforeEach(() => {
    vi.clearAllMocks();
    usuariosService = new UsuariosService(mockApiClient as any);
  });

  describe('verificarPerfil', () => {
    it('debería verificar el perfil del usuario', async () => {
      mockApiClient.post.mockResolvedValue(usuarioMock);

      const result = await usuariosService.verificarPerfil();

      expect(mockApiClient.post).toHaveBeenCalledWith('/usuarios/perfil/verificar');
      expect(result).toEqual(usuarioMock);
    });

    it('debería manejar errores en verificarPerfil', async () => {
      const error = new Error('Error al verificar perfil');
      mockApiClient.post.mockRejectedValue(error);

      await expect(usuariosService.verificarPerfil()).rejects.toThrow('Error al verificar perfil');
    });
  });

  describe('obtenerPerfil', () => {
    it('debería obtener el perfil del usuario', async () => {
      mockApiClient.get.mockResolvedValue(usuarioMock);

      const result = await usuariosService.obtenerPerfil();

      expect(mockApiClient.get).toHaveBeenCalledWith('/usuarios/perfil');
      expect(result).toEqual(usuarioMock);
    });

    it('debería manejar errores en obtenerPerfil', async () => {
      const error = new Error('Error al obtener perfil');
      mockApiClient.get.mockRejectedValue(error);

      await expect(usuariosService.obtenerPerfil()).rejects.toThrow('Error al obtener perfil');
    });
  });

  describe('actualizarPerfil', () => {
    it('debería actualizar el perfil del usuario', async () => {
      const updatedUsuario = { ...usuarioMock, nombres: 'Juan Carlos' };
      mockApiClient.put.mockResolvedValue(updatedUsuario);

      const updateData = {
        nombres: 'Juan Carlos',
        direccion: 'Nueva Dirección 456',
      };

      const result = await usuariosService.actualizarPerfil(updateData);

      expect(mockApiClient.put).toHaveBeenCalledWith('/usuarios/perfil', updateData);
      expect(result).toEqual(updatedUsuario);
    });

    it('debería manejar errores en actualizarPerfil', async () => {
      const error = new Error('Error al actualizar perfil');
      mockApiClient.put.mockRejectedValue(error);

      const updateData = { nombres: 'Juan Carlos' };

      await expect(usuariosService.actualizarPerfil(updateData)).rejects.toThrow('Error al actualizar perfil');
    });
  });

  describe('obtenerComunas', () => {
    it('debería obtener la lista de comunas', async () => {
      const comunasMock = [comunaMock, { comunaId: 2, nombre: 'Comuna 2' }];
      mockApiClient.get.mockResolvedValue(comunasMock);

      const result = await usuariosService.obtenerComunas();

      expect(mockApiClient.get).toHaveBeenCalledWith('/comunas');
      expect(result).toEqual(comunasMock);
    });

    it('debería manejar errores en obtenerComunas', async () => {
      const error = new Error('Error al obtener comunas');
      mockApiClient.get.mockRejectedValue(error);

      await expect(usuariosService.obtenerComunas()).rejects.toThrow('Error al obtener comunas');
    });
  });

  describe('listarUsuarios', () => {
    it('debería listar todos los usuarios', async () => {
      const usuariosMock = [usuarioMock, { ...usuarioMock, usuarioId: 2, username: 'usuario2' }];
      mockApiClient.get.mockResolvedValue(usuariosMock);

      const result = await usuariosService.listarUsuarios();

      expect(mockApiClient.get).toHaveBeenCalledWith('/usuarios');
      expect(result).toEqual(usuariosMock);
    });

    it('debería listar usuarios por organización', async () => {
      const usuariosMock = [usuarioMock];
      mockApiClient.get.mockResolvedValue(usuariosMock);

      const result = await usuariosService.listarUsuarios(1);

      expect(mockApiClient.get).toHaveBeenCalledWith('/usuarios?organizacionId=1');
      expect(result).toEqual(usuariosMock);
    });

    it('debería manejar errores en listarUsuarios', async () => {
      const error = new Error('Error al listar usuarios');
      mockApiClient.get.mockRejectedValue(error);

      await expect(usuariosService.listarUsuarios()).rejects.toThrow('Error al listar usuarios');
    });

    it('debería manejar errores en listarUsuarios por organización', async () => {
      const error = new Error('Error al listar usuarios de organización');
      mockApiClient.get.mockRejectedValue(error);

      await expect(usuariosService.listarUsuarios(1)).rejects.toThrow('Error al listar usuarios de organización');
    });
  });

  describe('crearUsuario', () => {
    it('debería crear un usuario', async () => {
      const newUsuario = { ...usuarioMock, usuarioId: 3, username: 'nuevo_usuario' };
      mockApiClient.post.mockResolvedValue(newUsuario);

      const createData = {
        username: 'nuevo_usuario',
        nombres: 'María',
        apellidos: 'García',
        email: 'maria@example.com',
        rol: 'usuario',
      };

      const result = await usuariosService.crearUsuario(createData);

      expect(mockApiClient.post).toHaveBeenCalledWith('/usuarios', createData);
      expect(result).toEqual(newUsuario);
    });

    it('debería manejar errores en crearUsuario', async () => {
      const error = new Error('Error al crear usuario');
      mockApiClient.post.mockRejectedValue(error);

      const createData = {
        username: 'nuevo_usuario',
        nombres: 'María',
        apellidos: 'García',
      };

      await expect(usuariosService.crearUsuario(createData)).rejects.toThrow('Error al crear usuario');
    });
  });

  describe('actualizarUsuario', () => {
    it('debería actualizar un usuario por ID', async () => {
      const updatedUsuario = { ...usuarioMock, nombres: 'Juan Carlos', activo: false };
      mockApiClient.put.mockResolvedValue(updatedUsuario);

      const updateData = {
        nombres: 'Juan Carlos',
        activo: false,
      };

      const result = await usuariosService.actualizarUsuario(1, updateData);

      expect(mockApiClient.put).toHaveBeenCalledWith('/usuarios/1', updateData);
      expect(result).toEqual(updatedUsuario);
    });

    it('debería manejar errores en actualizarUsuario', async () => {
      const error = new Error('Error al actualizar usuario');
      mockApiClient.put.mockRejectedValue(error);

      const updateData = { nombres: 'Juan Carlos' };

      await expect(usuariosService.actualizarUsuario(1, updateData)).rejects.toThrow('Error al actualizar usuario');
    });
  });
}); 