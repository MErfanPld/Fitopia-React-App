/**
 * Bottom navigation — premium mobile tab bar
 */

import { Home, Ticket, Award, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const items = [
  {
    id: "nav-home",
    to: "/home",
    label: "خانه",
    icon: Home,
    match: (p: string) => p === "/home" || p.startsWith("/home/"),
  },
  {
    id: "nav-tokens",
    to: "/gym-access/tokens",
    label: "اعتبار",
    icon: Ticket,
    match: (p: string) => p.startsWith("/gym-access"),
  },
  {
    id: "nav-subscribe",
    to: "/subscriptions",
    label: "اشتراک",
    icon: Award,
    match: (p: string) => p.startsWith("/subscriptions"),
  },
  {
    id: "nav-profile",
    to: "/profile",
    label: "پروفایل",
    icon: User,
    match: (p: string) => p === "/profile" || p.startsWith("/profile/"),
  },
] as const;

export function BottomNavigation() {
  const location = useLocation();

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-50 border-t border-white/8 bg-[#0c0c10]/94 backdrop-blur-xl md:bottom-5 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:max-w-md md:rounded-2xl md:border md:border-white/10 md:shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
      aria-label="منوی اصلی"
    >
      <div className="flex items-stretch justify-around gap-1 px-2 pt-1.5 pb-[calc(0.4rem+env(safe-area-inset-bottom))] min-h-16">
        {items.map(({ id, to, label, icon: Icon, match }) => {
          const active = match(location.pathname);
          return (
            <Link
              key={id}
              id={id}
              to={to}
              className={`flex flex-1 flex-col items-center justify-center gap-0.5 min-h-12 rounded-xl px-1 transition-colors no-underline ${
                active
                  ? "text-primary bg-primary-container/10"
                  : "text-on-surface-variant/70 hover:text-on-surface"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <Icon size={22} strokeWidth={active ? 2.1 : 1.6} aria-hidden />
              <span className="text-[11px] font-semibold tracking-tight">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
