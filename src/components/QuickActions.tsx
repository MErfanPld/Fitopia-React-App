/**
 * Quick actions — real app routes only (no mock features).
 */

import { Map, Ticket, Award, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const actions = [
  {
    id: "qa-map",
    label: "نقشه باشگاه‌ها",
    desc: "یافتن نزدیک‌ترین",
    icon: Map,
    to: "/gym-map",
  },
  {
    id: "qa-all",
    label: "همه باشگاه‌ها",
    desc: "لیست و جستجو",
    icon: Building2,
    to: "/gym/all",
  },
  {
    id: "qa-sub",
    label: "اشتراک‌ها",
    desc: "پلن و تمدید",
    icon: Award,
    to: "/subscriptions",
  },
  {
    id: "qa-tokens",
    label: "اعتبار دسترسی",
    desc: "توکن ورود",
    icon: Ticket,
    to: "/gym-access/tokens",
  },
] as const;

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <section className="space-y-3" id="quick-actions-section" aria-label="دسترسی سریع">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-on-surface">دسترسی سریع</h2>
      </div>

      <div className="grid grid-cols-2 gap-3" id="quick-actions-grid">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              id={act.id}
              type="button"
              onClick={() => navigate(act.to)}
              className="glass-card text-right p-3.5 flex flex-col gap-3 min-h-[5.5rem] border border-white/6 hover:border-primary-container/35 transition-colors"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-container/12 border border-primary-container/25 text-primary-container">
                <Icon size={18} strokeWidth={1.75} aria-hidden />
              </div>
              <div>
                <p className="text-sm font-bold text-on-surface leading-tight">{act.label}</p>
                <p className="text-[11px] text-on-surface-variant mt-0.5">{act.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
