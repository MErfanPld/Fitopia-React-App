import { Check, Sparkles, Coins, Building2, CalendarDays } from "lucide-react";
import type { SubscriptionPlan } from "../../types/subscription";

interface PlanCardProps {
  plan: SubscriptionPlan;
  onSelect: (plan: SubscriptionPlan) => void;
  isPopular?: boolean;
  isBestValue?: boolean;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("fa-IR").format(price);
}

export default function PlanCard({
  plan,
  onSelect,
  isPopular,
  isBestValue,
}: PlanCardProps) {
  return (
    <article
      className={`relative flex flex-col overflow-hidden rounded-2xl border p-5 transition-colors ${
        isPopular
          ? "border-primary/45 bg-gradient-to-b from-primary/[0.12] to-[#121216] shadow-[0_0_28px_rgba(255,106,0,0.12)]"
          : "border-white/[0.08] bg-[#121216]"
      }`}
    >
      {(isPopular || isBestValue) && (
        <div className="mb-3 flex flex-wrap gap-1.5">
          {isPopular ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold text-black">
              <Sparkles size={11} aria-hidden />
              پرطرفدار
            </span>
          ) : null}
          {isBestValue ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/35 bg-amber-400/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-200">
              بهترین ارزش
            </span>
          ) : null}
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 text-right">
          <h3 className="text-base font-extrabold text-white tracking-tight leading-snug">
            {plan.name}
          </h3>
          <p className="mt-1.5 flex items-baseline justify-end gap-1">
            <span className="text-[clamp(1.25rem,4vw,1.5rem)] font-black text-primary tabular-nums leading-none">
              {formatPrice(plan.price)}
            </span>
            <span className="text-[11px] font-medium text-white/45">تومان</span>
          </p>
        </div>
        <div
          className={`shrink-0 rounded-xl px-2.5 py-1.5 text-center ${
            isPopular
              ? "bg-primary/20 border border-primary/30"
              : "bg-white/[0.04] border border-white/10"
          }`}
        >
          <p className={`text-sm font-black tabular-nums ${isPopular ? "text-primary" : "text-white"}`}>
            {plan.token_count.toLocaleString("fa-IR")}
          </p>
          <p className="text-[10px] text-white/50">توکن</p>
        </div>
      </div>

      <ul className="mt-4 space-y-2 flex-1">
        <li className="flex items-center justify-end gap-2 text-[12px] text-white/70">
          <span>{plan.duration_days.toLocaleString("fa-IR")} روز اعتبار</span>
          <CalendarDays size={14} className="shrink-0 text-primary/80" aria-hidden />
        </li>
        <li className="flex items-center justify-end gap-2 text-[12px] text-white/70">
          <span>{plan.token_count.toLocaleString("fa-IR")} توکن ورودی</span>
          <Coins size={14} className="shrink-0 text-primary/80" aria-hidden />
        </li>
        {plan.gyms_count > 0 ? (
          <li className="flex items-center justify-end gap-2 text-[12px] text-white/70">
            <span>تا {plan.gyms_count.toLocaleString("fa-IR")} باشگاه</span>
            <Building2 size={14} className="shrink-0 text-primary/80" aria-hidden />
          </li>
        ) : null}
        {plan.description?.trim() && !plan.description.includes("\n") ? (
          <li className="flex items-start justify-end gap-2 text-[12px] text-white/55 leading-relaxed">
            <span className="text-right">{plan.description.trim()}</span>
            <Check size={14} className="shrink-0 mt-0.5 text-primary/70" aria-hidden />
          </li>
        ) : null}
      </ul>

      <button
        type="button"
        onClick={() => onSelect(plan)}
        className={`mt-5 w-full min-h-12 rounded-xl text-sm font-bold transition-transform active:scale-[0.98] ${
          isPopular
            ? "btn btn-primary"
            : "border border-white/12 bg-white/[0.06] text-white hover:bg-white/[0.1]"
        }`}
      >
        انتخاب پلن
      </button>
    </article>
  );
}
