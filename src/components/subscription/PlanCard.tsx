import { SubscriptionPlan } from '../../types/subscription';

interface PlanCardProps {
  plan: SubscriptionPlan;
  onSelect: (plan: SubscriptionPlan) => void;
  isPopular?: boolean;
  isBestValue?: boolean;
}

const PlanCard = ({ plan, onSelect, isPopular, isBestValue }: PlanCardProps) => {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat('fa-IR').format(price) + ' تومان';

  return (
    <div
      className={`glass-panel p-6 rounded-2xl flex flex-col gap-4 relative overflow-hidden
        ${isPopular ? 'plan-popular' : ''}
        ${isBestValue ? 'border-secondary/30 bg-secondary/5' : ''}
      `}
    >
      {/* بج پرطرفدار */}
      {isPopular && (
        <div className="absolute -left-10 top-6 -rotate-45 bg-primary px-12 py-1 text-[10px] font-bold text-on-primary shadow-lg uppercase tracking-widest">
          پرطرفدار
        </div>
      )}

      <div className="flex justify-between items-start">
        <div>
          {/* نام پلن + بج بهترین ارزش */}
          <div className="flex items-center gap-2">
            <h3 className="font-headline-md text-on-surface">{plan.name}</h3>
            {isBestValue && (
              <span className="bg-secondary/20 text-secondary text-[10px] px-2 py-0.5 rounded-full border border-secondary/30">
                بهترین ارزش
              </span>
            )}
          </div>
          <p className="text-primary font-bold mt-1">{formatPrice(plan.price)}</p>
        </div>

        {/* توکن badge */}
        <div
          className={`rounded-lg px-3 py-1 flex items-center gap-1
            ${isPopular
              ? 'bg-primary/20 border border-primary/30'
              : 'bg-surface-container'
            }`}
        >
          <span className="text-primary font-bold">{plan.token_count}</span>
          <span className={`text-xs ${isPopular ? 'text-primary' : 'text-on-surface-variant'}`}>
            توکن
          </span>
        </div>
      </div>

      {/* فیچرها */}
      <ul className="space-y-2 py-2">
        {plan.description && (
          <li className="flex items-center gap-2 text-sm text-on-surface-variant/80">
            {isPopular ? (
              <svg className="w-5 h-5 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
            )}
            {plan.description}
          </li>
        )}
        <li className="flex items-center gap-2 text-sm text-on-surface-variant/80">
          <svg className="w-5 h-5 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
          </svg>
          دسترسی به {plan.gyms_count} باشگاه
        </li>
        <li className="flex items-center gap-2 text-sm text-on-surface-variant/80">
          <svg className="w-5 h-5 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
          </svg>
          اعتبار {plan.duration_days} روزه
        </li>
      </ul>

      <button
        onClick={() => onSelect(plan)}
        className={`amber-gradient py-3 rounded-xl font-bold text-on-primary active:scale-95 transition-transform
          ${isPopular ? 'font-extrabold shadow-[0_0_20px_rgba(255,106,0,0.4)]' : ''}
        `}
      >
        انتخاب پلن
      </button>
    </div>
  );
};

export default PlanCard;
