/**
 * @file BottomNavigation.tsx
 * @description Standard mobile-first tab bar pinned to the bottom of the page.
 * Tracks location path from react-router-dom to highlight the selected main view segment.
 * Icons are simple black/white without colored backgrounds.
 */

import { Home, Ticket, Award, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function BottomNavigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 w-full md:bottom-6 md:left-1/2 md:-translate-x-1/2 md:max-w-md md:rounded-2xl md:border md:border-white/10 md:shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex justify-around items-center px-4 py-3 pb-safe md:pb-3 bg-surface-container/90 backdrop-blur-xl border-t border-white/5 z-50 rounded-t-xl shadow-[0_-4px_20px_rgba(255,106,0,0.05)] select-none">
      {/* Home Button */}
      <Link
        id="nav-home"
        to="/home"
        className={`flex flex-col items-center justify-center rounded-xl px-4 py-1.5 transition-all duration-300 ease-out active:scale-90 ${
          location.pathname === "/home"
            ? "text-primary"
            : "text-on-surface-variant/60 hover:text-on-surface-variant/80"
        }`}
      >
        <Home size={24} strokeWidth={1.5} />
        <span className="font-label-sm text-label-sm mt-1 text-xs">خانه</span>
      </Link>

      {/* Gym Access Tokens Button */}
      <Link
        id="nav-tokens"
        to="/gym-access/tokens"
        className={`flex flex-col items-center justify-center rounded-xl px-4 py-1.5 transition-all duration-300 ease-out active:scale-90 ${
          location.pathname === "/gym-access/tokens"
            ? "text-primary"
            : "text-on-surface-variant/60 hover:text-on-surface-variant/80"
        }`}
      >
        <Ticket size={24} strokeWidth={1.5} />
        <span className="font-label-sm text-label-sm mt-1 text-xs">اعتبار</span>
      </Link>

      {/* Subscription Button */}
      <Link
        id="nav-subscribe"
        to="/subscriptions"
        className={`flex flex-col items-center justify-center rounded-xl px-4 py-1.5 transition-all duration-300 ease-out active:scale-90 ${
          location.pathname === "/subscriptions"
            ? "text-primary"
            : "text-on-surface-variant/60 hover:text-on-surface-variant/80"
        }`}
      >
        <Award size={24} strokeWidth={1.5} />
        <span className="font-label-sm text-label-sm mt-1 text-xs">اشتراک</span>
      </Link>

      {/* Profile Button */}
      <Link
        id="nav-profile"
        to="/profile"
        className={`flex flex-col items-center justify-center rounded-xl px-4 py-1.5 transition-all duration-300 ease-out active:scale-90 ${
          location.pathname === "/profile"
            ? "text-primary"
            : "text-on-surface-variant/60 hover:text-on-surface-variant/80"
        }`}
      >
        <User size={24} strokeWidth={1.5} />
        <span className="font-label-sm text-label-sm mt-1 text-xs">پروفایل</span>
      </Link>
    </nav>
  );
}
