/**
 * Activities grid — sports with icons, 2 rows × 4 columns.
 * Uses real /api/gym/sports/ data.
 */

import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dumbbell,
  Flame,
  Activity,
  Target,
  Hand,
  Swords,
  Footprints,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useSports } from "../hooks/useGymAPI";

const SPORT_ICONS: { match: RegExp; icon: LucideIcon }[] = [
  { match: /پاور|قدرت|وزن|body|strength/i, icon: Dumbbell },
  { match: /فیتنس|fitness|کاردیو/i, icon: Activity },
  { match: /فانک|functional|trx/i, icon: Target },
  { match: /بوکس|boxe|boxing/i, icon: Hand },
  { match: /mma|رزمی|جudo|جودو|martial/i, icon: Swords },
  { match: /کراس|cross/i, icon: Flame },
  { match: /دویدن|run|پیاده/i, icon: Footprints },
];

function iconForSport(name: string): LucideIcon {
  for (const row of SPORT_ICONS) {
    if (row.match.test(name)) return row.icon;
  }
  return Zap;
}

export function CategorySlider() {
  const navigate = useNavigate();
  const { sports, loading, error } = useSports();

  const items = useMemo(() => {
    const list = Array.isArray(sports) ? sports.slice(0, 8) : [];
    return list;
  }, [sports]);

  if (loading) {
    return (
      <section className="space-y-3" aria-busy="true" aria-label="فعالیت‌ها">
        <div className="skeleton h-4 w-24 rounded ms-auto" />
        <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton h-[4.5rem] rounded-2xl" />
          ))}
        </div>
      </section>
    );
  }

  if (error || items.length === 0) return null;

  return (
    <section className="space-y-3" id="category-slider" aria-label="فعالیت‌ها">
      <h2 className="section-title">فعالیت‌ها</h2>
      <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
        {items.map((sport) => {
          const Icon = iconForSport(sport.name);
          return (
            <button
              key={sport.id}
              type="button"
              onClick={() =>
                navigate(`/gym/all?q=${encodeURIComponent(sport.name)}`)
              }
              className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-white/[0.08] bg-[#121216] px-1 py-2.5 min-h-[4.5rem] active:scale-[0.97] transition-transform"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon size={18} strokeWidth={1.9} aria-hidden />
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-white/80 text-center leading-tight line-clamp-2 px-0.5">
                {sport.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
