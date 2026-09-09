import { useNavigate } from "react-router-dom";
import { useGyms, Gym } from "../hooks/useGymAPI";
import { GymCard } from "./GymCard";

interface PopularGymsProps {
  onGymSelect?: (gym: Gym) => void;
}

export function PopularGyms({ onGymSelect }: PopularGymsProps) {
  const { gyms, loading, error } = useGyms();
  const navigate = useNavigate();

  const handleGymClick = (gym: Gym) => {
    if (onGymSelect) onGymSelect(gym);
    else navigate(`/gym/${gym.id}`);
  };

  if (loading) {
    return (
      <section className="space-y-3" aria-busy="true" aria-label="در حال بارگذاری باشگاه‌های محبوب">
        <div className="flex items-center justify-between gap-2">
          <div className="skeleton h-4 w-32 rounded" />
          <div className="skeleton h-3 w-16 rounded" />
        </div>
        <div className="flex gap-3 overflow-hidden">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="shrink-0 w-[min(72vw,16.5rem)] sm:w-[15rem] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#121216]"
            >
              <div className="skeleton aspect-[4/3] w-full rounded-none" />
              <div className="space-y-2 p-3">
                <div className="skeleton h-4 w-[75%] rounded ms-auto" />
                <div className="skeleton h-3 w-full rounded" />
                <div className="skeleton h-3 w-[55%] rounded ms-auto" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="space-y-2">
        <h2 className="section-title">باشگاه‌های محبوب</h2>
        <div className="state-box">
          <p className="state-desc">خطا در بارگذاری باشگاه‌ها</p>
        </div>
      </section>
    );
  }

  const popularGyms = gyms
    .filter((gym) => gym.is_popular)
    .sort((a, b) => b.popularity_score - a.popularity_score)
    .slice(0, 8);

  return (
    <section className="space-y-3" id="popular-gyms-section" aria-label="باشگاه‌های محبوب">
      <div className="flex items-center justify-between gap-2">
        <h2 className="section-title">باشگاه‌های محبوب</h2>
        <button type="button" className="section-link" onClick={() => navigate("/gym/all")}>
          مشاهده همه
        </button>
      </div>

      {popularGyms.length === 0 ? (
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-sm text-white/55">
          باشگاه محبوبی یافت نشد
        </div>
      ) : (
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1 snap-x snap-mandatory">
          {popularGyms.map((gym) => (
            <div
              key={gym.id}
              className="snap-start shrink-0 w-[min(72vw,16.5rem)] sm:w-[15rem]"
            >
              <GymCard gym={gym} onClick={() => handleGymClick(gym)} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
