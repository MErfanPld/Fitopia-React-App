/**
 * Blocks unauthenticated / expired sessions — always → /welcome
 * Manual URL entry cannot bypass: storage + JWT exp checked on every route change.
 * Tries one refresh before denying so short-lived access tokens still work.
 *
 * UX: when the user is already authenticated, keep the previous page visible
 * during re-check (no full-screen spinner flash on every navigation).
 */

import { type ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { PageLoader } from "./PageLoader";
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
  const [gate, setGate] = useState<"checking" | "ok" | "deny">(() =>
    isAuthenticated ? "ok" : "checking",
  );

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const token = getAccessTokenFromStorage();

      // Fast path: valid access token — stay ok, no UI flash
      if (token && !isAccessTokenExpired(token)) {
        if (!cancelled) setGate("ok");
        return;
      }

      // Need refresh or deny — only then show checking if we weren't ok
      if (!cancelled) setGate((prev) => (prev === "ok" ? "checking" : prev));

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

  // Initial app auth bootstrap only
  if (isLoading) {
    return <PageLoader label="در حال آماده‌سازی…" />;
  }

  // Soft re-check after session was already ok: keep children, thin top bar
  if (gate === "checking" && isAuthenticated) {
    return (
      <>
        <PageLoader variant="bar" />
        {children}
      </>
    );
  }

  if (gate === "checking") {
    return <PageLoader />;
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
