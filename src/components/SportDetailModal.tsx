/**
 * @file SportDetailModal.tsx
 * @description Modal showing sport class details, coach info, and schedule
 * Displayed when user clicks on a sport class in GymDetailPage
 */

import { X, Clock, User, MapPin } from "lucide-react";

interface SportDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  sport: {
    id: number;
    name: string;
    category: number;
  };
  coachName: string;
  coachImage?: string;
  schedule?: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
  isPurchased: boolean;
  onSubscribe?: () => void;
}

export function SportDetailModal({
  isOpen,
  onClose,
  sport,
  coachName,
  coachImage,
  schedule,
  isPurchased,
  onSubscribe,
}: SportDetailModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative z-50 w-full max-w-md rounded-t-3xl md:rounded-3xl bg-surface-container/95 backdrop-blur border border-white/10 p-6 md:p-8 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-surface hover:bg-surface-container transition-colors"
        >
          <X size={20} className="text-on-surface" />
        </button>

        {/* Sport Name */}
        <h2 className="text-2xl font-bold text-on-surface mb-6 pr-8">
          {sport.name}
        </h2>

        {/* Coach Info Card */}
        <div className="bg-surface-container/70 border border-white/5 rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-4">
            {coachImage ? (
              <img
                src={coachImage}
                alt={coachName}
                className="w-16 h-16 rounded-full object-cover border-2 border-primary"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <User size={28} className="text-primary" />
              </div>
            )}

            <div className="flex-1 text-right">
              <p className="text-sm text-on-surface-variant mb-1">مربی</p>
              <p className="text-base font-bold text-on-surface">{coachName}</p>
            </div>
          </div>
        </div>

        {/* Schedule */}
        {schedule && schedule.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-on-surface mb-3 flex items-center gap-2">
              <Clock size={18} className="text-primary" />
              برنامه‌ی کلاس‌ها
            </h3>

            <div className="space-y-2">
              {schedule.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-surface-container/70 border border-white/5 rounded-xl p-3 flex items-center justify-between"
                >
                  <div className="text-right">
                    <p className="text-sm font-bold text-on-surface">
                      {item.day}
                    </p>
                    <p className="text-xs text-on-surface-variant mt-1">
                      {item.startTime} الی {item.endTime}
                    </p>
                  </div>
                  <Clock size={16} className="text-primary/50" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Status Badge */}
        <div className="mb-6">
          {isPurchased ? (
            <div className="bg-success/20 border border-success/50 rounded-xl p-4 text-center">
              <p className="text-sm font-bold text-success">
                ✓ شما این رشته رو خریده‌اید
              </p>
              <p className="text-xs text-success/80 mt-1">
                می‌تونید بدون محدودیت از این کلاس‌ها استفاده کنید
              </p>
            </div>
          ) : (
            <div className="bg-error/10 border border-error/30 rounded-xl p-4 text-center">
              <p className="text-sm font-bold text-error mb-1">
                شما این رشته رو نخریده‌اید
              </p>
              <p className="text-xs text-on-surface-variant">
                برای دسترسی به این کلاس‌ها، باید یک اشتراک بخرید
              </p>
            </div>
          )}
        </div>

        {/* Subscribe Button */}
        {!isPurchased && onSubscribe && (
          <button
            onClick={onSubscribe}
            className="w-full bg-gradient-to-r from-primary-container to-primary text-on-primary py-3 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95"
          >
            خرید اشتراک
          </button>
        )}

        {/* Close Button (Bottom) */}
        {isPurchased && (
          <button
            onClick={onClose}
            className="w-full bg-surface-container/70 hover:bg-surface-container text-on-surface py-3 rounded-xl font-bold transition-colors"
          >
            بستن
          </button>
        )}
      </div>
    </div>
  );
}
