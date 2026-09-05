/**
 * Fitopia navigation shell
 * - Mobile: floating pill, HOME centered, raised active circle
 * - Desktop/tablet (≥ md): thin 68px rail, optional expand via toggle
 */

import { useState, useRef, useEffect, useCallback } from "react";
import {
  House,
  Compass,
  MapPinned,
  CreditCard,
  CircleUser,
  PanelLeft,
  LogOut,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type NavItem = {
  id: string;
  to: string;
  label: string;
  icon: typeof House;
  match: (p: string) => boolean;
  primary?: boolean;
};

/** Explore → Map → HOME (center) → Membership → Profile */
const primaryNav: NavItem[] = [
  {
    id: "explore",
    to: "/gym/all",
    label: "باشگاه‌ها",
    icon: Compass,
    match: (p) => p === "/gym/all" || (p.startsWith("/gym/") && !p.startsWith("/gym-map")),
  },
  {
    id: "map",
    to: "/gym-map",
    label: "نقشه",
    icon: MapPinned,
    match: (p) => p.startsWith("/gym-map"),
  },
  {
    id: "home",
    to: "/home",
    label: "خانه",
    icon: House,
    primary: true,
    match: (p) => p === "/home" || p.startsWith("/home/"),
  },
  {
    id: "membership",
    to: "/subscriptions",
    label: "اشتراک",
    icon: CreditCard,
    match: (p) => p.startsWith("/subscriptions"),
  },
  {
    id: "profile",
    to: "/profile",
    label: "پروفایل",
    icon: CircleUser,
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
      className="fixed inset-x-0 z-50 flex justify-center pointer-events-none md:hidden"
      style={{ bottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      aria-label="منوی اصلی"
    >
      <div
        className="pointer-events-auto relative flex items-center justify-between w-[min(calc(100vw-1.5rem),23.75rem)] h-[4.15rem] px-1.5 rounded-full border border-white/[0.08] bg-[rgba(20,20,24,0.96)] shadow-[0_8px_28px_rgba(0,0,0,0.4)]"
        role="list"
      >
        {primaryNav.map(({ id, to, label, icon: Icon, match, primary }) => {
          const current = isActive(match, location.pathname);
          return (
            <Link
              key={id}
              to={to}
              role="listitem"
              aria-label={label}
              aria-current={current ? "page" : undefined}
              className="relative flex flex-1 items-center justify-center min-h-12 min-w-0 no-underline rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#141418]"
            >
              <span
                className={`flex items-center justify-center rounded-full transition-all duration-200 ease-out motion-reduce:transition-none ${
                  current
                    ? "h-[3.25rem] w-[3.25rem] -translate-y-3 bg-[#FF6A00] text-white shadow-[0_6px_14px_rgba(255,106,0,0.32)]"
                    : "h-11 w-11 text-[#8B8B92] active:opacity-70"
                }`}
              >
                <Icon
                  size={current || primary ? 22 : 20}
                  strokeWidth={current ? 2.1 : 1.75}
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
  const [tooltip, setTooltip] = useState<{ label: string; y: number } | null>(null);
  const tipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggle = useCallback(() => setExpanded((v) => !v), []);

  useEffect(() => {
    return () => {
      if (tipTimer.current) clearTimeout(tipTimer.current);
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1199px)");
    const onChange = () => {
      if (mq.matches) setExpanded(false);
    };
    mq.addEventListener("change", onChange);
    onChange();
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const showTip = (label: string, el: HTMLElement) => {
    if (expanded) return;
    if (tipTimer.current) clearTimeout(tipTimer.current);
    tipTimer.current = setTimeout(() => {
      const rect = el.getBoundingClientRect();
      setTooltip({ label, y: rect.top + rect.height / 2 });
    }, 150);
  };

  const hideTip = () => {
    if (tipTimer.current) clearTimeout(tipTimer.current);
    setTooltip(null);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/welcome", { replace: true });
  };

  return (
    <>
      <aside
        className={`hidden md:flex fixed top-0 left-0 z-40 h-dvh flex-col items-stretch border-r border-white/[0.05] bg-[#0D0D11] transition-[width] duration-200 ease-out overflow-hidden motion-reduce:transition-none ${
          expanded ? "w-[238px]" : "w-[68px]"
        }`}
        aria-label="ناوبری اصلی"
      >
        <div
          className={`flex h-14 shrink-0 items-center border-b border-white/[0.05] ${
            expanded ? "px-3 gap-2" : "justify-center"
          }`}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-primary-container/12 border border-primary-container/20">
            <span className="text-[12px] font-black text-[#FF6A00]">F</span>
          </div>
          <span
            className={`text-[13px] font-extrabold tracking-wide text-white whitespace-nowrap transition-opacity duration-200 delay-75 ${
              expanded ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
            }`}
          >
            FITOPIA
          </span>
          {expanded && (
            <button
              type="button"
              onClick={toggle}
              className="ms-auto flex h-8 w-8 items-center justify-center rounded-lg text-white/40 hover:text-white/80 hover:bg-white/[0.05] transition-colors"
              aria-label="جمع کردن منو"
            >
              <PanelLeft size={16} strokeWidth={1.8} aria-hidden />
            </button>
          )}
        </div>

        {!expanded && (
          <div className="flex justify-center py-2">
            <button
              type="button"
              onClick={toggle}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/35 hover:text-white/75 hover:bg-white/[0.05] transition-colors"
              aria-label="باز کردن منو"
              aria-expanded={false}
            >
              <PanelLeft size={16} strokeWidth={1.8} className="rotate-180" aria-hidden />
            </button>
          </div>
        )}

        <nav
          className={`flex-1 flex flex-col py-2 gap-2 overflow-y-auto overflow-x-hidden ${
            expanded ? "px-2.5" : "items-center px-0"
          }`}
        >
          <div className={`flex flex-col gap-1.5 ${expanded ? "" : "items-center"}`}>
            {primaryNav.slice(0, 2).map((item) => (
              <RailLink
                key={item.id}
                item={item}
                pathname={location.pathname}
                expanded={expanded}
                onTip={showTip}
                onTipHide={hideTip}
              />
            ))}
          </div>

          <div className={`my-1 flex flex-col ${expanded ? "" : "items-center"}`}>
            <RailLink
              item={primaryNav[2]}
              pathname={location.pathname}
              expanded={expanded}
              onTip={showTip}
              onTipHide={hideTip}
              emphasize
            />
          </div>

          <div className={`flex flex-col gap-1.5 ${expanded ? "" : "items-center"}`}>
            {primaryNav.slice(3).map((item) => (
              <RailLink
                key={item.id}
                item={item}
                pathname={location.pathname}
                expanded={expanded}
                onTip={showTip}
                onTipHide={hideTip}
              />
            ))}
          </div>
        </nav>

        <div
          className={`shrink-0 border-t border-white/[0.05] py-3 ${
            expanded ? "px-2.5" : "flex flex-col items-center gap-2"
          }`}
        >
          <Link
            to="/profile"
            className={`flex items-center rounded-[12px] no-underline transition-colors hover:bg-white/[0.04] ${
              expanded ? "gap-2.5 px-2 min-h-11" : "h-9 w-9 justify-center"
            }`}
            aria-label={displayName || "پروفایل"}
            onMouseEnter={(e) => showTip(displayName || "پروفایل", e.currentTarget)}
            onMouseLeave={hideTip}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.06] border border-white/10 text-white/70">
              <CircleUser size={16} strokeWidth={1.8} aria-hidden />
            </span>
            {expanded && (
              <span className="text-[12px] font-semibold text-white/80 truncate max-w-[8.5rem]">
                {displayName || "پروفایل"}
              </span>
            )}
          </Link>
          {expanded && (
            <button
              type="button"
              onClick={handleLogout}
              className="mt-1 w-full flex items-center gap-2.5 rounded-[12px] px-2 min-h-10 text-white/40 hover:text-red-300 hover:bg-red-500/10 transition-colors"
            >
              <LogOut size={16} strokeWidth={1.8} aria-hidden />
              <span className="text-[12px] font-medium">خروج</span>
            </button>
          )}
        </div>
      </aside>

      {tooltip && !expanded && (
        <div
          role="tooltip"
          className="hidden md:block fixed z-50 pointer-events-none px-2.5 py-1 rounded-md bg-[#1a1a20] border border-white/10 text-[11px] font-semibold text-white shadow-lg"
          style={{ left: "4.75rem", top: tooltip.y, transform: "translateY(-50%)" }}
        >
          {tooltip.label}
        </div>
      )}
    </>
  );
}

function RailLink({
  item,
  pathname,
  expanded,
  onTip,
  onTipHide,
  emphasize,
}: {
  item: NavItem;
  pathname: string;
  expanded: boolean;
  onTip: (label: string, el: HTMLElement) => void;
  onTipHide: () => void;
  emphasize?: boolean;
}) {
  const active = isActive(item.match, pathname);
  const Icon = item.icon;

  return (
    <Link
      to={item.to}
      aria-label={item.label}
      aria-current={active ? "page" : undefined}
      onMouseEnter={(e) => onTip(item.label, e.currentTarget)}
      onMouseLeave={onTipHide}
      className={`group relative flex items-center no-underline outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]/70 rounded-[12px] transition-colors duration-150 ${
        expanded ? "gap-3 min-h-11 w-full px-2.5" : "h-11 w-11 justify-center"
      } ${
        active
          ? "bg-[rgba(255,106,0,0.14)] text-[#FF6A00]"
          : "text-[#8B8B92] hover:bg-white/[0.04] hover:text-white/85"
      }`}
    >
      {active && (
        <span
          aria-hidden
          className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[2px] rounded-full bg-[#FF6A00]"
        />
      )}
      <Icon
        size={emphasize || item.primary ? 21 : 20}
        strokeWidth={active ? 2 : 1.85}
        className="shrink-0"
        aria-hidden
      />
      {expanded && (
        <span
          className={`text-[13px] whitespace-nowrap transition-opacity duration-200 delay-75 ${
            active ? "font-bold" : "font-semibold"
          }`}
        >
          {item.label}
        </span>
      )}
    </Link>
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
