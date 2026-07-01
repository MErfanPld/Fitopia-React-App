import { FC } from 'react';
import { formatPersianNumber } from '../../utils/formatting';

interface DiscountCardProps {
  discountAmount: number;
  onRefresh?: () => void;
}

const DiscountCard: FC<DiscountCardProps> = ({ discountAmount }) => {
  return (
    <section className="glass-panel rounded-2xl p-6 relative overflow-hidden border-primary/20 bg-gradient-to-br from-[#0E0E12] to-[#1a1a24]">
      <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full" />
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              stars
            </span>
            <span className="font-bold text-lg">باشگاه وفاداری فیتوپیا</span>
          </div>
          <h2 className="text-2xl font-bold text-white">تخفیف انباشته شما</h2>
          <p className="text-on-surface-variant text-sm max-w-sm">
            مجموع سود شما از تبدیل توکن‌های استفاده نشده به اعتبار خرید دوره‌های بعدی.
          </p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-extrabold text-white mb-1">
            {formatPersianNumber(discountAmount)}{' '}
            <span className="text-lg font-medium text-on-surface-variant">تومان</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 rounded-full text-primary text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            قابل استفاده در فاکتور بعدی
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiscountCard;