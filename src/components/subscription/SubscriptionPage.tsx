import { useState } from 'react';
import { useSubscriptionPlans } from '../../hooks/useSubscriptionPlans';
import PlanCard from './PlanCard';
import PlanCardSkeleton from './PlanCardSkeleton';
import ConfirmModal from './ConfirmModal';
import { SubscriptionPlan } from '../../types/subscription';

const SubscriptionPage = () => {
  const { plans, loading, error, refetch } = useSubscriptionPlans();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  return (
    <>
      <main className="relative z-10 pt-24 pb-32 px-margin-mobile max-w-container-max mx-auto">
        <section className="text-center mb-12">
          <h1 className="font-display-lg-mobile text-display-lg-mobile text-on-surface mb-2">
            پلن‌های اشتراک
          </h1>
          <p className="font-body-md text-on-surface-variant opacity-70">
            با هر پلن به باشگاه‌های منتخب دسترسی داشته باش
          </p>
        </section>

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
              : plans.map((plan) => (
                  <PlanCard key={plan.id} plan={plan} onSelect={setSelectedPlan} />
                ))}
          </div>
        )}
      </main>

      <ConfirmModal
        plan={selectedPlan}
        onClose={() => setSelectedPlan(null)}
      />
    </>
  );
};

export default SubscriptionPage;
