/**
 * @file PopularGyms.tsx
 * @description Horizontal list component rendering a list of best-rated partner gyms
 * from API. Filters popular gyms and displays them in card overlays.
 */

import { useGyms, Gym } from "../hooks/useGymAPI";
import { GymCard } from "./GymCard";

interface PopularGymsProps {
  onGymSelect?: (gym: Gym) => void;
}

export function PopularGyms({ onGymSelect }: PopularGymsProps) {
  const { gyms, loading, error } = useGyms();

  const handleGymClick = (gym: Gym) => {
    if (onGymSelect) {
      onGymSelect(gym);
    } else {
      alert(
        `اطلاعات جامع باشگاه "${gym.name}" بارگذاری شد!\nموقعیت مکانی: ${gym.address}\nامتیاز محبوبیت: ${gym.popularity_score}`
      );
    }
  };

  if (loading) {
    return (
      <section className="mt-10 fade-in-up select-none" id="popular-gyms-section">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-headline-md text-headline-md text-on-surface">باشگاه‌های محبوب</h4>
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
      <section className="mt-10 fade-in-up select-none" id="popular-gyms-section">
        <h4 className="font-headline-md text-headline-md text-on-surface mb-4">باشگاه‌های محبوب</h4>
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
    <section className="mt-10 fade-in-up select-none" style={{ animationDelay: "0.4s" }} id="popular-gyms-section">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-headline-md text-headline-md text-on-surface">باشگاه‌های محبوب</h4>
        <button
          onClick={() => alert("نمایش تمامی باشگاه‌های همکار فیتوپیا در فاز بعدی فعال می‌گردد.")}
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
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 md:grid md:grid-cols-2 xl:grid-cols-3 md:gap-6 md:pb-0 md:overflow-visible">
          {popularGyms.map((gym) => (
            <GymCard
              key={gym.id}
              gym={{
                id: gym.id,
                name: gym.name,
                cover_image: gym.cover_image,
                popularity_score: gym.popularity_score,
                rating: gym.popularity_score / 20,
              }}
              onClick={() => handleGymClick(gym)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
