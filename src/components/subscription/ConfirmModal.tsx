import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Coins, CalendarDays, Building2, CreditCard } from "lucide-react";
import type { SubscriptionPlan } from "../../types/subscription";

interface ConfirmModalProps {
  plan: SubscriptionPlan | null;
  onClose: () => void;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("fa-IR").format(price) + " تومان";
}

export default function ConfirmModal({ plan, onClose }: ConfirmModalProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!plan) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [plan, onClose]);

  if (!plan) return null;

  const handlePayment = () => {
    navigate("/subscriptions/payment", {
      state: { planId: plan.id, plan },
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-plan-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-label="بستن"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-md rounded-t-3xl sm:rounded-2xl border border-white/10 bg-[#121216] p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] shadow-2xl">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-white/20 sm:hidden" aria-hidden />

        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="text-right min-w-0">
            <p className="text-[11px] text-white/45 mb-0.5">تأیید خرید</p>
            <h3 id="confirm-plan-title" className="text-lg font-extrabold text-white truncate">
              {plan.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/70"
            aria-label="بستن"
          >
            <X size={18} aria-hidden />
          </button>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-bold text-primary tabular-nums">{formatPrice(plan.price)}</span>
            <span className="text-white/50">قیمت</span>
          </div>
          <div className="h-px bg-white/[0.06]" aria-hidden />
          <div className="flex items-center justify-between text-sm">
            <span className="inline-flex items-center gap-1.5 font-semibold text-white">
              <Coins size={14} className="text-primary" aria-hidden />
              {plan.token_count.toLocaleString("fa-IR")} توکن
            </span>
            <span className="text-white/50">اعتبار ورودی</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="inline-flex items-center gap-1.5 font-semibold text-white">
              <CalendarDays size={14} className="text-primary" aria-hidden />
              {plan.duration_days.toLocaleString("fa-IR")} روز
            </span>
            <span className="text-white/50">مدت اشتراک</span>
          </div>
          {plan.gyms_count > 0 ? (
            <div className="flex items-center justify-between text-sm">
              <span className="inline-flex items-center gap-1.5 font-semibold text-white">
                <Building2 size={14} className="text-primary" aria-hidden />
                {plan.gyms_count.toLocaleString("fa-IR")} باشگاه
              </span>
              <span className="text-white/50">دسترسی</span>
            </div>
          ) : null}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="min-h-12 rounded-xl border border-white/12 bg-white/[0.04] text-sm font-semibold text-white/80"
          >
            انصراف
          </button>
          <button
            type="button"
            onClick={handlePayment}
            className="btn btn-primary min-h-12 text-sm inline-flex items-center justify-center gap-2"
          >
            <CreditCard size={16} aria-hidden />
            پرداخت
          </button>
        </div>
      </div>
    </div>
  );
}
