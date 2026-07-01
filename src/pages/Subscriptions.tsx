import { useState } from 'react';
import { useSubscriptionPlans } from '../hooks/useSubscriptionPlans';
import PlanCard from '../components/subscription/PlanCard';
import PlanCardSkeleton from '../components/subscription/PlanCardSkeleton';
import ConfirmModal from '../components/subscription/ConfirmModal';
import { BottomNavigation } from '../components/BottomNavigation';
import { Header } from '../components/Header';
import { ShaderBackground } from '../components/ShaderBackground';
import { ParticleOverlay } from '../components/ParticleOverlay';
import { SubscriptionPlan } from '../types/subscription';

const FAQ_ITEMS = [
  {
    q: 'توکن‌ها چگونه کار می‌کنند؟',
    a: 'هر ورود به باشگاه معادل تعداد مشخصی توکن است. باشگاه‌های اکونومی معمولاً ۱ توکن و باشگاه‌های لوکس تا ۳ توکن مصرف می‌کنند.',
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

  // پلن وسطی رو popular نشون بده
  const getPopularIndex = () => Math.floor(plans.length / 2);

  return (
    <>
      {/* 1. Dynamic background fluid simulation */}
      <ShaderBackground />

      {/* 2. Floating particles */}
      <ParticleOverlay />

      {/* 3. Top Header navigation bar */}
      <Header />

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

        {/* Plan Cards */}
        {error ? (
          <div className="glass-panel rounded-2xl p-8 text-center flex flex-col items-center gap-4">
            <svg
              className="w-12 h-12 text-error"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
            </svg>
            <p className="text-on-surface-variant">{error}</p>
            <button
              onClick={refetch}
              className="amber-gradient px-6 py-2 rounded-xl font-bold text-on-primary"
            >
              تلاش مجدد
            </button>
          </div>
        ) : (
          <div className="space-y-6 mb-12">
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
            <svg
              className="w-6 h-6 text-primary"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
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
                  <svg
                    className="w-5 h-5 text-on-surface-variant transition-transform duration-300"
                    style={{ transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M7 10l5 5 5-5z" />
                  </svg>
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

      {/* Bottom Navigation */}
      <BottomNavigation />

      <ConfirmModal
        plan={selectedPlan}
        onClose={() => setSelectedPlan(null)}
      />
    </>
  );
};

export default Subscriptions;
