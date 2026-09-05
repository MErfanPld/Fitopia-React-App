import { Map, Ticket, Award, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <section aria-label="اقدامات اصلی" className="space-y-3">
      <h2 className="section-title">اقدام بعدی</h2>

      <button
        type="button"
        onClick={() => navigate("/gym-map")}
        className="w-full text-right rounded-2xl border border-primary-container/30 bg-gradient-to-l from-primary-container/18 via-[#141418] to-[#121216] p-4 min-h-[5rem] flex items-center gap-3 active:scale-[0.99] transition-transform"
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-container text-[#1a0a00]">
          <Map size={20} strokeWidth={2.1} aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-white">پیدا کردن باشگاه</p>
          <p className="text-[11px] text-white/50 mt-0.5">نقشه و نزدیک‌ترین گزینه‌ها</p>
        </div>
      </button>

      <div className="grid grid-cols-3 gap-2.5">
        {[
          { to: "/gym/all", label: "باشگاه‌ها", icon: Building2 },
          { to: "/subscriptions", label: "اشتراک", icon: Award },
          { to: "/gym-access/tokens", label: "توکن", icon: Ticket },
        ].map(({ to, label, icon: Icon }) => (
          <button
            key={to}
            type="button"
            onClick={() => navigate(to)}
            className="rounded-2xl border border-white/8 bg-[#121216] p-3 min-h-[4.5rem] flex flex-col items-center justify-center gap-2 active:scale-[0.98] transition-transform"
          >
            <Icon size={18} className="text-primary" strokeWidth={1.85} aria-hidden />
            <span className="text-[11px] font-semibold text-white/85 text-center">{label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
