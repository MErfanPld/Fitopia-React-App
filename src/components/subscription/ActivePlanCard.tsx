import { FC } from 'react';
import { MySubscription } from '../../types/subscription';
import { formatPersianNumber } from '../../utils/formatting';

interface ActivePlanCardProps {
  subscription: MySubscription;
}

const ActivePlanCard: FC<ActivePlanCardProps> = ({ subscription }) => {
  const tokenUsagePercent = (subscription.tokens_used / subscription.tokens_total) * 100;

  return (
    <section className="relative group">
      <div className="glass-panel rounded-xl p-6 relative overflow-hidden amber-glow border-primary/30">
        <div className="flex justify-between items-start mb-6">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary font-label-sm text-xs mb-2">
              اشتراک فعلی
            </span>
            <h2 className="font-headline-md text-headline-md text-white">
              {subscription.plan_name}
            </h2>
          </div>
          <div className="text-left">
            <div className="text-primary font-bold text-2xl">
              {subscription.days_remaining}
            </div>
            <div className="text-on-surface-variant font-label-sm uppercase tracking-widest text-[10px]">
              مانده تا تمدید
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-on-surface-variant">مصرف توکن آموزشی</span>
            <span className="text-white">
              {formatPersianNumber(subscription.tokens_used)} از {formatPersianNumber(subscription.tokens_total)} توکن
            </span>
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full energy-gradient rounded-full shadow-[0_0_10px_rgba(255,106,0,0.5)]"
              style={{ width: `${tokenUsagePercent}%` }}
            />
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
          <div className="flex -space-x-2 space-x-reverse">
            <div className="w-8 h-8 rounded-full border-2 border-surface bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
              +
            </div>
          </div>
          <button className="text-primary font-label-sm flex items-center gap-1 hover:opacity-80">
            جزئیات پلن
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ActivePlanCard;