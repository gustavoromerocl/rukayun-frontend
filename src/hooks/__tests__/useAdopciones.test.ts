import { renderHook, act } from '@testing-library/react'
import { vi } from 'vitest'
import { useAdopciones } from '../useAdopciones'

let mockGetAdopciones: any
let mockCreateAdopcion: any
let mockUpdateAdopcion: any
let mockDeleteAdopcion: any

vi.mock('@/services/adopcionesService', () => ({
  AdopcionesService: class {
    constructor() {}
    getAdopciones = (...args: any[]) => mockGetAdopciones(...args)
    createAdopcion = (...args: any[]) => mockCreateAdopcion(...args)
    updateAdopcion = (...args: any[]) => mockUpdateAdopcion(...args)
    deleteAdopcion = (...args: any[]) => mockDeleteAdopcion(...args)
    getAdopcion = vi.fn()
    getAdopcionesByEstado = vi.fn()
    getAdopcionesByUsuario = vi.fn()
    getAdopcionesByAnimal = vi.fn()
  }
}))

vi.mock('../useApi', () => ({
  useApi: () => ({ get: vi.fn(), post: vi.fn() })
}))

describe('useAdopciones', () => {
  beforeEach(() => {
    mockGetAdopciones = vi.fn().mockResolvedValue([
      { adopcionId: 1, animalId: 1, usuarioId: 1, adopcionEstadoId: 1, fechaCreacion: '', fechaActualizacion: '', descripcionFamilia: '', usuario: null, adopcionEstado: { adopcionEstadoId: 1, nombre: 'Pendiente' }, animal: {}, seguimientos: [] }
    ])
    mockCreateAdopcion = vi.fn().mockResolvedValue({ adopcionId: 2 })
    mockUpdateAdopcion = vi.fn().mockResolvedValue({ adopcionId: 1, descripcionFamilia: 'actualizado' })
    mockDeleteAdopcion = vi.fn().mockResolvedValue(undefined)
  })

  it('debe tener estado inicial correcto', () => {
    const { result } = renderHook(() => useAdopciones())
    expect(result.current.adopciones).toEqual([])
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('debe obtener adopciones correctamente', async () => {
    const { result } = renderHook(() => useAdopciones())
    await act(async () => {
      await result.current.fetchAdopciones()
    })
    expect(result.current.adopciones.length).toBe(1)
    expect(result.current.error).toBeNull()
    expect(result.current.loading).toBe(false)
  })

  it('debe manejar error al obtener adopciones', async () => {
    mockGetAdopciones.mockRejectedValueOnce(new Error('Error de red'))
    const { result } = renderHook(() => useAdopciones())
    await act(async () => {
      await result.current.fetchAdopciones()
    })
    expect(result.current.error).toBe('Error de red')
    expect(result.current.adopciones).toEqual([])
    expect(result.current.loading).toBe(false)
  })

  it('debe crear una adopcion correctamente', async () => {
    const { result } = renderHook(() => useAdopciones())
    await act(async () => {
      const nueva = await result.current.createAdopcion({ animalId: 1, usuarioId: 1 })
      expect(nueva).toEqual({ adopcionId: 2 })
    })
    expect(result.current.error).toBeNull()
  })

  it('debe manejar error al crear una adopcion', async () => {
    mockCreateAdopcion.mockRejectedValueOnce(new Error('Error creando'))
    const { result } = renderHook(() => useAdopciones())
    await act(async () => {
      await result.current.createAdopcion({ animalId: 1, usuarioId: 1 }).catch(() => {})
    })
    await act(async () => { await Promise.resolve() })
    expect(result.current.error).toBe('Error creando')
  })

  it('debe actualizar una adopcion correctamente', async () => {
    const { result } = renderHook(() => useAdopciones())
    await act(async () => {
      const actualizado = await result.current.updateAdopcion(1, { descripcionFamilia: 'actualizado' })
      expect(actualizado).toEqual({ adopcionId: 1, descripcionFamilia: 'actualizado' })
    })
    expect(result.current.error).toBeNull()
  })

  it('debe manejar error al actualizar una adopcion', async () => {
    mockUpdateAdopcion.mockRejectedValueOnce(new Error('Error actualizando'))
    const { result } = renderHook(() => useAdopciones())
    await act(async () => {
      await result.current.updateAdopcion(1, { descripcionFamilia: 'actualizado' }).catch(() => {})
    })
    await act(async () => { await Promise.resolve() })
    expect(result.current.error).toBe('Error actualizando')
  })

  it('debe eliminar una adopcion correctamente', async () => {
    const { result } = renderHook(() => useAdopciones())
    await act(async () => {
      await result.current.deleteAdopcion(1)
    })
    expect(result.current.error).toBeNull()
  })

  it('debe manejar error al eliminar una adopcion', async () => {
    mockDeleteAdopcion.mockRejectedValueOnce(new Error('Error eliminando'))
    const { result } = renderHook(() => useAdopciones())
    await act(async () => {
      await result.current.deleteAdopcion(1).catch(() => {})
    })
    await act(async () => { await Promise.resolve() })
    expect(result.current.error).toBe('Error eliminando')
  })

  it('clearError debe limpiar el error', () => {
    const { result } = renderHook(() => useAdopciones())
    act(() => {
      result.current.clearError()
    })
    expect(result.current.error).toBeNull()
  })
}) 