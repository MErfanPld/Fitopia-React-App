/**
 * Fitopia navigation shell
 * - Mobile: floating pill bar + raised circular active item
 * - Desktop (≥ lg): compact icon rail (hover expand)
 */

import { useState, useRef, useEffect } from "react";
import { Home, Map, Award, Ticket, User, LogOut, History } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type NavItem = {
  id: string;
  to: string;
  label: string;
  icon: typeof Home;
  match: (p: string) => boolean;
};

const primaryNav: NavItem[] = [
  {
    id: "home",
    to: "/home",
    label: "خانه",
    icon: Home,
    match: (p) => p === "/home" || p.startsWith("/home/"),
  },
  {
    id: "gyms",
    to: "/gym-map",
    label: "باشگاه‌ها",
    icon: Map,
    match: (p) => p.startsWith("/gym-map") || p.startsWith("/gym/"),
  },
  {
    id: "sub",
    to: "/subscriptions",
    label: "اشتراک",
    icon: Award,
    match: (p) => p.startsWith("/subscriptions"),
  },
  {
    id: "tokens",
    to: "/gym-access/tokens",
    label: "توکن‌ها",
    icon: Ticket,
    match: (p) => p.startsWith("/gym-access"),
  },
  {
    id: "profile",
    to: "/profile",
    label: "پروفایل",
    icon: User,
    match: (p) => p === "/profile" || p.startsWith("/profile/"),
  },
];

function isActive(match: NavItem["match"], pathname: string) {
  return match(pathname);
}

