import { useMsal } from "@azure/msal-react";
import { Navigate } from "react-router-dom";
import { LoadingScreen } from "./LoadingScreen";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { accounts, inProgress } = useMsal();

  // Debug temporal
  console.log('RequireAuth - Accounts:', accounts);
  console.log('RequireAuth - InProgress:', inProgress);

  if (inProgress !== "none") {
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