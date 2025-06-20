import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { PawPrint, Home, Users, FileText, User, ClipboardList, Settings, LogOut } from "lucide-react";
import { useAppStore } from "@/lib/store";

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
  const setUser = useAppStore((state) => state.setUser);

  const handleLogout = () => {
    setUser(null);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex bg-muted/40">
      {/* Sidebar */}
      <aside className="w-64 bg-background border-r flex flex-col py-6 px-4 gap-2 relative">
        <Link to="/dashboard" className="flex items-center gap-2 mb-8 text-foreground">
          <PawPrint className="w-7 h-7 text-primary" />
          <span className="font-bold text-xl">Rukayun</span>
        </Link>
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map(({ label, to, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${location.pathname === to ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"}`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          ))}
        </nav>
        {/* Logout styled as nav item */}
        <div className="absolute bottom-6 left-0 right-0 px-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md font-medium text-muted-foreground hover:bg-muted transition-colors cursor-pointer border-none outline-none bg-transparent"
            style={{ appearance: 'none' }}
          >
            <LogOut className="w-5 h-5" />
            Cerrar sesión
          </button>
        </div>
      </aside>
      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 bg-background border-b flex items-center px-8">
          <h1 className="text-xl font-bold text-foreground">Panel de administración</h1>
        </header>
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
} 