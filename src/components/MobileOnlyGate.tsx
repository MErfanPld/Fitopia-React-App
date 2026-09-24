/**
 * Blocks the app on large screens (laptop/desktop).
 * Fitopia user app is mobile-only.
 */

import { useEffect, useState } from "react";
import { Smartphone, Monitor } from "lucide-react";

const MOBILE_MAX_WIDTH = 768;
const FORCE_KEY = "fitopia_force_mobile";

function isForcedMobile(): boolean {
  try {
    if (new URLSearchParams(window.location.search).get("forceMobile") === "1") {
      sessionStorage.setItem(FORCE_KEY, "1");
      return true;
    }
    return sessionStorage.getItem(FORCE_KEY) === "1";
  } catch {
    return false;
  }
}

export function MobileOnlyGate({ children }: { children: React.ReactNode }) {
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const check = () => {
      if (isForcedMobile()) {
        setBlocked(false);
        return;
      }
      setBlocked(window.innerWidth > MOBILE_MAX_WIDTH);
    };

    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!blocked) return <>{children}</>;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#07070A] px-6 text-center select-none">
      <div className="max-w-sm w-full">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FF6A00]/15 border border-[#FF6A00]/30">
          <Smartphone className="text-[#FF6A00]" size={28} aria-hidden />
        </div>

        <p className="text-[#FF6A00] font-black text-xl tracking-tight">FITOPIA</p>

        <h1 className="mt-4 text-lg font-bold text-white leading-snug">
          این اپلیکیشن فقط روی موبایل در دسترس است
        </h1>

        <p className="mt-3 text-sm text-white/55 leading-relaxed">
          لطفاً با گوشی موبایل وارد شوید و از منوی مرورگر گزینه
          <span className="text-white/80 font-semibold"> «افزودن به صفحه اصلی» </span>
          را انتخاب کنید.
        </p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-right space-y-3">
          <div className="flex items-start gap-3">
            <Monitor size={18} className="text-white/35 mt-0.5 shrink-0" aria-hidden />
            <p className="text-xs text-white/45 leading-relaxed">
              نمایش روی لپ‌تاپ و دسکتاپ پشتیبانی نمی‌شود. برای تجربه کامل، از تلفن همراه استفاده کنید.
            </p>
          </div>
        </div>

        <p className="mt-6 text-[11px] text-white/30">
          آدرس را روی گوشی باز کنید یا QR اسکن کنید
        </p>
      </div>
    </div>
  );
}
