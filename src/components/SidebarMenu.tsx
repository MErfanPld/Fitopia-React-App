/**
 * Mobile navigation drawer only (RTL: slides from right).
 * Desktop uses BottomNavigation → DesktopNavRail.
 * Sole owner of body scroll-lock via .drawer-open.
 */

import { FC, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Home,
  Map,
  Award,
  Ticket,
  User,
  History,
  LogOut,
  X,
} from "lucide-react";

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const primary = [
  { id: "home", label: "خانه", icon: Home, path: "/home" },
  { id: "map", label: "باشگاه‌ها", icon: Map, path: "/gym-map" },
  { id: "sub", label: "اشتراک", icon: Award, path: "/subscriptions" },
  { id: "tokens", label: "توکن‌ها", icon: Ticket, path: "/gym-access/tokens" },
  { id: "profile", label: "پروفایل", icon: User, path: "/profile" },
] as const;

const secondary = [
  {
    id: "history",
    label: "تاریخچه اشتراک",
    icon: History,
    path: "/subscriptions/history",
  },
] as const;

const SidebarMenu: FC<SidebarMenuProps> = ({ isOpen, onClose }) => {
  const { displayName, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      document.documentElement.classList.remove("drawer-open");
      document.body.classList.remove("drawer-open");
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      return;
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    document.documentElement.classList.add("drawer-open");
    document.body.classList.add("drawer-open");
    requestAnimationFrame(() => closeRef.current?.focus());

    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("drawer-open");
      document.body.classList.remove("drawer-open");
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleLogout = async () => {
    await logout();
    onClose();
    navigate("/welcome", { replace: true });
  };

  const active = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] md:hidden transition-opacity duration-200 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{ background: "rgba(0,0,0,0.55)" }}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      <aside
        className={`fixed top-0 right-0 z-[70] h-dvh w-[min(20rem,82vw)] flex flex-col bg-[#0e0e12] border-l border-white/[0.07] shadow-[-8px_0_32px_rgba(0,0,0,0.4)] transition-transform duration-[240ms] ease-out md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="منوی ناوبری"
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between gap-3 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-3 border-b border-white/[0.06]">
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="min-w-11 min-h-11 inline-flex items-center justify-center rounded-xl hover:bg-white/5 transition-colors"
            aria-label="بستن منو"
          >
            <X className="w-5 h-5 text-white/80" aria-hidden />
          </button>
          <span className="text-sm font-extrabold tracking-wide text-white">
            FITOPIA
          </span>
        </div>

        <div className="flex items-center gap-3 px-4 py-4 border-b border-white/[0.06]">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-container/15 border border-primary-container/30">
            <User className="w-5 h-5 text-primary" aria-hidden />
          </div>
          <div className="min-w-0 text-right flex-1">
            <p className="text-sm font-bold text-white truncate">
              {displayName || "کاربر فیتوپیا"}
            </p>
            <p className="text-[11px] text-white/40">عضو فیتوپیا</p>
          </div>
        </div>

        <nav
          className="flex-1 overflow-y-auto px-2.5 py-3 space-y-0.5"
          aria-label="لینک‌ها"
        >
          {primary.map(({ id, label, icon: Icon, path }) => {
            const on = active(path);
            return (
              <Link
                key={id}
                to={path}
                onClick={onClose}
                className={`flex items-center justify-end gap-3 rounded-xl px-3 min-h-12 no-underline transition-colors duration-150 ${
                  on
                    ? "bg-primary-container/12 text-[#FF8A4C]"
                    : "text-white/75 hover:bg-white/[0.04]"
                }`}
                aria-current={on ? "page" : undefined}
              >
                <span className="text-[13px] font-semibold">{label}</span>
                <Icon size={20} strokeWidth={on ? 2.05 : 1.55} aria-hidden />
              </Link>
            );
          })}

          <div className="my-2.5 mx-2 border-t border-white/[0.06]" />

          {secondary.map(({ id, label, icon: Icon, path }) => (
            <Link
              key={id}
              to={path}
              onClick={onClose}
              className="flex items-center justify-end gap-3 rounded-xl px-3 min-h-12 text-white/55 hover:bg-white/[0.04] no-underline"
            >
              <span className="text-[13px] font-medium">{label}</span>
              <Icon size={20} strokeWidth={1.55} aria-hidden />
            </Link>
          ))}
        </nav>

        <div className="p-2.5 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-white/[0.06]">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-end gap-3 rounded-xl px-3 min-h-12 text-red-300/90 hover:bg-red-500/10 transition-colors"
          >
            <span className="text-[13px] font-semibold">خروج از حساب</span>
            <LogOut size={18} strokeWidth={1.7} aria-hidden />
          </button>
        </div>
      </aside>
    </>
  );
};

export default SidebarMenu;
