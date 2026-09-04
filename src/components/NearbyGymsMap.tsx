/**
 * Compact nearby discovery card → full map page.
 */

import { MapPin, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserLocation } from "../hooks/useUserLocation";
import { useNearbyGyms } from "../hooks/useNearbyGyms";

export function NearbyGymsMap() {
  const navigate = useNavigate();
  const { location, loading: locLoading } = useUserLocation();
  const { gyms, loading: gymsLoading } = useNearbyGyms(location.lat, location.lon);
  const loading = locLoading || gymsLoading;
  const count = gyms?.length ?? 0;

  return (
    <section className="space-y-3" id="nearby-gyms-map" aria-label="باشگاه‌های نزدیک">
      <h2 className="section-title">باشگاه‌های نزدیک شما</h2>

      <button
        type="button"
        onClick={() => navigate("/gym-map")}
        className="relative w-full overflow-hidden rounded-2xl border border-white/10 text-right min-h-[9.5rem] sm:min-h-[11rem] active:scale-[0.99] transition-transform"
      >
        <div
          className="absolute inset-0 bg-[#101014]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,106,0,0.12) 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07070A] via-[#07070A]/55 to-transparent" />

        <span className="absolute top-[28%] right-[22%] h-2.5 w-2.5 rounded-full bg-primary-container shadow-[0_0_12px_rgba(255,106,0,0.6)]" />
        <span className="absolute top-[48%] right-[48%] h-2 w-2 rounded-full bg-primary/80" />
        <span className="absolute top-[36%] left-[28%] h-2 w-2 rounded-full bg-primary/70" />

        <div className="relative z-10 flex h-full min-h-[9.5rem] sm:min-h-[11rem] flex-col justify-end p-4">
          {loading ? (
            <p className="text-xs text-white/55">در حال یافتن موقعیت...</p>
          ) : (
            <>
              <div className="flex items-center justify-end gap-1.5 text-primary">
                <span className="text-xs font-semibold">
                  {count > 0 ? `${count} باشگاه نزدیک` : "مشاهده روی نقشه"}
                </span>
                <MapPin size={14} aria-hidden />
              </div>
              <p className="mt-1 text-sm font-bold text-white flex items-center justify-end gap-1">
                باز کردن نقشه کامل
                <ChevronLeft size={16} aria-hidden />
              </p>
            </>
          )}
        </div>
      </button>
    </section>
  );
}
