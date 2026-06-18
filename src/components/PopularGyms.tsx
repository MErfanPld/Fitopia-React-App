/**
 * @file PopularGyms.tsx
 * @description Horizontal list component rendering a list of best-rated partner gyms
 * inside card overlays. Includes tap interactions to trigger a simulation modal or alert detail.
 */

import { GymCard } from "./GymCard";
import { gymsData, Gym } from "../data/gyms";

interface PopularGymsProps {
  onGymSelect?: (gym: Gym) => void; // Parent coordination callback
}

export function PopularGyms({ onGymSelect }: PopularGymsProps) {
  // Coordinates gym click action or triggers alert mock.
  const handleGymClick = (gym: Gym) => {
    if (onGymSelect) {
      onGymSelect(gym);
    } else {
      alert(`اطلاعات جامع باشگاه "${gym.name}" بارگذاری شد!\nموقعیت مکانی: ${gym.distance}\nهزینه کسر توکن: ${gym.tokensCost} توکن فیتوپیا.`);
    }
  };

  return (
    <section className="mt-10 fade-in-up select-none" style={{ animationDelay: "0.4s" }} id="popular-gyms-section">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-headline-md text-headline-md text-on-surface">باشگاه‌های محبوب</h4>
        <button
          onClick={() => alert("نمایش تمامی ۲۴ مجموعه همکار فیتوپیا در فاز بعدی فعال می‌گردد.")}
          className="text-primary font-label-sm hover:underline cursor-pointer bg-transparent border-none"
        >
          مشاهده همه
        </button>
      </div>
      
      <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 md:grid md:grid-cols-2 xl:grid-cols-3 md:gap-6 md:pb-0 md:overflow-visible">
        {gymsData.map((gym) => (
          <GymCard 
            key={gym.id} 
            gym={gym} 
            onClick={() => handleGymClick(gym)} 
          />
        ))}
      </div>
    </section>
  );
}
