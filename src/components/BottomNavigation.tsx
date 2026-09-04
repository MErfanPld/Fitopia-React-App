/**
 * @file BottomNavigation.tsx
 * Mobile-first tab bar — Fitopia Design System
 */

import { Home, Ticket, Award, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const items = [
  { id: "nav-home", to: "/home", label: "خانه", icon: Home, match: (p: string) => p === "/home" },
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
    match: (p: string) => p === "/profile",
  },
] as const;

export function BottomNavigation() {
  const location = useLocation();

  return (
    <nav
      className="bottom-nav md:bottom-5 md:left-1/2 md:-translate-x-1/2 md:max-w-md md:rounded-2xl md:border md:border-white/10 md:shadow-[0_8px_32px_rgba(0,0,0,0.5)] md:inset-inline-auto select-none"
      aria-label="منوی اصلی"
    >
      {items.map(({ id, to, label, icon: Icon, match }) => {
        const active = match(location.pathname);
        return (
          <Link
            key={id}
            id={id}
            to={to}
            className={`bottom-nav-item ${active ? "active" : ""}`}
            aria-current={active ? "page" : undefined}
          >
            <Icon size={22} strokeWidth={active ? 2 : 1.6} aria-hidden />
            <span className="text-[11px] font-semibold tracking-tight">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
