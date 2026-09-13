/** Minimal JWT helpers — no external dependency */

export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const json = decodeURIComponent(
      Array.from(atob(padded))
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join(""),
    );
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/** true if token is missing, invalid, or past exp (with 30s skew) */
export function isAccessTokenExpired(token: string | null | undefined): boolean {
  if (!token) return true;
  const payload = decodeJwtPayload(token);
  if (!payload || typeof payload.exp !== "number") {
    return false;
  }
  const now = Math.floor(Date.now() / 1000);
  return payload.exp <= now + 30;
}

export function getAccessTokenFromStorage(): string | null {
  return (
    localStorage.getItem("access") ||
    localStorage.getItem("fitopia_auth_token") ||
    localStorage.getItem("fitopia_access_token") ||
    null
  );
}

export function getRefreshTokenFromStorage(): string | null {
  return (
    localStorage.getItem("refresh") ||
    localStorage.getItem("fitopia_refresh_token") ||
    null
  );
}

export function clearAuthStorage(): void {
  [
    "access",
    "fitopia_auth_token",
    "fitopia_access_token",
    "refresh",
    "fitopia_refresh_token",
    "fitopia_user_name",
    "fitopia_user_data",
    "fitopia_token_expiry",
  ].forEach((k) => localStorage.removeItem(k));
}

const REFRESH_URLS = [
  "https://fitopiaapi.pythonanywhere.com/api/token/refresh/",
  "https://fitopiaapi.pythonanywhere.com/api/accounts/token/refresh/",
  "https://fitopiaapi.pythonanywhere.com/api/auth/token/refresh/",
];

export async function tryRefreshAccessToken(
  refreshToken: string,
): Promise<string | null> {
  for (const url of REFRESH_URLS) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });
      if (!res.ok) continue;
      const data = await res.json();
      if (data?.access) {
        localStorage.setItem("access", data.access);
        localStorage.setItem("fitopia_auth_token", data.access);
        if (data.refresh) {
          localStorage.setItem("refresh", data.refresh);
          localStorage.setItem("fitopia_refresh_token", data.refresh);
        }
        return data.access as string;
      }
    } catch {
      /* next */
    }
  }
  return null;
}

export const AUTH_EXPIRED_EVENT = "fitopia:auth-expired";

export function emitAuthExpired(): void {
  clearAuthStorage();
  window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));
}
