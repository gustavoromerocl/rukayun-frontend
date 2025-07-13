import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AdopcionesService } from '../adopcionesService';

// Mock del ApiClient
const mockApiClient = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
};

// Mock de fetch para solicitarAdopcion
global.fetch = vi.fn();

const adopcionMock = {
  adopcionId: 1,
  animalId: 1,
  usuarioId: 1,
  adopcionEstadoId: 1,
  fechaCreacion: '2023-01-01T00:00:00Z',
  fechaActualizacion: '2023-01-01T00:00:00Z',
  descripcionFamilia: 'Familia responsable con experiencia en mascotas',
  usuario: {
    usuarioId: 1,
    username: 'usuario1',
    nombres: 'Juan',
    apellidos: 'Pérez',
    activo: true,
    fechaCreacion: '2023-01-01',
    direccion: null,
    telefono: null,
    telefono2: null,
    comuna: null,
    rol: 'usuario',
  },
  adopcionEstado: {
    adopcionEstadoId: 1,
    nombre: 'PENDIENTE',
  },
  animal: {
    animalId: 1,
    nombre: 'Firulais',
    peso: 15.5,
    fechaRegistro: '2023-01-01',
    fechaNacimiento: '2020-01-01',
    publicado: true,
    descripcion: 'Un perro muy bueno',
    especieId: 1,
    sexoId: 1,
    organizacionId: 1,
    fechaEliminacion: null,
    tamanoId: 2,
    nivelActividadId: 1,
    especie: { especieId: 1, nombre: 'Perro' },
    sexo: { sexoId: 1, nombre: 'Macho' },
    organizacion: {
      organizacionId: 1,
      nombre: 'ONG 1',
      nombreContacto: 'Juan',
      telefonoContacto: '123',
      emailContacto: 'a@b.com',
      direccion: 'Calle 1',
      comunaId: 1,
      fechaEliminacion: null,
      comuna: { comunaId: 1, nombre: 'Comuna 1' },
      organizacionUsuarios: [],
    },
    tamano: { tamanoId: 2, nombre: 'Mediano' },
    nivelActividad: { nivelActividadId: 1, nombre: 'Bajo' },
    animalImagenes: [],
    edad: 3,
  },
  seguimientos: [],
};

