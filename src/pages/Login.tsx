import { Button } from "@/components/ui/button";
import { useMsal } from "@azure/msal-react";
import { LogIn } from "lucide-react";

export default function Login() {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginPopup().then(() => {
      window.location.href = "/dashboard";
    });
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