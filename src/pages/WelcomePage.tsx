/**
 * @file WelcomePage.tsx
 * @description Sleek and premium Welcome & Landing stage for FITOPIA.
 * Introduces the platform, features dual action gates (Login / Register),
 * and automatically diverts authenticated athletes directly to the home workspace feed.
 */

import { useState, useEffect, MouseEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { ShaderBackground } from "../components/ShaderBackground";
import { ParticleOverlay } from "../components/ParticleOverlay";
import { Dumbbell, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../context/AuthContext";

export function WelcomePage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  // Skip welcome page if user already holds a valid authentication session
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/home", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Parallax physical simulation for premium interactive card tilt
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    
    // Relative mouse position
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    setRotateX(-y / 35);
    setRotateY(x / 35);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  if (isLoading || isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-[#07070A] z-50 flex flex-col justify-center items-center select-none">
        <div className="relative w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 bg-primary/25 rounded-full blur-2xl animate-pulse" />
          <div className="w-16 h-16 rounded-full border-t-2 border-r-2 border-primary animate-spin" />
          <div className="absolute w-12 h-12 rounded-full border-b-2 border-l-2 border-[#FFB000]/60 animate-spin-[reverse_1.5s_linear_infinite]" />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 1. WebGL Organic Ambient Space background */}
      <ShaderBackground />

      {/* 2. Particle layer overlays */}
      <ParticleOverlay />

      <div 
        id="welcome-page-parallax-wrapper"
        className="w-full flex justify-center items-center relative z-10 transition-transform duration-300"
      >
        <AuthLayout>
          {/* Card body with mouse tilt feel */}
          <div
            id="welcome-parallax-box"
            style={{
              transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
              transition: "transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="w-full flex flex-col items-center select-none text-right"
          >
            {/* Branding Core Element */}
            <header className="flex flex-col items-center mb-10" id="welcome-branding-header">
              <div 
                id="welcome-logo-circle"
                className="w-20 h-20 mb-6 flex items-center justify-center bg-primary-container/10 rounded-3xl border border-primary-container/30 shadow-[0_0_25px_rgba(255,106,0,0.25)] animate-[pulse_3s_infinite]"
              >
                <Dumbbell className="text-primary-container animate-[spin_8s_linear_infinite]" size={42} />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-on-surface mb-3 text-center tracking-tight leading-normal">
                سلامتی تو، مسیر نو
              </h2>
              <div className="flex items-center gap-1.5 justify-center mb-4 text-[#FFB000]">
                <Sparkles size={16} />
                <span className="text-xs uppercase font-black tracking-widest font-mono">
                  Welcome to Fitopia
                </span>
                <Sparkles size={16} />
              </div>
              <p className="text-sm text-on-surface-variant/80 text-center leading-relaxed font-medium max-w-sm">
                باشگاه هوشمند فیتوپیا به شما امکان می‌دهد اهداف ورزشی خود را در قالب برنامه دقیق شخصی‌سازی کرده و در ازای تمرین، توکن دریافت کنید.
              </p>
            </header>

            {/* Premium Navigation Hub */}
            <div className="w-full space-y-4" id="welcome-cta-container">
              {/* Login Button with rich styling */}
              <Link
                to="/login"
                id="welcome-login-btn"
                className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-[#FF6A00] to-[#FFB000] text-on-primary font-black text-base rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/35 hover:scale-[1.02] active:scale-[0.98] duration-250 transition-all cursor-pointer group"
              >
                <span>ورود به حساب کاربری</span>
                <ArrowRight size={18} className="rotate-180 transition-transform group-hover:-translate-x-1 duration-200" />
              </Link>

              {/* Register Button with transparent neon feel */}
              <Link
                to="/register"
                id="welcome-register-btn"
                className="w-full flex items-center justify-center py-4 px-6 bg-surface-container/30 border border-white/10 text-on-surface-variant hover:text-on-surface hover:border-white/20 hover:bg-surface-container/50 font-black text-base rounded-2xl duration-250 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                ثبت‌نام و عضویت سریع
              </Link>
            </div>

            {/* App Footer Details */}
            <footer className="mt-10 select-none text-center" id="welcome-footer-tag">
              <span className="text-[10px] text-on-surface-variant/30 uppercase tracking-widest font-black">
                Version 3.2.1 • Smart Health Platform
              </span>
            </footer>
          </div>
        </AuthLayout>
      </div>
    </>
  );
}
