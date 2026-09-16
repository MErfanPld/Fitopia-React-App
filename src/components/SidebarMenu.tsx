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
  { id: "tokens", label: "بلیت‌ها", icon: Ticket, path: "/gym-access/tokens" },
  { id: "profile", label: "پروفایل", icon: UserRound, path: "/profile" },
  {
    id: "history",
    label: "سوابق اشتراک",
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

  const handleLogout = () => {
    onClose();
    logout();
    navigate("/welcome", { replace: true });
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-[2px] transition-opacity md:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      <aside
        className={`fixed inset-y-0 right-0 z-[70] flex w-[min(88vw,300px)] flex-col border-l border-white/[0.08] bg-[#0D0D11] transition-transform duration-300 ease-out md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="منو"
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-4">
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white/70"
            aria-label="بستن منو"
          >
            <X size={18} aria-hidden />
          </button>
          <div className="min-w-0 text-right">
            <p className="truncate text-sm font-bold text-white">{displayName || "کاربر فیتوپیا"}</p>
            <p className="text-[11px] text-white/40">منوی اصلی</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-3" aria-label="ناوبری">
          <ul className="space-y-1">
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = isActive(location.pathname, item.path);
              return (
                <li key={item.id}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={`flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-colors ${
                      active
                        ? "bg-primary/15 text-primary"
                        : "text-white/75 hover:bg-white/[0.05] hover:text-white"
                    }`}
                  >
                    <Icon size={18} strokeWidth={1.9} aria-hidden />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-white/[0.06] p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex min-h-12 w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold text-red-300/90 hover:bg-red-500/10"
          >
            <LogOut size={18} aria-hidden />
            خروج از حساب
          </button>
        </div>
      </aside>
    </>
  );
};

export default SidebarMenu;
export { SidebarMenu };
