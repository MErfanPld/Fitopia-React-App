/**
 * @file OfflinePage.tsx
 * @description Sleek connection fallback page for FITOPIA. 
 * If a network disconnect is detected, rather than showing a blank screen, this page offers
 * an interactive, offline-available guided box-breathing activity to lower stress levels.
 */

import { useState, useEffect } from "react";
import { Compass, WifiOff, RefreshCw, Activity, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ShaderBackground } from "../components/ShaderBackground";

export function OfflinePage() {
  const [breathingState, setBreathingState] = useState<"دم" | "بازدم" | "نگه‌داری">("دم");
  const [seconds, setSeconds] = useState(4);
  const [sessionCount, setSessionCount] = useState(0);

  // Simple breathing cycle loop for premium offline interaction.
  // Performs a 4s inhale (دم) -> 4s hold (نگه‌داری) -> 4s exhale (بازدم) cadence.
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          if (breathingState === "دم") {
            setBreathingState("نگه‌داری");
            return 4;
          } else if (breathingState === "نگه‌داری") {
            setBreathingState("بازدم");
            return 4;
          } else {
            setBreathingState("دم");
            setSessionCount((s) => s + 1);
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [breathingState]);

  // Manually queries the browser network state to determine whether to restore the dash view.
  const handleRetryConnection = () => {
    if (navigator.onLine) {
      window.location.href = "/home";
    } else {
      alert("ارتباط اینترنت همچنان قطع است. لطفاً وضعیت مودم یا شبکه همراه خود را بررسی کنید.");
    }
  };

  return (
    <>
      <ShaderBackground />
      
      <main className="relative z-10 min-h-screen flex flex-col justify-center items-center px-4 py-12 select-none text-right">
        <div className="w-full max-w-md bg-surface/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
          
          {/* Top Status */}
          <div className="flex flex-col items-center text-center mt-4">
            <div className="relative">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500">
                <WifiOff size={32} className="animate-bounce" />
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
            </div>
            
            <h1 className="font-headline text-2xl text-on-surface mt-4">عدم دسترسی به شبکه</h1>
            <p className="text-on-surface-variant/80 font-vazir text-sm mt-2 max-w-xs leading-relaxed">
              ارتباط اینترنت شما قطع است. فیتوپیا همچنان در دسترس شماست و به همین دلیل ابزار تنفس آفلاین برای شما لود شده است.
            </p>
          </div>

          {/* Interactive Offline Breathing Simulator */}
          <div className="my-8 py-6 px-4 bg-white/5 border border-white/5 rounded-2xl flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-primary text-xs font-bold mb-4">
              <Activity size={14} className="animate-pulse" />
              <span>مراقبه و تنفس آفلاین فیتوپیا</span>
            </div>

            {/* Pulsing Core circle */}
            <div 
              className={`w-32 h-32 rounded-full flex flex-col items-center justify-center transition-all duration-1000 ${
                breathingState === "دم" 
                  ? "bg-primary/20 scale-110 shadow-[0_0_30px_rgba(255,106,0,0.3)]" 
                  : breathingState === "نگه‌داری"
                  ? "bg-[#FFB000]/20 scale-115 shadow-[0_0_35px_rgba(255,176,0,0.3)]"
                  : "bg-surface-container-high scale-95 shadow-none"
              }`}
            >
              <span className="text-2xl font-black text-on-surface">{breathingState}</span>
              <span className="text-xs text-on-surface-variant/70 mt-1 font-vazir">{seconds} ثانیه</span>
            </div>

            <p className="text-xs text-on-surface-variant/60 font-vazir mt-4">
              دورهای مکرر تکمیل شده: <span className="font-bold text-primary">{sessionCount}</span>
            </p>
          </div>

          {/* Call to actions */}
          <div className="space-y-3">
            <button
              onClick={handleRetryConnection}
              className="w-full py-3 bg-gradient-to-r from-[#FF6A00] to-[#FFB000] text-on-primary font-bold rounded-xl shadow-lg shadow-primary/20 active:scale-95 duration-200 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <RefreshCw size={16} />
              <span>تلاش مجدد برای اتصال</span>
            </button>
            
            <Link
              to="/home"
              className="w-full py-3 bg-white/5 border border-white/5 text-on-surface font-semibold rounded-xl active:scale-95 duration-200 hover:bg-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <span>برو به صفحه اصلی (نسخه آفلاین)</span>
              <ArrowRight size={16} />
            </Link>
          </div>

        </div>
      </main>
    </>
  );
}
