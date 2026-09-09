/**
 * All Gyms — fitness marketplace discovery
 * Hierarchy: Header → Search → Sort chips → Results → Grid → Nav
 * Real API only: /gym/ client filter + sort (popular | name | newest)
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
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
import { GymCard } from "../components/GymCard";
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
}

type SortOption = "popular" | "name" | "newest";
type ChipFilter = "all" | "popular_only";

const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: "popular", label: "محبوب‌ترین" },
  { id: "name", label: "الفبایی" },
  { id: "newest", label: "جدیدترین" },
];

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
      className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#121216]"
      aria-hidden
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <div className="skeleton absolute inset-0 rounded-none" />
        <div className="absolute top-2 start-2 skeleton h-5 w-14 rounded-full opacity-60" />
        <div className="absolute top-2 end-2 skeleton h-5 w-10 rounded-full opacity-60" />
      </div>
      <div className="space-y-2 p-3">
        <div className="skeleton h-4 w-[78%] rounded-md ms-auto" />
        <div className="skeleton h-3 w-full rounded-md" />
        <div className="skeleton h-3 w-[62%] rounded-md ms-auto" />
      </div>
    </div>
  );
}

function GymsLoadingState() {
  return (
    <div className="space-y-5" aria-busy="true" aria-live="polite" aria-label="در حال بارگذاری باشگاه‌ها">
      <div className="flex flex-col items-center justify-center gap-3 py-2">
        <div className="relative flex h-12 w-12 items-center justify-center">
          <div className="fitopia-loader-ring" />
          <span className="absolute h-2 w-2 rounded-full bg-primary" style={{ animation: "fitopia-pulse 1.2s ease-in-out infinite" }} />
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-semibold text-white/85">در حال بارگذاری باشگاه‌ها</p>
          <p className="text-[11px] text-white/40">لطفاً چند لحظه صبر کنید…</p>
        </div>
      </div>
      <div className="skeleton-stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <GymCardSkeleton key={i} index={i} />
        ))}
      </div>
    </div>
  );
}

export function AllGymsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(() => searchParams.get("q") || "");
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [chip, setChip] = useState<ChipFilter>("all");

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
    let list = [...gyms];

    if (chip === "popular_only") {
      list = list.filter((g) => g.is_popular);
    }

    const q = debouncedSearch.trim().toLowerCase();
    if (q) {
      list = list.filter((g) => {
        const hay = `${g.name} ${g.address || ""} ${g.description || ""}`.toLowerCase();
        return hay.includes(q);
      });
    }

    if (sortBy === "popular") {
      list.sort((a, b) => (b.popularity_score || 0) - (a.popularity_score || 0));
    } else if (sortBy === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name, "fa"));
    } else if (sortBy === "newest") {
      list.sort((a, b) => b.id - a.id);
    }

    return list;
  }, [gyms, chip, debouncedSearch, sortBy]);

  const hasActiveFilters =
    Boolean(searchTerm.trim()) || chip !== "all" || sortBy !== "popular";

  const clearFilters = () => {
    setSearchTerm("");
    setChip("all");
    setSortBy("popular");
  };

  return (
    <div className="min-h-dvh bg-[#07070A] text-right home-with-rail">
      <Header />

      <main className="relative z-10 home-shell home-pad pb-[calc(6.75rem+env(safe-area-inset-bottom))] md:pb-12">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 sm:gap-5 lg:max-w-4xl xl:max-w-5xl">
          {/* Title */}
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

          {/* Search */}
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
              className="field w-full min-h-[52px] rounded-2xl border border-white/10 bg-[#121216] pe-11 ps-11 text-sm text-white placeholder:text-white/35 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
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

          {/* Filters / sort */}
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-0.5">
            <button
              type="button"
              onClick={() => setChip("all")}
              className={`shrink-0 whitespace-nowrap rounded-full px-3.5 min-h-9 text-xs font-semibold border transition-colors ${
                chip === "all"
                  ? "bg-primary text-black border-primary"
                  : "bg-white/[0.04] border-white/10 text-white/75"
              }`}
            >
              همه
            </button>
            <button
              type="button"
              onClick={() => setChip("popular_only")}
              className={`shrink-0 whitespace-nowrap rounded-full px-3.5 min-h-9 text-xs font-semibold border transition-colors ${
                chip === "popular_only"
                  ? "bg-primary text-black border-primary"
                  : "bg-white/[0.04] border-white/10 text-white/75"
              }`}
            >
              محبوب
            </button>
            <span className="mx-0.5 w-px shrink-0 self-center h-5 bg-white/10" aria-hidden />
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSortBy(opt.id)}
                className={`shrink-0 whitespace-nowrap rounded-full px-3.5 min-h-9 text-xs font-semibold border transition-colors ${
                  sortBy === opt.id
                    ? "bg-[#FF6A00]/15 border-[#FF6A00]/45 text-[#FF8A4C]"
                    : "bg-white/[0.04] border-white/10 text-white/75"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {!loading && !error && (
            <div className="flex items-center justify-between gap-3 text-[12px]">
              <p className="text-white/50">
                {filteredGyms.length > 0
                  ? `${filteredGyms.length} باشگاه`
                  : "نتیجه‌ای نیست"}
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-primary/90 font-medium hover:text-primary"
                >
                  پاک کردن فیلترها
                </button>
              )}
            </div>
          )}

          {error && !loading && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-5 py-10 text-center space-y-3">
              <AlertCircle className="mx-auto h-9 w-9 text-red-300/80" aria-hidden />
              <p className="text-sm font-semibold text-white">خطا در بارگذاری</p>
              <p className="text-xs text-white/50 max-w-xs mx-auto">{error}</p>
              <button
                type="button"
                onClick={loadGyms}
                className="btn btn-primary mx-auto mt-1 inline-flex min-h-11 items-center gap-2 px-5 text-sm"
              >
                <RefreshCw size={16} aria-hidden />
                تلاش مجدد
              </button>
            </div>
          )}

          {loading && <GymsLoadingState />}

          {!loading && !error && filteredGyms.length === 0 && (
            <div className="rounded-2xl border border-white/[0.08] bg-[#121216] px-5 py-12 text-center space-y-3">
              <Building2
                className="mx-auto h-10 w-10 text-white/30"
                strokeWidth={1.5}
                aria-hidden
              />
              <p className="text-base font-bold text-white">باشگاهی پیدا نشد</p>
              <p className="text-sm text-white/50 leading-relaxed max-w-xs mx-auto">
                عبارت جستجو یا فیلترها را تغییر دهید و دوباره امتحان کنید.
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="btn btn-primary mx-auto mt-2 min-h-11 px-5 text-sm"
                >
                  پاک کردن فیلترها
                </button>
              )}
            </div>
          )}

          {!loading && !error && filteredGyms.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredGyms.map((gym) => (
                <GymCard
                  key={gym.id}
                  gym={gym}
                  onClick={() => navigate(`/gym/${gym.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}
