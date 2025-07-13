import { useMsal } from "@azure/msal-react";
import { Navigate } from "react-router-dom";
import { LoadingScreen } from "./LoadingScreen";
import { useAuth } from "@/hooks/useAuth";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { accounts, inProgress } = useMsal();
  const { loading: authLoading } = useAuth();

  // Debug temporal
  console.log('RequireAuth - Accounts:', accounts);
  console.log('RequireAuth - InProgress:', inProgress);
  console.log('RequireAuth - AuthLoading:', authLoading);

  if (inProgress !== "none" || authLoading) {
    console.log('RequireAuth - Mostrando LoadingScreen');
    return <LoadingScreen />;
  }

  if (!accounts[0]) {
    console.log('RequireAuth - No hay cuenta, redirigiendo a /');
    return <Navigate to="/" replace />;
  }

  console.log('RequireAuth - Usuario autenticado, mostrando children');
  return <>{children}</>;
}

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { accounts, inProgress } = useMsal();
  const { loading: authLoading } = useAuth();

  // Debug temporal
  console.log('RequireAdmin - Accounts:', accounts);
  console.log('RequireAdmin - InProgress:', inProgress);
  console.log('RequireAdmin - AuthLoading:', authLoading);

  if (inProgress !== "none" || authLoading) {
    console.log('RequireAdmin - Mostrando LoadingScreen');
    return <LoadingScreen />;
  }

  if (!accounts[0]) {
    console.log('RequireAdmin - No hay cuenta, redirigiendo a /');
    return <Navigate to="/" replace />;
  }

  // Verificar rol de administrador
  const user = accounts[0];
  const userRole = user?.idTokenClaims?.extension_Roles || user?.idTokenClaims?.extension_Role || user?.idTokenClaims?.role || 'user';
  
  console.log('RequireAdmin - UserRole:', userRole);
  console.log('RequireAdmin - IdTokenClaims:', user?.idTokenClaims);

  if (userRole !== 'SUPER_ADMIN') {
    console.log('RequireAdmin - Usuario no es SUPER_ADMIN, redirigiendo a /dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  console.log('RequireAdmin - Usuario es SUPER_ADMIN, mostrando children');
  return <>{children}</>;
} 