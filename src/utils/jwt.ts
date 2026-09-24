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

/** true if token is missing, invalid/undecodable, or past exp (with 30s skew) */
export function isAccessTokenExpired(token: string | null | undefined): boolean {
  if (!token) return true;
  const payload = decodeJwtPayload(token);
  // Strict: unreadable JWT or missing exp → treat as expired (force re-login)
  if (!payload || typeof payload.exp !== "number") {
    return true;
  }
  const now = Math.floor(Date.now() / 1000);
  return payload.exp <= now + 30;
}

function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key) || sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

export function getAccessTokenFromStorage(): string | null {
  return (
    readStorage("access") ||
    readStorage("fitopia_auth_token") ||
    readStorage("fitopia_access_token") ||
    null
  );
}

export function getRefreshTokenFromStorage(): string | null {
  return (
    readStorage("refresh") ||
    readStorage("fitopia_refresh_token") ||
    null
  );
}

/** Whether the last login used remember_me (localStorage) */
export function getRememberMeFromStorage(): boolean {
  try {
    if (localStorage.getItem("fitopia_remember_me") === "1") return true;
    // Legacy sessions lived in localStorage without the flag
    if (localStorage.getItem("access") || localStorage.getItem("fitopia_auth_token")) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

/**
 * Persist auth tokens.
 * rememberMe=true  → localStorage (survives browser restart; API keeps session ~10 days)
 * rememberMe=false → sessionStorage (cleared when the tab/browser session ends)
 */
export function persistAuthTokens(
  access: string,
  refresh: string,
  rememberMe: boolean,
  displayName?: string,
  userData?: unknown,
): void {
  const store = rememberMe ? localStorage : sessionStorage;
  const other = rememberMe ? sessionStorage : localStorage;

  const keys = [
    "access",
    "fitopia_auth_token",
    "fitopia_access_token",
    "refresh",
    "fitopia_refresh_token",
    "fitopia_user_name",
    "fitopia_user_data",
    "fitopia_remember_me",
  ];

  // Clear the other store so we never mix session vs persistent
  keys.forEach((k) => {
    try {
      other.removeItem(k);
    } catch {
      /* ignore */
    }
  });

  store.setItem("access", access);
  store.setItem("fitopia_auth_token", access);
  store.setItem("refresh", refresh);
  store.setItem("fitopia_refresh_token", refresh);
  store.setItem("fitopia_remember_me", rememberMe ? "1" : "0");

  if (displayName != null) {
    store.setItem("fitopia_user_name", displayName);
  }
  if (userData !== undefined) {
    store.setItem("fitopia_user_data", JSON.stringify(userData));
  }
}

export function clearAuthStorage(): void {
  const keys = [
    "access",
    "fitopia_auth_token",
    "fitopia_access_token",
    "refresh",
    "fitopia_refresh_token",
    "fitopia_user_name",
    "fitopia_user_data",
    "fitopia_token_expiry",
    "fitopia_remember_me",
  ];
  keys.forEach((k) => {
    try {
      localStorage.removeItem(k);
      sessionStorage.removeItem(k);
    } catch {
      /* ignore */
    }
  });
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
        const remember = getRememberMeFromStorage();
        const store = remember ? localStorage : sessionStorage;
        store.setItem("access", data.access);
        store.setItem("fitopia_auth_token", data.access);
        if (data.refresh) {
          store.setItem("refresh", data.refresh);
          store.setItem("fitopia_refresh_token", data.refresh);
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
