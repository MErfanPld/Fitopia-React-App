import { useState } from 'react';
import { useSubscriptionPlans } from '../hooks/useSubscriptionPlans';
import PlanCard from '../components/subscription/PlanCard';
import PlanCardSkeleton from '../components/subscription/PlanCardSkeleton';
import ConfirmModal from '../components/subscription/ConfirmModal';
import { SubscriptionPlan } from '../types/subscription';

const FAQ_ITEMS = [
  {
    q: 'توکن‌ها چگونه کار می‌کنند؟',
    a: 'هر ورود به باشگاه معادل تعداد مشخصی توکن است. باشگاه‌های اکونومی معمولاً ۱ توکن و باشگاه‌های لوکس تا ۳ توکن نیاز دارند.',
  },
  {
    q: 'آیا توکن‌ها منقضی می‌شوند؟',
    a: 'بله، توکن‌های هر پلن ۳۰ روز پس از خرید اعتبار دارند. در صورت تمدید قبل از انقضا، توکن‌های قبلی به ماه بعد منتقل می‌شوند.',
  },
  {
    q: 'چطور وارد باشگاه شویم؟',
    a: 'کافیست در اپلیکیشن QR کد موجود در پذیرش باشگاه را اسکن کنید. سیستم به طور خودکار توکن لازم را از حساب شما کسر می‌کند.',
  },
];

const Subscriptions = () => {
  const { plans, loading, error, refetch } = useSubscriptionPlans();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleConfirm = () => {
    // TODO: API پرداخت
    console.log('خرید پلن:', selectedPlan);
    setSelectedPlan(null);
  };

  // پلن وسطی رو popular نشون بده
  const getPopularIndex = () => Math.floor(plans.length / 2);

  return (
    <>
      <main className="relative z-10 pt-24 pb-32 px-[16px] max-w-[1280px] mx-auto">

        {/* Hero */}
        <section className="text-center mb-12">
          <h1 className="text-[32px] leading-[40px] font-bold tracking-tight text-on-surface mb-2">
            پلن‌های اشتراک
          </h1>
          <p className="text-[16px] text-on-surface-variant opacity-70">
            با هر پلن به باشگاه‌های منتخب دسترسی داشته باش
          </p>
        </section>

        {/* Discount Banner */}
        <div className="glass-panel rounded-xl p-4 mb-10 flex items-center justify-between border-[rgba(255,180,148,0.2)] bg-[rgba(255,180,148,0.05)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">redeem</span>
            </div>
            <div>
              <p className="text-[16px] text-on-surface font-semibold">شما ۱۲۰,۰۰۰ تومان تخفیف دارید</p>
              <p className="text-xs text-on-surface-variant opacity-60">قابل استفاده در تمامی پلن‌ها</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-on-surface-variant">استفاده از تخفیف</span>
            <button
              className="w-11 h-6 bg-[#353438] rounded-full p-1 transition-colors duration-300"
              onClick={(e) => {
                const btn = e.currentTarget;
                const dot = btn.querySelector('div') as HTMLElement;
                btn.classList.toggle('bg-primary');
                dot.classList.toggle('-translate-x-[18px]');
              }}
            >
              <div className="w-4 h-4 bg-white rounded-full transition-transform duration-300" />
            </button>
          </div>
        </div>

        {/* Plan Cards */}
        {error ? (
          <div className="glass-panel rounded-2xl p-8 text-center flex flex-col items-center gap-4">
            <span className="material-symbols-outlined text-error text-5xl">wifi_off</span>
            <p className="text-on-surface-variant">{error}</p>
            <button
              onClick={refetch}
              className="amber-gradient px-6 py-2 rounded-xl font-bold text-on-primary"
            >
              تلاش مجدد
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {loading
              ? Array.from({ length: 3 }).map((_, i) => <PlanCardSkeleton key={i} />)
              : plans.map((plan, index) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    onSelect={setSelectedPlan}
                    isPopular={index === getPopularIndex()}
                    isBestValue={index === plans.length - 2}
                  />
                ))}
          </div>
        )}

        {/* FAQ */}
        <section className="mt-16 mb-24">
          <h2 className="text-[24px] font-semibold text-on-surface mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">help_outline</span>
            سوالات متداول
          </h2>
          <div className="space-y-4">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="glass-panel rounded-xl overflow-hidden">
                <button
                  className="w-full flex justify-between items-center p-5 text-right transition-colors hover:bg-white/5"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="text-[16px] font-semibold text-on-surface">{item.q}</span>
                  <span
                    className="material-symbols-outlined text-on-surface-variant transition-transform duration-300"
                    style={{ transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  >
                    expand_more
                  </span>
                </button>
                <div
                  style={{
                    maxHeight: openFaq === i ? '200px' : '0px',
                    overflow: 'hidden',
                    transition: 'max-height 0.3s ease-out',
                  }}
                >
                  <p className="text-sm text-on-surface-variant leading-relaxed opacity-80 px-5 pb-5">
                    {item.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <ConfirmModal
        plan={selectedPlan}
        onConfirm={handleConfirm}
        onClose={() => setSelectedPlan(null)}
      />
    </>
  );
};

export default Subscriptions;