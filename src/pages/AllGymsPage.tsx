/**
 * @file AllGymsPage.tsx
 * @description Complete gym listing page with filtering, search, and API integration
 * Displays all gyms from the API with categories, sorting, and grid layout
 */

import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { BottomNavigation } from "../components/BottomNavigation";
import { ShaderBackground } from "../components/ShaderBackground";
import { ParticleOverlay } from "../components/ParticleOverlay";
import { ArrowLeft, Search, Filter, Loader, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { GymListCard } from "../components/GymListCard";
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

export function AllGymsPage() {
  const navigate = useNavigate();
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [filteredGyms, setFilteredGyms] = useState<Gym[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    document.title = "FITOPIA | تمام باشگاه‌ها";
    loadGyms();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [gyms, searchTerm, sortBy]);

  const loadGyms = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.get<Gym[]>("/gym/");
      console.log("📤 Gyms loaded:", data);
      setGyms(data || []);
    } catch (err: any) {
      console.error("❌ Error loading gyms:", err);
      setError(err.message || "خطا در بارگذاری باشگاه‌ها");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...gyms];

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (gym) =>
          gym.name.toLowerCase().includes(term) ||
          gym.address.toLowerCase().includes(term)
      );
    }

    // Sort
    if (sortBy === "popular") {
      filtered.sort((a, b) => b.popularity_score - a.popularity_score);
    } else if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name, "fa-IR"));
    } else if (sortBy === "newest") {
      filtered.sort((a, b) => b.id - a.id);
    }

    setFilteredGyms(filtered);
  };

  return (
    <>
      <ShaderBackground />
      <ParticleOverlay />
      <Header />

      <main className="relative z-10 pt-24 pb-36 px-4 md:px-8 max-w-7xl mx-auto w-full select-none text-right">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate("/home")}
            className="p-2 hover:bg-white/10 rounded-lg transition-all active:scale-95"
            title="برگشت"
          >
            <ArrowLeft className="w-5 h-5 text-on-surface" />
          </button>
          <h1 className="text-2xl font-bold text-on-surface">تمام باشگاه‌ها</h1>
        </div>

        {/* Search and Filters Bar */}
        <div className="flex gap-3 mb-6 flex-col md:flex-row">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant/50" />
            <input
              type="text"
              placeholder="جستجو در نام یا آدرس باشگاه..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface-container/50 border border-white/10 rounded-xl px-4 py-3 pr-10 text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          {/* Sort and Filter Buttons */}
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-surface-container/50 border border-white/10 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary/50 transition-colors font-medium"
            >
              <option value="popular">محبوب‌ترین</option>
              <option value="name">الفبایی</option>
              <option value="newest">جدیدترین</option>
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 bg-primary/10 border border-primary/30 text-primary rounded-xl px-4 py-3 hover:bg-primary/20 transition-colors font-medium"
            >
              <Filter size={18} />
              <span>فیلتر</span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-on-surface-variant">درحال بارگذاری باشگاه‌ها...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3 mb-6">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-300 font-medium">{error}</p>
            </div>
            <button
              onClick={loadGyms}
              className="text-sm px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors font-medium"
            >
              تلاش مجدد
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredGyms.length === 0 && !error && (
          <div className="text-center py-20">
            <p className="text-on-surface-variant text-lg mb-4">
              {searchTerm ? "باشگاهی با این مشخصات یافت نشد" : "هیچ باشگاهی دسترس نیست"}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-primary font-medium hover:underline"
              >
                پاک کردن جستجو
              </button>
            )}
          </div>
        )}

        {/* Gyms Grid */}
        {!loading && filteredGyms.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGyms.map((gym) => (
              <GymListCard
                key={gym.id}
                gym={gym}
                onClick={() => navigate(`/gym/${gym.id}`)}
              />
            ))}
          </div>
        )}

        {/* Results Count */}
        {!loading && filteredGyms.length > 0 && (
          <div className="mt-8 text-center text-on-surface-variant text-sm">
            <p>
              {filteredGyms.length} از {gyms.length} باشگاه
            </p>
          </div>
        )}
      </main>

      <BottomNavigation />
    </>
  );
}
