/**
 * Mobile drawer — opens from the right (RTL).
 * Desktop: hidden (rail is in BottomNavigation).
 * Owns body scroll-lock via .drawer-open.
 */

import { FC, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  House,
  Compass,
  MapPinned,
  CreditCard,
  Ticket,
  UserRound,
  History,
  LogOut,
  X,
} from "lucide-react";

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV = [
  { id: "home", label: "خانه", icon: House, path: "/home" },
  { id: "explore", label: "باشگاه‌ها", icon: Compass, path: "/gym/all" },
  { id: "map", label: "نقشه", icon: MapPinned, path: "/gym-map" },
  { id: "sub", label: "اشتراک", icon: CreditCard, path: "/subscriptions" },
  { id: "tokens", label: "توکن‌ها", icon: Ticket, path: "/gym-access/tokens" },
  { id: "profile", label: "پروفایل", icon: UserRound, path: "/profile" },
  {
    id: "history",
    label: "تاریخچه اشتراک",
    icon: History,
    path: "/subscriptions/history",
  },
] as const;

function isActive(pathname: string, path: string) {
  if (path === "/home") return pathname === "/home" || pathname.startsWith("/home/");
  if (path === "/gym/all") return pathname === "/gym/all";
  if (path === "/gym-map") return pathname.startsWith("/gym-map");
  if (path === "/subscriptions")
    return pathname === "/subscriptions" || pathname.startsWith("/subscriptions/payment");
  if (path === "/subscriptions/history") return pathname.startsWith("/subscriptions/history");
  return pathname === path || pathname.startsWith(path + "/");
}

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

  const name = displayName?.trim() || "کاربر فیتوپیا";
  const initial = name.charAt(0);

  return (
    <div className="md:hidden" aria-hidden={!isOpen}>
      <button
        type="button"
        tabIndex={isOpen ? 0 : -1}
        aria-label="بستن منو"
        onClick={onClose}
        className={`fixed inset-0 z-[60] border-0 p-0 transition-opacity duration-200 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{ background: "rgba(0,0,0,0.55)" }}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="منوی ناوبری"
        className={`fixed top-0 right-0 z-[70] flex h-[100dvh] max-h-[100dvh] flex-col bg-[#0c0c10] border-l border-white/10 shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          width: "min(300px, 88vw)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        <div
          className="flex shrink-0 items-center gap-3 border-b border-white/10 px-3"
          style={{
            paddingTop: "max(12px, env(safe-area-inset-top, 0px))",
            paddingBottom: 12,
          }}
        >
          <div className="min-w-0 flex-1 text-right">
            <p className="text-sm font-black tracking-wide text-white">FITOPIA</p>
            <p className="text-[11px] text-white/40 truncate">{name}</p>
          </div>
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 border border-primary/30 text-sm font-black text-primary"
            aria-hidden
          >
            {initial}
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-white/80 hover:bg-white/10"
            aria-label="بستن"
          >
            <X size={18} aria-hidden />
          </button>
        </div>

        <nav
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-3"
          aria-label="منو"
        >
          <ul className="m-0 list-none space-y-1 p-0">
            {NAV.map(({ id, label, icon: Icon, path }) => {
              const on = isActive(location.pathname, path);
              return (
                <li key={id}>
                  <Link
                    to={path}
                    onClick={onClose}
                    aria-current={on ? "page" : undefined}
                    className={`flex w-full flex-row-reverse items-center gap-3 rounded-xl px-3 py-3 no-underline transition-colors ${
                      on
                        ? "bg-primary/15 text-primary"
                        : "text-white/80 hover:bg-white/5 hover:text-white"
                    }`}
                    style={{ minHeight: 48 }}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                        on ? "bg-primary/20 text-primary" : "bg-white/5 text-white/60"
                      }`}
                    >
                      <Icon size={18} strokeWidth={on ? 2.15 : 1.8} aria-hidden />
                    </span>
                    <span
                      className={`min-w-0 flex-1 text-right text-[13px] ${
                        on ? "font-bold" : "font-semibold"
                      }`}
                    >
                      {label}
                    </span>
                    {on ? (
                      <span className="h-5 w-1 shrink-0 rounded-full bg-primary" aria-hidden />
                    ) : (
                      <span className="w-1 shrink-0" aria-hidden />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="shrink-0 border-t border-white/10 p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/25 bg-red-500/10 px-3 py-3 text-[13px] font-bold text-red-300 hover:bg-red-500/15"
            style={{ minHeight: 48 }}
          >
            <LogOut size={17} aria-hidden />
            خروج از حساب
          </button>
        </div>
      </aside>
    </div>
  );
};

export default SidebarMenu;
