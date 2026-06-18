/**
 * @file ProtectedRoute.tsx
 * @description A layout gate component that ensures only authenticated athletes can access protected screens.
 * If no valid session token exists in local storage, they are instantly redirected to the premium welcome entry deck.
 */

import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/welcome" replace />;
  }

  return <>{children}</>;
}
