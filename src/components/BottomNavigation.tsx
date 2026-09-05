import { Home, Map, Award, User, Ticket } from "lucide-react";
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
    id: "nav-map",
    to: "/gym-map",
    label: "باشگاه‌ها",
    icon: Map,
    match: (p: string) => p.startsWith("/gym-map") || p.startsWith("/gym/"),
  },
  {
    id: "nav-sub",
    to: "/subscriptions",
    label: "اشتراک",
    icon: Award,
    match: (p: string) => p.startsWith("/subscriptions"),
  },
  {
    id: "nav-tokens",
    to: "/gym-access/tokens",
    label: "توکن",
    icon: Ticket,
    match: (p: string) => p.startsWith("/gym-access"),
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
    <>
      <nav
        className="fixed bottom-0 inset-x-0 z-50 border-t border-white/8 bg-[#0b0b0f]/96 backdrop-blur-xl lg:hidden"
        aria-label="منوی اصلی"
      >
        <div className="flex items-stretch justify-around px-0.5 pt-1 pb-[max(0.35rem,env(safe-area-inset-bottom))] min-h-[3.75rem]">
          {items.map(({ id, to, label, icon: Icon, match }) => {
            const active = match(location.pathname);
            return (
              <Link
                key={id}
                id={id}
                to={to}
                className={`flex flex-1 flex-col items-center justify-center gap-0.5 min-h-12 rounded-xl mx-px no-underline transition-colors duration-200 ${
                  active ? "text-[#FF8A4C] bg-primary-container/12" : "text-white/40"
                }`}
                aria-current={active ? "page" : undefined}
              >
                <Icon size={20} strokeWidth={active ? 2.2 : 1.55} aria-hidden />
                <span className="text-[10px] font-semibold tracking-tight">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <nav
        className="hidden lg:flex fixed top-0 left-0 z-40 h-dvh w-[4.75rem] flex-col items-center border-r border-white/8 bg-[#0b0b0f] py-5 gap-1.5"
        aria-label="منوی دسکتاپ"
      >
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-container/20 border border-primary-container/35">
          <span className="text-[10px] font-black text-primary">FT</span>
        </div>
        {items.map(({ id, to, label, icon: Icon, match }) => {
          const active = match(location.pathname);
          return (
            <Link
              key={id}
              to={to}
              title={label}
              className={`flex flex-col items-center justify-center gap-1 w-14 min-h-14 rounded-2xl no-underline transition-colors ${
                active
                  ? "text-[#FF8A4C] bg-primary-container/12"
                  : "text-white/40 hover:text-white/75 hover:bg-white/5"
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
