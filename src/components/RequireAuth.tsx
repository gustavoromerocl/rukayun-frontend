import { useMsal } from "@azure/msal-react";
import { Navigate } from "react-router-dom";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { accounts, inProgress } = useMsal();

  if (inProgress !== "none") {
    return <div>Cargando autenticación...</div>;
  }

  if (!accounts[0]) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
} 