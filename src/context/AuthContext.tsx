/**
 * @file AuthContext.tsx
 * @description Global Context to manage authentication state, session preservation, and seamless loading protection to prevent flickering.
 */

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
  userData: any;
  displayName: string;
  isLoading: boolean;
  login: (token: string, refreshToken: string, userData: any, displayName: string) => void;
  logout: () => Promise<void>;
  setDisplayNameState: (name: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [displayName, setDisplayName] = useState<string>("کاربر عزیز");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize and restore session on application mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("access") || localStorage.getItem("fitopia_auth_token");
      const storedRefresh = localStorage.getItem("refresh") || localStorage.getItem("fitopia_refresh_token");
      const storedName = localStorage.getItem("fitopia_user_name");
      const storedUserData = localStorage.getItem("fitopia_user_data");

      console.log("Restoring Auth State:");
      console.log("Stored token ('access'):", storedToken);
      console.log("Stored refresh ('refresh'):", storedRefresh);

      if (storedToken) {
        setToken(storedToken);
        setRefreshToken(storedRefresh);
        
        if (storedUserData) {
          try {
            setUserData(JSON.parse(storedUserData));
          } catch (e) {
            console.error("Error parsing user data details", e);
          }
        }

        if (storedName) {
          // Fallback if the name is like a physical phone number
          const cleanNum = storedName.trim().replace(/[\s\-()]/g, "");
          if (/^\+?\d+$/.test(cleanNum)) {
            setDisplayName("کاربر فیتوپیا");
          } else {
            setDisplayName(storedName);
          }
        } else {
          setDisplayName("کاربر عزیز");
        }
      }
    } catch (error) {
      console.error("Session restoration error:", error);
    } finally {
      // Simulate/ensure a micromoment of verification before lifting loader to prevent flickering
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, []);

  const login = (
    authToken: string,
    refreshTok: string,
    data: any,
    nameCandidate: string
  ) => {
    console.log("Executing login user updates in AuthProvider:");
    console.log("Incoming data:", data);
    console.log("Incoming authToken:", authToken);
    console.log("Incoming refreshTok:", refreshTok);

    setToken(authToken);
    setRefreshToken(refreshTok);
    setUserData(data);

    // Filter potential phone-number looking names
    let finalName = nameCandidate;
    const cleanNum = nameCandidate.trim().replace(/[\s\-()]/g, "");
    if (/^\+?\d+$/.test(cleanNum)) {
      finalName = "کاربر فیتوپیا";
    }
    setDisplayName(finalName);

    localStorage.setItem("access", authToken);
    localStorage.setItem("fitopia_auth_token", authToken);
    localStorage.setItem("refresh", refreshTok);
    localStorage.setItem("fitopia_refresh_token", refreshTok);
    localStorage.setItem("fitopia_user_name", finalName);
    localStorage.setItem("fitopia_user_data", JSON.stringify(data));

    console.log("Verification checks after local storage updates:");
    console.log("Stored access token (localStorage):", localStorage.getItem("access"));
    console.log("Stored refresh token (localStorage):", localStorage.getItem("refresh"));
  };

const logout = async () => {
  const currentRefresh =
    refreshToken ||
    localStorage.getItem("refresh") ||
    localStorage.getItem("fitopia_refresh_token") ||
    "";

  const currentAccess =
    token ||
    localStorage.getItem("access") ||
    localStorage.getItem("fitopia_auth_token") ||
    "";

  const clearAuthCache = () => {
    setToken(null);
    setRefreshToken(null);
    setUserData(null);
    setDisplayName("کاربر عزیز");

    localStorage.removeItem("access");
    localStorage.removeItem("fitopia_auth_token");
    localStorage.removeItem("refresh");
    localStorage.removeItem("fitopia_refresh_token");
    localStorage.removeItem("fitopia_user_name");
    localStorage.removeItem("fitopia_user_data");
  };

  try {
    const response = await fetch(
      "https://fitopiaapi.pythonanywhere.com/api/accounts/logout/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(currentAccess
            ? { Authorization: `Bearer ${currentAccess}` }
            : {}),
        },
        body: JSON.stringify({
          refresh: currentRefresh,
        }),
      }
    );

    // ✅ مهم: حتی اگر API fail شد هم باید logout انجام شود
    clearAuthCache();

    if (!response.ok) {
      console.warn("Logout API failed but user was logged out locally");
    }
  } catch (err) {
    console.error("Logout API error:", err);

    // ✅ مهم: حتی در error هم پاک کن
    clearAuthCache();
  }
};

  const setDisplayNameState = (name: string) => {
    setDisplayName(name);
    localStorage.setItem("fitopia_user_name", name);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
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
