import { useMsal } from "@azure/msal-react";
import { Navigate } from "react-router-dom";
import { LoadingScreen } from "./LoadingScreen";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { accounts, inProgress } = useMsal();

  if (inProgress !== "none") {
    return <LoadingScreen />;
  }

  if (!accounts[0]) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
} 