describe('AdopcionesService', () => {
  let adopcionesService: AdopcionesService;

  beforeEach(() => {
    vi.clearAllMocks();
    adopcionesService = new AdopcionesService(mockApiClient as any);
  });

  describe('getAdopciones', () => {
    it('debería obtener todas las adopciones', async () => {
      const adopcionesMock = [adopcionMock];
      mockApiClient.get.mockResolvedValue(adopcionesMock);

      const result = await adopcionesService.getAdopciones();

      expect(mockApiClient.get).toHaveBeenCalledWith('/adopciones');
      expect(result).toEqual(adopcionesMock);
    });

    it('debería manejar errores en getAdopciones', async () => {
      const error = new Error('Error de red');
      mockApiClient.get.mockRejectedValue(error);

      await expect(adopcionesService.getAdopciones()).rejects.toThrow('Error de red');
    });
  });

  describe('getAdopcion', () => {
    it('debería obtener una adopción por ID', async () => {
      mockApiClient.get.mockResolvedValue(adopcionMock);

      const result = await adopcionesService.getAdopcion(1);

      expect(mockApiClient.get).toHaveBeenCalledWith('/adopciones/1');
      expect(result).toEqual(adopcionMock);
    });

    it('debería manejar errores en getAdopcion', async () => {
      const error = new Error('Adopción no encontrada');
      mockApiClient.get.mockRejectedValue(error);

      await expect(adopcionesService.getAdopcion(999)).rejects.toThrow('Adopción no encontrada');
    });
  });

  describe('createAdopcion', () => {
    it('debería crear una adopción', async () => {
      const newAdopcion = { ...adopcionMock, adopcionId: 2 };
      mockApiClient.post.mockResolvedValue(newAdopcion);

      const createData = {
        animalId: 2,
        usuarioId: 2,
        descripcionFamilia: 'Familia con experiencia en gatos',
      };

      const result = await adopcionesService.createAdopcion(createData);

      expect(mockApiClient.post).toHaveBeenCalledWith('/adopciones', createData);
      expect(result).toEqual(newAdopcion);
    });

    it('debería manejar errores en createAdopcion', async () => {
      const error = new Error('Error al crear adopción');
      mockApiClient.post.mockRejectedValue(error);

      const createData = {
        animalId: 2,
        usuarioId: 2,
        descripcionFamilia: 'Familia con experiencia en gatos',
      };

      await expect(adopcionesService.createAdopcion(createData)).rejects.toThrow('Error al crear adopción');
    });
  });

  describe('updateAdopcion', () => {
    it('debería actualizar una adopción', async () => {
      const updatedAdopcion = { ...adopcionMock, adopcionEstadoId: 2 };
      mockApiClient.put.mockResolvedValue(updatedAdopcion);

      const updateData = {
        adopcionEstadoId: 2,
        descripcionFamilia: 'Familia actualizada',
      };

      const result = await adopcionesService.updateAdopcion(1, updateData);

      expect(mockApiClient.put).toHaveBeenCalledWith('/adopciones/1', updateData);
      expect(result).toEqual(updatedAdopcion);
    });

    it('debería manejar errores en updateAdopcion', async () => {
      const error = new Error('Error al actualizar adopción');
      mockApiClient.put.mockRejectedValue(error);

      const updateData = { adopcionEstadoId: 2 };

      await expect(adopcionesService.updateAdopcion(1, updateData)).rejects.toThrow('Error al actualizar adopción');
    });
  });

  describe('deleteAdopcion', () => {
    it('debería eliminar una adopción', async () => {
      mockApiClient.delete.mockResolvedValue(undefined);

      await adopcionesService.deleteAdopcion(1);

      expect(mockApiClient.delete).toHaveBeenCalledWith('/adopciones/1');
    });

    it('debería manejar errores en deleteAdopcion', async () => {
      const error = new Error('Error al eliminar adopción');
      mockApiClient.delete.mockRejectedValue(error);

      await expect(adopcionesService.deleteAdopcion(1)).rejects.toThrow('Error al eliminar adopción');
    });
  });

  describe('getAdopcionesByEstado', () => {
    it('debería obtener adopciones por estado', async () => {
      const adopcionesMock = [adopcionMock];
      mockApiClient.get.mockResolvedValue(adopcionesMock);

      const result = await adopcionesService.getAdopcionesByEstado(1);

      expect(mockApiClient.get).toHaveBeenCalledWith('/adopciones?adopcionEstadoId=1');
      expect(result).toEqual(adopcionesMock);
    });

    it('debería manejar errores en getAdopcionesByEstado', async () => {
      const error = new Error('Error al obtener adopciones por estado');
      mockApiClient.get.mockRejectedValue(error);

      await expect(adopcionesService.getAdopcionesByEstado(1)).rejects.toThrow('Error al obtener adopciones por estado');
    });
  });

  describe('getAdopcionesByUsuario', () => {
    it('debería obtener adopciones por usuario', async () => {
      const adopcionesMock = [adopcionMock];
      mockApiClient.get.mockResolvedValue(adopcionesMock);

      const result = await adopcionesService.getAdopcionesByUsuario(1);

      expect(mockApiClient.get).toHaveBeenCalledWith('/adopciones?usuarioId=1');
      expect(result).toEqual(adopcionesMock);
    });

    it('debería manejar errores en getAdopcionesByUsuario', async () => {
      const error = new Error('Error al obtener adopciones por usuario');
      mockApiClient.get.mockRejectedValue(error);

      await expect(adopcionesService.getAdopcionesByUsuario(1)).rejects.toThrow('Error al obtener adopciones por usuario');
    });
  });

  describe('getAdopcionesByAnimal', () => {
    it('debería obtener adopciones por animal', async () => {
      const adopcionesMock = [adopcionMock];
      mockApiClient.get.mockResolvedValue(adopcionesMock);

      const result = await adopcionesService.getAdopcionesByAnimal(1);

      expect(mockApiClient.get).toHaveBeenCalledWith('/adopciones?animalId=1');
      expect(result).toEqual(adopcionesMock);
    });

    it('debería manejar errores en getAdopcionesByAnimal', async () => {
      const error = new Error('Error al obtener adopciones por animal');
      mockApiClient.get.mockRejectedValue(error);

      await expect(adopcionesService.getAdopcionesByAnimal(1)).rejects.toThrow('Error al obtener adopciones por animal');
    });
  });

  describe('solicitarAdopcion', () => {
    it('debería solicitar adopción sin token', async () => {
      const mockResponse = { success: true, message: 'Solicitud enviada' };
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });
      global.fetch = mockFetch;

      const solicitudData = {
        animalId: 1,
        usuarioId: 1,
        descripcionFamilia: 'Familia responsable',
      };

      const result = await adopcionesService.solicitarAdopcion(solicitudData);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/adopciones/solicitar'),
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(solicitudData),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('debería solicitar adopción con token', async () => {
      const mockResponse = { success: true, message: 'Solicitud enviada' };
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });
      global.fetch = mockFetch;

      const solicitudData = {
        animalId: 1,
        usuarioId: 1,
        descripcionFamilia: 'Familia responsable',
      };

      const result = await adopcionesService.solicitarAdopcion(solicitudData);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/adopciones/solicitar'),
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer test-token',
          },
          body: JSON.stringify(solicitudData),
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it('debería manejar errores en solicitarAdopcion', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ message: 'Error del servidor' }),
      });
      global.fetch = mockFetch;

      const solicitudData = {
        animalId: 1,
        usuarioId: 1,
      };

      await expect(adopcionesService.solicitarAdopcion(solicitudData)).rejects.toThrow('Error del servidor');
    });

    it('debería manejar errores de red en solicitarAdopcion', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: false,
        json: () => Promise.reject(new Error('Error de red')),
      });
      global.fetch = mockFetch;

      const solicitudData = {
        animalId: 1,
        usuarioId: 1,
      };

      await expect(adopcionesService.solicitarAdopcion(solicitudData)).rejects.toThrow('Error al solicitar adopción');
    });
  });
}); 