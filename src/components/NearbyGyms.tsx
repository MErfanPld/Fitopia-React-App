import { useState } from "react";
import { MapPin, Star, Phone, Clock, Coins, ChevronRight } from "lucide-react";

interface Gym {
  id: string;
  name: string;
  image: string;
  rating: number;
  distance: string;
  tokensCost: number;
  openHours: string;
}

export function NearbyGyms() {
  const [selectedGym, setSelectedGym] = useState<Gym | null>(null);

  const gyms: Gym[] = [
    {
      id: "gym-1",
      name: "باشگاه رویال پلاتینیوم",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=350&q=80",
      rating: 4.8,
      distance: "۱.۲ کیلومتر",
      tokensCost: 4,
      openHours: "۰۶:۰۰ تا ۲۳:۰۰",
    },
    {
      id: "gym-2",
      name: "مرکز کاردیو و یوگا تایتان",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=350&q=80",
      rating: 4.7,
      distance: "۳.۵ کیلومتر",
      tokensCost: 3,
      openHours: "۰۷:۰۰ تا ۲۲:۰۰",
    },
    {
      id: "gym-3",
      name: "آکادمی بوکس و مبارزه اتم",
      image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=350&q=80",
      rating: 4.9,
      distance: "۴.۸ کیلومتر",
      tokensCost: 5,
      openHours: "۰۸:۰۰ تا ۲۴:۰۰",
    },
  ];

  const handleBookGym = (gym: Gym) => {
    const confirmation = window.confirm(
      `آیا می‌خواهید با کسر ${gym.tokensCost} توکن فیتوپیا، جلسه تمرینی خود در "${gym.name}" را تایید نهایی کنید؟`
    );
    if (confirmation) {
      alert(`کد رزرو فیتوپیا فعال شد! 🎫\nنام مجموعه: ${gym.name}\nساعت پذیرش: امروز از ساعت ${gym.openHours}\nلطفا آیدی رزرو را به مسئول پذیرش نشان دهید.`);
      setSelectedGym(null);
    }
  };

  return (
    <section className="space-y-5 select-none" id="gyms-nearby-section">
      <div className="flex justify-between items-center">
        <h4 className="text-base font-black text-on-surface">باشگاه‌های همکار فیتوپیا</h4>
        <span className="text-xs text-primary-container font-black hover:underline cursor-pointer">
          مشاهده روی نقشه بزرگ
        </span>
      </div>

      {/* 1. Map preview widget with glowing positioning hotspots */}
      <div className="relative w-full h-64 rounded-[2rem] overflow-hidden glass-panel border border-white/5" id="gyms-map-widget">
        <div
          className="absolute inset-0 bg-[#0E0E12]"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, rgba(255,106,0,0.06) 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        {/* Fake blueprint outline map illustration */}
        <div className="absolute inset-0 opacity-40 mix-blend-screen pointer-events-none">
          <img
            alt="Minimal map schematic overlay"
            className="w-full h-full object-cover grayscale invert contrast-125 brightness-50"
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80"
          />
        </div>

        {/* Hotspot Markers */}
        {/* Marker 1 */}
        <div
          onClick={() => {
            setSelectedGym(gyms[0]);
            alert("باشگاه رویال پلاتینیوم انتخاب شد!");
          }}
          className="absolute top-1/2 left-1/3 w-6 h-6 bg-primary-container/30 rounded-full border border-primary flex items-center justify-center cursor-pointer shadow-[0_0_15px_#ff6a00] hover:scale-110 active:scale-95 transition-all text-[8px] text-white font-bold animate-[bounce_2s_infinite]"
          title={gyms[0].name}
        >
          📍
        </div>

        {/* Marker 2 */}
        <div
          onClick={() => {
            setSelectedGym(gyms[1]);
            alert("مرکز کاردیو و یوگا تایتان انتخاب شد!");
          }}
          className="absolute top-1/4 right-1/4 w-6 h-6 bg-primary-container/30 rounded-full border border-primary flex items-center justify-center cursor-pointer shadow-[0_0_15px_#ff6a00] hover:scale-110 active:scale-95 transition-all text-[8px] text-white font-bold animate-[bounce_2s_infinite]"
          title={gyms[1].name}
        >
          📍
        </div>

        {/* Marker 3 */}
        <div
          onClick={() => {
            setSelectedGym(gyms[2]);
            alert("آکادمی بوکس و مبارزه اتم انتخاب شد!");
          }}
          className="absolute bottom-1/3 right-1/2 w-6 h-6 bg-primary-container/30 rounded-full border border-primary flex items-center justify-center cursor-pointer shadow-[0_0_15px_#ff6a00] hover:scale-110 active:scale-95 transition-all text-[8px] text-white font-bold animate-[bounce_2s_infinite]"
          title={gyms[2].name}
        >
          📍
        </div>

        {/* Bottom map action card */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-surface-dim/95 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/5 shadow-2xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
            <span className="text-xs font-semibold text-on-surface">۳ مجموعه ورزشی نزدیک شما باز هستند</span>
          </div>
          <button
            onClick={() => alert("لیست ۲۴ باشگاه تحت پوشش شهر شما در نسخه نهایی نمایش داده خواهد شد.")}
            className="text-xs text-primary-container font-black hover:underline cursor-pointer flex items-center gap-0.5"
          >
            <span>لیست کامل</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* 2. Gym Horizontal Cards Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5" id="gyms-grid">
        {gyms.map((gym) => (
          <div
            key={gym.id}
            onClick={() => setSelectedGym(gym)}
            className={`rounded-3xl glass-card flex flex-col justify-between overflow-hidden cursor-pointer border hover:border-primary-container/30 active:scale-[0.99] transition-all relative ${
              selectedGym?.id === gym.id ? "border-primary-container" : "border-white/5"
            }`}
          >
            <div className="h-40 relative">
              <img
                src={gym.image}
                referrerPolicy="no-referrer"
                alt={gym.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
              <div className="absolute top-3 left-3 bg-black/55 backdrop-blur-md text-[10px] px-2.5 py-1.5 rounded-xl flex items-center gap-1 font-bold">
                <Star size={12} className="text-[#FFB000] fill-[#FFB000]" />
                <span className="text-on-surface">{gym.rating}</span>
              </div>
            </div>

            <div className="p-5 flex-grow flex flex-col justify-between">
              <div>
                <h5 className="font-extrabold text-[#e5e1e6] text-base leading-snug">{gym.name}</h5>
                <div className="flex gap-4 items-center text-xs text-on-surface-variant/60 font-semibold mt-2.5">
                  <span className="flex items-center gap-1">
                    <MapPin size={13} className="text-primary" />
                    {gym.distance}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={13} />
                    {gym.openHours}
                  </span>
                </div>
              </div>

              {/* Booking section */}
              <div className="mt-5 pt-4 border-t border-white/5 flex gap-2 items-center justify-between">
                <div className="flex items-center gap-1 text-primary-container font-bold text-xs">
                  <Coins size={14} />
                  <span>{gym.tokensCost} توکن برای رزرو</span>
                </div>
                <span className="text-[11px] text-primary hover:underline font-bold">رزرو فوری</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Detailed Booking modal / popup */}
      {selectedGym && (
        <div
          id="booking-modal-overlay"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-[fadeIn_0.3s_ease-out]"
        >
          <div className="glass-panel w-full max-w-sm rounded-[2rem] p-6 text-right space-y-6 relative border border-white/10 shadow-2xl">
            <h4 className="text-lg font-black text-on-surface border-b border-white/5 pb-3">رزرو سریع فیتوپیا</h4>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <img
                  src={selectedGym.image}
                  referrerPolicy="no-referrer"
                  alt={selectedGym.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
                <div className="flex flex-col justify-center">
                  <span className="font-extrabold text-on-surface text-sm">{selectedGym.name}</span>
                  <span className="text-xs text-on-surface-variant/70 mt-1">{selectedGym.distance} | {selectedGym.openHours}</span>
                </div>
              </div>

              <div className="bg-surface-container-lowest p-4 rounded-2xl space-y-2 border border-white/5 text-xs font-semibold">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">بهای رزرو نهایی:</span>
                  <span className="text-[#FFB000]">{selectedGym.tokensCost} توکن</span>
                </div>
                <div className="flex justify-between border-t border-white/5 pt-2 mt-2">
                  <span className="text-on-surface-variant">کیف پول فعلی شما:</span>
                  <span className="text-emerald-400">۲۴ توکن</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => handleBookGym(selectedGym)}
                className="flex-grow py-3 bg-gradient-to-l from-[#FF6A00] to-[#FFB000] text-on-primary-container font-black text-xs rounded-xl cursor-pointer hover:brightness-110 active:scale-95 transition-all"
              >
                کاهش توکن و رزرو نهایی
              </button>
              <button
                onClick={() => setSelectedGym(null)}
                className="py-3 px-5 bg-white/5 text-on-surface-variant/80 hover:bg-white/10 text-xs font-bold rounded-xl cursor-pointer active:scale-95 transition-all"
              >
                انصراف
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
