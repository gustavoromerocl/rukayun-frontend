import { useMsal } from "@azure/msal-react";
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { accounts, inProgress } = useMsal();
  const location = useLocation();
  const [justRedirected, setJustRedirected] = useState(false);

  useEffect(() => {
    // Si la URL tiene #state= o #code=, es un redirect de MSAL
    if (location.hash.includes("state=") || location.hash.includes("code=")) {
      setJustRedirected(true);
      setTimeout(() => setJustRedirected(false), 700); // 700ms de espera
    }
  }, [location]);

  if (inProgress !== "none" || justRedirected) {
    return <div>Cargando autenticación...</div>;
  }

  if (!accounts[0]) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
} 