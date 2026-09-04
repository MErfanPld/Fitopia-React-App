import { Home, Ticket, Award, User, Map } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const mobileItems = [
  { id: "nav-home", to: "/home", label: "خانه", icon: Home, match: (p: string) => p === "/home" || p.startsWith("/home/") },
  { id: "nav-map", to: "/gym-map", label: "نقشه", icon: Map, match: (p: string) => p.startsWith("/gym-map") || p.startsWith("/gym/") },
  { id: "nav-sub", to: "/subscriptions", label: "اشتراک", icon: Award, match: (p: string) => p.startsWith("/subscriptions") },
  { id: "nav-tokens", to: "/gym-access/tokens", label: "اعتبار", icon: Ticket, match: (p: string) => p.startsWith("/gym-access") },
  { id: "nav-profile", to: "/profile", label: "پروفایل", icon: User, match: (p: string) => p === "/profile" || p.startsWith("/profile/") },
] as const;

const railItems = mobileItems;

export function BottomNavigation() {
  const location = useLocation();

  return (
    <>
      <nav
        className="fixed bottom-0 inset-x-0 z-50 border-t border-white/8 bg-[#0b0b0f]/95 backdrop-blur-xl lg:hidden"
        aria-label="منوی اصلی"
      >
        <div className="flex items-stretch justify-around px-1 pt-1 pb-[max(0.35rem,env(safe-area-inset-bottom))] min-h-[3.75rem]">
          {mobileItems.map(({ id, to, label, icon: Icon, match }) => {
            const active = match(location.pathname);
            return (
              <Link
                key={id}
                id={id}
                to={to}
                className={`flex flex-1 flex-col items-center justify-center gap-0.5 min-h-12 rounded-xl mx-0.5 no-underline transition-colors ${
                  active ? "text-[#FF8A4C] bg-primary-container/10" : "text-white/45"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <Icon size={20} strokeWidth={active ? 2.15 : 1.55} aria-hidden />
                <span className="text-[10px] font-semibold">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <nav
        className="hidden lg:flex fixed top-0 left-0 z-40 h-dvh w-[4.75rem] flex-col items-center border-r border-white/8 bg-[#0b0b0f] py-5 gap-2"
        aria-label="منوی دسکتاپ"
      >
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-container/20 border border-primary-container/30">
          <span className="text-[10px] font-black text-primary">FT</span>
        </div>
        {railItems.map(({ id, to, label, icon: Icon, match }) => {
          const active = match(location.pathname);
          return (
            <Link
              key={id}
              to={to}
              title={label}
              className={`flex flex-col items-center justify-center gap-1 w-14 min-h-14 rounded-2xl no-underline transition-colors ${
                active ? "text-[#FF8A4C] bg-primary-container/12" : "text-white/45 hover:text-white/80 hover:bg-white/5"
              }`}
              aria-current={active ? "page" : undefined}
              aria-label={label}
            >
              <Icon size={20} strokeWidth={active ? 2.1 : 1.55} aria-hidden />
              <span className="text-[9px] font-semibold">{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
