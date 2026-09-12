import { CheckCircle2, Clock, XCircle, Coins } from "lucide-react";
import type { SubscriptionHistoryItem } from "../../types/subscription";
import { formatPersianDate, formatPersianNumber } from "../../utils/formatting";

interface HistoryItemProps {
  item: SubscriptionHistoryItem;
  isActive?: boolean;
}

const STATUS: Record<
  string,
  { label: string; className: string; Icon: typeof CheckCircle2 }
> = {
  active: {
    label: "فعال",
    className: "bg-emerald-500/15 text-emerald-300 border-emerald-500/25",
    Icon: CheckCircle2,
  },
  expired: {
    label: "منقضی",
    className: "bg-amber-500/15 text-amber-200 border-amber-500/25",
    Icon: Clock,
  },
  cancelled: {
    label: "لغوشده",
    className: "bg-red-500/15 text-red-300 border-red-500/25",
    Icon: XCircle,
  },
};

export default function HistoryItem({ item, isActive = false }: HistoryItemProps) {
  const status = STATUS[item.status] || STATUS.expired;
  const Icon = status.Icon;
  const paid = item.paid_amount ?? 0;
  const discount = item.discount_applied ?? 0;

  return (
    <article
      className={`rounded-2xl border bg-[#121216] p-4 sm:p-5 transition-opacity ${
        item.status === "active"
          ? "border-primary/30"
          : "border-white/[0.08] opacity-90"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 text-right flex-1">
          <div className="flex flex-wrap items-center justify-end gap-2">
            <h3 className="text-sm font-extrabold text-white leading-snug">
              {item.plan_name || "اشتراک"}
            </h3>
            {isActive || item.is_active ? (
              <span className="text-[10px] font-bold text-primary">فعلی</span>
            ) : null}
          </div>
          <p className="mt-1 text-[11px] text-white/45" dir="ltr">
            {formatPersianDate(item.start_date)} — {formatPersianDate(item.end_date)}
          </p>
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold ${status.className}`}
        >
          <Icon size={12} aria-hidden />
          {status.label}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <div className="rounded-xl bg-black/25 px-2.5 py-2">
          <p className="text-[10px] text-white/40">پرداخت‌شده</p>
          <p className="text-xs font-bold text-white tabular-nums mt-0.5">
            {formatPersianNumber(paid)}
            <span className="text-[10px] font-medium text-white/40"> ت</span>
          </p>
        </div>
        <div className="rounded-xl bg-black/25 px-2.5 py-2">
          <p className="text-[10px] text-white/40">توکن</p>
          <p className="text-xs font-bold text-white tabular-nums mt-0.5 inline-flex items-center gap-1">
            <Coins size={11} className="text-primary" aria-hidden />
            {formatPersianNumber(item.tokens_remaining ?? 0)}
            <span className="text-[10px] font-medium text-white/35">
              /{formatPersianNumber(item.tokens_total ?? 0)}
            </span>
          </p>
        </div>
        <div className="rounded-xl bg-black/25 px-2.5 py-2">
          <p className="text-[10px] text-white/40">مصرف</p>
          <p className="text-xs font-bold text-white tabular-nums mt-0.5">
            {formatPersianNumber(item.tokens_used ?? 0)}
          </p>
        </div>
        <div className="rounded-xl bg-black/25 px-2.5 py-2">
          <p className="text-[10px] text-white/40">تخفیف</p>
          <p className="text-xs font-bold text-white tabular-nums mt-0.5">
            {discount > 0 ? formatPersianNumber(discount) : "—"}
          </p>
        </div>
      </div>
    </article>
  );
}
