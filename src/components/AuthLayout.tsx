import React from "react";
import { Shield, Zap } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

/**
 * Focused auth shell — dark card on brand background.
 * Used by Login / Register (Welcome has its own layout).
 */
export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="relative min-h-dvh w-full flex items-center justify-center px-4 py-8 selection:bg-primary/30">
      <main className="w-full max-w-md relative z-10">
        <div className="glass-panel elevation-2 rounded-3xl p-6 sm:p-8 flex flex-col">
          <div className="mb-6 flex flex-col items-center text-center select-none">
            <span className="text-2xl sm:text-3xl tracking-tight text-primary font-black font-vazir">
              FITOPIA
            </span>
            <div className="h-1 w-9 bg-primary-container mt-2 rounded-full" />
            {title && (
              <h1 className="mt-5 text-lg sm:text-xl font-bold text-on-surface">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="mt-2 text-sm text-on-surface-variant leading-relaxed max-w-xs">
                {subtitle}
              </p>
            )}
          </div>

          <div className="w-full">{children}</div>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-3 text-on-surface-variant/70">
          <div className="flex items-center gap-2">
            <Shield size={15} className="text-secondary-container" aria-hidden />
            <span className="text-xs font-semibold">امنیت تضمین‌شده</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap size={15} className="text-primary-container" aria-hidden />
            <span className="text-xs font-semibold">دسترسی آنی</span>
          </div>
        </div>
      </main>
    </div>
  );
}
