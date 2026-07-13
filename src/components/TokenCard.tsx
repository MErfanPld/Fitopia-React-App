// src/components/TokenCard.tsx
/**
 * @file TokenCard.tsx
 * @description Renders the user's available token balance for active booking,
 * styled within a floating virtual card with 3D mouse parallax tilt simulation.
 */

import { useState, useEffect, useRef } from "react";
import { Award, Loader2, AlertCircle } from "lucide-react";
import { useTokens } from "../hooks/useTokens";

export function TokenCard() {
  const { activeCount, loading, error, refetch, purchaseToken } = useTokens();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Active desktop cursor coordinate-based gyro tilt simulation
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cardRef.current) {
        const x = (window.innerWidth / 2 - e.clientX) / 60;
        const y = (window.innerHeight / 2 - e.clientY) / 60;
        cardRef.current.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${y}deg)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Handle purchasing new tokens
  const handleRecharge = async () => {
    setIsPurchasing(true);
    try {
      const newToken = await purchaseToken();
      if (newToken) {
        alert("🎉 پرداخت با موفقیت انجام شد! یک توکن جدید به موجودی شما افزوده شد.");
      } else {
        alert("❌ خطا در پرداخت. لطفاً مجدداً تلاش کنید.");
      }
    } catch (err) {
      alert("❌ خطا در پرداخت. لطفاً مجدداً تلاش کنید.");
    } finally {
      setIsPurchasing(false);
    }
  };

  // نمایش وضعیت بارگذاری
  if (loading) {
    return (
      <section className="mt-8 fade-in-up select-none" style={{ animationDelay: "0.2s" }}>
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
          <div className="flex justify-between items-center">
            <div className="text-right">
              <p className="font-label-sm text-on-surface-variant/60">توکن‌های باقیمانده</p>
              <div className="flex items-center gap-2 mt-2">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="text-on-surface-variant/80">در حال بارگذاری...</span>
              </div>
            </div>
            <div className="bg-primary/10 p-4 rounded-xl">
              <Award className="w-10 h-10 text-primary/50" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  // نمایش خطا
  if (error) {
    return (
      <section className="mt-8 fade-in-up select-none" style={{ animationDelay: "0.2s" }}>
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden border border-red-500/30">
          <div className="flex justify-between items-center">
            <div className="text-right">
              <p className="font-label-sm text-red-400">خطا در دریافت توکن‌ها</p>
              <div className="flex items-center gap-2 mt-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-on-surface-variant/80 text-sm">{error}</span>
              </div>
              <button
                onClick={refetch}
                className="mt-3 text-primary text-sm hover:underline"
              >
                تلاش مجدد
              </button>
            </div>
            <div className="bg-red-500/10 p-4 rounded-xl">
              <Award className="w-10 h-10 text-red-400/50" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mt-8 fade-in-up select-none" style={{ animationDelay: "0.2s" }} id="token-card-section">
      <div 
        ref={cardRef} 
        className="amber-glow-border float-anim transition-transform duration-100 ease-out" 
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />
          
          <div className="flex justify-between items-center relative z-10">
            <div className="text-right">
              <p className="font-label-sm text-on-surface-variant/60">توکن‌های باقیمانده</p>
              <h3 className="font-display-lg text-display-lg text-primary mt-2">{activeCount}</h3>
              <p className="font-body-md text-on-surface-variant/80 mt-1">
                {activeCount === 0 ? 'هیچ توکن فعالی ندارید' : 'برای رزرو باشگاه‌ها'}
              </p>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-xl flex items-center justify-center text-primary">
              <Award className="w-10 h-10 animate-pulse" />
            </div>
          </div>
          
          <button
            onClick={handleRecharge}
            disabled={isPurchasing}
            className="w-full mt-6 py-3 bg-gradient-to-r from-[#FF6A00] to-[#FFB000] text-on-primary font-bold rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-transform cursor-pointer hover:brightness-110 relative z-10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPurchasing ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                در حال پرداخت...
              </div>
            ) : (
              'افزودن شارژ'
            )}
          </button>
        </div>
      </div>
    </section>
  );
}