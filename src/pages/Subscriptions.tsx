/**
 * Subscriptions marketplace — plan discovery + purchase
 * Route: /subscriptions
 * API: useSubscriptionPlans + useUserSubscription (real data only)
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  RefreshCw,
  ChevronDown,
  History,
  CreditCard,
  Sparkles,
} from "lucide-react";
import { useSubscriptionPlans } from "../hooks/useSubscriptionPlans";
import { useUserSubscription } from "../hooks/useUserSubscription";
import PlanCard from "../components/subscription/PlanCard";
import PlanCardSkeleton from "../components/subscription/PlanCardSkeleton";
import ConfirmModal from "../components/subscription/ConfirmModal";
import { BottomNavigation } from "../components/BottomNavigation";
import { Header } from "../components/Header";
import type { SubscriptionPlan } from "../types/subscription";

const FAQ_ITEMS = [
  {
    q: "توکن‌ها چگونه کار می‌کنند؟",
    a: "هر ورود به باشگاه معادل تعداد مشخصی توکن است. باشگاه‌های اکونومی معمولاً ۱ توکن و باشگاه‌های لوکس تا ۳ توکن مصرف می‌کنند.",
  },
  {
    q: "آیا توکن‌ها منقضی می‌شوند؟",
    a: "بله، توکن‌های هر پلن معمولاً هم‌زمان با اعتبار اشتراک منقضی می‌شوند. جزئیات هر پلن را روی کارت ببین.",
  },
  {
    q: "چطور وارد باشگاه شویم؟",
    a: "در اپلیکیشن QR کد پذیرش باشگاه را اسکن کن؛ سیستم توکن لازم را از حسابت کسر می‌کند.",
  },
];

function daysLabel(days: number | string | null | undefined): number | null {
  if (days == null) return null;
  const n = typeof days === "string" ? parseInt(days, 10) : days;
  return Number.isFinite(n) ? n : null;
}

export default function Subscriptions() {
  const navigate = useNavigate();
  const { plans, loading, error, refetch } = useSubscriptionPlans();
  const { subscription, loading: subLoading, hasSubscription } = useUserSubscription();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const getPopularIndex = () => (plans.length > 0 ? Math.floor(plans.length / 2) : -1);
  const bestValueIndex = plans.length >= 2 ? plans.length - 2 : -1;

  const remainingDays = daysLabel(subscription?.days_remaining);

  return (
    <div className="min-h-dvh bg-[#07070A] text-right home-with-rail">
      <Header />

      <main className="relative z-10 home-shell home-pad pb-[calc(6.75rem+env(safe-area-inset-bottom))] md:pb-12">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 sm:gap-6 lg:max-w-4xl xl:max-w-5xl">
          {/* Title */}
          <section className="space-y-1 pt-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 text-right">
                <h1 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                  اشتراک‌ها
                </h1>
                <p className="mt-0.5 text-xs text-white/45 sm:text-sm leading-relaxed">
                  پلن مناسب خودت را انتخاب کن و به باشگاه‌ها دسترسی بگیر
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate("/subscriptions/history")}
                className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-2xl border border-white/10 bg-white/[0.04] px-3 text-xs font-semibold text-white/80 hover:bg-white/[0.07] transition-colors"
                aria-label="تاریخچه اشتراک"
              >
                <History size={15} className="text-primary" aria-hidden />
                تاریخچه
              </button>
            </div>
          </section>

          {/* Active subscription summary */}
          {!subLoading && hasSubscription && subscription ? (
            <section
              className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/[0.12] to-[#121216] p-4 sm:p-5"
              aria-label="اشتراک فعال"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -left-6 top-0 h-24 w-24 rounded-full bg-primary/20 blur-3xl"
              />
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-bold text-emerald-300">
                  <Sparkles size={11} aria-hidden />
                  اشتراک فعال
                </span>
                {remainingDays != null ? (
                  <span className="text-xs font-semibold text-primary">
                    {remainingDays > 0
                      ? `${remainingDays.toLocaleString("fa-IR")} روز باقی‌مانده`
                      : "امروز آخرین روز"}
                  </span>
                ) : null}
              </div>
              <h2 className="relative z-10 mt-2 text-base font-extrabold text-white">
                {subscription.plan_name || "اشتراک فیتوپیا"}
              </h2>
              <div className="relative z-10 mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                <div className="rounded-xl bg-black/25 px-3 py-2">
                  <p className="text-[10px] text-white/45">توکن باقی‌مانده</p>
                  <p className="text-sm font-black text-white tabular-nums">
                    {(subscription.tokens_remaining ?? 0).toLocaleString("fa-IR")}
                    <span className="text-[10px] font-medium text-white/40">
                      {" "}
                      / {(subscription.tokens_total ?? 0).toLocaleString("fa-IR")}
                    </span>
                  </p>
                </div>
                <div className="rounded-xl bg-black/25 px-3 py-2">
                  <p className="text-[10px] text-white/45">مصرف‌شده</p>
                  <p className="text-sm font-black text-white tabular-nums">
                    {(subscription.tokens_used ?? 0).toLocaleString("fa-IR")}
                  </p>
                </div>
                {subscription.end_date ? (
                  <div className="rounded-xl bg-black/25 px-3 py-2 col-span-2 sm:col-span-1">
                    <p className="text-[10px] text-white/45">تاریخ پایان</p>
                    <p className="text-sm font-bold text-white/90" dir="ltr">
                      {new Date(subscription.end_date).toLocaleDateString("fa-IR")}
                    </p>
                  </div>
                ) : null}
              </div>
            </section>
          ) : null}

          {/* Plans */}
          <section aria-label="پلن‌های اشتراک">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="flex items-center gap-2 text-[0.95rem] font-bold text-white">
                <span className="inline-block h-4 w-1 rounded-full bg-primary-container" aria-hidden />
                <CreditCard size={15} className="text-primary" aria-hidden />
                پلن‌ها
              </h2>
              {!loading && !error && plans.length > 0 ? (
                <span className="text-[11px] text-white/40">
                  {plans.length.toLocaleString("fa-IR")} پلن فعال
                </span>
              ) : null}
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-5 py-10 text-center space-y-3">
                <AlertCircle className="mx-auto h-9 w-9 text-red-300/80" aria-hidden />
                <p className="text-sm font-semibold text-white">خطا در بارگذاری پلن‌ها</p>
                <p className="text-xs text-white/50 max-w-xs mx-auto">{error}</p>
                <button
                  type="button"
                  onClick={refetch}
                  className="btn btn-primary mx-auto mt-1 inline-flex min-h-11 items-center gap-2 px-5 text-sm"
                >
                  <RefreshCw size={16} aria-hidden />
                  تلاش مجدد
                </button>
              </div>
            ) : null}

            {loading ? (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                aria-busy="true"
                aria-label="در حال بارگذاری پلن‌ها"
              >
                {Array.from({ length: 3 }).map((_, i) => (
                  <PlanCardSkeleton key={i} />
                ))}
              </div>
            ) : null}

            {!loading && !error && plans.length === 0 ? (
              <div className="rounded-2xl border border-white/[0.08] bg-[#121216] px-5 py-12 text-center space-y-2">
                <CreditCard className="mx-auto h-10 w-10 text-white/25" strokeWidth={1.5} aria-hidden />
                <p className="text-base font-bold text-white">پلنی موجود نیست</p>
                <p className="text-sm text-white/50">به‌زودی پلن‌های جدید اضافه می‌شوند.</p>
              </div>
            ) : null}

            {!loading && !error && plans.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {plans.map((plan, index) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    onSelect={setSelectedPlan}
                    isPopular={index === getPopularIndex()}
                    isBestValue={index === bestValueIndex && index !== getPopularIndex()}
                  />
                ))}
              </div>
            ) : null}
          </section>

          {/* FAQ */}
          <section className="space-y-3" aria-label="سوالات متداول">
            <h2 className="flex items-center gap-2 text-[0.95rem] font-bold text-white">
              <span className="inline-block h-4 w-1 rounded-full bg-primary-container" aria-hidden />
              سوالات متداول
            </h2>
            <div className="space-y-2">
              {FAQ_ITEMS.map((item, i) => {
                const open = openFaq === i;
                return (
                  <div
                    key={item.q}
                    className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#121216]"
                  >
                    <button
                      type="button"
                      className="flex w-full min-h-12 items-center justify-between gap-3 px-4 py-3 text-right"
                      onClick={() => setOpenFaq(open ? null : i)}
                      aria-expanded={open}
                    >
                      <span className="text-sm font-semibold text-white/90">{item.q}</span>
                      <ChevronDown
                        size={18}
                        className={`shrink-0 text-white/45 transition-transform ${open ? "rotate-180" : ""}`}
                        aria-hidden
                      />
                    </button>
                    {open ? (
                      <p className="px-4 pb-4 text-[13px] leading-relaxed text-white/55">
                        {item.a}
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      <BottomNavigation />

      <ConfirmModal plan={selectedPlan} onClose={() => setSelectedPlan(null)} />
    </div>
  );
}
