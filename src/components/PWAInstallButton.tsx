/**
 * @file PWAInstallButton.tsx
 * @description Renders a premium prompt overlay asking users to install FITOPIA natively
 * on their device. Offers custom dynamic instructions for iOS users (who require Manual sharing)
 * versus Android and Desktop users (who can use Native App Prompt APIs).
 */

import { Monitor, Smartphone, Download } from "lucide-react";
import { usePWA } from "../hooks/usePWA";

export function PWAInstallButton() {
  const { isInstallable, installApp } = usePWA();

  if (!isInstallable) return null;

  // Track if user browsing environment is Safari/iOS to present tailored manual setup instructions
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

  return (
    <section className="fade-in-up select-none px-4" id="pwa-install-app-section">
      <div className="glass-card rounded-2xl p-5 border border-primary/20 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Glow backdrop decorator */}
        <div className="absolute -left-10 -bottom-10 w-28 h-28 bg-primary/10 blur-2xl rounded-full" />
        
        <div className="flex items-start gap-3 relative z-10 text-right">
          <div className="bg-gradient-to-br from-[#FF6A00]/20 to-[#FFB000]/20 p-3 rounded-xl text-primary mt-1">
            {isIOS ? <Smartphone size={24} /> : <Monitor size={24} />}
          </div>
          <div>
            <h4 className="font-headline-md text-base text-on-surface">نصب مستقیم اپلیکیشن فیتوپیا</h4>
            <p className="font-label-sm text-xs text-on-surface-variant/70 mt-1">
              {isIOS 
                ? "برای عملکرد سریع‌تر و دسترسی آفلاین، این وب‌اپلیکیشن را روی آیفون خود اضافه کنید."
                : "برنامه را روی رایانه یا تلفن همراه نصب کنید تا تجربه ای پرسرعت شبیه به اپلیکیشن بومی داشته باشید."}
            </p>
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-2">
          {isIOS ? (
            <div className="text-xs bg-surface-container-high px-4 py-2 rounded-xl text-on-surface-variant border border-white/5 font-vazir text-center md:text-right">
              دکمه <span className="font-bold text-primary">Share 📤</span> را بزنید و سپس گزینه <span className="font-bold text-primary">Add to Home Screen ➕</span> را انتخاب کنید.
            </div>
          ) : (
            <button
              onClick={installApp}
              className="w-full md:w-auto px-6 py-2.5 bg-gradient-to-r from-[#FF6A00] to-[#FFB000] text-on-primary font-bold rounded-xl shadow-lg shadow-primary/20 active:scale-95 hover:brightness-110 duration-200 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
            >
              <Download size={16} />
              <span>نصب اپلیکیشن</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
