import { renderHook, act } from '@testing-library/react'
import { vi } from 'vitest'
import { useAuth } from '../useAuth'

let mockVerificarPerfil: any

vi.mock('@/services/usuariosService', () => ({
  UsuariosService: class {
    constructor() {}
    verificarPerfil = (...args: any[]) => mockVerificarPerfil(...args)
  }
}))

vi.mock('../useApi', () => ({
  useApi: () => ({ get: vi.fn(), post: vi.fn() })
}))

vi.mock('@azure/msal-react', () => ({
  useMsal: () => ({
    instance: {
      getAllAccounts: () => [{ idTokenClaims: { extension_Roles: 'USER' } }],
      acquireTokenSilent: vi.fn().mockResolvedValue({ idToken: 'mock-token' })
    },
    accounts: [{ idTokenClaims: { extension_Roles: 'USER' } }],
    inProgress: 'none'
  })
}))

vi.mock('@/lib/store', () => ({
  useAppStore: () => ({
    setIsColaborator: vi.fn(),
    user: null,
    setUser: vi.fn()
  })
}))

describe('useAuth', () => {
  beforeEach(() => {
    mockVerificarPerfil = vi.fn().mockResolvedValue({
      usuarioId: 1,
      nombres: 'Juan',
      apellidos: 'Pérez',
      email: 'juan@example.com',
      rol: 'USER'
    })
  })

  it('debe verificar perfil correctamente', async () => {
    const { result } = renderHook(() => useAuth())
    await act(async () => {
      await result.current.cargarPerfil()
    })
    expect(result.current.usuario).toEqual({
      usuarioId: 1,
      nombres: 'Juan',
      apellidos: 'Pérez',
      email: 'juan@example.com',
      rol: 'USER'
    })
    expect(result.current.error).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.isAuthenticated).toBe(true)
  })

  it('debe recargar perfil correctamente', async () => {
    const { result } = renderHook(() => useAuth())
    await act(async () => {
      await result.current.recargarPerfil()
    })
    expect(result.current.usuario).toEqual({
      usuarioId: 1,
      nombres: 'Juan',
      apellidos: 'Pérez',
      email: 'juan@example.com',
      rol: 'USER'
    })
    expect(result.current.error).toBeNull()
  })

  it('clearError debe limpiar el error', () => {
    const { result } = renderHook(() => useAuth())
    act(() => {
      result.current.clearError()
    })
    expect(result.current.error).toBeNull()
  })

  it('debe manejar usuario con rol de colaborador', async () => {
    mockVerificarPerfil.mockResolvedValueOnce({
      usuarioId: 1,
      nombres: 'Admin',
      apellidos: 'User',
      email: 'admin@example.com',
      rol: 'ADMIN'
    })
    const { result } = renderHook(() => useAuth())
    await act(async () => {
      await result.current.cargarPerfil()
    })
    expect(result.current.usuario?.rol).toBe('ADMIN')
    expect(result.current.isAuthenticated).toBe(true)
  })
}) 