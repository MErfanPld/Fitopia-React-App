/**
 * AuthContext — session restore, JWT expiry, force logout → welcome
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  AUTH_EXPIRED_EVENT,
  clearAuthStorage,
  getAccessTokenFromStorage,
  getRefreshTokenFromStorage,
  isAccessTokenExpired,
  tryRefreshAccessToken,
} from "../utils/jwt";

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
  userData: unknown;
  displayName: string;
  isLoading: boolean;
  login: (
    token: string,
    refreshToken: string,
    userData: unknown,
    displayName: string,
  ) => void;
  logout: () => Promise<void>;
  setDisplayNameState: (name: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<unknown>(null);
  const [displayName, setDisplayName] = useState<string>("کاربر عزیز");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const hardLogoutLocal = useCallback(() => {
    setToken(null);
    setRefreshToken(null);
    setUserData(null);
    setDisplayName("کاربر عزیز");
    clearAuthStorage();
  }, []);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        let storedToken = getAccessTokenFromStorage();
        const storedRefresh = getRefreshTokenFromStorage();
        const storedName = localStorage.getItem("fitopia_user_name");
        const storedUserData = localStorage.getItem("fitopia_user_data");

        if (storedToken && isAccessTokenExpired(storedToken)) {
          if (storedRefresh) {
            const fresh = await tryRefreshAccessToken(storedRefresh);
            storedToken = fresh;
          } else {
            storedToken = null;
          }
          if (!storedToken) {
            clearAuthStorage();
          }
        }

        if (cancelled) return;

        if (storedToken) {
          setToken(storedToken);
          setRefreshToken(getRefreshTokenFromStorage());

          if (storedUserData) {
            try {
              setUserData(JSON.parse(storedUserData));
            } catch {
              /* ignore */
            }
          }

          if (storedName) {
            const cleanNum = storedName.trim().replace(/[\s\-()]/g, "");
            setDisplayName(
              /^\+?\d+$/.test(cleanNum) ? "کاربر فیتوپیا" : storedName,
            );
          }
        } else {
          hardLogoutLocal();
        }
      } catch {
        hardLogoutLocal();
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [hardLogoutLocal]);

  useEffect(() => {
    const onExpired = () => {
      hardLogoutLocal();
      const path = window.location.pathname;
      if (
        path !== "/welcome" &&
        path !== "/login" &&
        path !== "/register" &&
        path !== "/offline"
      ) {
        window.location.replace("/welcome");
      }
    };
    window.addEventListener(AUTH_EXPIRED_EVENT, onExpired);
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, onExpired);
  }, [hardLogoutLocal]);

  useEffect(() => {
    if (!token) return;

    const checkExpiry = () => {
      const current = getAccessTokenFromStorage();
      if (!current || isAccessTokenExpired(current)) {
        const refresh = getRefreshTokenFromStorage();
        if (refresh) {
          tryRefreshAccessToken(refresh).then((fresh) => {
            if (fresh) {
              setToken(fresh);
            } else {
              window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));
            }
          });
        } else {
          window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));
        }
      }
    };

    // Poll every 15s + on tab focus / visibility (covers manual URL while expired)
    const id = window.setInterval(checkExpiry, 15_000);
    const onFocus = () => checkExpiry();
    const onVis = () => {
      if (document.visibilityState === "visible") checkExpiry();
    };
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVis);
    checkExpiry();

    return () => {
      window.clearInterval(id);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [token]);

  const login = (
    accessTok: string,
    refreshTok: string,
    data: unknown,
    name: string,
  ) => {
    const finalName = name?.trim() || "کاربر عزیز";
    setToken(accessTok);
    setRefreshToken(refreshTok);
    setUserData(data);
    setDisplayName(finalName);

    localStorage.setItem("access", accessTok);
    localStorage.setItem("fitopia_auth_token", accessTok);
    localStorage.setItem("refresh", refreshTok);
    localStorage.setItem("fitopia_refresh_token", refreshTok);
    localStorage.setItem("fitopia_user_name", finalName);
    localStorage.setItem("fitopia_user_data", JSON.stringify(data));
  };

  const logout = async () => {
    const currentRefresh =
      refreshToken || getRefreshTokenFromStorage() || "";
    const currentAccess = token || getAccessTokenFromStorage() || "";

    try {
      await fetch(
        "https://fitopiaapi.pythonanywhere.com/api/accounts/logout/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(currentAccess
              ? { Authorization: `Bearer ${currentAccess}` }
              : {}),
          },
          body: JSON.stringify({ refresh: currentRefresh }),
        },
      );
    } catch {
      /* still clear local */
    } finally {
      hardLogoutLocal();
    }
  };

  const setDisplayNameState = (name: string) => {
    setDisplayName(name);
    localStorage.setItem("fitopia_user_name", name);
  };

  const isAuthenticated =
    !!token && !isAccessTokenExpired(token || getAccessTokenFromStorage());

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token,
        refreshToken,
        userData,
        displayName,
        isLoading,
        login,
        logout,
        setDisplayNameState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
