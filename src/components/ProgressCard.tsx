import { useState } from "react";
import { Coins, Flame, Footprints, Sparkles, Droplet, Clock } from "lucide-react";

export function ProgressCard() {
  const [tokens, setTokens] = useState(24);
  const [waterCups, setWaterCups] = useState(4); // target: 8
  const calorieProgressPercent = 75; // 600 / 800
  const stepProgressPercent = 82; // 8200 / 10000
  const activeProgressPercent = 60; // 36 / 60

  const handleAddTokens = () => {
    setTokens(prev => prev + 10);
    alert("۱۰ توکن با موفقیت از طریق درگاه شبیه‌سازی شده اضافه گردید! 🎉");
  };

  const handleDrinkWater = () => {
    if (waterCups < 8) {
      setWaterCups(prev => prev + 1);
    } else {
      alert("آفرین! شما نیاز آب روزانه خود را تکمیل کرده‌اید. 💧");
    }
  };

  return (
    <div className="space-y-6" id="progress-card-section">
      {/* 1. Fluid Amber-Glow Tokens recharge card */}
      <div className="amber-glow-border float-anim" id="token-showcase-container">
        <div className="glass-card rounded-[2rem] p-6 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />
          
          <div className="flex justify-between items-start">
            <div className="text-right">
              <p className="font-label-sm text-xs text-on-surface-variant/60">شارژ کیف پول فیتوپیا</p>
              <div className="flex items-baseline gap-2 mt-2">
                <h3 className="text-4xl font-black text-primary-container">{tokens}</h3>
                <span className="text-xs text-on-surface font-bold">توکن فعال</span>
              </div>
              <p className="font-body-md text-xs text-on-surface-variant/80 mt-1">
                ویژه تایید جلسات حضوری و رزرو فوری باشگاه‌ها
              </p>
            </div>
            
            <div className="bg-primary-container/10 p-3.5 rounded-2xl border border-primary-container/20 text-primary-container flex items-center justify-center">
              <Coins size={32} className="animate-[spin_6s_linear_infinite]" />
            </div>
          </div>

          <div className="mt-5 flex gap-3">
            <button
              onClick={handleAddTokens}
              className="flex-grow py-3 px-4 bg-gradient-to-r from-[#FF6A00] to-[#FFB000] text-on-primary font-black rounded-2xl shadow-lg shadow-primary/10 active:scale-[0.97] hover:brightness-110 cursor-pointer transition-all flex items-center justify-center gap-1.5 text-sm"
            >
              <Sparkles size={16} />
              افزودن شارژ فوری
            </button>
          </div>
        </div>
      </div>

      {/* 2. Ring-Progress Fitness Dashboard Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="stat-widgets-grid">
        {/* Main Rings Dashboard Progress Summary */}
        <div className="glass-panel rounded-3xl p-6 flex flex-col justify-between" id="daily-activity-gauge">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-bold text-on-surface">وضعیت سلامتی امروز</h4>
            <span className="text-xs text-primary-container font-black">۷۸٪ از اهداف</span>
          </div>

          <div className="flex items-center justify-around gap-4">
            {/* Visual Circular rings simulation */}
            <div className="relative w-28 h-28 flex items-center justify-center" id="svg-ring-container">
              {/* SVG nested rings */}
              <svg className="w-full h-full transform -rotate-90">
                {/* Red Calorie ring */}
                <circle cx="56" cy="56" r="45" stroke="rgba(255,106,0,0.15)" strokeWidth="8" fill="transparent" />
                <circle
                  cx="56"
                  cy="56"
                  r="45"
                  stroke="#FF6A00"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="282"
                  strokeDashoffset={282 - (282 * calorieProgressPercent) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
                
                {/* Yellow Steps Ring */}
                <circle cx="56" cy="56" r="32" stroke="rgba(255,176,0,0.15)" strokeWidth="8" fill="transparent" />
                <circle
                  cx="56"
                  cy="56"
                  r="32"
                  stroke="#FFB000"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="201"
                  strokeDashoffset={201 - (201 * stepProgressPercent) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <Flame size={18} className="text-[#FF6A05]" />
                <span className="text-xs font-black mt-0.5 text-on-surface">۶۰۰</span>
              </div>
            </div>

            {/* List breakdown values */}
            <div className="space-y-3 flex-grow" id="breakdown-metrics">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF6A00]" />
                  <span className="text-on-surface-variant font-medium">کالری مصرفی:</span>
                </div>
                <span className="font-extrabold text-on-surface">۶۰۰ / ۸۰۰ Kcal</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFB000]" />
                  <span className="text-on-surface-variant font-medium">پیمایش قدم‌ها:</span>
                </div>
                <span className="font-extrabold text-on-surface">۸,۲۰۰ / ۱۰,۰۰۰</span>
              </div>

              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  <span className="text-on-surface-variant font-medium">زمان فعالیت:</span>
                </div>
                <span className="font-extrabold text-on-surface">۳۶ / ۶۰ دقیقه</span>
              </div>
            </div>
          </div>
        </div>

        {/* Supplementary Tracker: Water Intake Hydration tracker */}
        <div className="glass-panel rounded-3xl p-6 flex flex-col justify-between" id="hydration-card">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-bold text-on-surface flex items-center gap-1.5">
              <Droplet size={18} className="text-blue-400 fill-blue-400" />
              تراز نوشیدن آب
            </h4>
            <span className="text-xs text-blue-400 font-extrabold">{waterCups} از ۸ لیوان</span>
          </div>

          <p className="text-xs text-on-surface-variant/70 leading-relaxed mb-4">
            برای بازپروری بهینه فیبرهای ماهیچه‌ای، نوشیدن مرتب آب جزو کلیدی برنامه امروز شماست.
          </p>

          <div className="flex flex-col gap-3">
            {/* Horizontal Water cells visual representation */}
            <div className="flex gap-1.5 justify-between bg-surface-container-lowest p-2.5 rounded-xl border border-white/5">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className={`flex-grow h-7 rounded-md transition-all duration-300 ${
                    index < waterCups
                      ? "bg-gradient-to-t from-blue-500 to-cyan-400 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                      : "bg-white/5"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleDrinkWater}
              className="py-2 px-4 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 text-blue-400 text-xs font-black rounded-xl cursor-pointer active:scale-95 transition-all w-full text-center"
            >
              + ثبت نوشیدن ۱ لیوان آب
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
