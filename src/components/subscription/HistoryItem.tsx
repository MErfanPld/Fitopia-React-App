import { FC } from 'react';
import { SubscriptionHistoryItem } from '../../types/subscription';
import { formatPersianDate, formatPersianNumber } from '../../utils/formatting';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

interface HistoryItemProps {
  item: SubscriptionHistoryItem;
  isActive?: boolean;
}

const HistoryItem: FC<HistoryItemProps> = ({ item, isActive = false }) => {
  const getStatusConfig = (status: string) => {
    const configs: Record<string, { badge: string; icon: string; textColor: string; bgColor: string }> = {
      active: {
        badge: 'فعال',
        icon: 'CheckCircle',
        textColor: 'text-green-400',
        bgColor: 'bg-green-500/10',
      },
      expired: {
        badge: 'پایان یافته',
        icon: 'Clock',
        textColor: 'text-yellow-400',
        bgColor: 'bg-yellow-500/10',
      },
      cancelled: {
        badge: 'لغوشده',
        icon: 'XCircle',
        textColor: 'text-red-400',
        bgColor: 'bg-red-500/10',
      },
    };
    return configs[status] || configs.expired;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5" />;
      case 'expired':
        return <Clock className="w-5 h-5" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const config = getStatusConfig(item.status);
  const isInactive = item.status !== 'active';

  return (
    <div
      className={`glass-panel rounded-2xl p-6 transition-all duration-300 ${
        isInactive ? 'opacity-60 hover:opacity-100' : 'hover:shadow-lg hover:shadow-primary/10'
      }`}
    >
      {/* Header: Title + Status Badge */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg ${config.bgColor}`}>
            {getStatusIcon(item.status)}
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">
              {item.plan_name}
              {item.is_active && <span className="text-xs text-primary ml-2">(فعلی)</span>}
            </h3>
            <p className="text-on-surface-variant text-sm mt-1">
              {formatPersianDate(item.start_date)} تا {formatPersianDate(item.end_date)}
            </p>
          </div>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${config.bgColor} ${config.textColor} border ${config.textColor}/20 whitespace-nowrap`}>
          {config.badge}
        </span>
      </div>

      {/* Details: Amount + Tokens */}
      <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5">
        <div className="flex flex-col">
          <span className="text-xs text-on-surface-variant font-medium mb-1">مبلغ پرداخت‌شده</span>
          <span className="font-bold text-white">
            {formatPersianNumber(item.paid_amount)} تومان
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-on-surface-variant font-medium mb-1">توکن‌های باقی‌مانده</span>
          <span className={`font-bold ${item.status === 'active' ? 'text-primary' : 'text-on-surface-variant'}`}>
            {formatPersianNumber(item.tokens_remaining)} توکن
          </span>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4">
        {item.status === 'active' ? (
          <p className="text-xs text-on-surface-variant italic">
            💡 توکن‌های استفاده‌نشده به تخفیف دوره بعد تبدیل می‌شوند
          </p>
        ) : item.discount_applied > 0 ? (
          <div className="flex items-center gap-2 bg-primary/5 p-3 rounded-lg border border-primary/20">
            <span className="text-xl">⚡</span>
            <div>
              <span className="text-xs text-primary font-bold">
                {formatPersianNumber(item.discount_applied)} تومان تخفیف
              </span>
              <p className="text-xs text-on-surface-variant">
                از توکن‌های باقی‌مانده برای دوره بعدی
              </p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-on-surface-variant">بدون تخفیف اضافی</p>
        )}
      </div>
    </div>
  );
};

export default HistoryItem;
