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

function GymCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#121216]" aria-hidden>
      <div className="skeleton aspect-[4/3] w-full rounded-none" />
      <div className="space-y-2 p-3">
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
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
      list = list.filter((g) => g.is_popular || (g.popularity_score ?? 0) > 0);
    }

    const term = debouncedSearch.trim().toLowerCase();
    if (term) {
      list = list.filter(
        (g) =>
          g.name?.toLowerCase().includes(term) ||
          g.address?.toLowerCase().includes(term),
      );
    }

    if (sortBy === "popular") {
      list.sort(
        (a, b) => (b.popularity_score ?? 0) - (a.popularity_score ?? 0),
      );
    } else if (sortBy === "name") {
      list.sort((a, b) => (a.name || "").localeCompare(b.name || "", "fa-IR"));
    } else {
      list.sort((a, b) => b.id - a.id);
    }

    return list;
  }, [gyms, debouncedSearch, sortBy, chip]);

  const clearFilters = () => {
    setSearchTerm("");
    setSortBy("popular");
    setChip("all");
  };

  const hasActiveFilters =
    Boolean(searchTerm.trim()) || sortBy !== "popular" || chip !== "all";

  return (
    <div className="min-h-dvh bg-[#07070A] text-right home-with-rail">
      <Header />

      <main className="relative z-10 home-shell home-pad pb-[calc(6.75rem+env(safe-area-inset-bottom))] md:pb-12">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-5 sm:gap-6 lg:max-w-4xl xl:max-w-6xl">
          <header className="flex items-start gap-3 pt-1">
            <button
              type="button"
              onClick={() => navigate("/home")}
              className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-white/80 hover:bg-white/[0.07] transition-colors"
              aria-label="بازگشت به خانه"
            >
              <ArrowRight size={20} strokeWidth={1.85} aria-hidden />
            </button>
            <div className="min-w-0 flex-1 text-right">
              <h1 className="text-[clamp(1.15rem,4.5vw,1.4rem)] font-extrabold text-white leading-tight tracking-tight">
                باشگاه‌ها
              </h1>
              <p className="mt-0.5 text-[12px] text-white/45 leading-relaxed">
                باشگاه مناسب خودت را پیدا کن
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate("/gym-map")}
              className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-[#FF8A4C] hover:bg-white/[0.07] transition-colors"
              aria-label="نقشه باشگاه‌ها"
            >
              <MapPinned size={20} strokeWidth={1.85} aria-hidden />
            </button>
          </header>

          <form
            role="search"
            aria-label="جستجوی باشگاه"
            onSubmit={(e) => e.preventDefault()}
            className="w-full"
          >
            <label className="sr-only" htmlFor="all-gyms-search">
              جستجو
            </label>
            <div className="relative flex items-center">
              <Search
                size={20}
                strokeWidth={1.85}
                className="pointer-events-none absolute end-4 z-10 text-white/40"
                aria-hidden
              />
              <input
                id="all-gyms-search"
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="جستجوی نام باشگاه یا آدرس..."
                enterKeyHint="search"
                autoComplete="off"
                className="w-full min-h-[3.25rem] rounded-2xl border border-white/[0.09] bg-[#121216] pe-12 ps-11 text-[0.9375rem] text-white placeholder:text-white/35 outline-none transition-[border-color,box-shadow] focus:border-[#FF6A00]/55 focus:shadow-[0_0_0_3px_rgba(255,106,0,0.12)]"
              />
              {searchTerm ? (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute start-3 flex h-8 w-8 items-center justify-center rounded-full text-white/45 hover:text-white/80 hover:bg-white/[0.06]"
                  aria-label="پاک کردن جستجو"
                >
                  <X size={16} aria-hidden />
                </button>
              ) : null}
            </div>
          </form>

          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-0.5 -mx-0.5 px-0.5">
            <button
              type="button"
              onClick={() => setChip("all")}
              className={`shrink-0 whitespace-nowrap rounded-full px-3.5 min-h-9 text-xs font-semibold border transition-colors ${
                chip === "all"
                  ? "bg-[#FF6A00]/15 border-[#FF6A00]/45 text-[#FF8A4C]"
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
                  ? "bg-[#FF6A00]/15 border-[#FF6A00]/45 text-[#FF8A4C]"
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
                  ? `${filteredGyms.length.toLocaleString("fa-IR")} باشگاه پیدا شد`
                  : "نتیجه‌ای نیست"}
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-[#FF8A4C] font-semibold min-h-9 px-1"
                >
                  پاک کردن فیلترها
                </button>
              )}
            </div>
          )}

          {error && !loading && (
            <div
              role="alert"
              className="rounded-2xl border border-red-500/25 bg-red-500/10 p-5 text-center space-y-3"
            >
              <AlertCircle className="mx-auto h-8 w-8 text-red-300" aria-hidden />
              <p className="text-sm font-semibold text-red-200">
                دریافت باشگاه‌ها با مشکل مواجه شد
              </p>
              <p className="text-xs text-red-200/70">{error}</p>
              <button
                type="button"
                onClick={loadGyms}
                className="btn btn-secondary mx-auto min-h-11 px-5 gap-2 text-sm"
              >
                <RefreshCw size={16} aria-hidden />
                تلاش مجدد
              </button>
            </div>
          )}

          {loading && (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
              aria-busy="true"
              aria-label="در حال بارگذاری"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <GymCardSkeleton key={i} />
              ))}
            </div>
          )}

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
