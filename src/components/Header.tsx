/**
 * @file Header.tsx
 * @description Pinned navigation top bar containing the app title 'FITOPIA',
 * localized athlete profile avatar pictures with an interactive dropdown menu, 
 * logout API connection, and an notifications bell.
 */

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, LogOut, Loader2, AlertCircle, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function Header() {
  const navigate = useNavigate();
  const [unreadNotifications, setUnreadNotifications] = useState(1);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("کاربر عزیز");

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync profile display name on mounting
  useEffect(() => {
    const rawStored = localStorage.getItem("fitopia_user_name");
    
    // Check if there is full user data
    const storedDataStr = localStorage.getItem("fitopia_user_data");
    let resolvedName = "";

    if (storedDataStr) {
      try {
        const userData = JSON.parse(storedDataStr);
        if (userData && typeof userData === "object") {
          resolvedName = userData.full_name || userData.user_name || userData.username;
        }
      } catch (e) {
        console.error("Stale user data in local storage:", e);
      }
    }

    if (!resolvedName && rawStored) {
      resolvedName = rawStored;
    }

    // Defensive default
    if (resolvedName) {
      // If it resembles a phone number format, fallback
      const cleanNum = resolvedName.trim().replace(/[\s\-()]/g, "");
      if (/^\+?\d+$/.test(cleanNum)) {
        setDisplayName("کاربر فیتوپیا");
      } else {
        setDisplayName(resolvedName);
      }
    } else {
      setDisplayName("کاربر عزیز");
    }
  }, [isDropdownOpen]);

  // Click outside detector
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setLogoutError(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Triggers alert dialog on press to mock receiving fresh workout tokens
  const handleNotificationClick = () => {
    if (unreadNotifications > 0) {
      alert("اعلان جدید:\nشما ۲۴ توکن فیتوپیا با موفقیت دریافت کردید!");
      setUnreadNotifications(0);
    } else {
      alert("اعلان جدیدی وجود ندارد.");
    }
  };

  // Connects to PythonAnywhere accounts/logout endpoint
  const handleLogoutClick = async () => {
    setIsLoggingOut(true);
    setLogoutError(null);

    const refreshToken = localStorage.getItem("fitopia_refresh_token") || "";
    const accessToken = localStorage.getItem("fitopia_auth_token") || "";

    try {
      const response = await fetch("https://fitopiaapi.pythonanywhere.com/api/accounts/logout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken ? { "Authorization": `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({
          refresh: refreshToken,
        }),
      });

      if (response.ok) {
        // Complete sweep of authentication cached items
        localStorage.removeItem("fitopia_auth_token");
        localStorage.removeItem("fitopia_refresh_token");
        localStorage.removeItem("fitopia_user_name");
        localStorage.removeItem("fitopia_user_data");

        setIsDropdownOpen(false);
        navigate("/login");
      } else {
        const responseData = await response.json().catch(() => null);
        let message = "خروج از حساب با خطا مواجه شد.";
        if (responseData && typeof responseData === "object") {
          const detail = responseData.detail || responseData.error || responseData.refresh;
          if (Array.isArray(detail)) {
            message = detail.join(" | ");
          } else if (typeof detail === "string") {
            message = detail;
          }
        }
        setLogoutError(message);
      }
    } catch (err) {
      console.error("HTTP Logout Request Fail:", err);
      setLogoutError("اختلال در اتصال به شبکه. دوباره تلاش کنید.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-white/5 h-16 select-none">
      <div className="max-w-7xl mx-auto h-full w-full flex justify-between items-center px-4 md:px-8">
        {/* Clickable Profile Avatar block */}
        <div className="relative" ref={dropdownRef} id="avatar-dropdown-wrapper">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="relative w-10 h-10 rounded-full overflow-hidden border border-primary/20 hover:border-primary/60 transition-all active:scale-95 duration-200 cursor-pointer flex items-center justify-center bg-surface-container"
            aria-label="پروفایل کاربر"
            id="avatar-trigger-btn"
          >
            <img
              alt="User Profile"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDKEwiGCrqAbdQWGW67UNCzrUoHvCSD53WoXymywAH4QDrhPX9GDeLCoCQgZYWgcT3AqfQ1_0MsGp0-fk355uN_LUTumQCTbx44QeSoj3xgc6nGH9q7hYbhngJXssxwAYU4HK9KxfF4IsFQfG5Z6rR7hIhN8Yy98K6vQ_PPVKU78QhaQQaRXbCpEvV25igN2DURVZX-RpUVRhv-vk8ghZXMlWs0vh_Ekba_eOGbkIi2EFrO2LjdzSGSO_KuDUyRTdKjdTlj88Cz9YPD"
            />
          </button>

          {/* Dropdown Menu Container */}
          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                id="avatar-dropdown-menu"
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="absolute left-0 mt-3 w-64 bg-surface/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden py-3 text-right z-50 origin-top-left"
              >
                {/* Profile Details Header */}
                <div className="px-5 py-2.5 flex items-center gap-3 border-b border-white/5 pb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary-container shrink-0">
                    <User size={18} />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="font-bold text-on-surface text-sm truncate leading-tight">
                      {displayName}
                    </h4>
                    <p className="font-mono text-[10px] text-on-surface-variant/70 mt-0.5 leading-none">
                      مدیریت حساب فیتوپیا
                    </p>
                  </div>
                </div>

                {/* Error warning area if API triggers error */}
                {logoutError && (
                  <div
                    id="logout-error-panel"
                    className="mx-3 mt-2 mb-1 p-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs flex items-start gap-1.5 leading-snug animate-[shake_0.4s]"
                  >
                    <AlertCircle size={14} className="shrink-0 mt-0.5" />
                    <span>{logoutError}</span>
                  </div>
                )}

                {/* Navigation Action Buttons list */}
                <div className="px-2 mt-2">
                  <button
                    id="logout-action-btn"
                    disabled={isLoggingOut}
                    onClick={handleLogoutClick}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-right rounded-xl hover:bg-white/5 text-red-400 hover:text-red-300 font-medium transition-all group duration-150 disabled:opacity-50 cursor-pointer text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      {isLoggingOut ? (
                        <Loader2 size={16} className="animate-spin text-red-400" />
                      ) : (
                        <LogOut size={16} className="transition-transform group-hover:-translate-x-0.5" />
                      )}
                      <span>خروج از حساب کاربری</span>
                    </div>
                    
                    {isLoggingOut && (
                      <span className="text-[10px] text-on-surface-variant/50 animate-pulse">
                        در حال خروج...
                      </span>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <h1 className="font-display-lg-mobile text-display-lg-mobile tracking-tighter text-primary">
          FITOPIA
        </h1>

        {/* Notifications bell click */}
        <div
          onClick={handleNotificationClick}
          className="relative active:scale-95 transition-transform duration-200 cursor-pointer w-8 h-8 flex items-center justify-center"
        >
          <Bell className="text-primary w-6 h-6 hover:brightness-110 active:brightness-90 transition-all" />
          {unreadNotifications > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full shadow-[0_0_8px_rgba(255,180,171,0.8)]" />
          )}
        </div>
      </div>
    </header>
  );
}
