import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";

export default function Login() {
  const setUser = useAppStore((state) => state.setUser);
  const navigate = useNavigate();

  const handleLogin = () => {
    // 1. Simulate a successful login from Microsoft IaaS
    const mockUser = {
      id: "12345",
      name: "Usuario de Prueba",
      email: "test.user@microsoft.com",
    };

    // 2. Update the global state
    setUser(mockUser);

    // 3. Redirect to the dashboard
    navigate("/dashboard");
  };

  return (
    <div className="w-full flex-grow flex items-center justify-center">
      <div className="bg-background/80 backdrop-blur-sm p-8 rounded-lg shadow-lg text-center max-w-sm">
        <h1 className="text-2xl font-bold mb-2">Iniciar Sesión</h1>
        <p className="text-muted-foreground mb-6">
          Usa tu cuenta de Microsoft para ingresar al sistema.
        </p>
        <Button onClick={handleLogin} className="w-full">
          <LogIn className="mr-2 h-4 w-4" /> Ingresar con Microsoft
        </Button>
      </div>
    </div>
  );
} 