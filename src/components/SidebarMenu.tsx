/**
 * Mobile navigation drawer (RTL: slides from right).
 * Desktop uses BottomNavigation → DesktopNavRail.
 * Sole owner of body scroll-lock via .drawer-open.
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
  ChevronLeft,
} from "lucide-react";

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const primary = [
  { id: "home", label: "خانه", icon: House, path: "/home" },
  { id: "explore", label: "باشگاه‌ها", icon: Compass, path: "/gym/all" },
  { id: "map", label: "نقشه", icon: MapPinned, path: "/gym-map" },
  { id: "sub", label: "اشتراک", icon: CreditCard, path: "/subscriptions" },
  { id: "tokens", label: "توکن‌ها", icon: Ticket, path: "/gym-access/tokens" },
  { id: "profile", label: "پروفایل", icon: UserRound, path: "/profile" },
] as const;

const secondary = [
  {
    id: "history",
    label: "تاریخچه اشتراک",
    icon: History,
    path: "/subscriptions/history",
  },
] as const;

function isRouteActive(pathname: string, path: string) {
  if (path === "/home") return pathname === "/home" || pathname.startsWith("/home/");
  if (path === "/gym/all")
    return (
      pathname === "/gym/all" ||
      (pathname.startsWith("/gym/") && !pathname.startsWith("/gym-map"))
    );
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

  const initials = (displayName || "ک").trim().charAt(0);

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] md:hidden transition-opacity duration-250 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        style={{ background: "rgba(0,0,0,0.58)", backdropFilter: "blur(3px)" }}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      <aside
        className={`fixed top-0 end-0 z-[70] flex h-dvh w-[min(18.5rem,86vw)] flex-col bg-[#0c0c10] border-s border-white/[0.07] shadow-[-12px_0_40px_rgba(0,0,0,0.45)] transition-transform duration-[260ms] ease-[cubic-bezier(0.22,1,0.36,1)] md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="منوی ناوبری"
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-4 pt-[max(0.85rem,env(safe-area-inset-top))] pb-3">
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-white/75 hover:bg-white/[0.07] transition-colors"
            aria-label="بستن منو"
          >
            <X size={18} aria-hidden />
          </button>
          <div className="text-right min-w-0">
            <p className="text-[13px] font-black tracking-[0.12em] text-white">FITOPIA</p>
            <p className="text-[10px] text-white/35 mt-0.5">منوی اصلی</p>
          </div>
        </div>

        <div className="mx-3 mt-3 flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] px-3 py-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/15 text-sm font-black text-primary">
            {initials}
          </div>
          <div className="min-w-0 flex-1 text-right">
            <p className="truncate text-sm font-bold text-white">
              {displayName || "کاربر فیتوپیا"}
            </p>
            <p className="text-[11px] text-white/40 mt-0.5">حساب کاربری</p>
          </div>
          <ChevronLeft size={16} className="shrink-0 text-white/25" aria-hidden />
        </div>

        <nav
          className="mt-3 flex-1 overflow-y-auto overscroll-contain px-3 pb-3"
          aria-label="لینک‌های اصلی"
        >
          <p className="mb-1.5 px-2 text-[10px] font-bold tracking-wide text-white/30">
            ناوبری
          </p>
          <ul className="space-y-1">
            {primary.map(({ id, label, icon: Icon, path }) => {
              const on = isRouteActive(location.pathname, path);
              return (
                <li key={id}>
                  <Link
                    to={path}
                    onClick={onClose}
                    aria-current={on ? "page" : undefined}
                    className={`group relative flex min-h-12 items-center justify-between gap-3 rounded-xl px-3 no-underline transition-colors ${
                      on
                        ? "bg-primary/12 text-primary"
                        : "text-white/75 hover:bg-white/[0.04] hover:text-white"
                    }`}
                  >
                    {on ? (
                      <span
                        className="absolute end-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-s-full bg-primary"
                        aria-hidden
                      />
                    ) : null}
                    <span className="flex min-w-0 flex-1 items-center justify-end gap-2.5">
                      <span className={`text-[13px] font-semibold truncate ${on ? "font-bold" : ""}`}>
                        {label}
                      </span>
                      <span
                        className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                          on
                            ? "bg-primary/20 text-primary"
                            : "bg-white/[0.04] text-white/55 group-hover:text-white/80"
                        }`}
                      >
                        <Icon size={18} strokeWidth={on ? 2.1 : 1.75} aria-hidden />
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="my-3 mx-1 border-t border-white/[0.06]" />

          <p className="mb-1.5 px-2 text-[10px] font-bold tracking-wide text-white/30">
            بیشتر
          </p>
          <ul className="space-y-1">
            {secondary.map(({ id, label, icon: Icon, path }) => {
              const on = isRouteActive(location.pathname, path);
              return (
                <li key={id}>
                  <Link
                    to={path}
                    onClick={onClose}
                    aria-current={on ? "page" : undefined}
                    className={`flex min-h-11 items-center justify-end gap-2.5 rounded-xl px-3 no-underline transition-colors ${
                      on
                        ? "bg-primary/10 text-primary font-bold"
                        : "text-white/65 hover:bg-white/[0.04] hover:text-white/90 font-semibold"
                    }`}
                  >
                    <span className="text-[13px]">{label}</span>
                    <Icon size={17} strokeWidth={1.75} className="opacity-80" aria-hidden />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="shrink-0 border-t border-white/[0.06] p-3 pb-[max(0.85rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full min-h-12 items-center justify-end gap-2.5 rounded-xl border border-red-500/20 bg-red-500/[0.08] px-3 text-[13px] font-bold text-red-300 hover:bg-red-500/15 transition-colors"
          >
            خروج از حساب
            <LogOut size={17} aria-hidden />
          </button>
        </div>
      </aside>
    </>
  );
};

export default SidebarMenu;
