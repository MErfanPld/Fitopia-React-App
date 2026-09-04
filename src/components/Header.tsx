import { useState, useEffect, useRef } from "react";
import { Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import SidebarMenu from "./SidebarMenu";

function greetingByHour(): string {
  const h = new Date().getHours();
  if (h < 12) return "صبح بخیر";
  if (h < 18) return "ظهر بخیر";
  return "عصر بخیر";
}

export function Header() {
  const { logout, displayName } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && sidebarOpen) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen]);

  const handleProfileClick = () => {
    setOpen(false);
    navigate("/profile");
  };

  const handleLogoutClick = async () => {
    setLoading(true);
    try {
      await logout();
      setOpen(false);
      navigate("/welcome", { replace: true });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const name = displayName || "کاربر عزیز";

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-40 border-b border-white/5 bg-[#0c0c10]/92 backdrop-blur-xl">
        <div className="mx-auto max-w-3xl flex items-center gap-3 px-4 h-14 md:h-16 pt-[env(safe-area-inset-top)]">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden min-w-11 min-h-11 inline-flex items-center justify-center rounded-xl hover:bg-white/5 transition-colors"
            aria-label={sidebarOpen ? "بستن منو" : "باز کردن منو"}
            aria-expanded={sidebarOpen}
          >
            {sidebarOpen ? (
              <X className="w-5 h-5 text-primary" aria-hidden />
            ) : (
              <Menu className="w-5 h-5 text-on-surface" aria-hidden />
            )}
          </button>

          <div className="flex-1 min-w-0 text-right md:text-right">
            <p className="text-[11px] font-medium text-on-surface-variant truncate">
              {greetingByHour()}
            </p>
            <p className="text-sm font-bold text-on-surface truncate leading-tight">
              {name}
            </p>
          </div>

          <div className="flex items-center gap-1.5" ref={ref}>
            <div className="relative">
              <button
                type="button"
                onClick={() => setOpen(!open)}
                className="min-w-11 min-h-11 rounded-full bg-surface-container border border-white/10 inline-flex items-center justify-center hover:border-primary/40 transition-colors"
                aria-label="منوی کاربر"
                aria-expanded={open}
                aria-haspopup="menu"
              >
                <User className="w-5 h-5 text-on-surface-variant" strokeWidth={1.6} aria-hidden />
              </button>

              {open && (
                <div
                  role="menu"
                  className="absolute left-0 top-12 w-52 elevation-3 rounded-2xl border border-white/10 bg-surface-container-high overflow-hidden z-50"
                >
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleProfileClick}
                    className="w-full flex items-center justify-end gap-3 px-4 py-3.5 text-on-surface hover:bg-primary/10 hover:text-primary transition-colors text-right border-b border-white/8"
                  >
                    <span className="text-sm font-medium">پروفایل</span>
                    <User className="w-4 h-4 text-on-surface-variant" strokeWidth={1.6} aria-hidden />
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogoutClick}
                    disabled={loading}
                    className="w-full flex items-center justify-end gap-3 px-4 py-3.5 text-on-surface hover:bg-white/5 transition-colors text-right disabled:opacity-50"
                  >
                    <span className="text-sm font-medium">
                      {loading ? "در حال خروج..." : "خروج"}
                    </span>
                    <LogOut className="w-4 h-4" strokeWidth={1.6} aria-hidden />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <SidebarMenu isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}
