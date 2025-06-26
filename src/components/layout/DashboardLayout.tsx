import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { PawPrint, Home, FileText, User, ClipboardList, Settings, LogOut, Menu, X, Users } from "lucide-react";
import { useMsal } from "@azure/msal-react";
import { useState } from "react";

const navItems = [
  { label: "Resumen", to: "/dashboard", icon: Home },
  { label: "Animales", to: "/dashboard/animales", icon: PawPrint },
  { label: "Solicitudes", to: "/dashboard/solicitudes", icon: ClipboardList },
  { label: "Seguimiento", to: "/dashboard/seguimiento", icon: FileText },
  { label: "Perfil", to: "/dashboard/perfil", icon: User },
  { label: "Configuración", to: "/dashboard/configuracion", icon: Settings },
];

export function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { instance, accounts } = useMsal();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    instance.logoutPopup().then(() => {
      navigate("/");
    });
  };

  // Obtener información del usuario desde MSAL
  const user = accounts[0];
  // Obtener el rol desde los claims de MSAL (si está disponible)
  const userRole = user?.idTokenClaims?.extension_Role || user?.idTokenClaims?.role || 'user';

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen flex bg-muted/40">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-background border-r flex flex-col py-6 px-4 gap-2
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/dashboard" className="flex items-center gap-2 text-foreground" onClick={closeSidebar}>
            <PawPrint className="w-7 h-7 text-primary" />
            <span className="font-bold text-xl">Rukayun</span>
          </Link>
          <button
            onClick={closeSidebar}
            className="lg:hidden p-1 rounded-md hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map(({ label, to, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={closeSidebar}
              className={`
                flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-all duration-200
                ${location.pathname === to 
                  ? "bg-primary/10 text-primary border border-primary/20" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }
              `}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          ))}
          {/* Solo para administradores */}
          {userRole === 'admin' && (
            <Link
              to="/dashboard/usuarios"
              onClick={closeSidebar}
              className={`
                flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-all duration-200
                ${location.pathname === "/dashboard/usuarios" 
                  ? "bg-primary/10 text-primary border border-primary/20" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }
              `}
            >
              <Users className="w-5 h-5" />
              Usuarios
            </Link>
          )}
        </nav>

        {/* Logout */}
        <div className="pt-4 border-t border-border/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200 cursor-pointer border-none outline-none bg-transparent"
            style={{ appearance: 'none' }}
          >
            <LogOut className="w-5 h-5" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        {/* Header */}
        <header className="h-16 bg-background border-b flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md hover:bg-muted"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg sm:text-xl font-bold text-foreground">
              Panel de administración
            </h1>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
} 