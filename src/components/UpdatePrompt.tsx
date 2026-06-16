/**
 * @file UpdatePrompt.tsx
 * @description Dialog trigger representing to the user that a new version of the Web App is available.
 * Encourages the user to initiate a rapid, hot Service Worker refresh sequence.
 */

import { RefreshCw, Sparkles } from "lucide-react";
import { usePWA } from "../hooks/usePWA";

export function UpdatePrompt() {
  // Pull lifecycle state of the PWA registration model.
  const { updateAvailable, updateApp } = usePWA();

  if (!updateAvailable) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-[110] animate-bounce-in select-none">
      <div className="glass-card rounded-2xl p-5 border border-primary/40 bg-surface/95 backdrop-blur-xl shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="bg-primary/20 text-primary p-3 rounded-xl mt-1 animate-pulse">
            <Sparkles size={24} />
          </div>
          
          <div className="text-right flex-1">
            <h4 className="font-headline-md text-base text-on-surface text-primary">نسخه جدید فیتوپیا آماده است!</h4>
            <p className="font-label-sm text-xs text-on-surface-variant/80 mt-1 leading-relaxed">
              تغییرات جدید و بهبودهای فوق‌العاده عملکردی در نسخه جدید اعمال شده‌اند. مایلید فوراً به‌روزرسانی شود؟
            </p>
            
            <div className="flex gap-3 mt-4">
              <button
                onClick={updateApp}
                className="flex-1 py-2 px-4 bg-gradient-to-r from-[#FF6A00] to-[#FFB000] text-on-primary font-bold rounded-lg text-xs shadow-lg shadow-primary/20 active:scale-95 duration-200 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RefreshCw size={14} className="animate-spin-[10s]" />
                <span>به‌روز رسانی سریع</span>
              </button>
              
              <button
                onClick={() => {
                  // Direct bypass or visual dismissal (will prompt again next session)
                  const element = document.getElementById("update-toast-container");
                  if (element) element.style.display = "none";
                }}
                className="px-4 py-2 bg-white/5 border border-white/5 text-on-surface-variant/80 rounded-lg text-xs active:scale-95 duration-200 hover:bg-white/10 transition-colors cursor-pointer"
              >
                بعداً
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