function MobileBottomNav() {
  const location = useLocation();

  return (
    <nav
      className="fixed inset-x-0 z-50 flex justify-center pointer-events-none lg:hidden"
      style={{
        bottom: "max(0.75rem, env(safe-area-inset-bottom))",
      }}
      aria-label="منوی اصلی"
    >
      <div
        className="pointer-events-auto relative flex items-center justify-between w-[min(calc(100vw-1.5rem),23.75rem)] h-[4.15rem] px-1.5 rounded-full border border-white/[0.08] bg-[rgba(20,20,24,0.96)] shadow-[0_8px_32px_rgba(0,0,0,0.45)]"
        role="list"
      >
        {primaryNav.map(({ id, to, label, icon: Icon, match }) => {
          const isCurrent = isActive(match, location.pathname);

          return (
            <Link
              key={id}
              to={to}
              role="listitem"
              aria-label={label}
              aria-current={isCurrent ? "page" : undefined}
              className="relative flex flex-1 items-center justify-center min-h-12 min-w-0 no-underline outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00] focus-visible:ring-offset-2 focus-visible:ring-offset-[#141418] rounded-full"
            >
              <span
                className={`flex items-center justify-center rounded-full transition-all duration-200 ease-out motion-reduce:transition-none ${
                  isCurrent
                    ? "h-[3.25rem] w-[3.25rem] -translate-y-3 bg-[#FF6A00] text-white shadow-[0_6px_16px_rgba(255,106,0,0.35)]"
                    : "h-11 w-11 translate-y-0 bg-transparent text-[#8B8B92] active:scale-95 active:opacity-70"
                }`}
              >
                <Icon
                  size={isCurrent ? 22 : 20}
                  strokeWidth={isCurrent ? 2.15 : 1.55}
                  aria-hidden
                />
              </span>
              <span className="sr-only">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function DesktopNavRail() {
  const location = useLocation();
  const navigate = useNavigate();
  const { displayName, logout } = useAuth();
  const [expanded, setExpanded] = useState(false);
  const [tooltip, setTooltip] = useState<string | null>(null);
  const [tipY, setTipY] = useState(0);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const open = () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setExpanded(true);
    setTooltip(null);
  };

  const scheduleClose = () => {
    leaveTimer.current = setTimeout(() => setExpanded(false), 120);
  };

  useEffect(() => {
    return () => {
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/welcome", { replace: true });
  };

  const showTip = (label: string, el: HTMLElement) => {
    if (expanded) return;
    const rect = el.getBoundingClientRect();
    setTipY(rect.top + rect.height / 2);
    setTooltip(label);
  };

  return (
    <>
      <aside
        className={`hidden lg:flex fixed top-0 left-0 z-40 h-dvh flex-col border-r border-white/[0.06] bg-[#0a0a0e] transition-[width] duration-200 ease-out overflow-hidden ${
          expanded ? "w-60" : "w-[4.75rem]"
        }`}
        onMouseEnter={open}
        onMouseLeave={scheduleClose}
        aria-label="ناوبری اصلی"
      >
        <div className="flex h-14 shrink-0 items-center px-3 border-b border-white/[0.05]">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-container/15 border border-primary-container/25">
            <span className="text-[11px] font-black text-primary tracking-tight">F</span>
          </div>
          <span
            className={`ms-3 text-sm font-extrabold tracking-wide text-white whitespace-nowrap transition-opacity duration-200 ${
              expanded ? "opacity-100" : "opacity-0"
            }`}
          >
            FITOPIA
          </span>
        </div>

        <nav className="flex-1 flex flex-col gap-0.5 px-2 py-3 overflow-y-auto overflow-x-hidden">
          {primaryNav.map(({ id, to, label, icon: Icon, match }) => {
            const active = isActive(match, location.pathname);
            return (
              <Link
                key={id}
                to={to}
                className={`group relative flex items-center gap-3 rounded-xl min-h-11 px-2.5 no-underline transition-colors duration-150 ${
                  active
                    ? "bg-primary-container/12 text-[#FF8A4C]"
                    : "text-white/45 hover:bg-white/[0.04] hover:text-white/85"
                } ${!expanded ? "justify-center" : ""}`}
                aria-current={active ? "page" : undefined}
                onMouseEnter={(e) => showTip(label, e.currentTarget)}
                onMouseLeave={() => setTooltip(null)}
              >
                {active && (
                  <span
                    aria-hidden
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-full bg-[#FF6A00]"
                  />
                )}
                <span
                  className={`flex items-center justify-center shrink-0 rounded-full transition-colors duration-150 ${
                    active && !expanded ? "h-10 w-10 bg-[#FF6A00] text-white" : ""
                  }`}
                >
                  <Icon
                    size={20}
                    strokeWidth={active ? 2.1 : 1.6}
                    className={active && !expanded ? "text-white" : undefined}
                    aria-hidden
                  />
                </span>
                {expanded && (
                  <span className="text-[13px] font-semibold whitespace-nowrap">{label}</span>
                )}
              </Link>
            );
          })}

          <div className="my-2 mx-2 border-t border-white/[0.06]" />

          <Link
            to="/subscriptions/history"
            className={`flex items-center gap-3 rounded-xl min-h-11 px-2.5 no-underline transition-colors duration-150 ${
              location.pathname.includes("/history")
                ? "bg-primary-container/12 text-[#FF8A4C]"
                : "text-white/40 hover:bg-white/[0.04] hover:text-white/80"
            } ${!expanded ? "justify-center" : ""}`}
            onMouseEnter={(e) => showTip("تاریخچه", e.currentTarget)}
            onMouseLeave={() => setTooltip(null)}
          >
            <History size={20} strokeWidth={1.6} className="shrink-0" aria-hidden />
            {expanded && (
              <span className="text-[13px] font-medium whitespace-nowrap">تاریخچه</span>
            )}
          </Link>
        </nav>

        <div className="shrink-0 border-t border-white/[0.05] p-2 space-y-0.5">
          <Link
            to="/profile"
            className={`flex items-center gap-2.5 rounded-xl min-h-11 px-2 no-underline text-white/55 hover:bg-white/[0.04] hover:text-white/90 transition-colors ${
              !expanded ? "justify-center" : ""
            }`}
            onMouseEnter={(e) => showTip(displayName || "پروفایل", e.currentTarget)}
            onMouseLeave={() => setTooltip(null)}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/[0.06] border border-white/10">
              <User size={16} aria-hidden />
            </span>
            {expanded && (
              <span className="min-w-0">
                <span className="block text-[12px] font-bold text-white truncate max-w-[9rem]">
                  {displayName || "کاربر"}
                </span>
                <span className="block text-[10px] text-white/40">پروفایل</span>
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 rounded-xl min-h-10 px-2.5 text-white/40 hover:bg-red-500/10 hover:text-red-300 transition-colors ${
              !expanded ? "justify-center" : ""
            }`}
            onMouseEnter={(e) => showTip("خروج", e.currentTarget)}
            onMouseLeave={() => setTooltip(null)}
          >
            <LogOut size={18} strokeWidth={1.6} className="shrink-0" aria-hidden />
            {expanded && <span className="text-[13px] font-medium whitespace-nowrap">خروج</span>}
          </button>
        </div>
      </aside>

      {tooltip && !expanded && (
        <div
          role="tooltip"
          className="hidden lg:block fixed z-50 pointer-events-none px-2.5 py-1 rounded-md bg-[#1a1a20] border border-white/10 text-[11px] font-semibold text-white shadow-lg"
          style={{
            left: "5.25rem",
            top: tipY,
            transform: "translateY(-50%)",
          }}
        >
          {tooltip}
        </div>
      )}
    </>
  );
}

export function BottomNavigation() {
  return (
    <>
      <MobileBottomNav />
      <DesktopNavRail />
    </>
  );
}
