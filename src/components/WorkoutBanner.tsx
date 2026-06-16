import { useState, useEffect } from "react";
import { Play, Dumbbell, Award, Flame, Timer, TrendingUp, X } from "lucide-react";

export function WorkoutBanner() {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(2700); // 45 minutes target countdown

  useEffect(() => {
    let interval: number | undefined;
    if (isRunning && seconds > 0) {
      interval = window.setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsRunning(false);
      alert("آفرین! خسته نباشی قهرمان، تمرین امروز شما با موفقیت تکمیل شد! 🏆");
    }
    return () => clearInterval(interval);
  }, [isRunning, seconds]);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? "۰" : ""}${secs}`;
  };

  const handleStartWorkout = () => {
    setIsRunning(true);
  };

  return (
    <section className="glass-panel rounded-[2rem] overflow-hidden relative border border-white/5 shadow-xl" id="todays-workout-banner">
      {/* Background dark overlay image */}
      <div className="absolute inset-0 z-0">
        <img
          alt="Athlete training hard in dramatic lighting"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-30 scale-105 hover:scale-100 transition-transform duration-700"
          src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
      </div>

      <div className="p-8 md:p-10 relative z-10 select-none">
        {/* Banner Tag */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-primary-container/20 border border-primary-container/30 rounded-lg text-primary text-xs font-bold">
            <Award size={14} />
            <span>برنامه پیشنهادی تیم فیزیولوژی</span>
          </div>
          <span className="text-[11px] text-[#FFB000] font-black tracking-normal uppercase bg-[#FFB000]/10 border border-[#FFB000]/20 px-2 py-0.5 rounded-md">
            برن چربی شدید
          </span>
        </div>

        {/* Content detail */}
        <div className="mb-6">
          <h3 className="text-xl md:text-2xl font-black text-on-surface leading-snug">تمرین هوازی اینتروال ضربتی (HIIT)</h3>
          <p className="text-sm text-on-surface-variant/80 mt-2 max-w-md leading-relaxed">
            امروز عضلات چهارسر و تارهای تند-انقباض هدف هستند. ۴۵ دقیقه ایده آل برای ارتقای استقامت ریوی و کالری‌سوزی مضاعف.
          </p>
        </div>

        {/* Highlight tags */}
        <div className="grid grid-cols-3 gap-3 mb-6 bg-surface-container-lowest/50 backdrop-blur-md p-4 rounded-2xl border border-white/5">
          <div className="flex flex-col items-center justify-center text-center">
            <Timer size={18} className="text-primary-container mb-1" />
            <span className="text-xs text-on-surface-variant">زمان کل</span>
            <span className="text-xs font-black text-on-surface mt-0.5">{isRunning ? formatTime(seconds) : "۴۵ دقیقه"}</span>
          </div>

          <div className="flex flex-col items-center justify-center text-center border-x border-white/5">
            <TrendingUp size={18} className="text-[#FFB000] mb-1" />
            <span className="text-xs text-on-surface-variant">انرژی پایه</span>
            <span className="text-xs font-black text-on-surface mt-0.5">سخت و حرفه‌ای</span>
          </div>

          <div className="flex flex-col items-center justify-center text-center">
            <Flame size={18} className="text-red-400 mb-1" />
            <span className="text-xs text-on-surface-variant">تخمینی</span>
            <span className="text-xs font-black text-on-surface mt-0.5">۵۵۰ کالری</span>
          </div>
        </div>

        {/* Timer interaction or call button */}
        {isRunning ? (
          <div className="bg-primary/5 border border-primary-container/30 px-6 py-4 rounded-xl flex items-center justify-between gap-4 animate-[fadeIn_0.4s_ease-out]">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500"></span>
              </span>
              <span className="text-xs font-bold text-on-surface">جلسه تمرینی در حال اجراست...</span>
            </div>
            
            <button
              onClick={() => setIsRunning(false)}
              className="text-xs text-red-400 font-bold hover:underline py-1.5 px-3 rounded-lg bg-red-500/10 border border-red-500/20 cursor-pointer flex items-center gap-1 active:scale-95 transition-all"
            >
              <X size={14} />
              متوقف کردن موقت
            </button>
          </div>
        ) : (
          <button
            onClick={handleStartWorkout}
            className="energy-gradient w-full md:w-auto py-4 px-8 rounded-xl font-headline-md text-sm text-on-primary-container font-extrabold shadow-lg active:scale-[0.97] hover:brightness-110 cursor-pointer transition-all flex items-center justify-center gap-2"
          >
            <Play size={18} className="fill-current" />
            شروع تمرین امروز
          </button>
        )}
      </div>
    </section>
  );
}
