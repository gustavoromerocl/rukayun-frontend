import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock básico de MSAL
vi.mock('@azure/msal-react', () => ({
  useMsal: () => ({
    instance: {
      getAllAccounts: () => [{ idTokenClaims: { extension_Roles: 'USER' } }],
      acquireTokenSilent: vi.fn().mockResolvedValue({ idToken: 'mock-token' }),
      loginPopup: vi.fn().mockResolvedValue({}),
      logoutPopup: vi.fn().mockResolvedValue({}),
    },
    accounts: [{ idTokenClaims: { extension_Roles: 'USER' } }],
    inProgress: 'none',
  }),
  MsalProvider: ({ children }: { children: React.ReactNode }) => children,
}))

// Mock de react-router-dom
vi.mock('react-router-dom', () => ({
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => <a href={to}>{children}</a>,
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/' }),
  Outlet: () => <div>Outlet</div>,
  Navigate: ({ to }: { to: string }) => <div>Navigate to {to}</div>,
}))

// Mock de next-themes
vi.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: vi.fn(),
  }),
}))

// Mock de sonner
vi.mock('sonner', () => ({
  Toaster: () => <div>Toaster</div>,
}))

// Mock de recharts
vi.mock('recharts', () => ({
  Line: () => <div>Line</div>,
  LineChart: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  XAxis: () => <div>XAxis</div>,
  YAxis: () => <div>YAxis</div>,
  Tooltip: () => <div>Tooltip</div>,
  Legend: () => <div>Legend</div>,
}))

// Mock de variables de entorno
vi.stubEnv('VITE_API_URL', 'http://localhost:8080')

// Configuración global para testing
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock de ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
})) 