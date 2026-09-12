import { Sparkles, Coins, CalendarDays } from "lucide-react";
import type { MySubscription } from "../../types/subscription";
import { formatPersianDate, formatPersianNumber } from "../../utils/formatting";

interface ActivePlanCardProps {
  subscription: MySubscription;
}

function daysLabel(days: number | string | null | undefined): number | null {
  if (days == null) return null;
  const n = typeof days === "string" ? parseInt(days, 10) : days;
  return Number.isFinite(n) ? n : null;
}

export default function ActivePlanCard({ subscription }: ActivePlanCardProps) {
  const days = daysLabel(subscription.days_remaining);
  const statusActive = subscription.is_active && subscription.status === "active";
  const total = subscription.tokens_total || 0;
  const remaining = subscription.tokens_remaining || 0;
  const progress =
    total > 0 ? Math.min(100, Math.max(0, (remaining / total) * 100)) : 0;

  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/[0.12] to-[#121216] p-4 sm:p-5"
      aria-label="اشتراک فعال"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-6 top-0 h-24 w-24 rounded-full bg-primary/20 blur-3xl"
      />

      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
            statusActive
              ? "bg-emerald-500/15 text-emerald-300"
              : "bg-white/8 text-white/60"
          }`}
        >
          <Sparkles size={11} aria-hidden />
          {statusActive ? "اشتراک فعال" : subscription.status === "expired" ? "منقضی" : "غیرفعال"}
        </span>
        {days != null ? (
          <span className="text-xs font-semibold text-primary">
            {days > 0
              ? `${formatPersianNumber(days)} روز باقی‌مانده`
              : "امروز آخرین روز"}
          </span>
        ) : null}
      </div>

      <h2 className="relative z-10 mt-2 text-base font-extrabold text-white">
        {subscription.plan_name || "اشتراک فیتوپیا"}
      </h2>

      <div className="relative z-10 mt-3 flex items-center gap-1.5 text-[11px] text-white/50">
        <CalendarDays size={12} className="text-primary/80" aria-hidden />
        <span dir="ltr">
          {formatPersianDate(subscription.start_date)} — {formatPersianDate(subscription.end_date)}
        </span>
      </div>

      <div className="relative z-10 mt-4">
        <div className="mb-1.5 flex items-center justify-between text-[11px]">
          <span className="inline-flex items-center gap-1 font-semibold text-white/80">
            <Coins size={12} className="text-primary" aria-hidden />
            {formatPersianNumber(remaining)} / {formatPersianNumber(total)} توکن
          </span>
          <span className="text-white/40">باقی‌مانده</span>
        </div>
        <div
          className="h-1.5 w-full overflow-hidden rounded-full bg-white/10"
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-gradient-to-l from-primary-container to-primary transition-[width] duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </section>
  );
}
