import { FC, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Home,
  Map,
  Building2,
  Award,
  Ticket,
  User,
  CreditCard,
  History,
  LogOut,
  X,
} from "lucide-react";

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const primaryLinks = [
  { id: "home", label: "خانه", icon: Home, path: "/home" },
  { id: "map", label: "نقشه باشگاه‌ها", icon: Map, path: "/gym-map" },
  { id: "all", label: "همه باشگاه‌ها", icon: Building2, path: "/gym/all" },
  { id: "sub", label: "اشتراک‌ها", icon: Award, path: "/subscriptions" },
  { id: "tokens", label: "اعتبار دسترسی", icon: Ticket, path: "/gym-access/tokens" },
  { id: "profile", label: "پروفایل", icon: User, path: "/profile" },
] as const;

const secondaryLinks = [
  { id: "history", label: "تاریخچه اشتراک", icon: History, path: "/subscriptions/history" },
  { id: "payment", label: "پرداخت", icon: CreditCard, path: "/subscriptions/payment" },
] as const;

const SidebarMenu: FC<SidebarMenuProps> = ({ isOpen, onClose }) => {
  const { displayName, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const handleLogout = async () => {
    await logout();
    onClose();
    navigate("/welcome", { replace: true });
  };

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] drawer-backdrop transition-opacity duration-200 lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      <aside
        className={`fixed top-0 right-0 z-[70] h-dvh w-[min(20rem,88vw)] flex flex-col border-l border-white/10 bg-[#0e0e12] shadow-[-12px_0_40px_rgba(0,0,0,0.45)] transition-transform duration-250 ease-out lg:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="منوی اصلی"
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between gap-3 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-4 border-b border-white/8">
          <button
            type="button"
            onClick={onClose}
            className="min-w-11 min-h-11 inline-flex items-center justify-center rounded-xl hover:bg-white/5"
            aria-label="بستن منو"
          >
            <X className="w-5 h-5" aria-hidden />
          </button>
          <div className="text-right min-w-0">
            <p className="text-sm font-bold text-white truncate">{displayName || "کاربر فیتوپیا"}</p>
            <p className="text-[11px] text-white/45">عضو فیتوپیا</p>
          </div>
          <div className="min-w-11 min-h-11 rounded-2xl bg-primary-container/15 border border-primary-container/30 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" aria-hidden />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" aria-label="لینک‌های اپ">
          {primaryLinks.map(({ id, label, icon: Icon, path }) => {
            const active = isActive(path);
            return (
              <Link
                key={id}
                to={path}
                onClick={onClose}
                className={`flex items-center justify-end gap-3 rounded-xl px-3 min-h-12 no-underline transition-colors ${
                  active
                    ? "bg-primary-container/15 text-primary"
                    : "text-white/80 hover:bg-white/5"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <span className="text-sm font-semibold">{label}</span>
                <Icon size={18} strokeWidth={active ? 2 : 1.6} aria-hidden />
              </Link>
            );
          })}

          <div className="my-3 border-t border-white/8" />

          {secondaryLinks.map(({ id, label, icon: Icon, path }) => (
            <Link
              key={id}
              to={path}
              onClick={onClose}
              className="flex items-center justify-end gap-3 rounded-xl px-3 min-h-12 text-white/70 hover:bg-white/5 no-underline"
            >
              <span className="text-sm font-medium">{label}</span>
              <Icon size={18} strokeWidth={1.6} aria-hidden />
            </Link>
          ))}
        </nav>

        <div className="p-3 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-white/8">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-end gap-3 rounded-xl px-3 min-h-12 text-red-300 hover:bg-red-500/10 transition-colors"
          >
            <span className="text-sm font-semibold">خروج از حساب</span>
            <LogOut size={18} aria-hidden />
          </button>
        </div>
      </aside>
    </>
  );
};

export default SidebarMenu;
