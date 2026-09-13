/**
 * All Gyms — marketplace discovery
 * Filters: nearest, popular, gender, open-now + compact cards
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  X,
  MapPinned,
  AlertCircle,
  RefreshCw,
  Building2,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "../components/Header";
import { BottomNavigation } from "../components/BottomNavigation";
import { GymCard, inferGymGender, inferIsOpen, type GymGender } from "../components/GymCard";
import { useUserLocation } from "../hooks/useUserLocation";
import api from "../services/api";

export interface Gym {
  id: number;
  name: string;
  description?: string;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  cover_image: string;
  working_hours: string;
  rules?: string;
  instagram?: string;
  telegram?: string;
  website?: string;
  whatsapp?: string;
  popularity_score: number;
  is_popular: boolean;
  sports: number[];
  facilities: number[];
  gender?: string;
  is_open?: boolean;
}

type SortOption = "nearest" | "popular" | "name" | "newest";
type ChipFilter = "all" | "popular_only" | "open_now";
type GenderFilter = "all" | GymGender;

const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: "nearest", label: "نزدیک‌ترین" },
  { id: "popular", label: "محبوب‌ترین" },
  { id: "name", label: "الفبایی" },
  { id: "newest", label: "جدیدترین" },
];

const GENDER_OPTIONS: { id: GenderFilter; label: string }[] = [
  { id: "all", label: "همه" },
  { id: "women", label: "زنانه" },
  { id: "men", label: "مردانه" },
  { id: "both", label: "مختلط" },
];

function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

function GymCardSkeleton({ index = 0 }: { index?: number }) {
  return (
    <div
      className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#121216]"
      aria-hidden
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <div className="skeleton absolute inset-0 rounded-none" />
      </div>
      <div className="space-y-1.5 p-2.5">
        <div className="skeleton h-3.5 w-[75%] rounded-md ms-auto" />
        <div className="skeleton h-2.5 w-full rounded-md" />
        <div className="skeleton h-2.5 w-[55%] rounded-md ms-auto" />
      </div>
    </div>
  );
}

function GymsLoadingState() {
  return (
    <div className="space-y-4" aria-busy="true" aria-live="polite" aria-label="در حال بارگذاری باشگاه‌ها">
      <div className="flex flex-col items-center justify-center gap-3 py-2">
        <div className="fitopia-loader-ring" />
        <p className="text-sm font-semibold text-white/85">در حال بارگذاری باشگاه‌ها</p>
      </div>
      <div className="skeleton-stagger grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <GymCardSkeleton key={i} index={i} />
        ))}
      </div>
    </div>
  );
}

export function AllGymsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { location } = useUserLocation();
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get("q") || "");
  const [sortBy, setSortBy] = useState<SortOption>("nearest");
  const [chip, setChip] = useState<ChipFilter>("all");
  const [gender, setGender] = useState<GenderFilter>("all");

  const debouncedSearch = useDebouncedValue(searchTerm, 280);

  useEffect(() => {
    document.title = "FITOPIA | باشگاه‌ها";
  }, []);

  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (debouncedSearch.trim()) next.set("q", debouncedSearch.trim());
    else next.delete("q");
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const loadGyms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.get<Gym[]>("/gym/");
      setGyms(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "خطا در بارگذاری باشگاه‌ها";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGyms();
  }, [loadGyms]);

  const filteredGyms = useMemo(() => {
    let list = gyms.map((g) => {
      const distance_km =
        typeof g.latitude === "number" &&
        typeof g.longitude === "number" &&
        location?.lat &&
        location?.lon
          ? haversineKm(location.lat, location.lon, g.latitude, g.longitude)
          : null;
      return { ...g, distance_km };
    });

    if (chip === "popular_only") {
      list = list.filter((g) => g.is_popular);
    }
    if (chip === "open_now") {
      list = list.filter((g) => inferIsOpen(g.working_hours, g.is_open));
    }

    if (gender !== "all") {
      list = list.filter((g) => {
        const gnd = inferGymGender(g);
        if (gender === "both") return gnd === "both" || gnd === "unknown";
        return gnd === gender;
      });
    }

    const q = debouncedSearch.trim().toLowerCase();
    if (q) {
      list = list.filter((g) => {
        const hay = `${g.name} ${g.address || ""} ${g.description || ""}`.toLowerCase();
        return hay.includes(q);
      });
    }

    if (sortBy === "nearest") {
      list.sort((a, b) => {
        const da = a.distance_km ?? Number.POSITIVE_INFINITY;
        const db = b.distance_km ?? Number.POSITIVE_INFINITY;
        return da - db;
      });
    } else if (sortBy === "popular") {
      list.sort((a, b) => (b.popularity_score || 0) - (a.popularity_score || 0));
    } else if (sortBy === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name, "fa"));
    } else if (sortBy === "newest") {
      list.sort((a, b) => b.id - a.id);
    }

    return list;
  }, [gyms, chip, gender, debouncedSearch, sortBy, location.lat, location.lon]);

  const hasActiveFilters =
    Boolean(searchTerm.trim()) ||
    chip !== "all" ||
    gender !== "all" ||
    sortBy !== "nearest";

  const clearFilters = () => {
    setSearchTerm("");
    setChip("all");
    setGender("all");
    setSortBy("nearest");
  };

  return (
    <div className="min-h-dvh bg-[#07070A] text-right home-with-rail">
      <Header />

      <main className="relative z-10 home-shell home-pad pb-[calc(6.75rem+env(safe-area-inset-bottom))] md:pb-12">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-3.5 sm:gap-4 lg:max-w-4xl xl:max-w-5xl">
          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0 text-right">
                <h1 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                  باشگاه‌ها
                </h1>
                <p className="mt-0.5 text-xs text-white/45 sm:text-sm">
                  باشگاه مناسب خودت را پیدا کن
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate("/gym-map")}
                className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-1.5 rounded-2xl border border-white/10 bg-white/[0.04] px-3 text-xs font-semibold text-white/80 hover:bg-white/[0.07] transition-colors"
                aria-label="نقشه باشگاه‌ها"
              >
                <MapPinned size={16} className="text-primary" aria-hidden />
                <span className="hidden sm:inline">نقشه</span>
              </button>
            </div>
          </div>

          <div className="relative">
            <Search
              size={18}
              className="pointer-events-none absolute top-1/2 end-3.5 -translate-y-1/2 text-white/40"
              aria-hidden
            />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="جستجوی نام باشگاه، منطقه یا امکانات..."
              className="field w-full min-h-[48px] rounded-2xl border border-white/10 bg-[#121216] pe-11 ps-11 text-sm text-white placeholder:text-white/35 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
              aria-label="جستجوی باشگاه"
            />
            {searchTerm ? (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute top-1/2 start-3 -translate-y-1/2 inline-flex min-h-9 min-w-9 items-center justify-center rounded-xl text-white/50 hover:text-white"
                aria-label="پاک کردن جستجو"
              >
                <X size={16} aria-hidden />
              </button>
            ) : null}
          </div>

          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-0.5">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSortBy(opt.id)}
                className={`shrink-0 whitespace-nowrap rounded-full px-3.5 min-h-9 text-xs font-semibold border transition-colors ${
                  sortBy === opt.id
                    ? "bg-primary text-black border-primary"
                    : "bg-white/[0.04] border-white/10 text-white/75"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-0.5">
            <button type="button" onClick={() => setChip("all")} className={`shrink-0 whitespace-nowrap rounded-full px-3.5 min-h-9 text-xs font-semibold border transition-colors ${chip === "all" ? "bg-[#FF6A00]/15 border-[#FF6A00]/45 text-[#FF8A4C]" : "bg-white/[0.04] border-white/10 text-white/75"}`}>همه</button>
            <button type="button" onClick={() => setChip("open_now")} className={`shrink-0 whitespace-nowrap rounded-full px-3.5 min-h-9 text-xs font-semibold border transition-colors ${chip === "open_now" ? "bg-emerald-500/20 border-emerald-400/40 text-emerald-300" : "bg-white/[0.04] border-white/10 text-white/75"}`}>الان باز</button>
            <button type="button" onClick={() => setChip("popular_only")} className={`shrink-0 whitespace-nowrap rounded-full px-3.5 min-h-9 text-xs font-semibold border transition-colors ${chip === "popular_only" ? "bg-[#FF6A00]/15 border-[#FF6A00]/45 text-[#FF8A4C]" : "bg-white/[0.04] border-white/10 text-white/75"}`}>محبوب</button>
          </div>

          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-0.5" aria-label="جنسیت باشگاه">
            {GENDER_OPTIONS.map((opt) => (
              <button key={opt.id} type="button" onClick={() => setGender(opt.id)} className={`shrink-0 whitespace-nowrap rounded-full px-3.5 min-h-9 text-xs font-semibold border transition-colors ${gender === opt.id ? "bg-white/15 border-white/30 text-white" : "bg-white/[0.04] border-white/10 text-white/75"}`}>{opt.label}</button>
            ))}
          </div>

          {!loading && !error && (
            <div className="flex items-center justify-between gap-3 text-[12px]">
              <p className="text-white/50">{filteredGyms.length > 0 ? `${filteredGyms.length} باشگاه` : "نتیجه‌ای نیست"}</p>
              {hasActiveFilters && (<button type="button" onClick={clearFilters} className="text-primary/90 font-medium hover:text-primary">پاک کردن فیلترها</button>)}
            </div>
          )}

          {error && !loading && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-5 py-10 text-center space-y-3">
              <AlertCircle className="mx-auto h-9 w-9 text-red-300/80" aria-hidden />
              <p className="text-sm font-semibold text-white">خطا در بارگذاری</p>
              <p className="text-xs text-white/50 max-w-xs mx-auto">{error}</p>
              <button type="button" onClick={loadGyms} className="btn btn-primary mx-auto mt-1 inline-flex min-h-11 items-center gap-2 px-5 text-sm"><RefreshCw size={16} aria-hidden />تلاش مجدد</button>
            </div>
          )}

          {loading && <GymsLoadingState />}

          {!loading && !error && filteredGyms.length === 0 && (
            <div className="rounded-2xl border border-white/[0.08] bg-[#121216] px-5 py-12 text-center space-y-3">
              <Building2 className="mx-auto h-10 w-10 text-white/30" strokeWidth={1.5} aria-hidden />
              <p className="text-base font-bold text-white">باشگاهی پیدا نشد</p>
              <p className="text-sm text-white/50 leading-relaxed max-w-xs mx-auto">عبارت جستجو یا فیلترها را تغییر دهید و دوباره امتحان کنید.</p>
              {hasActiveFilters && (<button type="button" onClick={clearFilters} className="btn btn-primary mx-auto mt-2 min-h-11 px-5 text-sm">پاک کردن فیلترها</button>)}
            </div>
          )}

          {!loading && !error && filteredGyms.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
              {filteredGyms.map((gym) => (
                <GymCard key={gym.id} gym={gym} compact onClick={() => navigate(`/gym/${gym.id}`)} />
              ))}
            </div>
          )}
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
