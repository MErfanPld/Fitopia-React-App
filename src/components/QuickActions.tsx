import { Map, Ticket, Award, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <section aria-label="دسترسی سریع" className="space-y-3">
      <h2 className="section-title">دسترسی سریع</h2>

      <button
        type="button"
        onClick={() => navigate("/gym-map")}
        className="w-full text-right rounded-2xl border border-primary-container/25 bg-gradient-to-l from-primary-container/15 via-[#141418] to-[#121216] p-4 min-h-[5.25rem] flex items-center justify-between gap-3 active:scale-[0.99] transition-transform"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-container text-[#1a0a00]">
          <Map size={20} strokeWidth={2} aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-white">نقشه باشگاه‌ها</p>
          <p className="text-[11px] text-white/55 mt-0.5">نزدیک‌ترین باشگاه را پیدا کن</p>
        </div>
      </button>

      <div className="grid grid-cols-3 gap-2.5">
        {[
          { to: "/gym/all", label: "باشگاه‌ها", icon: Building2 },
          { to: "/subscriptions", label: "اشتراک", icon: Award },
          { to: "/gym-access/tokens", label: "اعتبار", icon: Ticket },
        ].map(({ to, label, icon: Icon }) => (
          <button
            key={to}
            type="button"
            onClick={() => navigate(to)}
            className="rounded-2xl border border-white/8 bg-white/[0.03] p-3 min-h-[4.75rem] flex flex-col items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-primary">
              <Icon size={17} strokeWidth={1.8} aria-hidden />
            </span>
            <span className="text-[11px] font-semibold text-white/85 text-center leading-tight">
              {label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
