import { useState, useEffect, useRef } from "react";
import { Menu, User, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import SidebarMenu from "./SidebarMenu";

function greetingByHour(): string {
  const h = new Date().getHours();
  if (h < 5) return "شب بخیر";
  if (h < 12) return "صبح بخیر";
  if (h < 17) return "ظهر بخیر";
  if (h < 21) return "عصر بخیر";
  return "شب بخیر";
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
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!sidebarOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
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
      <header className="relative z-40 w-full">
        <div className="home-shell home-pad pt-[max(0.75rem,env(safe-area-inset-top))] pb-2">
          <div className="flex items-start gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden mt-0.5 min-w-11 min-h-11 inline-flex items-center justify-center rounded-2xl bg-white/[0.04] border border-white/8 hover:bg-white/[0.07] transition-colors"
              aria-label="باز کردن منو"
              aria-expanded={sidebarOpen}
            >
              <Menu className="w-5 h-5 text-on-surface" aria-hidden />
            </button>

            <div className="flex-1 min-w-0 text-right">
              <p className="text-[11px] sm:text-xs font-medium text-white/55">
                {greetingByHour()} 👋
              </p>
              <h1 className="mt-0.5 text-[1.05rem] sm:text-xl font-extrabold text-white truncate leading-tight tracking-tight">
                {name}
              </h1>
              <p className="mt-1 text-[11px] sm:text-xs text-white/50 leading-relaxed">
                آماده‌ای برای تمرین امروز؟
              </p>
            </div>

            <div className="relative mt-0.5" ref={ref}>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="min-w-11 min-h-11 rounded-2xl bg-gradient-to-br from-primary-container/30 to-white/5 border border-primary-container/35 inline-flex items-center justify-center hover:border-primary-container/60 transition-colors"
                aria-label="منوی کاربر"
                aria-expanded={open}
                aria-haspopup="menu"
              >
                <User className="w-5 h-5 text-primary" strokeWidth={1.75} aria-hidden />
              </button>

              {open && (
                <div
                  role="menu"
                  className="absolute left-0 top-12 w-48 rounded-2xl border border-white/10 bg-[#141418] elevation-3 overflow-hidden z-50"
                >
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleProfileClick}
                    className="w-full flex items-center justify-end gap-2.5 px-4 py-3.5 text-sm text-on-surface hover:bg-white/5 transition-colors"
                  >
                    پروفایل
                    <User className="w-4 h-4 text-white/50" aria-hidden />
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogoutClick}
                    disabled={loading}
                    className="w-full flex items-center justify-end gap-2.5 px-4 py-3.5 text-sm text-on-surface hover:bg-white/5 border-t border-white/8 disabled:opacity-50"
                  >
                    {loading ? "در حال خروج..." : "خروج"}
                    <LogOut className="w-4 h-4 text-white/50" aria-hidden />
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
