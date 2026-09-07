/**
 * Marketplace gym card — image-first, scannable, real API data only.
 */

import { MapPin, Star } from "lucide-react";

const API_BASE = "https://fitopiaapi.pythonanywhere.com";

/** Minimal fields required for marketplace card (list + detail payloads) */
export type GymCardData = {
  id: number;
  name: string;
  address?: string;
  cover_image?: string | null;
  popularity_score?: number | null;
};

interface GymCardProps {
  gym: GymCardData;
  onClick?: () => void;
}

export function GymCard({ gym, onClick }: GymCardProps) {
  const cover =
    gym.cover_image &&
    (gym.cover_image.startsWith("http")
      ? gym.cover_image
      : `${API_BASE}${gym.cover_image}`);

  const rating =
    typeof gym.popularity_score === "number" && gym.popularity_score > 0
      ? gym.popularity_score.toFixed(1)
      : null;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full text-right overflow-hidden rounded-2xl border border-white/[0.08] bg-[#121216] active:scale-[0.98] transition-transform"
    >
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
        {rating && (
          <span className="absolute top-2 start-2 inline-flex items-center gap-1 rounded-full bg-black/55 backdrop-blur-sm px-2 py-0.5 text-[10px] font-semibold text-amber-200">
            <Star size={11} className="fill-amber-300 text-amber-300" aria-hidden />
            {rating}
          </span>
        )}
      </div>
      <div className="p-3 space-y-1 text-right">
        <p className="text-sm font-bold text-white line-clamp-1 leading-snug">{gym.name}</p>
        {gym.address ? (
          <p className="flex items-start justify-end gap-1 text-[11px] text-white/50 line-clamp-1">
            <span className="line-clamp-1">{gym.address}</span>
            <MapPin size={12} className="shrink-0 mt-0.5 opacity-70" aria-hidden />
          </p>
        ) : null}
      </div>
    </button>
  );
}
