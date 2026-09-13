/**
 * Blocks unauthenticated / expired sessions — always → /welcome
 */

import { type ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  AUTH_EXPIRED_EVENT,
  getAccessTokenFromStorage,
  isAccessTokenExpired,
} from "../utils/jwt";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const token = getAccessTokenFromStorage();
    if (token && isAccessTokenExpired(token)) {
      window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));
    }
  }, [location.pathname]);

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#07070A]">
        <div className="fitopia-loader-ring" aria-label="بارگذاری" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/welcome" replace state={{ from: location.pathname }} />;
  }

  const stored = getAccessTokenFromStorage();
  if (!stored || isAccessTokenExpired(stored)) {
    return <Navigate to="/welcome" replace />;
  }

  return <>{children}</>;
}
