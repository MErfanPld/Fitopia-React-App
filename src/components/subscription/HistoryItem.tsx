import { FC } from 'react';
import { SubscriptionHistoryItem } from '../../types/subscription';
import { formatPersianDate, formatPersianNumber } from '../../utils/formatting';
import { CheckCircle, Clock, XCircle, Zap } from 'lucide-react';

interface HistoryItemProps {
  item: SubscriptionHistoryItem;
  isActive?: boolean;
}

const HistoryItem: FC<HistoryItemProps> = ({ item, isActive = false }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-[10px] font-bold border border-green-500/20">
            فعال
          </span>
        );
      case 'expired':
        return (
          <span className="px-3 py-1 rounded-full bg-white/5 text-on-surface-variant text-[10px] font-bold border border-white/10">
            پایان یافته
          </span>
        );
      case 'cancelled':
        return (
          <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-[10px] font-bold border border-red-500/20">
            لغوشده
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-8 h-8" />;
      case 'expired':
        return <Clock className="w-8 h-8" />;
      case 'cancelled':
        return <XCircle className="w-8 h-8" />;
      default:
        return <Zap className="w-8 h-8" />;
    }
  };

  return (
    <div
      className={`glass-panel rounded-xl p-5 hover:scale-[1.01] spring-transition group ${
        item.status !== 'active' ? 'opacity-70 grayscale-[0.5] hover:grayscale-0 hover:opacity-100 transition-all' : ''
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-4">
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
              item.status === 'active'
                ? 'bg-primary/10 text-primary'
                : 'bg-surface-container text-on-surface-variant'
            }`}
          >
            {getStatusIcon(item.status)}
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">
              {item.plan_name}
              {item.is_active && ' (فعلی)'}
            </h3>
            <p className="text-on-surface-variant text-xs">
              {formatPersianDate(item.start_date)} - {formatPersianDate(item.end_date)}
            </p>
          </div>
        </div>
        {getStatusBadge(item.status)}
      </div>

      {item.status === 'active' ? (
        <>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-3 bg-surface-container-low rounded-lg border border-white/5">
              <div className="text-xs text-on-surface-variant mb-1">مبلغ پرداخت شده</div>
              <div className="text-white font-bold">
                {formatPersianNumber(item.paid_amount)} تومان
              </div>
            </div>
            <div className="p-3 bg-surface-container-low rounded-lg border border-white/5">
              <div className="text-xs text-on-surface-variant mb-1">توکن‌های باقی‌مانده</div>
              <div className="text-primary font-bold">
                {formatPersianNumber(item.tokens_remaining)} توکن
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-on-surface-variant">
              توکن‌های استفاده نشده به تخفیف دوره بعد تبدیل می‌شوند.
            </span>
            <span className="group-hover:translate-x-[-4px] transition-transform">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </span>
          </div>
        </>
      ) : item.discount_applied > 0 ? (
        <div className="bg-primary/5 p-3 rounded-lg border border-primary/20 flex items-center gap-3">
          <Zap className="w-5 h-5 text-primary flex-shrink-0" />
          <div className="text-xs">
            <span className="text-primary font-bold">
              {formatPersianNumber(item.discount_applied)} تومان
            </span>
            <span className="text-on-surface-variant">
              تخفیف بابت توکن‌های باقی‌مانده در این دوره ذخیره شد.
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default HistoryItem;