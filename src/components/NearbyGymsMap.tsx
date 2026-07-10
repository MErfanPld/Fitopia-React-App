/**
 * @file NearbyGymsMap.tsx
 * @description Enhanced nearby gyms preview card with navigation to full map
 */

import { MapPin, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserLocation } from "../hooks/useUserLocation";
import { useNearbyGyms } from "../hooks/useNearbyGyms";

export function NearbyGymsMap() {
  const navigate = useNavigate();
  const { location, loading: locLoading } = useUserLocation();
  const { gyms, loading: gymsLoading } = useNearbyGyms(location.lat, location.lon);

  const handleViewMap = () => {
    navigate("/gym-map");
  };

  return (
    <section
      className="mt-8 fade-in-up select-none"
      style={{ animationDelay: "0.5s" }}
      id="nearby-gyms-map"
    >
      <div className="flex items-center gap-2 mb-4">
        <MapPin size={18} className="text-primary" />
        <h4 className="font-title text-title text-on-surface">باشگاه‌های نزدیک شما</h4>
      </div>

      {/* Main Map Card */}
      <div
        onClick={handleViewMap}
        className="relative w-full h-80 rounded-2xl overflow-hidden glass-card border border-white/10 cursor-pointer transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/20 group"
      >
        {/* Loading state */}
        {(locLoading || gymsLoading) && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface/40 backdrop-blur-sm z-20">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              <p className="text-sm text-on-surface/60">درحال بارگذاری موقعیت...</p>
            </div>
          </div>
        )}

        {/* Background grid pattern */}
        <div
          className="absolute inset-0 bg-[#0E0E12]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, rgba(255, 106, 0, 0.05) 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-surface/20" />

        {/* Map image background */}
        <div className="absolute inset-0 opacity-30 mix-blend-screen pointer-events-none">
          <img
            alt="Dark Mode Map"
            className="w-full h-full object-cover grayscale invert contrast-125 brightness-50"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuX1C6qgAjPxCfHBuJNDAzacUpAjRWdLIngiYO8Xa2-co32lpYoaGA8QN3V9xfkXSuM73TNg0U-Yn526KXr3KL2ojOJ4YVuDS11LifDcUmUKThEj0FMhLyQ01BvqSLa"
          />
        </div>

        {/* Gym markers preview (first 3) */}
        {!locLoading && !gymsLoading && gyms.length > 0 && (
          <>
            {gyms.slice(0, 3).map((gym, index) => {
              // Distribute markers across the map
              const positions = [
                { top: "30%", left: "25%" },
                { top: "50%", left: "65%" },
                { top: "70%", left: "40%" },
              ];
              const pos = positions[index];
              return (
                <div
                  key={gym.id}
                  className="absolute w-3 h-3 bg-primary rounded-full border-2 border-white shadow-[0_0_12px_rgba(255,106,0,0.6)] animate-pulse"
                  style={{
                    top: pos.top,
                    left: pos.left,
                    transform: "translate(-50%, -50%)",
                  }}
                  title={gym.name}
                />
              );
            })}
          </>
        )}

        {/* Gradient fade at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-surface via-surface/50 to-transparent" />

        {/* Gym count badge */}
        <div className="absolute top-4 right-4 bg-surface/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-primary/30 text-sm font-semibold text-primary flex items-center gap-1.5">
          <MapPin size={14} className="text-primary" />
          {gymsLoading ? "..." : `${gyms.length} باشگاه`}
        </div>

        {/* CTA Button */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
          <button
            onClick={handleViewMap}
            className="bg-primary hover:bg-primary/90 text-white font-bold text-sm px-6 py-3 rounded-full transition-all duration-300 flex items-center gap-2 active:scale-95 shadow-lg shadow-primary/30 group-hover:shadow-primary/50"
          >
            <span>مشاهده نقشه تعاملی</span>
            <ChevronLeft size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Quick stats */}
      {!locLoading && !gymsLoading && gyms.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3">
          <div className="glass-card rounded-lg p-3 text-center border border-white/5">
            <p className="text-sm text-on-surface/60">نزدیک‌ترین</p>
            <p className="text-primary font-bold text-sm mt-1">{gyms[0]?.name.substring(0, 15)}</p>
          </div>
          <div className="glass-card rounded-lg p-3 text-center border border-white/5">
            <p className="text-sm text-on-surface/60">محبوب‌ترین</p>
            <p className="text-primary font-bold text-sm mt-1">
              {gyms.sort((a, b) => b.popularity_score - a.popularity_score)[0]?.name.substring(
                0,
                15
              )}
            </p>
          </div>
          <div className="glass-card rounded-lg p-3 text-center border border-white/5">
            <p className="text-sm text-on-surface/60">کل موجود</p>
            <p className="text-primary font-bold text-sm mt-1">{gyms.length}</p>
          </div>
        </div>
      )}
    </section>
  );
}
