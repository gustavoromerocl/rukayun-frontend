import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

export default function Dashboard() {
  const user = useAppStore((state) => state.user);
  const setUser = useAppStore((state) => state.setUser);
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Clear user from global state
    setUser(null);

    // 2. Redirect to home page
    navigate("/");
  };
  
  // This is a simple guard. In a real app, you'd use a protected route component.
  if (!user) {
    navigate('/login');
    return null; // Render nothing while redirecting
  }

  return (
    <div className="w-full flex-grow flex items-center justify-center">
      <div className="bg-background/80 backdrop-blur-sm p-8 rounded-lg shadow-lg text-center max-w-sm">
        <h1 className="text-2xl font-bold mb-2">Bienvenido, {user.name}</h1>
        <p className="text-muted-foreground mb-6">
          Has ingresado correctamente.
        </p>
        <Button onClick={handleLogout} variant="outline" className="w-full">
          <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
        </Button>
      </div>
    </div>
  );
} 