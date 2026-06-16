/**
 * @file OfflineIndicator.tsx
 * @description Header toast notification component indicating network online/offline status.
 * Automatically appears when offline, and flashes a green success banner briefly when internet re-connects.
 */

import { useState, useEffect } from "react";
import { WifiOff, Wifi } from "lucide-react";
import { usePWA } from "../hooks/usePWA";

export function OfflineIndicator() {
  const { isOffline } = usePWA();
  const [showStatus, setShowStatus] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);

  // Monitor network switches. If offline, lock display to true.
  // If recovered from offline state, display success bar then auto-close after 4 seconds.
  useEffect(() => {
    if (isOffline) {
      setShowStatus(true);
      setWasOffline(true);
    } else if (wasOffline) {
      // Show online brief success toast, then hide after 4 seconds
      setShowStatus(true);
      const timer = setTimeout(() => {
        setShowStatus(false);
        setWasOffline(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOffline, wasOffline]);

  if (!showStatus) return null;

  return (
    <div className="fixed top-20 left-4 right-4 md:left-auto md:right-4 z-[100] animate-bounce-in select-none">
      {isOffline ? (
        <div className="flex items-center gap-3 bg-red-950/90 backdrop-blur-xl border border-red-500/20 px-4 py-3 rounded-xl shadow-lg text-red-200">
          <div className="bg-red-500/20 p-2 rounded-lg text-red-400">
            <WifiOff size={18} className="animate-pulse" />
          </div>
          <div className="text-right">
            <p className="text-sm font-bold font-vazir">شما آفلاین هستید</p>
            <p className="text-xs text-red-300/80 font-vazir">بعضی امکانات فیتوپیا ممکن است موقتاً محدود شوند.</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 bg-emerald-950/90 backdrop-blur-xl border border-emerald-500/20 px-4 py-3 rounded-xl shadow-lg text-emerald-200">
          <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400">
            <Wifi size={18} />
          </div>
          <div className="text-right">
            <p className="text-sm font-bold font-vazir">اتصال برقرار شد</p>
            <p className="text-xs text-emerald-300/80 font-vazir">مجدداً به پایگاه داده سلامت فیتوپیا متصل شدید.</p>
          </div>
        </div>
      )}
    </div>
  );
}
