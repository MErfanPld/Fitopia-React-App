import { MapPin, Star } from "lucide-react";
import type { Gym } from "../hooks/useGymAPI";

const API_BASE = "https://fitopiaapi.pythonanywhere.com";

interface GymCardProps {
  gym: Gym;
  onClick?: () => void;
}

export function GymCard({ gym, onClick }: GymCardProps) {
  const cover =
    gym.cover_image &&
    (gym.cover_image.startsWith("http")
      ? gym.cover_image
      : `${API_BASE}${gym.cover_image}`);

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-right overflow-hidden rounded-2xl border border-white/8 bg-[#121216] active:scale-[0.98] transition-transform"
    >
      <div className="relative aspect-[16/11] bg-white/5">
        {cover ? (
          <img
            src={cover}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        {typeof gym.popularity_score === "number" && gym.popularity_score > 0 && (
          <span className="absolute top-2 right-2 inline-flex items-center gap-1 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-semibold text-amber-200">
            <Star size={11} className="fill-amber-300 text-amber-300" aria-hidden />
            {gym.popularity_score.toFixed(1)}
          </span>
        )}
      </div>
      <div className="p-3 space-y-1">
        <p className="text-sm font-bold text-white line-clamp-1">{gym.name}</p>
        {gym.address && (
          <p className="flex items-start justify-end gap-1 text-[11px] text-white/50 line-clamp-1">
            <span className="line-clamp-1">{gym.address}</span>
            <MapPin size={12} className="shrink-0 mt-0.5" aria-hidden />
          </p>
        )}
      </div>
    </button>
  );
}
