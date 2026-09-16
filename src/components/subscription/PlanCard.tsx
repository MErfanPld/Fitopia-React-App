import { Check, Sparkles, Ticket, Building2, CalendarDays } from "lucide-react";
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
      className={`relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-200 ${
        isPopular
          ? "border-primary/50 bg-gradient-to-b from-primary/[0.16] via-[#141418] to-[#101014] shadow-[0_8px_32px_rgba(255,106,0,0.18)] ring-1 ring-primary/20"
          : "border-white/[0.1] bg-[#121216] hover:border-white/20"
      }`}
    >
      {isPopular ? (
        <div className="h-1 w-full bg-gradient-to-l from-[#FF6A00] via-[#FF8A4C] to-[#FFB000]" aria-hidden />
      ) : null}

      <div className="flex flex-col flex-1 p-4 sm:p-5">
        {(isPopular || isBestValue) && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {isPopular ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold text-black shadow-sm">
                <Sparkles size={11} aria-hidden />
                پرطرفدار
              </span>
            ) : null}
            {isBestValue ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-400/40 bg-amber-400/12 px-2.5 py-1 text-[10px] font-bold text-amber-200">
                بهترین ارزش
              </span>
            ) : null}
          </div>
        )}

        <div className="text-right space-y-2">
          <h3 className="text-[15px] sm:text-base font-extrabold text-white tracking-tight leading-snug">
            {plan.name}
          </h3>
          <p className="flex items-baseline justify-end gap-1.5">
            <span
              className={`text-[1.5rem] sm:text-[1.65rem] font-black tabular-nums leading-none tracking-tight ${
                isPopular ? "text-primary" : "text-white"
              }`}
            >
              {formatPrice(plan.price)}
            </span>
            <span className="text-xs font-medium text-white/45">تومان</span>
          </p>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <div
            className={`rounded-xl px-3 py-2.5 text-center border ${
              isPopular
                ? "bg-primary/15 border-primary/25"
                : "bg-white/[0.04] border-white/[0.08]"
            }`}
          >
            <p
              className={`text-lg font-black tabular-nums leading-none ${
                isPopular ? "text-primary" : "text-white"
              }`}
            >
              {plan.token_count.toLocaleString("fa-IR")}
            </p>
            <p className="mt-1 text-[10px] font-medium text-white/50">بلیت ورود</p>
          </div>
          <div className="rounded-xl px-3 py-2.5 text-center border border-white/[0.08] bg-white/[0.04]">
            <p className="text-lg font-black tabular-nums leading-none text-white">
              {plan.duration_days.toLocaleString("fa-IR")}
            </p>
            <p className="mt-1 text-[10px] font-medium text-white/50">روز اعتبار</p>
          </div>
        </div>

        <ul className="mt-4 space-y-2.5 flex-1">
          <li className="flex items-center justify-end gap-2 text-[12px] text-white/70">
            <span>{plan.duration_days.toLocaleString("fa-IR")} روز دسترسی</span>
            <CalendarDays size={14} className="shrink-0 text-primary/90" aria-hidden />
          </li>
          <li className="flex items-center justify-end gap-2 text-[12px] text-white/70">
            <span>{plan.token_count.toLocaleString("fa-IR")} بلیت ورود</span>
            <Ticket size={14} className="shrink-0 text-primary/90" aria-hidden />
          </li>
          {plan.gyms_count > 0 ? (
            <li className="flex items-center justify-end gap-2 text-[12px] text-white/70">
              <span>تا {plan.gyms_count.toLocaleString("fa-IR")} باشگاه</span>
              <Building2 size={14} className="shrink-0 text-primary/90" aria-hidden />
            </li>
          ) : null}
          {plan.description?.trim() && !plan.description.includes("\n") ? (
            <li className="flex items-start justify-end gap-2 text-[12px] text-white/55 leading-relaxed">
              <span className="text-right line-clamp-2">{plan.description.trim()}</span>
              <Check size={14} className="shrink-0 mt-0.5 text-primary/80" aria-hidden />
            </li>
          ) : null}
        </ul>

        <button
          type="button"
          onClick={() => onSelect(plan)}
          className={`mt-5 w-full min-h-12 rounded-xl text-sm font-bold transition-transform active:scale-[0.98] ${
            isPopular
              ? "btn btn-primary shadow-lg shadow-primary/25"
              : "border border-white/15 bg-white/[0.07] text-white hover:bg-white/[0.12]"
          }`}
        >
          انتخاب اشتراک
        </button>
      </div>
    </article>
  );
}
