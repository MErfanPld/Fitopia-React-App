/**
 * @file TokenCard.tsx
 * @description Renders the user's available token balance for active booking,
 * styled within a floating virtual card with 3D mouse parallax tilt simulation.
 */

import { useState, useEffect, useRef } from "react";
import { Award } from "lucide-react";

export function TokenCard() {
  const [tokens, setTokens] = useState(24); // Starting tokens count
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

  // Simulates purchasing credit top ups
  const handleRecharge = () => {
    setTokens((prev) => prev + 10);
    alert("پرداخت با موفقیت شبیه‌سازی شد! ۱۰ توکن فیتوپیا به موجودی شما افزوده شد. 🎉");
  };

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
              <h3 className="font-display-lg text-display-lg text-primary mt-2">{tokens}</h3>
              <p className="font-body-md text-on-surface-variant/80 mt-1">برای رزرو باشگاه‌ها</p>
            </div>
            
            <div className="bg-primary/10 p-4 rounded-xl flex items-center justify-center text-primary">
              <Award className="w-10 h-10 animate-pulse" />
            </div>
          </div>
          
          <button
            onClick={handleRecharge}
            className="w-full mt-6 py-3 bg-gradient-to-r from-[#FF6A00] to-[#FFB000] text-on-primary font-bold rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-transform cursor-pointer hover:brightness-110 relative z-10"
          >
            افزودن شارژ
          </button>
        </div>
      </div>
    </section>
  );
}
