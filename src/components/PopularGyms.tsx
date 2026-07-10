/**
 * @file PopularGyms.tsx
 * @description Horizontal list component rendering a list of best-rated partner gyms
 * from API. Displays them with 2.5 card width for better showcase with snap scrolling.
 */

import { useNavigate } from "react-router-dom";
import { useGyms, Gym } from "../hooks/useGymAPI";
import { GymCard } from "./GymCard";
import { Star } from "lucide-react";

interface PopularGymsProps {
  onGymSelect?: (gym: Gym) => void;
}

export function PopularGyms({ onGymSelect }: PopularGymsProps) {
  const { gyms, loading, error } = useGyms();
  const navigate = useNavigate();

  const handleGymClick = (gym: Gym) => {
    if (onGymSelect) {
      onGymSelect(gym);
    } else {
      // Navigate to gym detail page
      navigate(`/gym/${gym.id}`);
    }
  };

  if (loading) {
    return (
      <section className="mt-8 fade-in-up select-none" id="popular-gyms-section">
        <div className="flex items-center gap-2 mb-4">
          <Star size={18} className="text-primary" />
          <h4 className="font-title text-title text-on-surface">باشگاه‌های محبوب</h4>
        </div>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 w-40 bg-surface-variant/20 rounded-lg animate-pulse flex-shrink-0" />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mt-8 fade-in-up select-none" id="popular-gyms-section">
        <div className="flex items-center gap-2 mb-4">
          <Star size={18} className="text-primary" />
          <h4 className="font-title text-title text-on-surface">باشگاه‌های محبوب</h4>
        </div>
        <div className="p-4 bg-error/10 rounded-lg text-error text-sm">
          خطا در بارگذاری باشگاه‌ها: {error}
        </div>
      </section>
    );
  }

  // Filter popular gyms, sorted by popularity score
  const popularGyms = gyms
    .filter((gym) => gym.is_popular)
    .sort((a, b) => b.popularity_score - a.popularity_score)
    .slice(0, 6); // Show max 6 gyms

  return (
    <section className="mt-8 fade-in-up select-none" style={{ animationDelay: "0.4s" }} id="popular-gyms-section">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Star size={18} className="text-primary" />
          <h4 className="font-title text-title text-on-surface">باشگاه‌های محبوب</h4>
        </div>
        <button
          onClick={() => navigate("/gym/all")}
          className="text-primary font-label-sm hover:underline cursor-pointer bg-transparent border-none"
        >
          مشاهده همه
        </button>
      </div>

      {popularGyms.length === 0 ? (
        <div className="p-4 bg-surface-variant/10 rounded-lg text-on-surface-variant/70 text-sm">
          هیچ باشگاه محبوبی یافت نشد
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 snap-x snap-mandatory">
          {popularGyms.map((gym) => (
            <div
              key={gym.id}
              className="flex-shrink-0 w-[calc(50vw-12px)] md:w-[calc((100vw-80px)/2.5)] lg:w-[calc((100vw-96px)/2.5)] snap-center"
            >
              <GymCard
                gym={gym}
                onClick={() => handleGymClick(gym)}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
