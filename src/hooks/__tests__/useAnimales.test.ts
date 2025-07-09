import { renderHook, act } from '@testing-library/react'
import { vi } from 'vitest'
import { useAnimales } from '../useAnimales'

// Referencia para el mock dinámico
let mockGetAnimales: any

// Mock del servicio
vi.mock('@/services/animalesService', () => ({
  AnimalesService: class {
    constructor() {}
    getAnimales = (...args: any[]) => mockGetAnimales(...args)
  }
}))

// Mock de useApi
vi.mock('../useApi', () => ({
  useApi: () => ({ get: vi.fn(), post: vi.fn() })
}))

// Mock de useMsal
vi.mock('@azure/msal-react', () => ({
  useMsal: () => ({ instance: { getAllAccounts: () => [{ idTokenClaims: { extension_Roles: 'USER' } }], acquireTokenSilent: vi.fn().mockResolvedValue({ idToken: 'mock-token' }) } })
}))

describe('useAnimales', () => {
  beforeEach(() => {
    mockGetAnimales = vi.fn().mockResolvedValue({
      items: [{ animalId: 1, nombre: 'Firulais', especie: { nombre: 'Perro' }, sexo: { nombre: 'Macho' }, tamano: { nombre: 'Mediano' }, descripcion: 'Un perro muy bueno', animalImagenes: [] }],
      totalCount: 1,
      page: 1,
      pageSize: 12,
      totalPages: 1,
      hasPreviousPage: false,
      hasNextPage: false,
    })
  })

  it('debe tener estado inicial correcto', () => {
    const { result } = renderHook(() => useAnimales())
    expect(result.current.animales).toEqual([])
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.pagination).toMatchObject({
      totalCount: 0,
      page: 1,
      pageSize: 12,
      totalPages: 0,
      hasPreviousPage: false,
      hasNextPage: false,
    })
  })

  it('debe obtener animales correctamente', async () => {
    const { result } = renderHook(() => useAnimales())
    await act(async () => {
      await result.current.fetchAnimales()
    })
    expect(result.current.animales.length).toBe(1)
    expect(result.current.animales[0].nombre).toBe('Firulais')
    expect(result.current.error).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.pagination.totalCount).toBe(1)
  })

  it('debe manejar errores al obtener animales', async () => {
    mockGetAnimales.mockRejectedValueOnce(new Error('Error de red'))
    const { result } = renderHook(() => useAnimales())
    await act(async () => {
      await result.current.fetchAnimales()
    })
    expect(result.current.error).toBe('Error de red')
    expect(result.current.animales).toEqual([])
    expect(result.current.loading).toBe(false)
  })

  it('clearError debe limpiar el error', async () => {
    const { result } = renderHook(() => useAnimales())
    act(() => {
      result.current.clearError()
    })
    expect(result.current.error).toBeNull()
  })
}) 