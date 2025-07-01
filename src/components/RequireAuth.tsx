import { useMsal } from "@azure/msal-react";
import { Navigate } from "react-router-dom";
import { LoadingScreen } from "./LoadingScreen";
import { useAuth } from "@/hooks/useAuth";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { accounts, inProgress } = useMsal();
  const { usuario, loading: authLoading, error: authError } = useAuth();

  // Debug temporal
  console.log('RequireAuth - Accounts:', accounts);
  console.log('RequireAuth - InProgress:', inProgress);
  console.log('RequireAuth - Usuario:', usuario);
  console.log('RequireAuth - AuthLoading:', authLoading);
  console.log('RequireAuth - AuthError:', authError);

  if (inProgress !== "none") {
    console.log('RequireAuth - Mostrando LoadingScreen');
    return <LoadingScreen />;
  }

  if (!accounts[0]) {
    console.log('RequireAuth - No hay cuenta, redirigiendo a /');
    return <Navigate to="/" replace />;
  }

  // Si está cargando la verificación del perfil, mostrar loading
  if (authLoading) {
    console.log('RequireAuth - Verificando perfil, mostrando LoadingScreen');
    return <LoadingScreen />;
  }

  // Si hay error en la verificación del perfil, mostrar warning pero permitir acceso
  if (authError) {
    console.log('RequireAuth - Error en verificación de perfil (permitiendo acceso):', authError);
    // Mostrar un toast o notificación pero no bloquear el acceso
  }

  console.log('RequireAuth - Usuario autenticado, mostrando children');
  return <>{children}</>;
} 