/**
 * Compact stats — only real subscription / token metrics.
 */

import { useUserSubscription } from "../../hooks/useUserSubscription";
import { useTokens } from "../../hooks/useTokens";

export function QuickStats() {
  const { subscription, loading: subLoading } = useUserSubscription();
  const { activeCount, loading: tokLoading } = useTokens();

  if (subLoading || tokLoading) {
    return (
      <div className="grid grid-cols-3 gap-2.5" aria-busy="true">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-[4.5rem] rounded-2xl" />
        ))}
      </div>
    );
  }

  const days =
    subscription?.days_remaining !== undefined && subscription?.days_remaining !== null
      ? Number(subscription.days_remaining)
      : null;
  const tokensRem =
    subscription?.tokens_remaining !== undefined
      ? Number(subscription.tokens_remaining)
      : null;

  const items: { label: string; value: string | number }[] = [];

  if (days !== null && Number.isFinite(days)) {
    items.push({ label: "روز باقی‌مانده", value: Math.max(0, days) });
  }
  if (tokensRem !== null && Number.isFinite(tokensRem)) {
    items.push({ label: "توکن پلن", value: Math.max(0, tokensRem) });
  }
  if (typeof activeCount === "number") {
    items.push({ label: "توکن فعال", value: activeCount });
  }

  if (items.length === 0) return null;

  return (
    <section aria-label="آمار سریع">
      <div
        className={`grid gap-2.5 ${
          items.length === 1
            ? "grid-cols-1"
            : items.length === 2
              ? "grid-cols-2"
              : "grid-cols-3"
        }`}
      >
        {items.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-white/8 bg-[#121216] px-3 py-3.5 text-center"
          >
            <p className="text-[clamp(1.25rem,5vw,1.5rem)] font-extrabold tabular-nums text-white leading-none">
              {item.value}
            </p>
            <p className="mt-1.5 text-[10px] sm:text-[11px] font-medium text-white/50 leading-tight">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
