import React from "react";
import { Shield, Zap } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
}


export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center px-4 py-6 selection:bg-primary/30">
      
      {/* Glass container */}
      <main className="w-full max-w-md sm:max-w-lg relative z-10">

        <div className="glass-panel rounded-3xl p-6 sm:p-10 md:p-12 flex flex-col items-center shadow-2xl">

          {/* Brand */}
          <div className="mb-6 flex flex-col items-center select-none floating-brand">
            <span className="text-3xl sm:text-4xl tracking-tight text-primary font-black font-vazir">
              FITOPIA
            </span>
            <div className="h-1 w-10 bg-primary-container mt-2 rounded-full"></div>
          </div>

          {/* Content */}
          <div className="w-full">
            {children}
          </div>
        </div>

        {/* Badges */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 text-on-surface-variant opacity-60 text-center">

          <div className="flex items-center justify-center gap-2">
            <Shield size={16} className="text-secondary-container" />
            <span className="text-xs font-semibold">امنیت تضمین شده</span>
          </div>

          <div className="flex items-center justify-center gap-2">
            <Zap size={16} className="text-primary-container" />
            <span className="text-xs font-semibold">دسترسی آنی</span>
          </div>

        </div>
      </main>
    </div>
  );
}