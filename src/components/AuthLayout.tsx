/**
 * @file AuthLayout.tsx
 * @description Master wrapper component for the login and registration layouts.
 * Includes glassmorphism card panels with responsive gutters and brand badge decorations.
 */

import React from "react";
import { Shield, Zap } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode; // Login or Register inner forms
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 md:p-6 z-10 selection:bg-primary/30">
      <main className="w-full max-w-lg relative">
        {/* Registration Card Wrapper */}
        <div className="glass-panel rounded-[2rem] p-8 md:p-12 flex flex-col items-center shadow-2xl">
          {/* Brand Anchor Logo */}
          <div className="floating-brand mb-6 flex flex-col items-center select-none">
            <span className="text-4xl tracking-tighter text-primary font-black uppercase font-vazir">
              FITOPIA
            </span>
            <div className="h-1 w-8 bg-primary-container mt-1 rounded-full"></div>
          </div>

          {/* Children Components (e.g., Title & Fields) */}
          {children}
        </div>

        {/* Footer Decorative Badges */}
        <div className="mt-8 flex justify-center gap-6 text-on-surface-variant opacity-50 select-none">
          <div className="flex items-center gap-2" id="badge-secure">
            <Shield size={16} className="text-secondary-container" />
            <span className="text-xs font-semibold">امنیت تضمین شده</span>
          </div>
          <div className="flex items-center gap-2" id="badge-instant">
            <Zap size={16} className="text-primary-container" />
            <span className="text-xs font-semibold">دسترسی آنی</span>
          </div>
        </div>
      </main>
    </div>
  );
}
