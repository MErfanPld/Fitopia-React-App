/**
 * Compact marketplace gym card — gender always visible (زنانه / مردانه / جفتش).
 */

import { MapPin, Star, Clock, Users } from "lucide-react";

const API_BASE = "https://fitopiaapi.pythonanywhere.com";

export type GymGender = "women" | "men" | "both" | "unknown";

export type GymCardData = {
  id: number;
  name: string;
  address?: string | null;
  cover_image?: string | null;
  popularity_score?: number | null;
  is_popular?: boolean;
  working_hours?: string | null;
  phone?: string | null;
  description?: string | null;
  gender?: GymGender | string | null;
  is_open?: boolean | null;
  distance_km?: number | null;
};

interface GymCardProps {
  gym: GymCardData;
  onClick?: () => void;
  compact?: boolean;
}

function resolveCover(src?: string | null): string | null {
  if (!src) return null;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  return `${API_BASE}${src.startsWith("/") ? "" : "/"}${src}`;
}

/** Infer gender from API field or Persian keywords in name/description. */
export function inferGymGender(gym: GymCardData): GymGender {
  const raw = (gym.gender || "").toString().toLowerCase().trim();
  if (
    raw === "women" ||
    raw === "female" ||
    raw === "زن" ||
    raw === "زنانه" ||
    raw === "بانوان"
  ) {
    return "women";
  }
  if (
    raw === "men" ||
    raw === "male" ||
    raw === "مرد" ||
    raw === "مردانه" ||
    raw === "آقایان"
  ) {
    return "men";
  }
  if (
    raw === "both" ||
    raw === "mixed" ||
    raw === "مختلط" ||
    raw === "جفت" ||
    raw === "جفتش"
  ) {
    return "both";
  }

  const hay = `${gym.name || ""} ${gym.description || ""}`.toLowerCase();
  const women = /زنانه|بانوان|خواهران|ladies|women|female/.test(hay);
  const men = /مردانه|آقایان|برادران|\bmen\b|male only/.test(hay);
  if (women && !men) return "women";
  if (men && !women) return "men";
  if (women && men) return "both";
  // Default: assume mixed / جفتش when API has no signal
  return "both";
}

export function inferIsOpen(
  hours?: string | null,
  explicit?: boolean | null,
): boolean {
  if (typeof explicit === "boolean") return explicit;
  if (!hours || !hours.trim()) return true;

  const text = hours.trim();
  if (/24\s*ساعت|شبانه\s*روزی|۲۴\s*ساعت/i.test(text)) return true;

  const now = new Date();
  const h = now.getHours() + now.getMinutes() / 60;

  const nums = [...text.matchAll(/(\d{1,2})(?::(\d{2}))?/g)].map((m) => {
    const hour = parseInt(m[1], 10);
    const min = m[2] ? parseInt(m[2], 10) : 0;
    return hour + min / 60;
  });

  if (nums.length < 2) return true;

  const open = nums[0];
  const close = nums[1];

  if (close <= open) {
    return h >= open || h < close;
  }
  return h >= open && h < close;
}

function genderText(g: GymGender): string {
  if (g === "women") return "زنانه";
  if (g === "men") return "مردانه";
  return "جفتش";
}

export function GymCard({ gym, onClick, compact = true }: GymCardProps) {
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

  const gender = inferGymGender(gym);
  const genderLabel = genderText(gender);
  const isOpen = inferIsOpen(gym.working_hours, gym.is_open);

  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full text-right overflow-hidden rounded-xl border border-white/[0.08] bg-[#121216] active:scale-[0.98] transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      <div
        className={`relative bg-white/[0.04] overflow-hidden ${
          compact ? "aspect-[16/10]" : "aspect-[4/3]"
        }`}
      >
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

        <div className="absolute top-1.5 inset-x-1.5 flex items-start justify-between gap-1">
          <div className="flex flex-wrap gap-1">
            {gym.is_popular ? (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-bold text-black">
                <Star size={9} className="fill-current" aria-hidden />
                محبوب
              </span>
            ) : null}
            <span
              className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                isOpen
                  ? "bg-emerald-500/90 text-white"
                  : "bg-white/20 text-white/90 backdrop-blur-sm"
              }`}
            >
              {isOpen ? "باز" : "بسته"}
            </span>
          </div>
          {rating ? (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-black/55 backdrop-blur-sm px-1.5 py-0.5 text-[9px] font-semibold text-amber-200">
              <Star size={9} className="fill-amber-300 text-amber-300" aria-hidden />
              {rating}
            </span>
          ) : null}
        </div>
      </div>

      <div className="px-2.5 py-2 space-y-1 text-right">
        <p className="text-[13px] font-bold text-white line-clamp-1 leading-snug tracking-tight">
          {gym.name}
        </p>

        {/* Gender — always visible */}
        <div className="flex flex-wrap items-center justify-end gap-1.5">
          <span
            className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${
              gender === "women"
                ? "bg-pink-500/15 text-pink-300"
                : gender === "men"
                  ? "bg-sky-500/15 text-sky-300"
                  : "bg-white/[0.08] text-white/75"
            }`}
          >
            <Users size={11} aria-hidden />
            {genderLabel}
          </span>
          {typeof gym.distance_km === "number" ? (
            <span className="text-[9px] text-primary/90 font-semibold tabular-nums">
              {gym.distance_km < 1
                ? `${Math.round(gym.distance_km * 1000)} م`
                : `${gym.distance_km.toFixed(1)} کم`}
            </span>
          ) : null}
        </div>

        {address ? (
          <p className="flex items-start justify-end gap-1 text-[10px] text-white/50 leading-snug">
            <span className="line-clamp-1 min-w-0">{address}</span>
            <MapPin size={11} className="shrink-0 mt-0.5 text-primary/80" aria-hidden />
          </p>
        ) : null}

        {hours ? (
          <p className="flex items-start justify-end gap-1 text-[10px] text-white/40 leading-snug">
            <span className="line-clamp-1 min-w-0">{hours}</span>
            <Clock size={11} className="shrink-0 mt-0.5 opacity-80" aria-hidden />
          </p>
        ) : null}
      </div>
    </button>
  );
}
