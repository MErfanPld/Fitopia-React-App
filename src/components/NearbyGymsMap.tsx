/**
 * @file NearbyGymsMap.tsx
 * @description Mock location map using satellite raster image overlays,
 * absolute position pins, and relative coordinates corresponding to partner gyms list.
 */

import { MapPin, Compass } from "lucide-react";

export function NearbyGymsMap() {
  const handleMarkerClick = (markerName: string) => {
    alert(`موقعیت یابی فیتوپیا:\nباشگاه "${markerName}" هم‌اکنون فعال و پذیرای اعضا می‌باشد!`);
  };

  const handleCtaClick = () => {
    alert("نقشه مسیریابی فیتوپیا با موفقیت روی نقشه بزرگ بارگذاری شد!\nشبیه‌سازی ارتباط GPS...");
  };

  return (
    <section className="mt-8 fade-in-up select-none" style={{ animationDelay: "0.5s" }} id="nearby-gyms-map">
      <div className="flex items-center gap-2 mb-4">
        <MapPin size={18} className="text-primary" />
        <h4 className="font-title text-title text-on-surface">باشگاه‌های نزدیک شما</h4>
      </div>
      
      <div className="relative w-full h-64 rounded-2xl overflow-hidden glass-card border border-white/5">
        {/* Abstract dot matrix grid */}
        <div
          className="absolute inset-0 bg-[#0E0E12]"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255, 106, 0, 0.05) 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Mock Map blueprint base overlay image */}
        <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none">
          <img
            alt="Dark Mode Map Schematic"
            className="w-full h-full object-cover grayscale invert contrast-125 brightness-50"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuX1C6qgAjPxCfHBuJNDAzacUpAjRWdLIngiYO8Xa2-co32lpYoaGA8QN3V9xfkXSuM73TNg0U-Yn526KXr3KL2ojOJ4YVuDS11LifDcUmUKThEj0FMhLyQ01BvqSLa[...]"
          />
        </div>

        {/* Floating Glowing interactive Markers */}
        <button
          onClick={() => handleMarkerClick("باشگاه رویال پلاتینیوم")}
          className="absolute top-1/2 left-1/3 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-[0_0_10px_#ff6a00] hover:scale-125 focus:outline-none transition-all cursor-pointer"
          title="باشگاه رویال پلاتینیوم - ۱.۲ کیلومتر"
        />

        <button
          onClick={() => handleMarkerClick("مرکز فیتنس تایتان")}
          className="absolute top-1/4 right-1/4 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-[0_0_10px_#ff6a00] pulse-breathing hover:scale-125 focus:outline-none transition-all cursor-pointer"
          title="مرکز فیتنس تایتان - ۳.۵ کیلومتر"
        />

        <button
          onClick={() => handleMarkerClick("آکادمی بوکس اتم")}
          className="absolute bottom-1/3 right-1/2 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-[0_0_10px_#ff6a00] hover:scale-125 focus:outline-none transition-all cursor-pointer"
          title="آکادمی بوکس اتم - ۴.۸ کیلومتر"
        />

        {/* Map CTA Bottom Overlay */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <button
            onClick={handleCtaClick}
            className="whitespace-nowrap bg-surface/90 backdrop-blur-md px-6 py-2.5 rounded-full border border-primary/30 text-primary font-bold text-sm flex items-center gap-2 active:scale-95 transition-transform cursor-pointer hover:bg-surface transition-colors"
          >
            <Compass size={16} className="text-primary animate-spin-[20s]" />
            <span>مشاهده همه نزدیک‌ها</span>
          </button>
        </div>
      </div>
    </section>
  );
}
