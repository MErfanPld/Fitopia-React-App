/**
 * Marketplace gym card — image-first, scannable, real API data only.
 * Shows: cover, rating, popular badge, name, address, working hours.
 */

import { MapPin, Star, Clock } from "lucide-react";

const API_BASE = "https://fitopiaapi.pythonanywhere.com";

/** Fields used on marketplace cards (list + home). Extra keys ignored if missing. */
export type GymCardData = {
  id: number;
  name: string;
  address?: string | null;
  cover_image?: string | null;
  popularity_score?: number | null;
  is_popular?: boolean;
  working_hours?: string | null;
  phone?: string | null;
};

interface GymCardProps {
  gym: GymCardData;
  onClick?: () => void;
}

function resolveCover(src?: string | null): string | null {
  if (!src) return null;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  return `${API_BASE}${src.startsWith("/") ? "" : "/"}${src}`;
}

export function GymCard({ gym, onClick }: GymCardProps) {
  const cover = resolveCover(gym.cover_image);

  const rating =
    typeof gym.popularity_score === "number" && gym.popularity_score > 0
      ? gym.popularity_score.toFixed(1)
      : null;

  const hours =
    gym.working_hours && gym.working_hours.trim().length > 0
      ? gym.working_hours.trim()
      : null;

  const address =
    gym.address && gym.address.trim().length > 0 ? gym.address.trim() : null;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full text-right overflow-hidden rounded-2xl border border-white/[0.08] bg-[#121216] active:scale-[0.98] transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      {/* Cover */}
      <div className="relative aspect-[4/3] bg-white/[0.04] overflow-hidden">
        {cover ? (
          <img
            src={cover}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1410] to-[#0e0e12]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

        {/* Top badges */}
        <div className="absolute top-2 inset-x-2 flex items-start justify-between gap-2">
          {gym.is_popular ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-black">
              <Star size={10} className="fill-current" aria-hidden />
              محبوب
            </span>
          ) : (
            <span />
          )}
          {rating ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-black/55 backdrop-blur-sm px-2 py-0.5 text-[10px] font-semibold text-amber-200">
              <Star size={11} className="fill-amber-300 text-amber-300" aria-hidden />
              {rating}
            </span>
          ) : null}
        </div>
      </div>

      {/* Info under image */}
      <div className="p-3 space-y-1.5 text-right">
        <p className="text-sm font-bold text-white line-clamp-1 leading-snug tracking-tight">
          {gym.name}
        </p>

        {address ? (
          <p className="flex items-start justify-end gap-1 text-[11px] text-white/55 leading-snug">
            <span className="line-clamp-2 min-w-0">{address}</span>
            <MapPin size={12} className="shrink-0 mt-0.5 opacity-80 text-primary/80" aria-hidden />
          </p>
        ) : null}

        {hours ? (
          <p className="flex items-start justify-end gap-1 text-[11px] text-white/45 leading-snug">
            <span className="line-clamp-1 min-w-0">{hours}</span>
            <Clock size={12} className="shrink-0 mt-0.5 opacity-80" aria-hidden />
          </p>
        ) : null}
      </div>
    </button>
  );
}
