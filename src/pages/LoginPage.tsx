/**
 * @file LoginPage.tsx
 * @description Smart and beautiful glassmorphism-based Authentication / Login Gateway.
 * Fully features:
 * - Parallax mouse-hover card tilt physical simulation
 * - Persian locale input forms (email/mobile + validation)
 * - Fluid high-contrast reactive gradients
 */

import { useState, MouseEvent } from "react";
import { Link } from "react-router-dom";
import { AuthLayout } from "../components/AuthLayout";
import { LoginForm } from "../components/LoginForm";
import { ShaderBackground } from "../components/ShaderBackground";
import { ParticleOverlay } from "../components/ParticleOverlay";
import { Dumbbell } from "lucide-react";

export function LoginPage() {
  // Parallax physical simulation parameters for 3D card tilt
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    
    // Calculate relative mouse position inside card
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Scale down movement to produce subtle premium parallax tilts
    setRotateX(-y / 35);
    setRotateY(x / 35);
  };

  const handleMouseLeave = () => {
    // Return gracefully to baseline
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <>
      {/* 1. WebGL Organic Ambient Space background */}
      <ShaderBackground />

      {/* 2. Particle layer overlays */}
      <ParticleOverlay />

      <div 
        id="login-page-parallax-wrapper"
        className="w-full flex justify-center items-center relative z-10 transition-transform duration-300"
      >
        <AuthLayout>
          {/* Parallax Container Card with mouse tilt animation */}
          <div
            id="parallax-box"
            style={{
              transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
              transition: "transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="w-full flex flex-col items-center"
          >
            {/* Branding Header with fitness symbol */}
            <header className="flex flex-col items-center mb-6 select-none" id="branding-header">
              <div 
                id="brand-logo-icon"
                className="w-16 h-16 mb-5 flex items-center justify-center bg-primary-container/10 rounded-2xl border border-primary-container/30 shadow-[0_0_20px_rgba(255,106,0,0.15)] animate-pulse"
              >
                <Dumbbell className="text-primary-container animate-[spin_5s_linear_infinite]" size={36} />
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-on-surface mb-2 text-center tracking-tight">
                ورود به حساب کاربری
              </h1>
              <p className="text-sm text-on-surface-variant/70 text-center font-medium">
                بدن خود را هوشمندانه مدیریت کنید
              </p>
            </header>

            {/* LoginForm handler */}
            <LoginForm />

            {/* Registration Anchor Link (React Router SPA Link) */}
            <div id="bottom-register-link" className="mt-6 text-center select-none w-full">
              <p className="text-sm text-on-surface-variant font-medium">
                هنوز ثبت‌نام نکرده‌اید؟{" "}
                <Link
                  to="/register"
                  className="text-primary font-black hover:underline decoration-2 underline-offset-4 transition-all"
                >
                  ایجاد حساب جدید
                </Link>
              </p>
            </div>

            {/* Bottom SSO Social Links */}
            <footer className="mt-8 flex flex-col items-center w-full select-none" id="sso-footer">
              <div className="flex items-center gap-4 mb-5 w-full justify-center">
                <div className="h-[1px] flex-grow max-w-[65px] bg-white/10"></div>
                <span className="text-[10px] text-on-surface-variant/30 uppercase tracking-widest font-black">
                  Premium Access
                </span>
                <div className="h-[1px] flex-grow max-w-[65px] bg-white/10"></div>
              </div>
              
              <div className="flex gap-4" id="sso-buttons">
                {/* Google Sign-in */}
                <button
                  id="google-sso-btn"
                  onClick={() => alert("سرویس گوگل به طور آزمایشی فعال است!")}
                  className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center hover:bg-white/5 cursor-pointer transition-colors"
                  title="ورود با حساب گوگل"
                >
                  <img
                    alt="Google Sign in"
                    className="w-5 h-5 opacity-70 grayscale hover:grayscale-0 transition-all"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuALRFRG7yN8EW5ao1eHxmaJTumNyquAgYFDK6faTFh2L0xjT3yCrPS3EV1g-YYMC9B-7YF0QnFqkzCfhLdEzYzYosaQba7bCKQ2Z7Z6zlxZQM5n14z04HmJnhGq7znREp-DdqN8jaSCjniig-k5OxsF_-N4aRR_8EoHE5RLNx0DSsBHnUclcz2_i-_ocmMY1-0vi9QqWCvN2d21ULTnKU43v35VBPw9R3ZMQghmpBY_qARKtrFhP1FfAIW9QZGo7V4XW-qM2gytMaWi"
                  />
                </button>
                
                {/* Apps SSO */}
                <button
                  id="native-sso-btn"
                  onClick={() => alert("سرویس‌های یکپارچه فیتوپیا به زودی در دسترس خواهند بود!")}
                  className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center hover:bg-white/5 cursor-pointer text-on-surface-variant/70 hover:text-on-surface transition-colors"
                  title="ورود با اپ فیتوپیا"
                >
                  <span className="material-symbols-outlined text-[20px]">apps</span>
                </button>
              </div>
            </footer>
          </div>
        </AuthLayout>
      </div>
    </>
  );
}
