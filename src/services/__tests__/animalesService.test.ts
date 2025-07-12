import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AnimalesService } from '../animalesService';

// Mock del ApiClient
const mockApiClient = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
};

const animalMock = {
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
};

const animalesResponseMock = {
  items: [animalMock],
  totalCount: 1,
  page: 1,
  pageSize: 12,
  totalPages: 1,
  hasPreviousPage: false,
  hasNextPage: false,
};

describe('AnimalesService', () => {
  let animalesService: AnimalesService;

  beforeEach(() => {
    vi.clearAllMocks();
    animalesService = new AnimalesService(mockApiClient as any);
  });

  describe('getAnimales', () => {
    it('debería obtener animales sin filtros', async () => {
      mockApiClient.get.mockResolvedValue(animalesResponseMock);

      const result = await animalesService.getAnimales();

      expect(mockApiClient.get).toHaveBeenCalledWith('/animales');
      expect(result).toEqual(animalesResponseMock);
    });

    it('debería obtener animales con filtros', async () => {
      mockApiClient.get.mockResolvedValue(animalesResponseMock);
      const filters = {
        search: 'perro',
        especieId: 1,
        publicado: true,
        page: 1,
        pageSize: 10,
      };

      const result = await animalesService.getAnimales(filters);

      expect(mockApiClient.get).toHaveBeenCalledWith('/animales?search=perro&especieId=1&publicado=true&page=1&pageSize=10');
      expect(result).toEqual(animalesResponseMock);
    });

    it('debería manejar errores en getAnimales', async () => {
      const error = new Error('Error de red');
      mockApiClient.get.mockRejectedValue(error);

      await expect(animalesService.getAnimales()).rejects.toThrow('Error de red');
    });
  });

  describe('getAnimal', () => {
    it('debería obtener un animal por ID', async () => {
      mockApiClient.get.mockResolvedValue(animalMock);

      const result = await animalesService.getAnimal(1);

      expect(mockApiClient.get).toHaveBeenCalledWith('/animales/1');
      expect(result).toEqual(animalMock);
    });

    it('debería manejar errores en getAnimal', async () => {
      const error = new Error('Animal no encontrado');
      mockApiClient.get.mockRejectedValue(error);

      await expect(animalesService.getAnimal(999)).rejects.toThrow('Animal no encontrado');
    });
  });

  describe('createAnimal', () => {
    it('debería crear un animal', async () => {
      const newAnimal = { ...animalMock, animalId: 2 };
      mockApiClient.post.mockResolvedValue(newAnimal);

      const createData = {
        nombre: 'Luna',
        peso: 8.5,
        fechaNacimiento: '2021-01-01',
        descripcion: 'Una gata muy cariñosa',
        especieId: 2,
        sexoId: 2,
        organizacionId: 1,
        tamanoId: 1,
        nivelActividadId: 2,
        publicado: false,
      };

      const result = await animalesService.createAnimal(createData);

      expect(mockApiClient.post).toHaveBeenCalledWith('/animales', createData);
      expect(result).toEqual(newAnimal);
    });

    it('debería manejar errores en createAnimal', async () => {
      const error = new Error('Error al crear animal');
      mockApiClient.post.mockRejectedValue(error);

      const createData = {
        nombre: 'Luna',
        peso: 8.5,
        fechaNacimiento: '2021-01-01',
        descripcion: 'Una gata muy cariñosa',
        especieId: 2,
        sexoId: 2,
        organizacionId: 1,
        tamanoId: 1,
        nivelActividadId: 2,
      };

      await expect(animalesService.createAnimal(createData)).rejects.toThrow('Error al crear animal');
    });
  });

  describe('updateAnimal', () => {
    it('debería actualizar un animal', async () => {
      const updatedAnimal = { ...animalMock, nombre: 'Firulais Actualizado' };
      mockApiClient.put.mockResolvedValue(updatedAnimal);

      const updateData = {
        nombre: 'Firulais Actualizado',
        descripcion: 'Un perro muy bueno y actualizado',
      };

      const result = await animalesService.updateAnimal(1, updateData);

      expect(mockApiClient.put).toHaveBeenCalledWith('/animales/1', updateData);
      expect(result).toEqual(updatedAnimal);
    });

    it('debería manejar errores en updateAnimal', async () => {
      const error = new Error('Error al actualizar animal');
      mockApiClient.put.mockRejectedValue(error);

      const updateData = { nombre: 'Nuevo Nombre' };

      await expect(animalesService.updateAnimal(1, updateData)).rejects.toThrow('Error al actualizar animal');
    });
  });

  describe('deleteAnimal', () => {
    it('debería eliminar un animal', async () => {
      mockApiClient.delete.mockResolvedValue(undefined);

      await animalesService.deleteAnimal(1);

      expect(mockApiClient.delete).toHaveBeenCalledWith('/animales/1');
    });

    it('debería manejar errores en deleteAnimal', async () => {
      const error = new Error('Error al eliminar animal');
      mockApiClient.delete.mockRejectedValue(error);

      await expect(animalesService.deleteAnimal(1)).rejects.toThrow('Error al eliminar animal');
    });
  });

  describe('togglePublicacion', () => {
    it('debería publicar un animal', async () => {
      const publishedAnimal = { ...animalMock, publicado: true };
      mockApiClient.put.mockResolvedValue(publishedAnimal);

      const result = await animalesService.togglePublicacion(1, true);

      expect(mockApiClient.put).toHaveBeenCalledWith('/animales/1', { publicado: true });
      expect(result).toEqual(publishedAnimal);
    });

    it('debería despublicar un animal', async () => {
      const unpublishedAnimal = { ...animalMock, publicado: false };
      mockApiClient.put.mockResolvedValue(unpublishedAnimal);

      const result = await animalesService.togglePublicacion(1, false);

      expect(mockApiClient.put).toHaveBeenCalledWith('/animales/1', { publicado: false });
      expect(result).toEqual(unpublishedAnimal);
    });
  });

  describe('getAnimalesByOrganizacion', () => {
    it('debería obtener animales por organización', async () => {
      mockApiClient.get.mockResolvedValue(animalesResponseMock);

      const result = await animalesService.getAnimalesByOrganizacion(1);

      expect(mockApiClient.get).toHaveBeenCalledWith('/animales?organizacionId=1');
      expect(result).toEqual(animalesResponseMock);
    });

    it('debería obtener animales por organización con filtros adicionales', async () => {
      mockApiClient.get.mockResolvedValue(animalesResponseMock);
      const filters = { publicado: true, especieId: 1 };

      const result = await animalesService.getAnimalesByOrganizacion(1, filters);

      // Verificar que la URL contiene todos los parámetros esperados sin importar el orden
      const callArgs = mockApiClient.get.mock.calls[0][0];
      expect(callArgs).toContain('/animales?');
      expect(callArgs).toContain('organizacionId=1');
      expect(callArgs).toContain('publicado=true');
      expect(callArgs).toContain('especieId=1');
      expect(result).toEqual(animalesResponseMock);
    });
  });

  describe('getAnimalesPublicados', () => {
    it('debería obtener animales publicados', async () => {
      mockApiClient.get.mockResolvedValue(animalesResponseMock);

      const result = await animalesService.getAnimalesPublicados();

      expect(mockApiClient.get).toHaveBeenCalledWith('/animales?publicado=true');
      expect(result).toEqual(animalesResponseMock);
    });

    it('debería obtener animales publicados con filtros adicionales', async () => {
      mockApiClient.get.mockResolvedValue(animalesResponseMock);
      const filters = { especieId: 1, comunaId: 2 };

      const result = await animalesService.getAnimalesPublicados(filters);

      // Verificar que la URL contiene todos los parámetros esperados sin importar el orden
      const callArgs = mockApiClient.get.mock.calls[0][0];
      expect(callArgs).toContain('/animales?');
      expect(callArgs).toContain('publicado=true');
      expect(callArgs).toContain('especieId=1');
      expect(callArgs).toContain('comunaId=2');
      expect(result).toEqual(animalesResponseMock);
    });
  });

  describe('deleteAnimalImage', () => {
    it('debería eliminar una imagen de animal', async () => {
      mockApiClient.delete.mockResolvedValue(undefined);

      await animalesService.deleteAnimalImage(1, 5);

      expect(mockApiClient.delete).toHaveBeenCalledWith('/animales/1/imagenes/5');
    });

    it('debería manejar errores en deleteAnimalImage', async () => {
      const error = new Error('Error al eliminar imagen');
      mockApiClient.delete.mockRejectedValue(error);

      await expect(animalesService.deleteAnimalImage(1, 5)).rejects.toThrow('Error al eliminar imagen');
    });
  });
}); 