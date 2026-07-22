import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface CoachLite {
  id: number;
  name: string;
  image?: string;
  specialty?: string;
  bio?: string;
}

export default function SportCoachesModal({
  open,
  onClose,
  sportName,
  coaches,
  loading,
  error,
}: {
  open: boolean;
  onClose: () => void;
  sportName: string;
  coaches: CoachLite[] | null;
  loading?: boolean;
  error?: string | null;
}) {
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev || '';
      };
    }
    return;
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden
      />

      <div className="relative w-full md:w-3/4 lg:w-1/2 max-h-[86vh] bg-surface-container/95 rounded-t-2xl md:rounded-2xl p-4 overflow-auto shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-lg">{sportName}</h3>
          <button
            onClick={onClose}
            aria-label="بستن"
            className="p-2 rounded-md hover:bg-white/5"
          >
            <X />
          </button>
        </div>

        {loading ? (
          <div className="py-8 flex items-center justify-center">در حال بارگذاری...</div>
        ) : error ? (
          <div className="py-8 text-center text-error">{error}</div>
        ) : !coaches || coaches.length === 0 ? (
          <div className="py-8 text-center text-on-surface-variant">مربی‌ای برای این رشته ثبت نشده است</div>
        ) : (
          <div className="space-y-4">
            {coaches.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-4 p-3 bg-surface-container/70 border border-white/5 rounded-xl"
              >
                {c.image ? (
                  <img
                    src={c.image}
                    alt={c.name}
                    className="w-16 h-16 rounded-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80';
                    }}
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">👤</div>
                )}

                <div className="flex-1">
                  <div className="font-bold text-sm text-on-surface">{c.name}</div>
                  {c.specialty && (
                    <div className="text-xs text-on-surface-variant mt-1">{c.specialty}</div>
                  )}
                  {c.bio && (
                    <div className="text-xs mt-2 text-on-surface-variant line-clamp-3">{c.bio}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
