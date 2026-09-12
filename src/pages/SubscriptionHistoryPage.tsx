/**
 * Subscription history — active plan + past purchases
 * Route: /subscriptions/history
 * API via useSubscriptionHistory (real data only)
 */

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  AlertCircle,
  RefreshCw,
  History,
  CreditCard,
} from "lucide-react";
import { Header } from "../components/Header";
import { BottomNavigation } from "../components/BottomNavigation";
import ActivePlanCard from "../components/subscription/ActivePlanCard";
import HistoryItem from "../components/subscription/HistoryItem";
import FilterBar from "../components/subscription/FilterBar";
import DiscountCard from "../components/subscription/DiscountCard";
import { useSubscriptionHistory } from "../hooks/useSubscriptionHistory";

const FILTER_TABS = [
  { id: "all", label: "همه" },
  { id: "active", label: "فعال" },
  { id: "expired", label: "منقضی" },
  { id: "cancelled", label: "لغوشده" },
];

function HistorySkeleton() {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="در حال بارگذاری">
      <div className="skeleton h-36 w-full rounded-2xl" />
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton h-9 w-16 rounded-full" />
        ))}
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="skeleton h-28 w-full rounded-2xl" />
      ))}
    </div>
  );
}

export function SubscriptionHistoryPage() {
  const navigate = useNavigate();
  const { mySubscription, history, discountRemaining, loading, error, refetch } =
    useSubscriptionHistory();
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    document.title = "FITOPIA | تاریخچه اشتراک‌ها";
  }, []);

  const filteredHistory = useMemo(() => {
    if (activeFilter === "all") return history;
    return history.filter((item) => item.status === activeFilter);
  }, [history, activeFilter]);

  return (
    <div className="min-h-dvh bg-[#07070A] text-right home-with-rail">
      <Header />

      <main className="relative z-10 home-shell home-pad pb-[calc(6.75rem+env(safe-area-inset-bottom))] md:pb-12">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 sm:gap-5 lg:max-w-4xl">
          {/* Title */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.07] transition-colors"
              aria-label="بازگشت"
            >
              <ArrowRight size={20} aria-hidden />
            </button>
            <div className="min-w-0 flex-1 text-right">
              <h1 className="text-lg font-extrabold tracking-tight text-white sm:text-xl">
                تاریخچه اشتراک‌ها
              </h1>
              <p className="text-[11px] text-white/45 mt-0.5">وضعیت فعلی و خریدهای قبلی</p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/subscriptions")}
              className="inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-2xl border border-white/10 bg-white/[0.04] px-3 text-xs font-semibold text-white/80 hover:bg-white/[0.07]"
            >
              <CreditCard size={14} className="text-primary" aria-hidden />
              پلن‌ها
            </button>
          </div>

          {loading ? <HistorySkeleton /> : null}

          {!loading && error ? (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-5 py-10 text-center space-y-3">
              <AlertCircle className="mx-auto h-9 w-9 text-red-300/80" aria-hidden />
              <p className="text-sm font-semibold text-white">خطا در بارگذاری</p>
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

          {!loading && !error ? (
            <>
              {mySubscription ? <ActivePlanCard subscription={mySubscription} /> : null}

              {discountRemaining > 0 ? (
                <DiscountCard discountAmount={discountRemaining} />
              ) : null}

              <section className="space-y-3" aria-label="لیست تاریخچه">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="flex items-center gap-2 text-[0.95rem] font-bold text-white">
                    <span className="inline-block h-4 w-1 rounded-full bg-primary-container" aria-hidden />
                    <History size={15} className="text-primary" aria-hidden />
                    سوابق
                  </h2>
                  <span className="text-[11px] text-white/40">
                    {filteredHistory.length.toLocaleString("fa-IR")} مورد
                  </span>
                </div>

                <FilterBar
                  tabs={FILTER_TABS}
                  activeTab={activeFilter}
                  onTabChange={setActiveFilter}
                />

                {filteredHistory.length > 0 ? (
                  <div className="space-y-3">
                    {filteredHistory.map((item) => (
                      <HistoryItem
                        key={item.id}
                        item={item}
                        isActive={item.is_active}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-white/[0.08] bg-[#121216] px-5 py-12 text-center space-y-2">
                    <History
                      className="mx-auto h-10 w-10 text-white/25"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                    <p className="text-base font-bold text-white">موردی یافت نشد</p>
                    <p className="text-sm text-white/50">
                      برای این فیلتر اشتراکی ثبت نشده است.
                    </p>
                    <button
                      type="button"
                      onClick={() => navigate("/subscriptions")}
                      className="btn btn-primary mx-auto mt-3 min-h-11 px-5 text-sm"
                    >
                      مشاهده پلن‌ها
                    </button>
                  </div>
                )}
              </section>
            </>
          ) : null}
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
