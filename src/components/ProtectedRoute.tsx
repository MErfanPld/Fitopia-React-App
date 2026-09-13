/**
 * Blocks unauthenticated / expired sessions — always → /welcome
 * Manual URL entry cannot bypass: storage + JWT exp checked on every route change.
 * Tries one refresh before denying so short-lived access tokens still work.
 */

import { type ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  emitAuthExpired,
  getAccessTokenFromStorage,
  getRefreshTokenFromStorage,
  isAccessTokenExpired,
  tryRefreshAccessToken,
} from "../utils/jwt";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const [gate, setGate] = useState<"checking" | "ok" | "deny">("checking");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setGate("checking");
      const token = getAccessTokenFromStorage();

      if (token && !isAccessTokenExpired(token)) {
        if (!cancelled) setGate("ok");
        return;
      }

      // Access expired / missing — try refresh once before denying
      const refresh = getRefreshTokenFromStorage();
      if (refresh) {
        const fresh = await tryRefreshAccessToken(refresh);
        if (cancelled) return;
        if (fresh && !isAccessTokenExpired(fresh)) {
          setGate("ok");
          return;
        }
      }

      if (cancelled) return;
      emitAuthExpired();
      setGate("deny");
    })();

    return () => {
      cancelled = true;
    };
  }, [location.pathname, location.key]);

  if (isLoading || gate === "checking") {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#07070A]">
        <div className="fitopia-loader-ring" aria-label="بارگذاری" />
      </div>
    );
  }

  if (gate === "deny" || !isAuthenticated) {
    return <Navigate to="/welcome" replace state={{ from: location.pathname }} />;
  }

  // Final belt-and-suspenders check against storage
  const stored = getAccessTokenFromStorage();
  if (!stored || isAccessTokenExpired(stored)) {
    return <Navigate to="/welcome" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
