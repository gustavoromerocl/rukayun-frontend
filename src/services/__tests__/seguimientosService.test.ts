import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SeguimientosService } from '../seguimientosService';

// Mock del ApiClient
const mockApiClient = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
};

const seguimientoMock = {
  seguimientoId: 1,
  adopcionId: 1,
  usuarioId: 1,
  fechaSeguimiento: '2023-01-01',
  estado: 'PENDIENTE',
  observaciones: 'Observación de prueba',
  proximaSeguimiento: '2023-02-01',
  adopcion: {
    adopcionId: 1,
    animal: {
      animalId: 1,
      nombre: 'Firulais',
    },
    adoptante: {
      usuarioId: 2,
      nombres: 'Juan',
      apellidos: 'Pérez',
    },
  },
  usuario: {
    usuarioId: 1,
    nombres: 'María',
    apellidos: 'García',
  },
};

const seguimientosResponseMock = {
  items: [seguimientoMock],
  totalCount: 1,
  page: 1,
  pageSize: 12,
  totalPages: 1,
  hasPreviousPage: false,
  hasNextPage: false,
};

describe('SeguimientosService', () => {
  let seguimientosService: SeguimientosService;

  beforeEach(() => {
    vi.clearAllMocks();
    seguimientosService = new SeguimientosService(mockApiClient as any);
  });

  describe('getSeguimientos', () => {
    it('debería obtener seguimientos sin filtros', async () => {
      mockApiClient.get.mockResolvedValue(seguimientosResponseMock);

      const result = await seguimientosService.getSeguimientos();

      expect(mockApiClient.get).toHaveBeenCalledWith('/seguimientos');
      expect(result).toEqual(seguimientosResponseMock);
    });

    it('debería obtener seguimientos con filtros', async () => {
      mockApiClient.get.mockResolvedValue(seguimientosResponseMock);
      const filters = {
        usuarioId: 1,
        adopcionId: 1,
        page: 1,
        pageSize: 10,
      };

      const result = await seguimientosService.getSeguimientos(filters);

      // Verificar que la URL contiene todos los parámetros esperados sin importar el orden
      const callArgs = mockApiClient.get.mock.calls[0][0];
      expect(callArgs).toContain('/seguimientos?');
      expect(callArgs).toContain('usuarioId=1');
      expect(callArgs).toContain('adopcionId=1');
      expect(callArgs).toContain('page=1');
      expect(callArgs).toContain('pageSize=10');
      expect(result).toEqual(seguimientosResponseMock);
    });

    it('debería manejar errores en getSeguimientos', async () => {
      const error = new Error('Error de red');
      mockApiClient.get.mockRejectedValue(error);

      await expect(seguimientosService.getSeguimientos()).rejects.toThrow('Error de red');
    });
  });

  describe('getSeguimiento', () => {
    it('debería obtener un seguimiento por ID', async () => {
      mockApiClient.get.mockResolvedValue(seguimientoMock);

      const result = await seguimientosService.getSeguimiento(1);

      expect(mockApiClient.get).toHaveBeenCalledWith('/seguimientos/1');
      expect(result).toEqual(seguimientoMock);
    });

    it('debería manejar errores en getSeguimiento', async () => {
      const error = new Error('Seguimiento no encontrado');
      mockApiClient.get.mockRejectedValue(error);

      await expect(seguimientosService.getSeguimiento(999)).rejects.toThrow('Seguimiento no encontrado');
    });
  });

  describe('createSeguimiento', () => {
    it('debería crear un seguimiento', async () => {
      const newSeguimiento = { ...seguimientoMock, seguimientoId: 2 };
      mockApiClient.post.mockResolvedValue(newSeguimiento);

      const createData = {
        adopcionId: 2,
        fechaSeguimiento: '2023-01-15',
        estado: 'COMPLETADO',
        observaciones: 'Nueva observación',
        proximaSeguimiento: '2023-03-01',
      };

      const result = await seguimientosService.createSeguimiento(createData);

      expect(mockApiClient.post).toHaveBeenCalledWith('/seguimientos', createData);
      expect(result).toEqual(newSeguimiento);
    });

    it('debería manejar errores en createSeguimiento', async () => {
      const error = new Error('Error al crear seguimiento');
      mockApiClient.post.mockRejectedValue(error);

      const createData = {
        adopcionId: 2,
        fechaSeguimiento: '2023-01-15',
        estado: 'COMPLETADO',
        observaciones: 'Nueva observación',
      };

      await expect(seguimientosService.createSeguimiento(createData)).rejects.toThrow('Error al crear seguimiento');
    });
  });

  describe('updateSeguimiento', () => {
    it('debería actualizar un seguimiento', async () => {
      const updatedSeguimiento = { ...seguimientoMock, estado: 'COMPLETADO' };
      mockApiClient.put.mockResolvedValue(updatedSeguimiento);

      const updateData = {
        estado: 'COMPLETADO',
        observaciones: 'Observación actualizada',
      };

      const result = await seguimientosService.updateSeguimiento(1, updateData);

      expect(mockApiClient.put).toHaveBeenCalledWith('/seguimientos/1', updateData);
      expect(result).toEqual(updatedSeguimiento);
    });

    it('debería manejar errores en updateSeguimiento', async () => {
      const error = new Error('Error al actualizar seguimiento');
      mockApiClient.put.mockRejectedValue(error);

      const updateData = { estado: 'COMPLETADO' };

      await expect(seguimientosService.updateSeguimiento(1, updateData)).rejects.toThrow('Error al actualizar seguimiento');
    });
  });

  describe('deleteSeguimiento', () => {
    it('debería eliminar un seguimiento', async () => {
      mockApiClient.delete.mockResolvedValue(undefined);

      await seguimientosService.deleteSeguimiento(1);

      expect(mockApiClient.delete).toHaveBeenCalledWith('/seguimientos/1');
    });

    it('debería manejar errores en deleteSeguimiento', async () => {
      const error = new Error('Error al eliminar seguimiento');
      mockApiClient.delete.mockRejectedValue(error);

      await expect(seguimientosService.deleteSeguimiento(1)).rejects.toThrow('Error al eliminar seguimiento');
    });
  });

  describe('getSeguimientosByAdopcion', () => {
    it('debería obtener seguimientos por adopción', async () => {
      mockApiClient.get.mockResolvedValue(seguimientosResponseMock);

      const result = await seguimientosService.getSeguimientosByAdopcion(1);

      // Verificar que la URL contiene el parámetro adopcionId
      const callArgs = mockApiClient.get.mock.calls[0][0];
      expect(callArgs).toContain('/seguimientos?');
      expect(callArgs).toContain('adopcionId=1');
      expect(result).toEqual(seguimientosResponseMock);
    });

    it('debería obtener seguimientos por adopción con filtros adicionales', async () => {
      mockApiClient.get.mockResolvedValue(seguimientosResponseMock);
      const filters = { page: 2, pageSize: 5 };

      const result = await seguimientosService.getSeguimientosByAdopcion(1, filters);

      // Verificar que la URL contiene todos los parámetros esperados
      const callArgs = mockApiClient.get.mock.calls[0][0];
      expect(callArgs).toContain('/seguimientos?');
      expect(callArgs).toContain('adopcionId=1');
      expect(callArgs).toContain('page=2');
      expect(callArgs).toContain('pageSize=5');
      expect(result).toEqual(seguimientosResponseMock);
    });

    it('debería manejar errores en getSeguimientosByAdopcion', async () => {
      const error = new Error('Error al obtener seguimientos por adopción');
      mockApiClient.get.mockRejectedValue(error);

      await expect(seguimientosService.getSeguimientosByAdopcion(1)).rejects.toThrow('Error al obtener seguimientos por adopción');
    });
  });

  describe('getSeguimientosByUsuario', () => {
    it('debería obtener seguimientos por usuario', async () => {
      mockApiClient.get.mockResolvedValue(seguimientosResponseMock);

      const result = await seguimientosService.getSeguimientosByUsuario(1);

      // Verificar que la URL contiene el parámetro usuarioId
      const callArgs = mockApiClient.get.mock.calls[0][0];
      expect(callArgs).toContain('/seguimientos?');
      expect(callArgs).toContain('usuarioId=1');
      expect(result).toEqual(seguimientosResponseMock);
    });

    it('debería obtener seguimientos por usuario con filtros adicionales', async () => {
      mockApiClient.get.mockResolvedValue(seguimientosResponseMock);
      const filters = { page: 1, pageSize: 20 };

      const result = await seguimientosService.getSeguimientosByUsuario(1, filters);

      // Verificar que la URL contiene todos los parámetros esperados
      const callArgs = mockApiClient.get.mock.calls[0][0];
      expect(callArgs).toContain('/seguimientos?');
      expect(callArgs).toContain('usuarioId=1');
      expect(callArgs).toContain('page=1');
      expect(callArgs).toContain('pageSize=20');
      expect(result).toEqual(seguimientosResponseMock);
    });

    it('debería manejar errores en getSeguimientosByUsuario', async () => {
      const error = new Error('Error al obtener seguimientos por usuario');
      mockApiClient.get.mockRejectedValue(error);

      await expect(seguimientosService.getSeguimientosByUsuario(1)).rejects.toThrow('Error al obtener seguimientos por usuario');
    });
  });
}); 