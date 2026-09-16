/**
 * Membership + stats in ONE unified card (remaining days, tickets, plan).
 */

import { useNavigate } from "react-router-dom";
import { useUserSubscription } from "../../hooks/useUserSubscription";
import { useTokens } from "../../hooks/useTokens";

function daysLabel(days: number | string | undefined): number | null {
  if (days === undefined || days === null || days === "") return null;
  const n = typeof days === "string" ? parseInt(days, 10) : days;
  return Number.isFinite(n) ? n : null;
}

export function MembershipHero() {
  const navigate = useNavigate();
  const { subscription, loading: subLoading, hasSubscription } = useUserSubscription();
  const { activeCount, loading: tokLoading } = useTokens();

  if (subLoading || tokLoading) {
    return (
      <section aria-busy="true" className="w-full">
        <div className="skeleton h-[11rem] w-full rounded-2xl" />
      </section>
    );
  }

  if (!hasSubscription || !subscription) {
    return (
      <section className="w-full rounded-2xl border border-white/10 bg-[#121216] p-5 text-right">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-white/45">
          اشتراک
        </p>
        <h2 className="mt-2 text-lg font-extrabold text-white leading-snug">
          هنوز اشتراک فعالی نداری
        </h2>
        <p className="mt-2 text-sm text-white/55 leading-relaxed">
          با تهیه اشتراک به باشگاه‌ها و اعتبار دسترسی وصل شو.
        </p>
        <button
          type="button"
          onClick={() => navigate("/subscriptions")}
          className="btn btn-primary mt-4 min-h-12 px-5 text-sm"
        >
          مشاهده اشتراک‌ها
        </button>
      </section>
    );
  }

  const days = daysLabel(subscription.days_remaining);
  const planName = subscription.plan_name || "اشتراک فیتوپیا";
  const statusActive = subscription.is_active && subscription.status === "active";
  const tokensRem =
    subscription.tokens_remaining !== undefined && subscription.tokens_remaining !== null
      ? Number(subscription.tokens_remaining)
      : null;

  const progress =
    days !== null && subscription.start_date && subscription.end_date
      ? (() => {
          const start = new Date(subscription.start_date).getTime();
          const end = new Date(subscription.end_date).getTime();
          const now = Date.now();
          if (!Number.isFinite(start) || !Number.isFinite(end) || end <= start) return null;
          return Math.min(100, Math.max(0, ((end - now) / (end - start)) * 100));
        })()
      : null;

  const stats: { label: string; value: string | number }[] = [];
  if (days !== null) {
    stats.push({ label: "روز باقی‌مانده", value: Math.max(0, days) });
  }
  if (tokensRem !== null && Number.isFinite(tokensRem)) {
    stats.push({ label: "بلیت اشتراک", value: Math.max(0, tokensRem) });
  }
  if (typeof activeCount === "number") {
    stats.push({ label: "بلیت فعال", value: activeCount });
  }

  return (
    <section
      className="relative w-full overflow-hidden rounded-2xl border border-primary-container/25 bg-[#121216] p-4 sm:p-5 text-right"
      aria-label="وضعیت اشتراک"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-8 top-0 h-32 w-32 rounded-full bg-primary-container/15 blur-3xl"
      />

      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ${
            statusActive
              ? "bg-emerald-500/15 text-emerald-300"
              : "bg-white/8 text-white/60"
          }`}
        >
          {statusActive ? "اشتراک فعال" : subscription.status === "expired" ? "منقضی" : "غیرفعال"}
        </span>
        {days !== null && (
          <span className="text-xs font-semibold text-primary">
            {days > 0 ? `${days} روز باقی‌مانده` : "امروز آخرین روز"}
          </span>
        )}
      </div>

      <h2 className="relative z-10 mt-3 text-[clamp(1.05rem,4vw,1.25rem)] font-extrabold text-white leading-snug">
        {planName}
      </h2>

      {progress !== null && (
        <div className="relative z-10 mt-3">
          <div
            className="h-1.5 w-full overflow-hidden rounded-full bg-white/10"
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="مانده اشتراک"
          >
            <div
              className="h-full rounded-full bg-gradient-to-l from-[#FF6A00] to-[#FF8A4C] transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {stats.length > 0 && (
        <div
          className={`relative z-10 mt-4 grid gap-2 ${
            stats.length === 1
              ? "grid-cols-1"
              : stats.length === 2
                ? "grid-cols-2"
                : "grid-cols-3"
          }`}
        >
          {stats.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-white/[0.08] bg-black/25 px-2.5 py-3 text-center"
            >
              <p className="text-[clamp(1.15rem,4.5vw,1.4rem)] font-extrabold tabular-nums text-white leading-none">
                {item.value}
              </p>
              <p className="mt-1.5 text-[10px] font-medium text-white/50 leading-tight">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="relative z-10 mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => navigate("/subscriptions")}
          className="btn btn-primary min-h-11 px-4 text-sm"
        >
          مدیریت اشتراک
        </button>
        <button
          type="button"
          onClick={() => navigate("/gym-access/tokens")}
          className="btn btn-secondary min-h-11 px-4 text-sm"
        >
          بلیت‌ها
        </button>
      </div>
    </section>
  );
}
