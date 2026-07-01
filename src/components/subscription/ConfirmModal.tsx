import { SubscriptionPlan } from '../../types/subscription';
import { useNavigate } from 'react-router-dom';

interface ConfirmModalProps {
  plan: SubscriptionPlan | null;
  onClose: () => void;
}

const ConfirmModal = ({ plan, onClose }: ConfirmModalProps) => {
  const navigate = useNavigate();

  if (!plan) return null;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('fa-IR').format(price) + ' تومان';

  const handlePayment = () => {
    // Navigate to payment page with plan ID
    navigate('/subscriptions/payment', {
      state: { planId: plan.id, plan }
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-surface-container-low border border-white/10 rounded-t-3xl p-6 pb-10 flex flex-col gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto" />

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-3.5 9c0 1.93-1.57 3.5-3.5 3.5S9.5 12.93 9.5 11 11.07 7.5 13 7.5s3.5 1.57 3.5 3.5zm3.5 7H4v-2c0-2.66 5.33-4 8-4s8 1.34 8 4v2z" />
            </svg>
          </div>
          <div>
            <h3 className="font-headline-md text-on-surface">{plan.name}</h3>
            <p className="text-sm text-on-surface-variant">تأیید خرید اشتراک</p>
          </div>
        </div>

        <div className="bg-surface-container rounded-xl p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-on-surface-variant">قیمت</span>
            <span className="text-sm font-bold text-primary">{formatPrice(plan.price)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-on-surface-variant">توکن</span>
            <span className="text-sm font-bold text-on-surface">{plan.token_count} توکن</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-on-surface-variant">تعداد باشگاه</span>
            <span className="text-sm font-bold text-on-surface">{plan.gyms_count} باشگاه</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-on-surface-variant">مدت اعتبار</span>
            <span className="text-sm font-bold text-on-surface">{plan.duration_days} روز</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-white/10 text-on-surface-variant font-bold active:scale-95 transition-transform"
          >
            انصراف
          </button>
          <button
            onClick={handlePayment}
            className="flex-1 py-3 rounded-xl amber-gradient font-bold text-on-primary shadow-[0_0_20px_rgba(255,106,0,0.3)] active:scale-95 transition-transform"
          >
            ادامه پرداخت
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
