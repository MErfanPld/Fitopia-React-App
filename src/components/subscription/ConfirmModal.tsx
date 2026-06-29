import { SubscriptionPlan } from '../../types/subscription';

interface ConfirmModalProps {
  plan: SubscriptionPlan | null;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmModal = ({ plan, onConfirm, onClose }: ConfirmModalProps) => {
  if (!plan) return null;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('fa-IR').format(price) + ' تومان';

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
            <span className="material-symbols-outlined text-primary">workspace_premium</span>
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
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl amber-gradient font-bold text-on-primary shadow-[0_0_20px_rgba(255,106,0,0.3)] active:scale-95 transition-transform"
          >
            تأیید و پرداخت
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;