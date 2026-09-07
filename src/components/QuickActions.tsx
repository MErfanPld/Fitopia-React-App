/**
 * Compact discovery shortcuts — marketplace style, real routes only.
 */

import { Building2, MapPinned, CreditCard, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";

const actions = [
  { to: "/gym/all", label: "باشگاه‌ها", icon: Building2 },
  { to: "/gym-map", label: "نقشه", icon: MapPinned },
  { to: "/subscriptions", label: "اشتراک", icon: CreditCard },
  { to: "/gym-access/tokens", label: "توکن‌ها", icon: Ticket },
] as const;

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <section aria-label="میانبرها" className="w-full">
      <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
        {actions.map(({ to, label, icon: Icon }) => (
          <button
            key={to}
            type="button"
            onClick={() => navigate(to)}
            className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-white/[0.08] bg-[#121216] px-1.5 py-3 min-h-[4.25rem] active:scale-[0.97] transition-transform"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.05] text-[#FF8A4C]">
              <Icon size={18} strokeWidth={1.9} aria-hidden />
            </span>
            <span className="text-[11px] font-semibold text-white/80 text-center leading-tight">
              {label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
