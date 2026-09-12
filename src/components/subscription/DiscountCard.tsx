import { Tag, Sparkles } from "lucide-react";
import { formatPersianNumber } from "../../utils/formatting";

interface DiscountCardProps {
  discountAmount: number;
  onRefresh?: () => void;
}

export default function DiscountCard({ discountAmount }: DiscountCardProps) {
  if (!discountAmount || discountAmount <= 0) return null;

  return (
    <section
      className="relative overflow-hidden rounded-2xl border border-primary/25 bg-[#121216] p-4 sm:p-5"
      aria-label="تخفیف انباشته"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-4 top-0 h-20 w-20 rounded-full bg-primary/15 blur-2xl"
      />
      <div className="relative z-10 flex items-center gap-3">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Tag size={18} aria-hidden />
        </span>
        <div className="min-w-0 flex-1 text-right">
          <p className="inline-flex items-center gap-1 text-[11px] font-bold text-primary">
            <Sparkles size={11} aria-hidden />
            باشگاه وفاداری
          </p>
          <p className="text-sm font-extrabold text-white mt-0.5">تخفیف انباشته شما</p>
          <p className="text-[11px] text-white/45 mt-0.5 leading-relaxed">
            قابل استفاده در خرید اشتراک بعدی
          </p>
        </div>
        <div className="text-left shrink-0">
          <p className="text-lg font-black text-primary tabular-nums leading-none">
            {formatPersianNumber(discountAmount)}
          </p>
          <p className="text-[10px] text-white/40 mt-0.5">تومان</p>
        </div>
      </div>
    </section>
  );
}
